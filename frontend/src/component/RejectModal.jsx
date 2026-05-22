function RejectModal({ show, onClose, onSubmit, reason, setReason }) {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div
          className="modal-content"
          style={{
            background: "#f8f9fa",
            borderRadius: "12px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          }}
        >
          {/* Header */}
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold text-dark">
              Reject Seller Application
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <div className="form-floating">
              <textarea
                className="form-control"
                placeholder="Enter rejection reason"
                style={{
                  height: "220px",
                  background: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #ced4da",
                }}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
              <label className="text-muted">Rejection Reason</label>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0">
            <button
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger px-4"
              onClick={onSubmit}
              disabled={!reason.trim()}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RejectModal;
