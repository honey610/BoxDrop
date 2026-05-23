import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import api from "../api/api";
import "./AdmainBoxesApproval.css";
import Navbar from "../component/Navbar";
import RejectBoxModal from "./seller/RejectionBoxModal";


const BACKEND_URL = "https://boxdrop-backend-w7s7.onrender.com";
function AdminBoxesApproval() {
  const [boxes, setBoxes] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);


  useEffect(() => {
    fetchPendingBoxes();
  }, []);

  const fetchPendingBoxes = async () => {
    try {
      const res = await api.get("/boxes/pending");
      setBoxes(res.data.boxes);
    } catch (err) {
      console.error("Failed to load boxes", err);
    }
  };

  const approveBox = async (id) => {
  try {
    await api.post(`/boxes/approve/${id}`);

    // Remove box from list
    setBoxes((prev) => prev.filter((box) => box._id !== id));

    // Clear right panel if same box
    if (selectedBox?._id === id) {
      setSelectedBox(null);
    }
  } catch (err) {
    console.error("Failed to approve box", err);
  }
};


//  const rejectBox = async (id) => {
//   try {
//     await api.post(`/boxes/reject/${id}`);

//     // Remove box from list
//     setBoxes((prev) => prev.filter((box) => box._id !== id));

//     // Clear right panel if same box
//     if (selectedBox?._id === id) {
//       setSelectedBox(null);
//     }
//   } catch (err) {
//     console.error("Failed to reject box", err);
//   }
// };
// const rejectBox = async (id) => {
//   const reason = prompt("Enter rejection reason:");
//   if (!reason) return;
 

//   await api.post(`/boxes/reject/${id}`, { rejectionReason: reason });
//   fetchPendingBoxes();
// };


  return (
    <>
    <Navbar />
    <div className="admin-approval text-white   vh-100 ">

      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Box Approvals</h1>
          <p>Review and approve seller subscription boxes</p>
        </div>
      </div>

      {/* EMPTY */}
      {boxes.length === 0 ? (
        <div className="empty-state">
          <h3>No pending boxes 🎉</h3>
          <p>All submissions are reviewed</p>
        </div>
      ) : (
        <div className="approval-grid">

          {/* LEFT: LIST */}
          <div className="approval-list">
            {boxes.map((box) => (
              <div
                key={box._id}
                className={`box-item ${selectedBox?._id === box._id ? "active" : ""}`}
                onClick={() => setSelectedBox(box)}
              >
                <strong>{box.title}</strong>
                <span>₹{box.price} • {box.billingCycle}</span>
              </div>
            ))}
          </div>

          {/* RIGHT: DETAILS */}
          {selectedBox && (
            <div className="approval-details">

              <h2>{selectedBox.title}</h2>
              <p className="desc">{selectedBox.description}</p>

              {/* IMAGES */}
              {selectedBox.images?.length > 0 && (
                <div className="image-row">
                  {selectedBox.images.map((img, i) => (
                    <img key={i} src={`${BACKEND_URL}${img}`} alt="box" />
                  ))}
                </div>
              )}

              {/* META */}
              {/* <div className="meta">
                <span>Price: ₹{selectedBox.price}</span>
                <span>Billing: {selectedBox.billingCycle}</span>
                <span>Seller ID: {selectedBox.sellerId}</span>
                <span>Seller BrandName: {selectedBox.sellerId?.brandName}</span>
              </div> */}
              <div className="meta">
  <span>Price: ₹{selectedBox.price}</span>
  <span>Billing: {selectedBox.billingCycle}</span>

  <span>
    Seller Brand:
    <strong>
      {" "}
      {typeof selectedBox.sellerId === "object" 
        ? selectedBox.sellerId.brandName
        : "Unknown"}
    </strong>
  </span>
</div>


              {/* ACTIONS */}
              <div className="actions">
                <button
                  className="approve"
                  onClick={() => approveBox(selectedBox._id)}
                >
                  <CheckCircle size={18} />
                  Approve
                </button>

                <button
                  className="reject"
                  onClick={() => setShowRejectionModal(true)}
                >
                  <XCircle size={18} />
                  Reject
                </button>

                {showRejectionModal && selectedBox && (
  <RejectBoxModal
    onClose={() => setShowRejectionModal(false)}
    onSubmit={async (reason) => {
      await api.post(`/boxes/reject/${selectedBox._id}`, {
        rejectionReason: reason,
      });

      setShowRejectionModal(false);
      setSelectedBox(null);
      fetchPendingBoxes();
    }}
  />
)}

              </div>
            </div>
          )}
        </div>
      )}
      
    </div>
    </>
  );
}

export default AdminBoxesApproval;
