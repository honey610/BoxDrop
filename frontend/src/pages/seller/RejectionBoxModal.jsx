import { X } from "lucide-react";
import { useState } from "react";
import "./RejectBoxModal.css";

function RejectBoxModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim().length < 5) {
      alert("Please enter a valid rejection reason (min 5 chars)");
      return;
    }
    onSubmit(reason);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Reject Box</h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <textarea
          rows={4}
          placeholder="Enter rejection reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn reject" onClick={handleSubmit}>
            Reject Box
          </button>
        </div>
      </div>
    </div>
  );
}

export default RejectBoxModal;
