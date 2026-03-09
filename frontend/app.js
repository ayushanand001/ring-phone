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
  const registration = await navigator.serviceWorker.register(
    "./firebase-messaging-sw.js",
  );

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    deviceToken = await getToken(messaging, {
      vapidKey:
        "BCQH6_LDKTqthp-JTKe_OxH2PZRj1GG4I027I4GyJ8sfp554qISUeAzoF8UEwXDPrWSWo5fF7ybjCaDCjJe6HqM",
      serviceWorkerRegistration: registration,
    });

    console.log("DEVICE TOKEN:", deviceToken);
  }
}

init();

onMessage(messaging, (payload) => {
  console.log("Message received in foreground:", payload);

  new Notification(payload.notification.title, {
    body: payload.notification.body,
  });

  const audio = new Audio("./ringtone.mp3");

  audio.loop = true;
  audio.play();
});

async function ring() {
  await fetch("https://ring-phone.onrender.com", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      token: deviceToken,
    }),
  });
}

window.ring = ring;
