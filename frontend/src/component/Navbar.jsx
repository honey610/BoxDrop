
import { Link, useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import logo from "../assets/pagelogo.png";
import "./Navbar.css";
import { auth } from "../firebase";
import { logout } from "../features/auth/authSlice";

function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
     
    await auth.signOut();
   
    dispatch(logout());
    // Remove token from local storage
 
     
    
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark navbar-expand-lg  border-bottom navbar-glass">
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand" to="/">
        <span><Package className="me-2" size={40} color="green"/></span>
          {/* <img src={logo} alt="BoxDrop" style={{ width: "180px" }} /> */}
         <span style={{color:"white",fontSize:"30px",fontFamily:"cursive"}}>BoxDrop</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
         
        >
          <span className="navbar-toggler-icon" ></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-4">

            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/browse" style={{color:"white"}}>
                Browse Boxes
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/how-it-works"style={{color:"white"}}>
                How it Works
              </Link>
            </li>

            {/* 👇 AUTH LOGIC */}
            {!isAuthenticated ? (
              <>
                <li className="nav-item ">
                  <Link className="nav-link text-white" to="/login">
                    Log In
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/signup"
                    className="btn text-white px-4"
                    style={{ backgroundColor: "rgba(72, 0, 255, 1)" }}
                  >
                    Get Started
                  </Link>
                </li>
              </>
            ) : (
              /* 👤 PROFILE DROPDOWN */
              <li className="nav-item dropdown">
                <button
                  className="btn dropdown-toggle profile-btn"
                  data-bs-toggle="dropdown"
                >
                  {user?.email?.charAt(0).toUpperCase()}
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li>
                    <Link className="dropdown-item" to="/userprofile">
                      My Profile
                    </Link>
                  </li>

                  {
                    user?.role === "USER" &&  (
                      <li>
                        <Link className="dropdown-item" to="/orders">
                          Orders
                        </Link>
                      </li>
                    )
                  }

                  {user?.role === "SELLER" && (
                    <li>
                      <Link className="dropdown-item" to="/seller/dashboard">
                        Seller Dashboard
                      </Link>
                      
                      <Link className="dropdown-item" to="/orders">
                          Orders
                        </Link>
                    </li>
                  )}

                  {user?.role === "ADMIN" && (
                    <li>
                      <Link className="dropdown-item" to="/admin">
                        Admin Panel
                      </Link>
                    </li>
                  )}


                  <li><hr className="dropdown-divider" /></li>

                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
