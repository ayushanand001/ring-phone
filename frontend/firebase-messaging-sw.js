importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyCP7pi5Jv7nIScyHYSkvUD15K_SiTEEoMU",
  authDomain: "push-ringtone.firebaseapp.com",
  projectId: "push-ringtone",
  messagingSenderId: "512791099015",
  appId: "1:512791099015:web:705897b77d7b4033f82a22",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// This handles the background notification
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Background message received ",
    payload,
  );

  const notificationTitle = payload.data.title || "Incoming Ring";
  const notificationOptions = {
    body: payload.data.body || "Someone is ringing!",
    icon: "/icon.png", // Add an icon path if you have one
    data: payload.data, // Pass the data so we can access it
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
