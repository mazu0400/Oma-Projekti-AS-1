import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const dropdown = document.querySelector(".dropdown");
const dropdownToggle = document.querySelector(".dropdown-toggle");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

dropdown.addEventListener("mouseenter", () => {
  if (window.innerWidth > 900) dropdown.classList.add("open");
});
dropdown.addEventListener("mouseleave", () => {
  if (window.innerWidth > 900) dropdown.classList.remove("open");
});

dropdownToggle.addEventListener("click", (e) => {
  if (window.innerWidth <= 900) {
    e.preventDefault();
    dropdown.classList.toggle("open");
  }
});

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

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    navMenu.classList.remove("active");
    dropdown.classList.remove("open");
  }
});

let cart = [];

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

const PRODUCTS = [
  // ENSAYMADA
  {
    id: "ens_asorted_half",
    name: "Ensaymada Assorted ½ box",
    price: 13,
    img: "Image/Tuotteet/Image/assorted.jpg",
    category: "ensaymada",
  },
  {
    id: "ens_asorted_full",
    name: "Ensaymada Assorted 1 box",
    price: 25,
    img: "Image/Tuotteet/Image/assorted.jpg",
    category: "ensaymada",
  },
  {
    id: "ens_ube_half",
    name: "Ensaymada <br>Ube ½ box",
    price: 14,
    img: "Image/Tuotteet/Image/Ube.jpg",
    category: "ensaymada",
  },
  {
    id: "ens_ube_full",
    name: "Ensaymada <br>Ube 1 box",
    price: 28,
    img: "Image/Tuotteet/Image/Ube.jpg",
    category: "ensaymada",
  },
  {
    id: "ens_caramel_half",
    name: "Ensaymada<br> Caramel ½ box",
    price: 13,
    img: "Image/Tuotteet/Image/caramel.jpg",
    category: "ensaymada",
  },
  {
    id: "ens_caramel_full",
    name: "Ensaymada <br>Caramel 1 box",
    price: 25,
    img: "Image/Tuotteet/Image/caramel.jpg",
    category: "ensaymada",
  },
  {
    id: "ens_cream_half",
    name: "Ensaymada <br> Cream Cheese ½ box",
    price: 13,
    img: "Image/Tuotteet/Image/cream.jpg",
    category: "ensaymada",
  },
  {
    id: "ens_cream_full",
    name: "Ensaymada <br> Cream Cheese 1 box",
    price: 25,
    img: "Image/Tuotteet/Image/cream.jpg",
    category: "ensaymada",
  },
  {
    id: "ens_classic_half",
    name: "Ensaymada <br>Classic ½ box",
    price: 13,
    img: "Image/Tuotteet/Image/classic.jpg",
    category: "ensaymada",
  },
  {
    id: "ens_classic_full",
    name: "Ensaymada <br>Classic 1 box",
    price: 25,
    img: "Image/Tuotteet/Image/classic.jpg",
    category: "ensaymada",
  },

  // HOPIA
  {
    id: "hop_assorted_half",
    name: "Hopia <br>Assorted ½ box",
    price: 12.5,
    img: "Image/Tuotteet/Image/hopia-assorted-puolikas.jpeg",
    category: "hopia",
  },
  {
    id: "hop_assorted_full",
    name: "Hopia <br>Assorted 1 box",
    price: 25,
    img: "Image/Tuotteet/Image/hopia-assorted-box.jpeg",
    category: "hopia",
  },
  {
    id: "hop_baboy_half",
    name: "Hopia <br>Baboy ½ box",
    price: 12.5,
    img: "Image/Tuotteet/Image/hopi.baboy.jpg",
    category: "hopia",
  },
  {
    id: "hop_baboy_full",
    name: "Hopia <br>Baboy 1 box",
    price: 25,
    img: "Image/Tuotteet/Image/hopi.baboy.jpg",
    category: "hopia",
  },
  {
    id: "hop_ube_half",
    name: "Hopia <br>Ube ½ box",
    price: 14,
    img: "Image/Tuotteet/Image/puolikas-hopia-ube.jpeg",
    category: "hopia",
  },
  {
    id: "hop_ube_full",
    name: "Hopia <br>Ube 1 box",
    price: 28,
    img: "Image/Tuotteet/Image/assor.hopia.jpg",
    category: "hopia",
  },
  {
    id: "hop_munggo_half",
    name: "Hopia <br>Munggo ½ box",
    price: 12.5,
    img: "Image/Tuotteet/Image/puolikas-hopia-munggo.jpeg",
    category: "hopia",
  },
  {
    id: "hop_munggo_full",
    name: "Hopia <br>Munggo 1 box",
    price: 25,
    img: "Image/Tuotteet/Image/hopia-munggo.jpeg",
    category: "hopia",
  },

  // OTHER
  {
    id: "milky_rolls",
    name: "Milky Cheese Rolls",
    price: 24,
    img: "Image/Tuotteet/Image/milky-cheese-rolss-full-box.jpeg",
    category: "other",
  },
  {
    id: "milky_rolls",
    name: "Milky Cheese Rolls ½ box",
    price: 12,
    img: "Image/Tuotteet/Image/milky.cheese.rolls.jpg",
    category: "other",
  },
  {
    id: "Cheese_roll_cake",
    name: "Cheese roll cake",
    price: 15,
    img: "Image/Tuotteet/Image/roll-cake.JPG",
    category: "other",
  },
  {
    id: "cheesy_mamon",
    name: "Cheesy Mamon <br>1 box",
    price: 25,
    img: "Image/Tuotteet/Image/chrrsy-mamon.jpeg",
    category: "other",
  },
  {
    id: "cheesy_mamon",
    name: "Cheesy Mamon <br>½ box",
    price: 13,
    img: "Image/Tuotteet/Image/chrrsy-mamon.jpeg",
    category: "other",
  },
  {
    id: "cassava_s",
    name: "Cassava Small",
    price: 10,
    img: "Image/Tuotteet/Image/cassava.small.jpeg",
    category: "other",
  },
  {
    id: "cassava_m",
    name: "Cassava Medium",
    price: 15,
    img: "Image/Tuotteet/Image/cassava-medium.jpeg",
    category: "other",
  },
  {
    id: "cassava_l",
    name: "Cassava Large",
    price: 25,
    img: "Image/Tuotteet/Image/cassava-large.jpeg",
    category: "other",
  },
  {
    id: "empanada_full_pork",
    name: "Empanada Pork",
    price: 25,
    img: "Image/Tuotteet/Image/empanada_full.JPG",
    category: "other",
  },
  {
    id: "empanada_full_pork",
    name: "Empanada Pork <br> ½ box",
    price: 13,
    img: "Image/Tuotteet/Image/empanada_full.JPG",
    category: "other",
  },
  {
    id: "empanada_full_Chicken",
    name: "Empanada Chicken",
    price: 25,
    img: "Image/Tuotteet/Image/empanada_full.JPG",
    category: "other",
  },
  {
    id: "empanada_half",
    name: " Empanada Chicken <br> ½ box",
    price: 13,
    img: "Image/Tuotteet/Image/empanada_full.JPG",
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
    img: "Image/Tuotteet/Image/pandecoco.jpg",
    category: "other",
  },
  {
    id: "maja_blanca",
    name: "Maja Blanca Large",
    price: 30,
    img: "Image/Tuotteet/Image/maja_blanca.JPG",
    category: "other",
  },
  {
    id: "maja_blanca",
    name: "Maja Blanca Small",
    price: 10,
    img: "Image/Tuotteet/Image/maja-blanca-small.jpeg",
    category: "other",
  },

  {
    id: "pandesiosa",
    name: "Pandesiosa",
    price: 10,
    img: "Image/Tuotteet/Image/pandesiosa.jpeg",
    category: "other",
  },
  {
    id: "ube_halaya",
    name: "Ube Halaya Small",
    price: 10,
    img: "Image/Tuotteet/Image/Ube.halaya.jpg",
    category: "other",
  },
  {
    id: "ube_halaya",
    name: "Ube Halaya Large",
    price: 20,
    img: "Image/Tuotteet/Image/ube-halaya-large-1.jpeg",
    category: "other",
  },
  {
    id: "ube_pandekeso",
    name: "Ube Pandekeso",
    price: 10,
    img: "Image/Tuotteet/Image/ube-pandekeso.jpeg",
    category: "other",
  },
  {
    id: "chicharon_single",
    name: "Chicharon 1 pcs",
    price: 8,
    img: "Image/Tuotteet/Image/chicharon.jpeg",
    category: "other",
  },
  {
    id: "chicharon_three",
    name: "Chicharon 3 pcs",
    price: 20,
    img: "Image/Tuotteet/Image/chicharon.jpeg",
    category: "other",
  },
  {
    id: "siopao",
    name: "siopao 4 pcs",
    price: 10,
    img: "Image/Tuotteet/Image/siopao.jpeg",
    category: "other",
  },
  {
    id: "siopao",
    name: "siopao 1 pcs",
    price: 2.5,
    img: "Image/Tuotteet/Image/siopao.jpeg",
    category: "other",
  },

  // SPANISH BREAD
  {
    id: "span_classic",
    name: "Spanish Bread <br>Classic",
    price: 10,
    img: "Image/Tuotteet/Image/spanish.bread.classic.jpg",
    category: "spanish",
  },
  {
    id: "span_munggo",
    name: "Spanish Bread <br>Munggo",
    price: 10,
    img: "Image/Tuotteet/Image/spanish.bread.munggo.jpg",
    category: "spanish",
  },
  {
    id: "span_ube",
    name: "Spanish Bread <br>Ube",
    price: 12,
    img: "Image/Tuotteet/Image/spanish.ube.jpg",
    category: "spanish",
  },
];

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
  totalPriceSpan.textContent = total.toFixed(2);
}

function setMinDeliveryDate() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  now.setHours(0, 0, 0, 0);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  deliveryTimeInput.min = `${year}-${month}-${day}T${hours}:${minutes}`;
}
setMinDeliveryDate();

// Haetaan elementit
const deliveryMethod = document.getElementById("deliveryMethod");
const cityContainer = document.getElementById("cityContainer");
const citySelect = document.getElementById("city");

// Näytetään kaupunki-valikko, jos toimitustapa on delivery
deliveryMethod.addEventListener("change", () => {
  if (deliveryMethod.value === "delivery") {
    cityContainer.style.display = "block";
    updateTotalPrice(); // Päivitetään hinta heti
  } else {
    cityContainer.style.display = "none";
    updateTotalPrice(); // Päivitetään hinta, jos ei toimitusta
  }
});

// Päivitetään hinta, kun kaupunki valitaan
citySelect.addEventListener("change", updateTotalPrice);

function updateTotalPrice() {
  let total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  if (deliveryMethod.value === "delivery") {
    const selectedCity = citySelect.options[citySelect.selectedIndex];
    const deliveryPrice = parseFloat(selectedCity.getAttribute("data-price")) || 0;
    total += deliveryPrice;
  }
  totalPriceSpan.textContent = total.toFixed(2) + " €";
}

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
const message = document.getElementById("orderMessage").value.trim();
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

let total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
let deliveryPrice = 0;
if (document.getElementById("deliveryMethod").value === "delivery") {
  const selected = citySelect.options[citySelect.selectedIndex];
  deliveryPrice = parseFloat(selected?.getAttribute("data-price")) || 0;
  total += deliveryPrice;
}

const order = {
  created: new Date().toISOString(),
  customer: { name, phone, email, address, city },  // Tämä on asiakkaan antama kaupunki
  delivery: { method: deliveryMethod, time: deliveryTime, city: citySelect.value }, // Tämä on valittu toimituskaupunki
  items: cart.map((c) => ({ product: c.name, qty: c.qty, unit: c.price })),
  total: total,
  deliveryPrice: deliveryPrice,
  message: message // Tämä on asiakkaan viesti
};

  try {
    await addDoc(collection(db, "orders"), order);
    alert("Order submitted!");
    cart = [];
    updateCartPopup();
    updateCartBadge();
    cartPopup.style.display = "none";
    orderForm.reset();
    setMinDeliveryDate();
  } catch (err) {
    console.error(err);
    alert("Order failed.");
  }
});

updateCartBadge();
