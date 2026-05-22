import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import api from "../api/api";

/* GOOGLE LOGIN */
export const googleLogin = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const token = await result.user.getIdToken();

  const res = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.user;
};

/* EMAIL LOGIN */
export const emailLogin = async (email, password) => {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const token = await result.user.getIdToken();

  const res = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.user;
};

/* EMAIL SIGNUP */
export const emailSignup = async (name, email, password) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(result.user, {
    displayName: name,
  });

  const token = await result.user.getIdToken();

  const res = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.user;
};
