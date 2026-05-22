

import "./Login.css";
import { useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import api from "../api/api";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // const {isAuthenticated}=useSelector((state)=>state.auth);


  /* 🔁 REDIRECT BY ROLE */
  const redirectByRole = (role) => {
    if (role === "ADMIN") navigate("/admin/seller-approvals");
    else if (role === "SELLER") navigate("/seller/dashboard");
    else navigate("/userProfile");
  };

  /* 🔐 GOOGLE LOGIN */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const res = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
// console.log("Backend response:", res.data);
      dispatch(setUser(res.data.user));
      redirectByRole(res.data.user.role);
    } catch (err) {
       console.error("Google login error:", err.response?.data || err.message);
  alert(err.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };
// const handleGoogleLogin = async () => {
//   try {
//     setLoading(true);

//     const result = await signInWithPopup(auth, googleProvider);
//     const token = await result.user.getIdToken();

//     let res;

//     try {
//       // 🔹 Try fetching existing user
//       res = await api.get("/users/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//     } catch (err) {
//       // 🔹 User doesn't exist → create
//       res = await api.post(
//         "/users/me",
//         {
//           name: result.user.displayName,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//     }

//     dispatch(setUser(res.data.user));
//     redirectByRole(res.data.user.role);
//   } catch (err) {
//     console.error("Google login error:", err.response?.data || err.message);
//     alert("Google login failed");
//   } finally {
//     setLoading(false);
//   }
// };


  /* 🔐 EMAIL LOGIN */
  const handleEmailLogin = async () => {
  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const result = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password.trim()
    );
    console.log("Firebase user:", result.user);

    const token = await result.user.getIdToken();

    const res = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setUser(res.data.user));
    redirectByRole(res.data.user.role);

  } catch (err) {
    console.error("Email login error:", err);
    alert("Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  // const handleEmailLogin = async () => {
  // if (!email || !password) {
  //   alert("Please fill all fields");
  //   return;
  // }

  // try {
  //   setLoading(true);

  //   const result = await signInWithEmailAndPassword(
  //     auth,
  //     email.trim(),
  //     password.trim()
  //   );

  //   const token = await result.user.getIdToken();

  //   let res;

  //   try {
  //     // 🔹 Try fetch user
  //     res = await api.get("/users/me", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
     
  //   } catch (err) {
  //     // 🔹 User missing in DB → create
  //     if (err.response?.status === 404) {
  //       res = await api.post(
  //         "/users/me",
  //         {
  //           name: result.user.displayName || email.split("@")[0],
  //         },
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //     } else {
  //       throw err;
  //     }
  //   }

//     dispatch(setUser(res.data.user));
//     redirectByRole(res.data.user.role);

//   } catch (err) {
//     console.error(err);
//     alert("Login failed");
//   } finally {
//     setLoading(false);
//   }
// };


  /* 🔐 EMAIL SIGNUP */
//   const handleSignup = async () => {
//     if (!name || !email || !password) {
//       alert("Please fill all fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       const result = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       await updateProfile(result.user, {
//         displayName: name,
//       });

//       const token = await result.user.getIdToken(true);

//       const res = await api.post(
//   "/users/me",
//   { name }, // 👈 send name explicitly
//   {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }
// );


//       dispatch(setUser(res.data.user));
//       redirectByRole(res.data.user.role);
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
const handleSignup = async () => {
  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const result = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password.trim()
    );

    // Save name in Firebase profile
    await updateProfile(result.user, {
      displayName: name,
    });

    const token = await result.user.getIdToken(true);

    const res = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setUser(res.data.user));
    redirectByRole(res.data.user.role);

  } catch (err) {
    console.error("Signup error:", err);
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container d-flex">
      {/* LEFT – FORM */}
      <div className="login-form d-flex flex-column justify-content-center">
        <h2>{isSignup ? "Create your BoxDrop account" : "Welcome to BoxDrop"}</h2>
        <p>{isSignup ? "Sign up to get started" : "Sign in to continue"}</p>

        {/* NAME (SIGNUP ONLY) */}
        {isSignup && (
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        {/* EMAIL */}
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* MAIN BUTTON */}
        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={isSignup ? handleSignup : handleEmailLogin}
        >
          {loading
            ? "Please wait..."
            : isSignup
            ? "Create Account"
            : "Login"}
        </button>

        <div className="text-center my-3 text-muted">OR</div>

        {/* GOOGLE */}
        <button
          className="btn btn-dark"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Continue with Google
        </button>

        {/* TOGGLE */}
        <p className="mt-4 text-center">
          {isSignup ? "Already have an account?" : "New to BoxDrop?"}{" "}
          <span
            className="text-primary fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Create account"}
          </span>
        </p>
      </div>

      {/* RIGHT – BRAND */}
      <div className="login-right">
        <div className="overlay">
          <h1>Discover curated subscription boxes</h1>
          <p>Premium experiences delivered monthly.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
