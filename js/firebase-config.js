import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAl5plvUphx7dQ9QLkQm85N5njyF9fq8lo",
  authDomain: "tilaukset-c956f.firebaseapp.com",
  projectId: "tilaukset-c956f",
  storageBucket: "tilaukset-c956f.appspot.com",
  messagingSenderId: "884544486844",
  appId: "1:884544486844:web:6423e6b2d5baa4e963ffb9",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
