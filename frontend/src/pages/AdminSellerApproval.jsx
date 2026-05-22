import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../component/Navbar";
import RejectModal from "../component/RejectModal";


function AdminSellerApproval() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
const [selectedSellerId, setSelectedSellerId] = useState(null);
const [rejectReason, setRejectReason] = useState("");

const openRejectModal = (sellerId) => {
  setSelectedSellerId(sellerId);
  setRejectReason("");
  setShowRejectModal(true);
};


  const fetchSellers = async () => {
    try {
      const res = await api.get("/sellers/pending");
      setSellers(res.data.sellers);
    } catch (err) {
      console.error("Failed to load sellers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const approveSeller = async (sellerId) => {
    try {
      await api.post(`/sellers/approve/${sellerId}`);
      fetchSellers(); // refresh list
    } catch (err) {
      alert("Failed to approve seller");
    }
  };

  // const rejectSeller = async (sellerId) => {
  //   try {
  //     await api.post(`/sellers/reject/${sellerId}`,{
  //       reason: setRejectReason,
  //     });
  //     fetchSellers();
  //   } catch (err) {
  //     alert("Failed to reject seller");
  //   }
  // };
  const submitRejection = async () => {
  if (!rejectReason.trim()) {
    alert("Rejection reason required");
    return;
  }

  try {
    await api.post(`/sellers/reject/${selectedSellerId}`, {
      reason: rejectReason,
    });
    setShowRejectModal(false);
    fetchSellers();
  } catch {
    alert("Failed to reject seller");
  }
};

  return (
    <>
      <Navbar />

      <div className="container py-5" style={{background:"radial-gradient(circle at top, #0f2027, #000)", minHeight:"100vh",minWidth:"100%"}}>
        <h2 className="fw-bold text-white mb-4">Seller Applications</h2>

        {loading ? (
          <p>Loading applications...</p>
        ) : sellers.length === 0 ? (
          <p className="text-white">No pending applications.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Description</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller._id}>
                    <td>{seller.brandName}</td>
                    <td style={{ maxWidth: 300 }}>
                      {seller.description}
                    </td>
                    <td>{seller.userId?.email}</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        {seller.status}
                      </span>
                    </td>
                    <td className="d-flex gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => approveSeller(seller._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => openRejectModal(seller._id)}

                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <RejectModal
  show={showRejectModal}
  onClose={() => setShowRejectModal(false)}
  onSubmit={submitRejection}
  reason={rejectReason}
  setReason={setRejectReason}
/>
      </div>
    </>
  );
}

export default AdminSellerApproval;