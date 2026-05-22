import Navbar from "../../component/Navbar";
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./OrderHistory.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [otp, setOtp] = useState("");
  const{user,loading}=useSelector((state)=>state.auth);
  const [verifying, setVerifying] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
const [showCancelBox, setShowCancelBox] = useState(false);
const [open, setOpen] = useState(false);
const [snackbarMsg, setSnackbarMsg] = useState("");
const [snackbarSeverity, setSnackbarSeverity] = useState("success");

const handleClose = (_, reason) => {
  if (reason === "clickaway") return;
  setOpen(false);
};

 
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    };

    const resendOtp = async () => {
      try {
        await api.post(`/orders/${order._id}/resend-otp`);
       setSnackbarMsg("OTP resent successfully");
setSnackbarSeverity("success");
setOpen(true);
      } catch (err) {
        console.error("Failed to resend OTP", err);
      }
    };

  
//     const handleCancelOrder = async () => {
//   if (!cancelReason.trim()) {
//     alert("Please provide a cancellation reason");
//     return;
//   }

//   try {
//     await api.post(`/orders/${order._id}/cancel`, {
//       reason: cancelReason,
//     });

//     setShowCancelBox(false);
//     setCancelReason("");
//     fetchOrder(); // refresh order
//   } catch (err) {
//     console.error("Failed to cancel order", err);
//   }
// };
const handleCancelOrder = async () => {
  if (!cancelReason.trim()) {
    setSnackbarMsg("Please provide a cancellation reason");
    setSnackbarSeverity("warning");
    setOpen(true);
    return;
  }

  try {
    const res = await api.post(`/orders/${order._id}/cancel`, {
      reason: cancelReason,
    });

    setSnackbarMsg(res.data.message || "Order cancelled successfully");
    setSnackbarSeverity("success");
    setOpen(true);

    setShowCancelBox(false);
    setCancelReason("");
    fetchOrder();
  } catch (err) {
    setSnackbarMsg(
      err.response?.data?.message || "Failed to cancel order"
    );
    setSnackbarSeverity("error");
    setOpen(true);
  }
};



    

    
  useEffect(() => {
  if (!loading && user) {
    fetchOrder();

  }
}, [loading, user, id]);

  if (!order) return <p>Loading...</p>;

  return (
    <>
   

      <div className="order-page">
  <Navbar />

  <div className="container  py-5">
    <div className="order-header">
      <h2>Order Details</h2>
      <p>Complete information about your order</p>
    </div>

    <div className="order-card">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">
          {order.boxId?.title}
        </h5>

        <span className={`order-status ${order.status}`}>
          {order.status}
        </span>
      </div>

      <p className="">
        Amount paid: <strong className="text-white">₹{order.boxId?.price}</strong>
      </p>

      <hr style={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <h6 className="fw-bold mb-2">Delivery Address</h6>

      <p className=" mb-0">
        {order.shippingAddress.name}<br />
        {order.shippingAddress.addressLine1}<br />
        {order.shippingAddress.city}, {order.shippingAddress.state}<br />
        {order.shippingAddress.pincode}
        
      </p>
      {/* CANCEL ORDER SECTION */}
    {order.status === "PLACED" && (
  <div style={{ marginTop: "15px" }}>

    {!showCancelBox ? (
      <button
        className="btn btn-danger"
        onClick={() => setShowCancelBox(true)}
      >
        Cancel Order
      </button>
    ) : (
      <div className="mt-3">
        <label className="form-label fw-bold">
          Cancellation Reason
        </label>

        <textarea
          className="form-control mb-2"
          rows={3}
          placeholder="Please tell us why you are cancelling this order"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />

        <button
          className="btn btn-danger me-2"
          onClick={handleCancelOrder}
        >
          Confirm Cancel
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setShowCancelBox(false);
            setCancelReason("");
          }}
        >
          Close
        </button>
      </div>
    )}
  </div>
)}


     {/* USER DELIVERY CONFIRMATION */}
{order.status === "SHIPPED" && (
  <div className="otp-card mt-4">
    <h5>Confirm Delivery</h5>
    <p className="">
      Enter the 6-digit OTP shared with you
    </p>

    <input
      type="text"
      maxLength={6}
      className="form-control mb-3"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />

    {order.status === "SHIPPED" && (
  <p className=" mt-2">
    📩 A delivery OTP has been sent to your registered email.
  </p>
)
}

    {/* <button
      className="btn btn-success"
      disabled={verifying}
      onClick={async () => {
        try {
          setVerifying(true);
          await api.patch(`/orders/${order._id}/verify-otp`, { otp });
          setOrder({ ...order, status: "DELIVERED" });
        } catch (err) {
          alert(err.response?.data?.message || "Invalid OTP");
        } finally {
          setVerifying(false);
        }
      }}
    >
      Confirm Delivery
    </button> */}
    <button
  className="btn btn-success"
  disabled={verifying}
  onClick={async () => {
    try {
      setVerifying(true);
      const res = await api.patch(
        `/orders/${order._id}/verify-otp`,
        { otp }
      );

      setOrder(res.data.order);

      setSnackbarMsg("Delivery confirmed successfully 🎉");
      setSnackbarSeverity("success");
      setOpen(true);

    } catch (err) {
      const msg =
        err.response?.data?.message || "OTP verification failed";

      setSnackbarMsg(msg);

      // refund-related warnings
      if (msg.toLowerCase().includes("refunded")) {
        setSnackbarSeverity("warning");
      } else {
        setSnackbarSeverity("error");
      }

      setOpen(true);
    } finally {
      setVerifying(false);
    }
  }}
>
  {verifying ? "Verifying..." : "Confirm Delivery"}
</button>

    <button
      className="btn btn-secondary ms-3"
      onClick={resendOtp}
    >
      Resend OTP
    </button>
  </div>
)}

{order.status === "DELIVERED" && (
  <div className="alert alert-success mt-3" role="alert">
    ✅ Your delivery has been confirmed. Enjoy your box!  
      <br />
      <small>Thank you for choosing our service.</small>
  </div>
)}


    </div>
  </div>
  <Snackbar
  open={open}
  autoHideDuration={4000}
  onClose={handleClose}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <MuiAlert
    onClose={handleClose}
    severity={snackbarSeverity}
    elevation={6}
    variant="filled"
    sx={{
      backgroundColor: "#ffffff",
      color: "#000000",
      fontWeight: 500,
      minWidth: "300px",
    }}
  >
    {snackbarMsg}
  </MuiAlert>
</Snackbar>
</div>
    </>
  );
}

export default OrderDetails;
