// import React,{useEffect} from "react";
// import "./BoxCard.css";

// function BoxCard({box}) {
// //     useEffect(() => {
// //   const cards = document.querySelectorAll(".box-card");

// //   const observer = new IntersectionObserver(
// //     (entries) => {
// //       entries.forEach(entry => {
// //         if (entry.isIntersecting) {
// //           entry.target.classList.add("scroll-3d");
// //         }
// //       });
// //     },
// //     { threshold: 0.4 }
// //   );

// //   cards.forEach(card => observer.observe(card));
// // }, []);
//     return ( <>
//      <div className="box-card">
//       <div className="box-image">
//         <img src={box.image} alt={box.title} />
//         <span className="price-tag">${box.price}/mo</span>
//       </div>

//       <div className="p-3">
//         <span className="box-category">{box.category}</span>
//         <h5 className="fw-bold mt-2">{box.title}</h5>
//         <p className="text-muted">by {box.brand}</p>

//         <div className="d-flex justify-content-between align-items-center mt-3">
//           <span className="rating">⭐ {box.rating}</span>
//           <button className="btn btn-link p-0">
//             View Details
//           </button>
//         </div>
//       </div>
//     </div>

//     </> );
// }

// export default BoxCard;

// import { Link } from "react-router-dom";

// function BoxCard({ box }) {
//   return (
//     <div className="card h-100 shadow-sm box-card">
//       <img
//         src={box.images?.[0] || "/placeholder.png"}
//         className="card-img-top"
//         alt={box.title}
//       />

//       <div className="card-body">
//         <span className="text-uppercase text-muted small">
//           {box.category || "SUBSCRIPTION"}
//         </span>

//         <h5 className="card-title mt-2">{box.title}</h5>

//         <p className="text-muted mb-2">
//           by {box.sellerId?.brandName}
//         </p>

//         <div className="d-flex justify-content-between align-items-center">
//           <strong>₹{box.price}</strong>
//           <Link to={`/boxes/${box._id}`} className="btn btn-sm btn-outline-dark">
//             View
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BoxCard;
import { Link } from "react-router-dom";
import "./BoxCard.css";
const BACKEND_URL = "https://boxdrop-backend-w7s7.onrender.com";

function BoxCard({ box }) {
  console.log(box)
 console.log(box.title,box.sellerId)
  return (
   
    <div className="card box-card h-100">
      <div className="box-image-wrapper">
        {/* <img
          src={box.images?.[0]|| "https://images.unsplash.com/photo-1582650859079-ee63913ecb84?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
          alt={box.title}
          className="box-image"
        /> */}
        <img
  src={
    box.images?.[0]
      ? `${BACKEND_URL}${box.images[0]}`
      // ?`box.images[0]`
      : "https://images.unsplash.com/photo-1582650859079-ee63913ecb84?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
  alt={box.title}
  className="box-image"
/>
      </div>

      <div className="card-body d-flex flex-column">
        <span className="box-category">
          {box.category || "SUBSCRIPTION"}
        </span>

        <h5 className="card-title mt-2">{box.title}</h5>

        <p className="text-muted mb-3">
          by {box.sellerId?.brandName||"Unknown Brand"}
        </p>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <strong className="box-price">₹{box.price}</strong>

          <Link
            to={`/boxes/${box._id}`}
            className="btn btn-sm btn-outline-dark"
          >
            View Box
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BoxCard;

