// import dotenv from "dotenv";
// dotenv.config(); // 🔑 LOAD ENV HERE

// import admin from "firebase-admin";
// import fs from "fs";
// import path from "path";

// if (!process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
//   throw new Error("❌ FIREBASE_SERVICE_ACCOUNT_PATH not set in .env");
// }

// const serviceAccountPath = path.resolve(
//   process.env.FIREBASE_SERVICE_ACCOUNT_PATH
// );

// if (!admin.apps.length) {
//   const serviceAccount = JSON.parse(
//     fs.readFileSync(serviceAccountPath, "utf8")
//   );

//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// export default admin;

import dotenv from "dotenv";
dotenv.config();

import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export default admin;