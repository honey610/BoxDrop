// import React from "react";


// function Footer() {
//     return ( <>
//     <footer className="bg-dark text-white text-center py-3 mt-4">
//       <p className="mb-0">&copy; 2024 Box Subscription Service. All rights reserved.</p>
//     </footer>
//     </> );
// }

// export default Footer;

import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row gy-4">

          {/* Brand */}
          <div className="col-md-4">
            <h5 className="fw-bold">BoxDrop</h5>
            <p className="text-muted mt-2">
              Discover curated subscription boxes from independent creators,
              delivered to your doorstep.
            </p>
          </div>

          {/* Explore */}
          <div className="col-md-2">
            <h6 className="fw-semibold">Explore</h6>
            <ul className="list-unstyled mt-2">
              <li><Link className="footer-link" to="/browse">Browse Boxes</Link></li>
              <li><Link className="footer-link" to="/how-it-works">How it Works</Link></li>
            </ul>
          </div>

          {/* Sellers */}
          <div className="col-md-3">
            <h6 className="fw-semibold">For Sellers</h6>
            <ul className="list-unstyled mt-2">
              <li><Link className="footer-link" to="/sell">Become a Seller</Link></li>
              <li><Link className="footer-link" to="/seller/dashboard">Seller Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-md-3">
            <h6 className="fw-semibold">Legal</h6>
            <ul className="list-unstyled mt-2">
              <li><Link className="footer-link" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="footer-link" to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

        </div>

        <hr className="border-secondary mt-4" />

        <div className="text-center text-muted">
          © {new Date().getFullYear()} BoxDrop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
