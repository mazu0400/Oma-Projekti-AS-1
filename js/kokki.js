import { auth, db } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Tarkista että käyttäjä on kirjautunut
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "kokki-login.html";
  }
});

// DOM-elementit
// DOM-elementit
const logoutBtn = document.getElementById("logoutBtn");
const refreshBtn = document.getElementById("refreshBtn");
const ordersTableBody = document.querySelector("#ordersTable tbody");
const ordersDiv = document.getElementById("ordersDiv");

// Tyhjennä napin luonti
const clearBtn = document.createElement("button");
clearBtn.textContent = "Tyhjennä tilaukset";
clearBtn.style.marginLeft = "10px";
ordersDiv.insertBefore(clearBtn, ordersDiv.firstChild);

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Päivitysnapin click
refreshBtn.addEventListener("click", loadOrders);

// Tyhjennä kaikki tilaukset
clearBtn.addEventListener("click", async () => {
  if (!confirm("Haluatko varmasti poistaa kaikki tilaukset?")) return;
  try {
    const ordersCol = collection(db, "orders");
    const snapshot = await getDocs(ordersCol);
    const deletePromises = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "orders", docSnap.id))
    );
    await Promise.all(deletePromises);
    await loadOrders();
  } catch (e) {
    console.error(e);
    alert("Poisto epäonnistui!");
  }
});

// 🌟 Funktio määritellään tässä
async function loadOrders() {
  ordersTableBody.innerHTML = "";
  try {
    const ordersCol = collection(db, "orders");
    const q = query(ordersCol, orderBy("created", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      ordersTableBody.innerHTML = "<tr><td colspan='6'>Ei tilauksia</td></tr>";
      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const row = document.createElement("tr");
      const productsText =
        data.items?.map((i) => `${i.product} x ${i.qty}`).join(", ") || "";

      row.innerHTML = `
        <td>${new Date(data.created).toLocaleString()}</td>
        <td>${data.customer?.name || ""}</td>
        <td>${data.customer?.phone || ""}</td>
        <td>${data.customer?.email || ""}</td>
        <td>${data.customer?.address || ""}</td>
        <td>${data.customer?.city || ""}</td>

        <td>${data.delivery?.method || ""}</td>
        <td>${data.delivery?.time || ""}</td>
        <td>${productsText}</td>
        <td>${data.total || 0} €</td>
      `;

      ordersTableBody.appendChild(row);
    });
  } catch (e) {
    console.error(e);
    ordersTableBody.innerHTML = `<tr><td colspan="6">Virhe latauksessa</td></tr>`;
  }
}

// 🌟 Kutsu funktio vasta nyt, kun se on määritelty
loadOrders();
