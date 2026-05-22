import { Plus, Edit, Eye, PauseCircle } from "lucide-react";
import { useEffect, useState } from "react";




import api from "../../api/api";
import "./Seller.css";

function SellerBoxes() {
  const [boxes, setBoxes] = useState([]);
  const [showReason, setShowReason] = useState(false);
const [reasonText, setReasonText] = useState("");

 


  

  useEffect(() => {
    api.get("/boxes/my").then((res) => setBoxes(res.data.boxes));
  }, []);

  const getStatus = (box) => {
  if (box.isApproved) return "LIVE";
  if (box.rejectionReason) return console.log("REJECTION REASON:", box.rejectionReason), "REJECTED";
  return "PENDING";
};



  

  return (
    <div className="seller-boxes">

      {/* HEADER */}
      <div className="boxes-header">
        <div>
          <h1>My Boxes</h1>
          <p>Manage, edit, and track your subscription boxes</p>
        </div>

        {/* <button className="create-btn">
          <Plus size={18} />
          Create Box
        </button> */}
      </div>

      {/* EMPTY STATE */}
      {boxes.length === 0 ? (
        <div className="empty-state">
          <h3>No boxes yet</h3>
          <p>Create your first box to start selling</p>
          {/* <button className="create-btn">Create Box</button> */}
        </div>
      ) : (
        <div className="boxes-panel">

          <table>
            <thead>
              <tr>
              
                <th>Box</th>
                <th>Status</th>
                <th>Price</th>
                <th>Subscribers</th>
                  <th >Image</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>

            <tbody>
            
              {boxes.map((box) => {
  const status = getStatus(box); // ✅ CORRECT
  console.log("BOX DEBUG:", {
    title: box.title,
    isApproved: box.isApproved,
    rejectionReason: box.rejectionReason,
  });

  return (
    <tr key={box._id}>
      <td>
        <div className="box-title">
          <strong>{box.title}</strong>
          <span>{box.billingCycle}</span>
        </div>
      </td>

      <td>
        <span
          className={`badge ${
            status === "LIVE"
              ? "live"
              : status === "REJECTED"
              ? "danger"
              : "review"
          }`}
        >
          {status}
        </span>

        {status === "REJECTED" && (
          <button
            className="view-reason-btn"
            onClick={() => {
              setReasonText(box.rejectionReason);
              setShowReason(true);
            }}
          >
            View reason
          </button>
        )}
      </td>

      <td>₹{box.price}</td>
      <td>{box.subscribers ?? 0}</td>

      {/* <td>
        <div className="action-buttons">
          <button title="View">
            <Eye size={16} />
          </button>
          <button title="Edit">
            <Edit size={16} />
          </button>
          <button title="Pause">
            <PauseCircle size={16} />
          </button>
        </div>
      </td> */}
      <td>
        {box.images && box.images.length > 0 ? (
          <img
            src={`http://localhost:5000${box.images[0]}`}
            alt="Box"
            className="box-image"
            style={{width:"200px",height:"200px"}}
          />
        ) : (
          <span>No Image</span>
        )}
      </td>
    </tr>
  );
})}
            </tbody>

          </table>
          {showReason && (
  <div className="modal-overlay">
    <div className="modal-card">
      <h3>Rejection Reason</h3>
      <p className="reason-text">{reasonText}</p>

      <button
        className="btn cancel"
        onClick={() => setShowReason(false)}
      >
        Close
      </button>
    </div>
  </div>
)}

        </div>
      )}
    </div>
  );
}

export default SellerBoxes;
