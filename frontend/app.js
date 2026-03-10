import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyCP7pi5Jv7nIScyHYSkvUD15K_SiTEEoMU",
  authDomain: "push-ringtone.firebaseapp.com",
  projectId: "push-ringtone",
  messagingSenderId: "512791099015",
  appId: "1:512791099015:web:705897b77d7b4033f82a22",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
let deviceToken = null;

async function init() {
  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      deviceToken = await getToken(messaging, {
        vapidKey:
          "BCQH6_LDKTqthp-JTKe_OxH2PZRj1GG4I027I4GyJ8sfp554qISUeAzoF8UEwXDPrWSWo5fF7ybjCaDCjJe6HqM",
        serviceWorkerRegistration: registration,
      });
      console.log("Token:", deviceToken);
    }
  } catch (err) {
    console.error("Init error:", err);
  }
}

// Foreground Listener
onMessage(messaging, (payload) => {
  console.log("Foreground message:", payload);
  if (payload.data?.type === "ring") {
    const audio = new Audio("/ringtone.mp3");
    audio
      .play()
      .catch((e) =>
        console.log("Audio play failed (user interaction needed):", e),
      );
  }
});

window.ring = async () => {
  if (!deviceToken) return alert("Token not ready");

  await fetch("https://ring-phone.onrender.com/ring", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: deviceToken }),
  });
};

init();
