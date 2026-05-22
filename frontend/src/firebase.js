
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCRZQSy_UYSQW4Er41mNJ2X3h7lxnKZ05Y",
  authDomain: "subscription-box-generator.firebaseapp.com",
  projectId: "subscription-box-generator",
  storageBucket: "subscription-box-generator.appspot.com",
  appId: "1:980796753764:web:72c3419a4d234212c89c71",
};

// ✅ Prevent double initialization (VERY IMPORTANT for Vite)
const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];

// ✅ Auth setup
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
