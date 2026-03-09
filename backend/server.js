const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  }),
);

// const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

app.post("/ring", async (req, res) => {
  console.log("Request received:", req.body);

  const { token } = req.body;

  const message = {
    token: token,
    notification: {
      title: "Incoming Ring",
      body: "Someone is ringing your phone",
    },
  };

  try {
    const response = await admin.messaging().send(message);

    console.log("Firebase response:", response);

    res.send("Notification sent");
  } catch (error) {
    console.log("Firebase error:", error);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
