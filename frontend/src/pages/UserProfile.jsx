
// import React from "react";
// import { useSelector } from "react-redux";
// import "./UserProfile.css";
// import Navbar from "../component/Navbar";
// import { Link } from "react-router-dom";

// function UserProfile() {
//   const { user } = useSelector((state) => state.auth);
//   if (!user) return null;

//   return (
//     <>
//     <Navbar />
//     <div className="profile-page-container vh-100">
//     <div className="profile-page">
      
//       {/* HEADER */}
//       <div className="profile-header fade-in">
//         <div className="avatar">
//           {user?.email?.charAt(0).toUpperCase()}
//         </div>

//         <div className="profile-info">
//           <h2>{user?.name || "BoxDrop User"}</h2>
//           <p>{user?.email}</p>
//           <span className={`role-badge ${user?.role?.toLowerCase()}`}>
//             {user?.role}
//           </span>
//         </div>
//       </div>

//       {/* STATS */}
//       <div className="profile-stats slide-up">
//         <div className="stat-card">
//           <h3>0</h3>
//           <p>Active Subscriptions</p>
//         </div>
//         <div className="stat-card">
//           <h3>0</h3>
//           <p>Boxes Received</p>
//         </div>
//         <div className="stat-card">
//           <h3>2025</h3>
//           <p>Member Since</p>
//         </div>
//       </div>

//       {/* DETAILS */}
//       <div className="profile-details fade-in-delay">
//         <h3>Account Details</h3>

//         <div className="detail-row">
//           <span>Email</span>
//           <span>{user?.email}</span>
//         </div>

//         <div className="detail-row">
//           <span>Role</span>
//           <span>{user?.role}</span>
//         </div>

//         <div className="detail-row">
//           <span>User ID</span>
//           <span className="muted">{user?._id}</span>
//         </div>
//       </div>

//       {/* ACTIONS */}
//       <div className="profile-actions slide-up-delay">
//         {user?.role === "USER" && (
//          < Link to="/apply-seller">
//           <button className="btn upgrade">
//             Become a Seller
//           </button>
//         </Link>
//         )}

        
//       </div>

//     </div>
//     </div>
//     </>
//   );
// }

// export default UserProfile;
// import { useState, useEffect} from "react";
// import { useSelector } from "react-redux";
// import Navbar from "../component/Navbar";
// import SellerApply from "./SellerApply";


// function UserProfile() {
//   const { user } = useSelector((state) => state.auth);
//   const { applicationStatus } = useSelector((state) => state.seller);
//   const [showSellerModal, setShowSellerModal] = useState(false);

//   if (!user) return null;
//   useEffect(() => {
//   if (applicationStatus) {
//     setTimeout(() => {
//       onClose();
//     }, 2000);
//   }
// }, [applicationStatus]);
// const [sellerStatus, setSellerStatus] = useState(null);
// const [rejectionReason, setRejectionReason] = useState(null);

// useEffect(() => {
//   const fetchSellerStatus = async () => {
//     try {
//       const res = await api.get("/sellers/my-status");
//       setSellerStatus(res.data.status);
//       setRejectionReason(res.data.rejectionReason);
//     } catch (err) {
//       console.error("Failed to fetch seller status");
//     }
//   };

//   fetchSellerStatus();
// }, []);

//   return (
//     <>
//       <Navbar />

//       <div className="container py-5">
//         <h2 className="fw-bold">My Profile</h2>

//         <div className="card p-4 mt-4">
//           <p><strong>Name:</strong> {user.name || "—"}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Role:</strong> {user.role}</p>

//           {/* APPLY SELLER CTA */}
//           {user.role === "USER" && (
//             <button
//               className="btn btn-primary mt-3"
//               onClick={() => setShowSellerModal(true)}
//             >
//               Become a Seller
//             </button>
//           )}
//           {/* NEVER APPLIED */}
// {sellerStatus === "NONE" && (
//   <button
//     className="btn btn-primary"
//     onClick={() => setShowSellerModal(true)}
//   >
//     Become a Seller
//   </button>
// )}

// {/* PENDING */}
// {sellerStatus === "PENDING" && (
//   <span className="badge bg-warning text-dark">
//     Seller application under review
//   </span>
// )}

// {/* APPROVED */}
// {sellerStatus === "APPROVED" && (
//   <span className="badge bg-success">
//     Seller account approved
//   </span>
// )}

// {/* REJECTED */}
// {sellerStatus === "REJECTED" && (
//   <div className="alert alert-danger mt-3">
//     <strong>Seller application rejected</strong>
//     <p className="mb-1 mt-2">
//       Reason:
//     </p>
//     <p className="fst-italic">
//       {rejectionReason || "No reason provided"}
//     </p>
//   </div>
// )}

//           {/* SELLER STATUS */}
//           {user.role === "SELLER" && (
//             <span className="badge bg-success mt-3">
//               Seller Account Active
//             </span>
//           )}
          

//         </div>
//       </div>

//       {showSellerModal && (
//         <SellerApply onClose={() => setShowSellerModal(false)} />
//       )}
//     </>
//   );
// }

// export default UserProfile;
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../api/api";
import Navbar from "../component/Navbar";
import SellerApply from "./SellerApply";


function UserProfile() {
  const { user } = useSelector((state) => state.auth);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [sellerStatus, setSellerStatus] = useState(null);
  const [rejectionReason, setRejectionReason] = useState(null);
  const [loadingSellerStatus, setLoadingSellerStatus] = useState(true);
  const [rejectionCount, setRejectionCount] = useState(null);
  



  // useEffect(() => {
  //   const fetchSellerStatus = async () => {
  //     try {
  //       const res = await api.get("/sellers/my-status"); // ✅ correct endpoint
  //       setSellerStatus(res.data.status);
  //       setRejectionReason(res.data.rejectionReason);
  //     } catch (err) {
  //       console.error("Failed to fetch seller status");
  //     }
  //   };

  //   fetchSellerStatus();
  // }, []);
  
  useEffect(() => {
  const fetchSellerStatus = async () => {
    try {
      const res = await api.get("/sellers/my-status");
      setSellerStatus(res.data.status);
      setRejectionReason(res.data.rejectionReason);
      setRejectionCount(res.data.rejectionCount);
    } catch (err) {
      console.error("Failed to fetch seller status");
    } finally {
      setLoadingSellerStatus(false);
    }
  };

  fetchSellerStatus();
}, []);
  if (loadingSellerStatus) return <p>Loading...</p>;

  if (!user) return null;

  return (
    <>
      <Navbar />

      <div className="container py-5">
        <h2 className="fw-bold text-white">My Profile</h2>

        <div className="card p-4 mt-4">
          <p><strong>Name:</strong> {user.name || "—"}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>

         {/* SELLER STATUS — ONLY FOR NON-ADMINS */}
{user.role?.toUpperCase() === "USER" && (
  <>
    {/* NEVER APPLIED */}
    {sellerStatus === "NONE" && (
      <button
        className="btn btn-primary mt-3"
        onClick={() => setShowSellerModal(true)}
      >
        Become a Seller
      </button>
    )}

    {/* PENDING */}
    {sellerStatus === "PENDING" && (
      <span className="badge bg-warning text-dark mt-3">
        Seller application under review
      </span>
    )}

    {/* APPROVED */}
    {sellerStatus === "APPROVED" && (
      <span className="badge bg-success mt-3">
        Seller account approved
      </span>
    )}

    {/* REJECTED */}
    {sellerStatus === "REJECTED" && (
      <div className="alert alert-danger mt-3">
        <strong>Seller application rejected</strong>
        <div className="mt-2 mb-1">Reason:</div>
        <div className="fst-italic">
          {rejectionReason || "No reason provided"}
          
        </div>

        {/* Rejection count */}
    {typeof rejectionCount === "number" && (
      <div className="mt-2">
        <strong>Rejections:</strong> {rejectionCount}
      </div>
    )}

       

       
        <button
  className="btn btn-primary mt-2"
  onClick={() => setShowSellerModal(true)}
>
  {sellerStatus === "REJECTED" ? "Re-apply as Seller" : "Become a Seller"}
</button>
      
      </div>
    )}
  </>
)}


        </div>
      </div>

      {showSellerModal && (
        // <SellerApply onClose={() => setShowSellerModal(false)} />
        <SellerApply
    mode={sellerStatus === "REJECTED" ? "REAPPLY" : "APPLY"}
    onClose={() => setShowSellerModal(false)}
  />
      )}
    </>
  );
}

export default UserProfile;
