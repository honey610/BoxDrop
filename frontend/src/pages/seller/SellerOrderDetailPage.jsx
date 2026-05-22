

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../api/api";
// import SellerLayout from "./SellerLayout";
import "./SellerOrderDetail.css";
import CircularProgress from "@mui/material/CircularProgress";


function SellerOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { user, loading } = useSelector((state) => state.auth);
  
const [updating, setUpdating] = useState(false);

 


  useEffect(() => {
     if (!loading && user) {
      api.get(`/orders/seller/${id}`).then((res) => {
        setOrder(res.data.order);
      });
    }
     }, [id, loading, user]);
  

    

  if (loading || !order) {
    return (
    //   <SellerLayout>
        <p className="text-muted">Loading order details...</p>
    //   </SellerLayout>
    );
  }

  return (
   
    // <SellerLayout>
      <div className="order-detail-page">

        {/* HEADER */}
        <div className="order-detail-header">
          <div>
            <h2>Order Details</h2>
            <p className="">
              Order ID: {order._id}
            </p>
          </div>

          <span className={`status-chip ${order.status}`}>
            {order.status}
          </span>
        </div>

        {/* GRID */}
        <div className="order-detail-grid">

          {/* LEFT */}
          <div className="detail-card">
            <h4>Product</h4>

            <div className="detail-row">
              <span>Box</span>
              <strong>{order.boxId?.title}</strong>
            </div>

            <div className="detail-row">
              <span>Quantity</span>
              <strong>{order.quantity}</strong>
            </div>

            <div className="detail-row">
              <span>Price</span>
              <strong>₹ {order.boxId?.price}</strong>
            </div>
          </div>

          {/* RIGHT */}
          <div className="detail-card">
            <h4>Customer</h4>

            <div className="detail-row">
              <span>Name</span>
              <strong>{order.shippingAddress.name}</strong>
            </div>

            <div className="detail-row">
              <span>Phone</span>
              <strong>{order.shippingAddress.phone}</strong>
            </div>

            <div className="detail-row">
              <span>Email</span>
              <strong>{order.userId?.email}</strong>
            </div>
          </div>

          {/* FULL WIDTH */}
          <div className="detail-card full">
            <h4>Delivery Address</h4>

            <p className="address">
              {order.shippingAddress.addressLine1}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state}<br />
              {order.shippingAddress.pincode}
            </p>

            {order.status === "CANCELLED" && order.rejectionReason && (
              <div className="mt-3">
                <h4>Cancellation Reason</h4>
                <p>{order.rejectionReason}</p>
              </div>
            )}

            {order.status === "PLACED" && (
  <button
    className="btn btn-primary mt-3"
    onClick={async () => {
      try {
        setUpdating(true);
        await api.patch(`/orders/${order._id}/status`, {
          status: "SHIPPED",
        });
      
        setOrder({ ...order, status: "SHIPPED" });
      } catch (err) {
        alert(err.response?.data?.message || "Failed to update status");
      }
    }}
  >
  {updating ? (
    <CircularProgress size={20} sx={{ color: "#fff" }} />
  ) : (
    "Mark as Shipped"
  )}
  </button>
)}
          </div>

        </div>
         {/* ✅ SNACKBAR */}
        {/* <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleClose}
          severity="success"
          elevation={6}
          variant="filled"
          sx={{
            backgroundColor: "#ffffff",
            color: "#000000",
            fontWeight: 500,
            minWidth: "300px",
          }}
        >
          {snackbarMsg || "Action completed successfully"}
        </MuiAlert>
      </Snackbar> */}
    
      </div>
     
      
   
  );
}

export default SellerOrderDetailPage;

