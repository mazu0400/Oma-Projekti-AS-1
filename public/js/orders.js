import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// OSTOSKORI
let cart = [];

// DOM-elementit
const productsSection = document.getElementById("products");
const cartPopup = document.getElementById("cartPopup");
const cartItemsDiv = document.getElementById("cartItems");
const totalPriceSpan = document.getElementById("totalPrice");
const closeCart = document.getElementById("closeCart");
const viewCartBtn = document.getElementById("viewCartBtn");
const orderForm = document.getElementById("orderForm");
//tuotteet
const PRODUCTS = [
  {
    id: "a",
    name: "Classic Crepe",
    price: 8,
    img: "img/a.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Suola", "Sokeri"],
  },
  {
    id: "b",
    name: "Chocolate Delight",
    price: 12,
    img: "img/b.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Kaakao", "Sokeri"],
  },
  {
    id: "c",
    name: "Berry Blast",
    price: 10,
    img: "img/c.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Mustikat", "Vadelmat"],
  },
  {
    id: "d",
    name: "Banana Nut Crunch",
    price: 11,
    img: "img/d.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Banaani", "Pähkinät"],
  },
  {
    id: "e",
    name: "Caramel Dream",
    price: 13,
    img: "img/e.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Karamelli", "Sokeri"],
  },
  {
    id: "f",
    name: "Maple Pecan",
    price: 12,
    img: "img/f.jpg",
    ingredients: [
      "Vehnäjauho",
      "Maito",
      "Muna",
      "Vaahterasiirappi",
      "Pekaanipähkinät",
    ],
  },
  {
    id: "g",
    name: "Lemon Zest",
    price: 9,
    img: "img/g.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Sitruuna", "Sokeri"],
  },
  {
    id: "h",
    name: "Strawberry Swirl",
    price: 11,
    img: "img/h.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Mansikat", "Kermavaahto"],
  },
  {
    id: "i",
    name: "Blueberry Heaven",
    price: 10,
    img: "img/i.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Mustikat", "Kaneli"],
  },
  {
    id: "j",
    name: "Nutella Fantasy",
    price: 14,
    img: "img/j.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Nutella", "Suklaarouhe"],
  },
  {
    id: "k",
    name: "Apple Cinnamon",
    price: 11,
    img: "img/k.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Omena", "Kaneli"],
  },
  {
    id: "l",
    name: "Peanut Butter Bliss",
    price: 12,
    img: "img/l.jpg",
    ingredients: [
      "Vehnäjauho",
      "Maito",
      "Muna",
      "Maapähkinävoi",
      "Suklaarouhe",
    ],
  },
  {
    id: "m",
    name: "Tropical Mango",
    price: 13,
    img: "img/m.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Mango", "Kookos"],
  },
  {
    id: "n",
    name: "Chocolate Banana",
    price: 12,
    img: "img/n.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Banaani", "Kaakao"],
  },
  {
    id: "o",
    name: "Vanilla Dream",
    price: 15,
    img: "img/o.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Vanilja", "Sokeri"],
  },
  {
    id: "p",
    name: "Coconut Delight",
    price: 13,
    img: "img/p.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Kookos", "Sokeri"],
  },
  {
    id: "q",
    name: "Caramel Apple",
    price: 14,
    img: "img/q.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Omena", "Karamelli"],
  },
  {
    id: "r",
    name: "Peach Melba",
    price: 15,
    img: "img/r.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Persikka", "Vadelmat"],
  },
  {
    id: "s",
    name: "Raspberry Tart",
    price: 16,
    img: "img/s.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Vadelmat", "Suklaa"],
  },
  {
    id: "t",
    name: "Chocolate Hazelnut",
    price: 17,
    img: "img/t.jpg",
    ingredients: ["Vehnäjauho", "Maito", "Muna", "Suklaa", "Hasselpähkinät"],
  },
];

// Luo tuotekortit (vain yksi looppi)
PRODUCTS.forEach((p) => {
  const div = document.createElement("div");
  div.className = "product-card";
  div.innerHTML = `
    <img src="${p.img}" alt="${p.name}">
    <h3>${p.name}</h3>
    <p>${p.price} €</p>
     <p class="ingredients"><strong>Ainesosat:</strong> ${p.ingredients.join(
       ", "
     )}</p>
    <div>
      <button class="minus">-</button>
      <span class="qty">1</span>
      <button class="plus">+</button>
    </div>
    <button class="add-to-cart">Lisää ostoskoriin</button>
  `;
  productsSection.appendChild(div);

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
  });
});

// Näytä ja päivitä ostoskori
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

viewCartBtn.addEventListener("click", () => {
  updateCartPopup();

  cartPopup.classList.remove("hidden");

  cartPopup.style.position = "fixed";
  cartPopup.style.top = "0";
  cartPopup.style.left = "0";
  cartPopup.style.right = "0";
  cartPopup.style.bottom = "0";

  cartPopup.style.display = "flex";
  cartPopup.style.alignItems = "center";
  cartPopup.style.justifyContent = "center";
  cartPopup.style.background = "rgba(0,0,0,0.5)";
  cartPopup.style.zIndex = "9999";
});
closeCart.addEventListener("click", () => {
  cartPopup.classList.add("hidden");
  cartPopup.style.display = "none";
});

// Lähetä tilaus Firebaseen
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Ostoskori on tyhjä");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const city = document.getElementById("customerCity").value.trim();
  const deliveryMethod = document.getElementById("deliveryMethod").value;
  const deliveryTime = document.getElementById("deliveryTime").value;

  if (
    !name ||
    !phone ||
    !email ||
    !address ||
    !city ||
    !deliveryMethod ||
    !deliveryTime
  ) {
    alert("Täytä kaikki kentät");
    return;
  }

  const order = {
    created: new Date().toISOString(),
    customer: { name, phone, email, address, city },
    delivery: { method: deliveryMethod, time: deliveryTime },
    items: cart.map((c) => ({ product: c.name, qty: c.qty, unit: c.price })),
    total: cart.reduce((sum, c) => sum + c.price * c.qty, 0),
  };
  const consent = document.getElementById("consent").checked;
  if (!consent) {
    alert("Hyväksy tietojesi käsittely ennen tilauksen lähettämistä.");
    return;
  }

  try {
    await addDoc(collection(db, "orders"), order);
    alert("Tilaus lähetetty!");
    cart = [];
    updateCartPopup();
    cartPopup.style.display = "none";
    orderForm.reset();
  } catch (err) {
    console.error(err);
    alert("Tilaus epäonnistui. Katso konsoli.");
  }
});
