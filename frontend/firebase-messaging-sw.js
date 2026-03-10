importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCP7pi5Jv7nIScyHYSkvUD15K_SiTEEoMU",
  authDomain: "push-ringtone.firebaseapp.com",
  projectId: "push-ringtone",
  messagingSenderId: "512791099015",
  appId: "1:512791099015:web:705897b77d7b4033f82a22",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background Ring Received:", payload);

  const notificationTitle = "🚨 INCOMING RING";
  const notificationOptions = {
    body: "Someone is ringing your phone!",
    icon: "/icon.png",
    tag: "ring-request", // This groups multiple rings into one
    renotify: true, // Makes the phone vibrate again if a second ring comes
    vibrate: [
      500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170,
      40,
    ], // SOS pattern
    data: { url: self.location.origin }, // Save the URL to open on click
  };

  // Logic to play sound in background (Android only)
  // Note: This is hit-or-miss depending on Chrome's 'Engagement' score
  const audio = new Audio("/ringtone.mp3");
  audio.play().catch(() => console.log("Background audio blocked by OS"));

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

// When user clicks the notification, open the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
