
  let favoritesCount = 0;

  const quantities = {
    productItem1: 1,
    productItem2: 1,
    productItem3: 1,
  };

  function selectTab(tab) {
    document.getElementById('cart-tab').classList.remove('active');
    document.getElementById('favorites-tab').classList.remove('active');
    if (tab === 'cart') {
      document.getElementById('cart-tab').classList.add('active');
    } else {
      document.getElementById('favorites-tab').classList.add('active');
    }
  }

  function updateCartCount() {
    let totalItems = 0;
    for (const qty of Object.values(quantities)) {
      totalItems += qty;
    }
    document.getElementById('cartCount').textContent = `${totalItems}`;
  }

  function updateFavoritesCount(count) {
    favoritesCount = count;
    document.getElementById('favoritesCount').textContent = `${favoritesCount}`;
  }

  function removeProduct(id) {
    const product = document.getElementById(id);
    if (product) {
      product.remove();
      delete quantities[id];
      updateCartCount();
      calculateTotal();
    }
  }

  function addToFavorites(productName) {
    favoritesCount++;
    updateFavoritesCount(favoritesCount);
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = `${productName} ajouté aux favoris`;
    alertBox.style.display = 'block';
    setTimeout(() => {
      alertBox.style.display = 'none';
    }, 2000);
  }

  function updateQty(id, delta) {
    if (!(id in quantities)) return;
    quantities[id] = Math.max(1, quantities[id] + delta);
    document.getElementById(`qty-${id}`).textContent = quantities[id];
    updateCartCount();
    calculateTotal();
  }

  function calculateTotal() {
    let total = 0;
    Object.keys(quantities).forEach(id => {
      const priceElement = document.querySelector(`#${id} .product-price`);
      if (priceElement) {
        const price = parseFloat(priceElement.dataset.price);
        total += price * quantities[id];
      }
    });

    document.querySelector('.cart-total').textContent = `Total : €${total.toFixed(2)}`;
  }

  // Initial setup
  updateCartCount();
  calculateTotal();

function openCheckout() {
  document.getElementById('main-cart').style.display = 'none';
  document.getElementById('checkout-page').style.display = 'block';

updateCheckoutDate();
updateCheckoutCount();

// Carrousel
  const carousel = document.getElementById('checkout-carousel');
  carousel.innerHTML = '';
  document.querySelectorAll('.product-item').forEach(item => {
    const img = item.querySelector('.product-image');
    const id = item.id;
    const quantity = quantities[id] || 1;

  for (let i = 0; i < quantity; i++) {
    const clone = img.cloneNode(true);
    clone.classList.add('carousel-item'); // ✅ applique le style
    carousel.appendChild(clone);

// Affiche l’adresse si elle existe
  const addr = document.getElementById('displayed-address').textContent.trim();
  document.getElementById('address-summary').style.display = addr ? 'block' : 'none';

  }
  });
}

function backToCart() {
  document.getElementById('checkout-page').style.display = 'none';
  document.getElementById('main-cart').style.display = 'block';
}

function updateCheckoutCount() {
  let totalItems = 0;
  for (const qty of Object.values(quantities)) {
    totalItems += qty;
  }
  console.log("Articles à passer au checkout :", totalItems);
  document.getElementById('checkout-count').textContent = totalItems;
}

function goToCheckout() {
  document.getElementById('main-cart').style.display = 'none';
  document.getElementById('checkout-page').style.display = 'block';
  updateCheckoutCount(); // 👈 met à jour le nombre
  updateCheckoutDate();
}

function updateCheckoutDate() {
  const dateEl = document.getElementById('checkout-date');
  const now = new Date();

  const jours = ["DIMANCHE", "LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"];
  const mois = [
    "JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN",
    "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"
  ];

  const jourSemaine = jours[now.getDay()];
  const jour = now.getDate();
  const moisNom = mois[now.getMonth()];

  const formatted = `${jourSemaine} ${jour} ${moisNom}`;

  dateEl.textContent = formatted;
}

function openAddressPage() {
  console.log("✅ Clic détecté sur Adresse de livraison");
  document.getElementById('checkout-page').style.display = 'none';
  document.getElementById('address-page').style.display = 'block';

 // Masquer le résumé s’il était visible
  const summary = document.getElementById('address-summary');
  if (summary) summary.style.display = 'none';

  // Afficher directement le formulaire
  const form = document.getElementById('address-form');
  if (form) form.style.display = 'flex';

  document.getElementById('address-summary').style.display = 'none';
  setTimeout(() => {
    document.getElementById('address-form').scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

function backToCheckout() {
  const paymentPage = document.getElementById('payment-page').style.display = 'none';
  const addressPage = document.getElementById('address-page').style.display = 'none';
  const checkoutPage = document.getElementById('checkout-page').style.display = 'block';
  }



document.getElementById('address-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Empêche l’envoi classique du formulaire

  const inputs = document.querySelectorAll('#address-form .address-input');
   const values = Array.from(inputs).map(input => input.value.trim()).filter(v => v !== '');
  const addressText = values.join(', ');

  document.getElementById('displayed-address').textContent = addressText;

// Sauvegarde dans localStorage
  localStorage.setItem('tokomi_address', addressText);

  document.getElementById('address-summary').style.display = 'block';
  document.getElementById('address-page').style.display = 'none';
  document.getElementById('checkout-page').style.display = 'block';
  document.getElementById('payment-header').style.display = 'flex';
  document.getElementById('payment-header').classList.remove('hidden');

  

  let totalItems = 0;
for (const qty of Object.values(quantities)) {
  totalItems += qty;
}
  localStorage.setItem('tokomi_cart_count', totalItems);

 

  // Affiche le bouton PAIEMENT
 

  alert('Adresse enregistrée avec succès !');
  backToCheckout();
});

window.addEventListener('load', () => {
  const savedAddress = localStorage.getItem('tokomi_address');
  if (savedAddress) {
    document.getElementById('displayed-address').textContent = savedAddress;
    document.getElementById('address-summary').style.display = 'block';
    document.getElementById('payment-header').style.display = 'flex';
  } else {
    document.getElementById('address-summary').style.display = 'none';

 }
});


function goToPaymentPage() {
  console.log("✅ Clic détecté sur PAIEMENT");



    const checkoutPage = document.getElementById('checkout-page');
    const paymentPage = document.getElementById('payment-page');

    if (checkoutPage && paymentPage) {
      checkoutPage.style.display = 'none';
      paymentPage.style.display = 'block';
    } else {
      console.error("❌ Impossible de trouver les éléments #checkout-page ou #payment-page");

    }
    

  document.getElementById('checkout-page').style.display = 'none';
  document.getElementById('payment-page').style.display = 'block';
    // Optionnel : faire défiler jusqu’au grid
  setTimeout(() => {
    document.querySelector('.payment-grid')?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}



    function showSelectedPayment() {
      
      const summary = document.getElementById("payment-summary");

      if (selected) {
        summary.textContent = `Moyen de paiement sélectionné : ${selected}`;
        summary.classList.add("visible");
      } else {
        summary.classList.remove("visible");
      }
    }

const paymentFields = {
  VISA: [
    { type: "text", placeholder: "TITULAIRE DE LA CARTE" },
    { type: "text", placeholder: "NUMÉRO DE CARTE" },
    { type: "text", placeholder: "DATE D'EXPIRATION (MM/AA)" },
    { type: "text", placeholder: "CODE CVC" },
  ],
   PAYPAL: [
    { type: "email", placeholder: "ADRESSE EMAIL PAYPAL" },
  ],
 "APPLE PAY": [
    { type: "text", placeholder: "IDENTIFIANT APPLE" },
  ],
  "M-PESA": [
    { type: "tel", placeholder: "NUMÉRO M-PESA" },
  ],
  ILLICOCASH: [
    { type: "tel", placeholder: "NUMÉRO ILLICOCASH" },
  ],
    "ORANGE MONEY": [
    { type: "tel", placeholder: "NUMÉRO ORANGE MONEY" },
  ],
 "AIRTEL MONEY": [
    { type: "tel", placeholder: "NUMÉRO AIRTEL MONEY" },
  ],
    "AFRIMONEY": [
    { type: "tel", placeholder: "NUMÉRO AFRIMONEY" },
  ],
 "MTN MOMO": [
    { type: "tel", placeholder: "NUMÉRO MTN MOMO" },
  ],
  "TAPTAPSEND": [
    { type: "tel", placeholder: "NUMÉRO TAPTAPSEND" },
    { type: "text", placeholder: "TITULAIRE DU NUMÉRO" },
  ],
   "AMERICAN EXPRESS": [
    { type: "text", placeholder: "TITULAIRE DE LA CARTE" },
    { type: "text", placeholder: "NUMÉRO DE CARTE" },
    { type: "text", placeholder: "DATE D'EXPIRATION (MM/AA)" },
    { type: "text", placeholder: "CODE CVC" },
  ],
  MASTERCARD: [
    { type: "text", placeholder: "TITULAIRE DE LA CARTE" },
    { type: "text", placeholder: "NUMÉRO DE CARTE" },
    { type: "text", placeholder: "DATE D'EXPIRATION (MM/AA)" },
    { type: "text", placeholder: "CODE CVC" },
  ],
};

document.querySelectorAll(".payment-button").forEach((button) => {

  button.addEventListener("click", () => {
    const method = button.dataset.method;
    const wrapper = button.closest(".payment-option-wrapper");
    const dropdown = wrapper.querySelector(".payment-dropdown");
    

    document.querySelectorAll(".payment-dropdown").forEach(d =>{
        if (d !== dropdown) {
        d.classList.remove("show");
        d.innerHTML = "";
     } 
  });

  // 🔁 Si déjà ouvert : on le referme
    if (dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
      dropdown.innerHTML = "";
      return;
    }

   // Créer le formulaire dynamiquement
    const fields = paymentFields[method] || [];
     fields.forEach(f => {
      const input = document.createElement("input");
      input.type = f.type;
      input.placeholder = f.placeholder;
      input.className = "address-input";
      dropdown.appendChild(input);
    });

    const submit = document.createElement("button");
    submit.textContent = "VALIDER ";
    submit.className = "submit-address-btn";
   

    

    // ✅ Met à jour le résumé du paiement sélectionné
    const summary = document.getElementById('payment-summary');
    const summaryText = document.getElementById('payment-method-selected');
    summaryText.textContent = `Moyen de paiement sélectionné : ${method}`;
    summary.style.display = 'block';
    

    dropdown.appendChild(submit);
    // ✅ ✅ ✅ C’EST ICI QUE LA CLASSE .show EST AJOUTÉE :
    dropdown.classList.add("show");


 



    






  
  
  
  
    // ✅ Mise à jour du résumé affiché
    document.getElementById("shipping-summary").style.display = "block";
    document.getElementById("selected-shipping").textContent = `Option sélectionnée : ${summary}`;

  
    
   

    



  });

  
});


// Exemple de total actuel
let cartTotal = 100; // Tu peux récupérer ce chiffre dynamiquement depuis ton panier
let shippingCost = 0;
   // Fonction pour ouvrir la page shipping
   
function openShippingPage() {
  const checkoutPage = document.getElementById("checkout-page");
  const paymentPage = document.getElementById("payment-page");
  const shippingPage = document.getElementById("shipping-page");

  if (checkoutPage && paymentPage && shippingPage) {
    checkoutPage.style.display = "none";
    paymentPage.style.display = "none";
    shippingPage.style.display = "block";
  } else {
    console.error("❌ Un ou plusieurs éléments (checkout, payment, shipping) sont introuvables dans le DOM.");
  }
}

// Revenir à checkout
function backToCheckout() {
  const shippingPage = document.getElementById("shipping-page");
  const checkoutPage = document.getElementById("checkout-page");

  if (checkout && shipping) {
    shipping.style.display = "none";
    checkout.style.display = "block";
  } else {
    console.error("❌ Les éléments 'shipping-page' ou 'checkout-page' sont introuvables.");
}
}

document.addEventListener("DOMContentLoaded", function () {
  const shippingForm = document.getElementById("shipping-form");

  document.querySelectorAll('input[name="shipping"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      const selectedValue = this.value;
      const summaryText = document.getElementById("selected-shipping");
      const summaryBox = document.getElementById("shipping-summary");

      summaryText.textContent = `Option sélectionnée : ${selectedValue}`;
      summaryBox.style.display = "block";
    });
  });

  // Soumission du formulaire
  if (shippingForm) {
    shippingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const selectedOption = document.querySelector('input[name="shipping"]:checked');
  if (selectedOption) {
    const summary = selectedOption.value;

    // Extraire le prix
    const match = summary.match(/€([0-9.,]+)/);
    shippingCost = match ? parseFloat(match[1].replace(",", ".")) : 0;

  // ✅ Mise à jour du total panier
    const total = cartTotal + shippingCost;
     document.querySelector(".cart-total").textContent = `€${total.toFixed(2)}`;

     // ✅ Retour à la checkout-page
    document.getElementById("shipping-page").style.display = "none";
    document.getElementById("checkout-page").style.display = "block";
  }
});
}
});
