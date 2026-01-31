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
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "kokki-login.html";
  }
});
const logoutBtn = document.getElementById("logoutBtn");
const refreshBtn = document.getElementById("refreshBtn");
const ordersTableBody = document.querySelector("#ordersTable tbody");
const ordersDiv = document.getElementById("ordersDiv");
const clearBtn = document.createElement("button");
clearBtn.textContent = "Tyhjennä tilaukset";
clearBtn.style.marginLeft = "10px";
ordersDiv.insertBefore(clearBtn, ordersDiv.firstChild);

const exportBtn = document.createElement("button");
exportBtn.textContent = "Tallenna Exceliin";
exportBtn.style.marginLeft = "10px";
ordersDiv.insertBefore(exportBtn, ordersDiv.firstChild);

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

refreshBtn.addEventListener("click", loadOrders);

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

exportBtn.addEventListener("click", () => {
  let csv =
    "Aikaleima,Nimi,Puhelin,Sähköposti,Osoite,Kaupunki,Toimitustapa,Haluttu toimitusaika,Tuotteet,Total\n";

  const rows = document.querySelectorAll("#ordersTable tbody tr");
  rows.forEach((row) => {
    const cols = row.querySelectorAll("td");
    const rowData = Array.from(cols)
      .map((td) => `"${td.textContent}"`)
      .join(",");
    csv += rowData + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "tilaukset.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
async function loadOrders() {
  ordersTableBody.innerHTML = "";
  try {
    const ordersCol = collection(db, "orders");
    const q = query(ordersCol, orderBy("created", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      ordersTableBody.innerHTML = "<tr><td colspan='11'>Ei tilauksia</td></tr>";
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
        <td>${data.total || 0} </td>
        <td><button class="deleteBtn">Poista</button></td>
      `;
      const deleteBtn = row.querySelector(".deleteBtn");
      deleteBtn.addEventListener("click", async () => {
        if (confirm("Haluatko varmasti poistaa tämän tilauksen?")) {
          try {
            await deleteDoc(doc(db, "orders", docSnap.id));
            await loadOrders();
          } catch (err) {
            console.error(err);
            alert("Tilausta ei voitu poistaa!");
          }
        }
      });
      ordersTableBody.appendChild(row);
    });
  } catch (e) {
    console.error(e);
    ordersTableBody.innerHTML = `<tr><td colspan="11">Virhe latauksessa</td></tr>`;
  }
}
loadOrders();
