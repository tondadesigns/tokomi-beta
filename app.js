const categories = [
  {
    title: "",
    products: [
      { brand: "Yene", price: "180", image: "https://via.placeholder.com/160" },
      { brand: "Kwetu", price: "220", image: "https://via.placeholder.com/160" }
    ]
  },
  {
    title: "Vêtements",
    products: [
      { brand: "Maison Kivu", price: "130", image: "https://via.placeholder.com/160" },
      { brand: "Ankole", price: "150", image: "https://via.placeholder.com/160" }
    ]
  },
  {
    title: "Accessoires",
    products: [
      { brand: "Jua", price: "90", image: "https://via.placeholder.com/160" },
      { brand: "Bantu Craft", price: "120", image: "https://via.placeholder.com/160" }
    ]
  },
  {
    title: "Beauté",
    products: [
      { brand: "GlowAfrique", price: "60", image: "https://via.placeholder.com/160" },
      { brand: "Karité D’or", price: "75", image: "https://via.placeholder.com/160" }
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("category-list");


  const categoriesFiltered = categories.filter(cat =>
    cat.title !== "" &&
    cat.title !== "Vêtements" &&
    cat.title !== "Accessoires" &&
    cat.title !== "Beauté"
  );

  // Liste des titres à exclure
  const excludedTitles = ["", "Vêtements", "Accessoires", "Beauté"];


  categories.forEach(cat => {
    const section = document.createElement("section");

    
    // 🔧 Conteneur pour le titre + flèche
    const header = document.createElement("div");
    header.className = "category-header";

    const title = document.createElement("span");
    title.className = "category-title";
    title.textContent = cat.title;

    const arrow = document.createElement("span");
    arrow.className = "category-arrow";
    arrow.textContent = "›"; // ou "→", ou "&gt;" si tu veux un signe HTML

     header.appendChild(title);
     header.appendChild(arrow);

     // 🔧 Fonction qui crée le carrousel de produits
     function createProductSlider(products) {
     const slider = document.createElement("div");
     slider.className = "product-slider";
}


    cat.products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.image}" alt="${p.brand}">
        <div class="brand">${p.brand}</div>
        <div class="price">${p.price}€</div>
      `;
      slider.appendChild(card);
    });

    section.appendChild(title);
    section.appendChild(slider);
    container.appendChild(section);
  });
});
