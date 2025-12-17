import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ==================== NAV ====================
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const dropdown = document.querySelector(".dropdown");
const dropdownToggle = document.querySelector(".dropdown-toggle");

// Burger toggle mobiilissa
menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Desktop hover dropdown
dropdown.addEventListener("mouseenter", () => {
  if (window.innerWidth > 900) dropdown.classList.add("open");
});
dropdown.addEventListener("mouseleave", () => {
  if (window.innerWidth > 900) dropdown.classList.remove("open");
});

// Mobile dropdown toggle
dropdownToggle.addEventListener("click", (e) => {
  if (window.innerWidth <= 900) {
    e.preventDefault();
    dropdown.classList.toggle("open");
  }
});

// Sulje nav mobiilissa linkin klikkauksella (mutta ei dropdown-togglea)
document.querySelectorAll("#nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    if (
      window.innerWidth <= 900 &&
      !link.classList.contains("dropdown-toggle")
    ) {
      navMenu.classList.remove("active");
      dropdown.classList.remove("open");
    }
  });
});

// Sulje nav ja dropdown jos resize > 900px
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    navMenu.classList.remove("active");
    dropdown.classList.remove("open");
  }
});

// ==================== OSTOSKORI ====================
let cart = [];

// DOM-elementit
const ensaymadaSection = document.getElementById("ensaymada");
const hopiaSection = document.getElementById("hopia");
const otherSection = document.getElementById("other");
const spanishSection = document.getElementById("spanish");

const cartPopup = document.getElementById("cartPopup");
const cartItemsDiv = document.getElementById("cartItems");
const totalPriceSpan = document.getElementById("totalPrice");
const closeCart = document.getElementById("closeCart");
const viewCartBtn = document.getElementById("viewCartBtn");
const orderForm = document.getElementById("orderForm");
const cartCountEl = document.getElementById("cart-count");
const deliveryTimeInput = document.getElementById("deliveryTime");
const clearCartBtn = document.getElementById("clearCartBtn");

// ==================== TUOTTEET ====================
//tuotteet
const PRODUCTS = [
  // ENSAYMADA
  {
    id: "ens_asorted_half",
    name: "Ensaymada Assorted ½ box",
    price: 13,
    img: "",
    category: "ensaymada",
  },
  {
    id: "ens_asorted_full",
    name: "Ensaymada Assorted 1 box",
    price: 25,
    img: "",
    category: "ensaymada",
  },
  {
    id: "ens_ube_half",
    name: "Ensaymada Ube ½ box",
    price: 14,
    img: "",
    category: "ensaymada",
  },
  {
    id: "ens_ube_full",
    name: "Ensaymada Ube 1 box",
    price: 28,
    img: "",
    category: "ensaymada",
  },
  {
    id: "ens_caramel_half",
    name: "Ensaymada Caramel ½ box",
    price: 13,
    img: "",
    category: "ensaymada",
  },
  {
    id: "ens_caramel_full",
    name: "Ensaymada Caramel 1 box",
    price: 25,
    img: "",
    category: "ensaymada",
  },
  {
    id: "ens_cream_half",
    name: "Ensaymada Cream Cheese ½ box",
    price: 13,
    img: "",
    category: "ensaymada",
  },
  {
    id: "ens_cream_full",
    name: "Ensaymada Cream Cheese 1 box",
    price: 25,
    img: "",
    category: "ensaymada",
  },
  {
    id: "ens_classic_half",
    name: "Ensaymada Classic ½ box",
    price: 13,
    img: "",
    category: "ensaymada",
  },
  {
    id: "ens_classic_full",
    name: "Ensaymada Classic 1 box",
    price: 25,
    img: "",
    category: "ensaymada",
  },

  // HOPIA
  {
    id: "hop_assorted_half",
    name: "Hopia Assorted ½ box",
    price: 12,
    img: "",
    category: "hopia",
  },
  {
    id: "hop_assorted_full",
    name: "Hopia Assorted 1 box",
    price: 24,
    img: "",
    category: "hopia",
  },
  {
    id: "hop_baboy_half",
    name: "Hopia Baboy ½ box",
    price: 12,
    img: "",
    category: "hopia",
  },
  {
    id: "hop_baboy_full",
    name: "Hopia Baboy 1 box",
    price: 24,
    img: "",
    category: "hopia",
  },
  {
    id: "hop_ube_half",
    name: "Hopia Ube ½ box",
    price: 14,
    img: "",
    category: "hopia",
  },
  {
    id: "hop_ube_full",
    name: "Hopia Ube 1 box",
    price: 28,
    img: "",
    category: "hopia",
  },
  {
    id: "hop_munggo_half",
    name: "Hopia Munggo ½ box",
    price: 12,
    img: "",
    category: "hopia",
  },
  {
    id: "hop_munggo_full",
    name: "Hopia Munggo 1 box",
    price: 24,
    img: "",
    category: "hopia",
  },

  // OTHER
  {
    id: "milky_rolls",
    name: "Milky Cheese Rolls",
    price: 12,
    img: "Image/Tuotteet/Image/milky.cheese.rolls.jpg",
    category: "other",
  },
  {
    id: "cheesy_mamon",
    name: "Cheesy Mamon",
    price: 13,
    img: "",
    category: "other",
  },
  {
    id: "cassava_s",
    name: "Cassava S",
    price: 10,
    img: "",
    category: "other",
  },
  {
    id: "cassava_l",
    name: "Cassava L",
    price: 25,
    img: "",
    category: "other",
  },
  {
    id: "pandesal_classic",
    name: "Pandesal Classic",
    price: 10,
    img: "Image/Tuotteet/Image/Pandesal.classic.jpg",
    category: "other",
  },
  {
    id: "pandecoco",
    name: "Pandecoco",
    price: 10,
    img: "",
    category: "other",
  },
  {
    id: "maja_blanca",
    name: "Maja Blanca",
    price: 10,
    img: "",
    category: "other",
  },
  {
    id: "pandesiosa",
    name: "Pandesiosa",
    price: 10,
    img: "",
    category: "other",
  },

  // SPANISH BREAD
  {
    id: "span_classic",
    name: "Spanish Bread Classic",
    price: 10,
    img: "Image/Tuotteet/Image/spanish.bread.classic.jpg",
    category: "spanish",
  },
  {
    id: "span_munggo",
    name: "Spanish Bread Munggo",
    price: 10,
    img: "Image/Tuotteet/Image/spanish.bread.munggo.jpg",
    category: "spanish",
  },
  {
    id: "span_ube",
    name: "Spanish Bread Ube",
    price: 12,
    img: "",
    category: "spanish",
  },
  {
    id: "ube_halaya",
    name: "Ube Halaya",
    price: 10,
    img: "Image/Tuotteet/Image/Ube.halaya.jpg",
    category: "spanish",
  },
  {
    id: "empanada_half",
    name: "Empanada ½ box",
    price: 12,
    img: "",
    category: "spanish",
  },
  {
    id: "empanada_full",
    name: "Empanada 1 box",
    price: 24,
    img: "",
    category: "spanish",
  },
  {
    id: "ube_pandekeso",
    name: "Ube Pandekeso",
    price: 10,
    img: "",
    category: "spanish",
  },
  {
    id: "chicharon_single",
    name: "Chicharon 1 pcs",
    price: 8,
    img: "",
    category: "spanish",
  },
  {
    id: "chicharon_three",
    name: "Chicharon 3 pcs",
    price: 20,
    img: "",
    category: "spanish",
  },
  {
    id: "suka",
    name: "Suka",
    price: 3.5,
    img: "",
    category: "spanish",
  },
];

// Luo tuotekortit
PRODUCTS.forEach((p) => {
  const div = document.createElement("div");
  div.className = "product-card";
  div.innerHTML = `
    <h3>${p.name}</h3>
    <img src="${p.img}" alt="${p.name}">
    <p>${p.price} €</p>
    <div>
      <button class="minus">-</button>
      <span class="qty">1</span>
      <button class="plus">+</button>
    </div>
    <button class="add-to-cart" data-key="addcard">Add to Cart</button>
  `;

  if (p.category === "ensaymada") ensaymadaSection.appendChild(div);
  else if (p.category === "hopia") hopiaSection.appendChild(div);
  else if (p.category === "spanish") spanishSection.appendChild(div);
  else otherSection.appendChild(div);

  const minus = div.querySelector(".minus");
  const plus = div.querySelector(".plus");
  const qtySpan = div.querySelector(".qty");
  const addBtn = div.querySelector(".add-to-cart");

  minus.addEventListener("click", () => {
    if (parseInt(qtySpan.textContent) > 1)
      qtySpan.textContent = parseInt(qtySpan.textContent) - 1;
  });

  plus.addEventListener("click", () => {
    qtySpan.textContent = parseInt(qtySpan.textContent) + 1;
  });

  addBtn.addEventListener("click", () => {
    const quantity = parseInt(qtySpan.textContent);
    const existing = cart.find((item) => item.id === p.id);
    if (existing) existing.qty += quantity;
    else cart.push({ ...p, qty: quantity });

    qtySpan.textContent = "1";
    updateCartBadge();
  });
});

// ==================== FUNKTIOT ====================
function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (totalQty > 0) {
    cartCountEl.style.display = "flex";
    cartCountEl.textContent = totalQty;
  } else {
    cartCountEl.style.display = "none";
  }
}

function updateCartPopup() {
  cartItemsDiv.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = `${item.name} x ${item.qty} = ${item.price * item.qty} €`;
    cartItemsDiv.appendChild(div);
    total += item.price * item.qty;
  });
  totalPriceSpan.textContent = total;
}

function setMinDeliveryDate() {
  const now = new Date();
  now.setDate(now.getDate() + 1); // seuraava päivä
  now.setHours(0, 0, 0, 0);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  deliveryTimeInput.min = `${year}-${month}-${day}T${hours}:${minutes}`;
}

// ==================== EVENT LISTENERIT ====================
setMinDeliveryDate();

viewCartBtn.addEventListener("click", () => {
  updateCartPopup();
  cartPopup.classList.remove("hidden");
  cartPopup.style.display = "flex";
  cartPopup.style.alignItems = "center";
  cartPopup.style.justifyContent = "center";
  cartPopup.style.background = "rgba(0,0,0,0.5)";
  cartPopup.style.position = "fixed";
  cartPopup.style.top = "0";
  cartPopup.style.left = "0";
  cartPopup.style.right = "0";
  cartPopup.style.bottom = "0";
  cartPopup.style.zIndex = "9999";
});

closeCart.addEventListener("click", () => {
  cartPopup.classList.add("hidden");
  cartPopup.style.display = "none";
});

clearCartBtn.addEventListener("click", () => {
  cart = [];
  updateCartPopup();
  updateCartBadge();
  cartPopup.style.display = "none";
  document
    .querySelectorAll(".product-card .qty")
    .forEach((span) => (span.textContent = "1"));
  orderForm.reset();
  alert("Cart cleared!");
});

orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const selectedDate = new Date(deliveryTimeInput.value);

  if (isNaN(selectedDate)) {
    alert("Please select a delivery date.");
    return;
  }

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  minDate.setHours(0, 0, 0, 0);

  if (selectedDate < minDate) {
    alert("Delivery date must be from tomorrow onwards.");
    return;
  }

  if (cart.length === 0) return alert("Your cart is empty.");

  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const city = document.getElementById("customerCity").value.trim();
  const deliveryMethod = document.getElementById("deliveryMethod").value;
  const deliveryTime = deliveryTimeInput.value;

  if (
    !name ||
    !phone ||
    !email ||
    !address ||
    !city ||
    !deliveryMethod ||
    !deliveryTime
  )
    return alert("Please fill in all fields.");

  if (!document.getElementById("consent").checked)
    return alert(
      "Please accept the processing of your data before submitting the order."
    );

  const order = {
    created: new Date().toISOString(),
    customer: { name, phone, email, address, city },
    delivery: { method: deliveryMethod, time: deliveryTime },
    items: cart.map((c) => ({ product: c.name, qty: c.qty, unit: c.price })),
    total: cart.reduce((sum, c) => sum + c.price * c.qty, 0),
  };

  try {
    await addDoc(collection(db, "orders"), order);
    alert("Order submitted!");
    cart = [];
    updateCartPopup();
    updateCartBadge();
    cartPopup.style.display = "none";
    orderForm.reset();
    setMinDeliveryDate(); // resetoi min date
  } catch (err) {
    console.error(err);
    alert("Order failed.");
  }
});

updateCartBadge();
