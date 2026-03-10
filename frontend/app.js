import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCP7pi5Jv7nIScyHYSkvUD15K_SiTEEoMU",
  authDomain: "push-ringtone.firebaseapp.com",
  projectId: "push-ringtone",
  messagingSenderId: "512791099015",
  appId: "1:512791099015:web:705897b77d7b4033f82a22",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const db = getFirestore(app);

// --- FUNCTION 1: REGISTER ---
async function handleRegister() {
  const nameInput = document.getElementById("username");
  const status = document.getElementById("status");
  const name = nameInput.value.trim().toLowerCase();

  if (!name) {
    alert("Please enter a name to register.");
    return;
  }

  status.innerText = "Registering...";

  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BCQH6_LDKTqthp-JTKe_OxH2PZRj1GG4I027I4GyJ8sfp554qISUeAzoF8UEwXDPrWSWo5fF7ybjCaDCjJe6HqM",
        serviceWorkerRegistration: registration,
      });

      if (token) {
        await setDoc(doc(db, "users", name), {
          token: token,
          lastUpdated: new Date(),
        });
        status.innerText = `Registered as "${name}"! ✅`;
      }
    } else {
      status.innerText = "Permission denied! ❌";
    }
  } catch (err) {
    console.error(err);
    status.innerText = "Error during registration.";
  }
}

// --- FUNCTION 2: RING ---
async function handleRing() {
  const friendName = document
    .getElementById("targetUser")
    .value.trim()
    .toLowerCase();
  if (!friendName) return alert("Enter a friend's name.");

  try {
    const docRef = doc(db, "users", friendName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const targetToken = docSnap.data().token;

      const response = await fetch("https://ring-phone.onrender.com/ring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: targetToken }),
      });

      if (response.ok) {
        alert(`Request sent to ${friendName}!`);
      } else {
        alert("Server error. Check backend logs.");
      }
    } else {
      alert(`User "${friendName}" not found in database.`);
    }
  } catch (err) {
    console.error(err);
    alert("Error sending ring.");
  }
}

// --- EVENT LISTENERS (The Fix) ---
document.getElementById("regBtn").addEventListener("click", handleRegister);
document.getElementById("ringBtn").addEventListener("click", handleRing);

// Foreground listener for sound
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  if (payload.data?.type === "ring") {
    const audio = new Audio("/ringtone.mp3");
    audio.play().catch(() => {
      console.log("Autoplay blocked. User must interact with page first.");
    });
  }
});
