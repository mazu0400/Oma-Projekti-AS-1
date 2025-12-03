import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const loginBtn = document.getElementById("loginBtn");
  const errorMsg = document.getElementById("errorMsg");

  loginBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Kirjautuminen onnistui, ohjataan kokki-näkymään
      window.location.href = "kokin.html";
    } catch (error) {
      console.error(error);
      errorMsg.style.display = "block";
      errorMsg.textContent = "Väärä sähköposti tai salasana";
    }
  });
});
