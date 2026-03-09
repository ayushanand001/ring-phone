import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCP7pi5Jv7nIScyHYSkvUD15K_SiTEEoMU",

  authDomain: "push-ringtone.firebaseapp.com",

  projectId: "push-ringtone",

  messagingSenderId: "512791099015",

  appId: "1:512791099015:web:705897b77d7b4033f82a22",
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    getToken(messaging, {
      vapidKey:
        "BCQH6_LDKTqthp-JTKe_OxH2PZRj1GG4I027I4GyJ8sfp554qISUeAzoF8UEwXDPrWSWo5fF7ybjCaDCjJe6HqM",
    }).then((currentToken) => {
      if (currentToken) {
        console.log("Device Token:", currentToken);
      }
    });
  }
});

async function ring() {
  await fetch("http://localhost:3000/ring", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      token: "PASTE_DEVICE_TOKEN_HERE",
    }),
  });
}
