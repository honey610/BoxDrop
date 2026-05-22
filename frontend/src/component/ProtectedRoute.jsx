import { Navigate,useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useSelector(
    (state) => state.auth
  );
   const location = useLocation();


  // ⏳ WAIT until auth is resolved
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{from:location}} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
console.log({ user, isAuthenticated, loading });

  return children;
}

// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// export default function ProtectedRoute({ children, allowedRoles }) {
//   const { user, loading } = useSelector((state) => state.auth);

//   // ⏳ wait for auth restore
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // ❌ no user → login
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // 🔐 role check
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }
