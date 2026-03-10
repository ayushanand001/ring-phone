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
    // Register service worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    // Ask notification permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    // Get FCM token
    deviceToken = await getToken(messaging, {
      vapidKey:
        "BCQH6_LDKTqthp-JTKe_OxH2PZRj1GG4I027I4GyJ8sfp554qISUeAzoF8UEwXDPrWSWo5fF7ybjCaDCjJe6HqM",
      serviceWorkerRegistration: registration,
    });

    console.log("Device Token:", deviceToken);

    if (!deviceToken) {
      console.log("No registration token available.");
    }
  } catch (err) {
    console.error("Init error:", err);
  }
}

init();

// Listen for foreground messages
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);

  if (payload.data && payload.data.type === "ring") {
    const audio = new Audio("/ringtone.mp3");
    audio.play();
  }
});

// Ring button function
async function ring() {
  if (!deviceToken) {
    alert("Device token not ready yet. Refresh the page.");
    return;
  }

  try {
    const response = await fetch("https://ring-phone.onrender.com/ring", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: deviceToken }),
    });

    const data = await response.text();
    console.log("Server response:", data);
  } catch (err) {
    console.error("Ring error:", err);
  }
}

// expose to HTML
window.ring = ring;
