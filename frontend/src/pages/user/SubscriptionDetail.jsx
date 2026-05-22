import Navbar from "../../component/Navbar";
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./SubscrptionDetail.css";

function SubscriptionDetail() {
  const { subscriptionId } = useParams();
  const [subscription, setSubscription] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const { user, loading } = useSelector((state) => state.auth);

  const fetchSubscription = async () => {
    try {
      const res = await api.get(`/subscriptions/${subscriptionId}`);
      setSubscription(res.data.subscription);
    } catch (err) {
      console.error("Failed to fetch subscription", err);
    }
  };

  const handlePause = async () => {
    if (!window.confirm("Are you sure you want to pause this subscription? You can resume it anytime.")) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.put(`/subscriptions/${subscriptionId}/pause`);
      setSubscription(res.data.subscription);
      alert("Subscription paused successfully!");
    } catch (err) {
      console.error("Failed to pause subscription", err);
      alert(err.response?.data?.message || "Failed to pause subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    setActionLoading(true);
    try {
      const res = await api.put(`/subscriptions/${subscriptionId}/resume`);
      setSubscription(res.data.subscription);
      alert("Subscription resumed successfully!");
    } catch (err) {
      console.error("Failed to resume subscription", err);
      alert(err.response?.data?.message || "Failed to resume subscription");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.put(`/subscriptions/${subscriptionId}/cancel`, { reason: cancelReason });
      setSubscription(res.data.subscription);
      setShowCancelModal(false);
      alert("Subscription cancelled successfully!");
    } catch (err) {
      console.error("Failed to cancel subscription", err);
      alert(err.response?.data?.message || "Failed to cancel subscription");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      fetchSubscription();
    }
  }, [loading, user, subscriptionId]);

  if (!subscription) return <p>Loading...</p>;

  return (
    <>
      <div className="sub-page">
        <Navbar />
        <div className="order-card">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              {subscription.titleSnapshot || subscription.boxId?.title}
            </h5>

            <span className={`order-status ${subscription.status}`}>
              <span className="status">
                {subscription.status}
              </span>
            </span>
          </div>

          <p>
            Subscription price:{" "}
            <strong className="text-white">
              ₹{subscription.priceSnapshot} / {subscription.billingCycle.toLowerCase()}
            </strong>
          </p>

          <p>
            Started on:{" "}
            {new Date(subscription.startedAt).toLocaleDateString()}
          </p>

          <p>
            Next delivery:{" "}
            {new Date(subscription.nextBillingDate).toLocaleDateString()}
          </p>

          {subscription.retryCount > 0 && (
            <p className="text-warning">
              Payment retry attempts: {subscription.retryCount}/3
            </p>
          )}

          <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />

          {/* Action Buttons */}
          <div className="subscription-actions mt-4">
            {subscription.status === "ACTIVE" && (
              <>
                <button
                  className="btn btn-warning me-2"
                  onClick={handlePause}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "⏸ Pause Subscription"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowCancelModal(true)}
                  disabled={actionLoading}
                >
                  ❌ Cancel Subscription
                </button>
              </>
            )}

            {subscription.status === "PAUSED" && (
              <>
                <button
                  className="btn btn-success me-2"
                  onClick={handleResume}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "▶ Resume Subscription"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowCancelModal(true)}
                  disabled={actionLoading}
                >
                  ❌ Cancel Subscription
                </button>
              </>
            )}

            {subscription.status === "CANCELLED" && (
              <p className="text-muted">This subscription has been cancelled.</p>
            )}
          </div>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="modal-overlay" style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div className="modal-content" style={{
              backgroundColor: "#1a1a2e",
              padding: "30px",
              borderRadius: "10px",
              maxWidth: "500px",
              width: "90%"
            }}>
              <h4 className="text-white mb-4">Cancel Subscription</h4>
              <p className="text-white-50 mb-3">
                Please let us know why you're cancelling:
              </p>
              <textarea
                className="form-control mb-3"
                rows="3"
                placeholder="Enter your reason (optional)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{ backgroundColor: "#2a2a4e", color: "white", border: "1px solid #444" }}
              />
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason("");
                  }}
                  disabled={actionLoading}
                >
                  Keep Subscription
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleCancel}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="container mt-4">
          <div className="guidelines-section">
            <h6>Guidelines:</h6>
            <ul>
              <li>A subscription is a recurring delivery agreement, not a single order.</li>
              <li>Orders are automatically generated based on the selected billing cycle.</li>
              <li>Subscription price and billing cycle are locked at the time of subscription.</li>
              <li>Cancelling a subscription stops future deliveries only.</li>
              <li>Previously generated orders will still be delivered as scheduled.</li>
            </ul>
            <div>
              <div>
                <strong>Manage Your Subscription:</strong>
              </div>
              <span>• <strong>Pause:</strong> Temporarily stop deliveries (you can resume anytime)</span><br />
              <span>• <strong>Resume:</strong> Start deliveries again after a pause</span><br />
              <span>• <strong>Cancel:</strong> Permanently stop the subscription</span>
            </div>
          </div>
        </div>

      </div> {/* ← closes <div className="sub-page"> */}
    </>
  );
}

export default SubscriptionDetail;