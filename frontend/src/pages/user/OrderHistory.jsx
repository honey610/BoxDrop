import Navbar from "../../component/Navbar";
import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
  const {user,loading}=useSelector((state)=>state.auth);
  const [subscribedOrders, setSubscribedOrders] = useState([]);
  


    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/all");
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    const fetchSubscribedOrders = async () => {
      try {
        const res = await api.get("/subscriptions/me");
        setSubscribedOrders(res.data.subscriptions);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };


 
 

useEffect(() => {
  if (!loading && user) {
    fetchOrders();
    fetchSubscribedOrders();
  }
}, [loading, user]);


  return (
   <>
  <div className="order-page">
    <Navbar />

    <div className="container py-5">
      <div className="row">

        {/* LEFT: ORDERS */}
        <div className="col-md-6">
          <div className="order-header">
            <h2>My Orders</h2>
            <p>Track your purchases and delivery status</p>
          </div>
<div style={{maxHeight: "70vh", overflowY: "auto", paddingRight: "8px"}}>
          {orders.length === 0 ? (
            <p className="">No orders placed yet.</p>
          ) : (
            <div className="row col-md-12 g-4">
              {orders.map((order) => (
                <div key={order._id} className="col-md-6">
                  <div className="order-card h-100 d-flex flex-column justify-content-between">

                    <div>
                      <h5 className="fw-bold mb-1">
                        {order.boxId?.title}
                      </h5>
                      <img
  src={
    order.boxId?.images?.[0]
      ? `http://localhost:5000${order.boxId.images[0]}`
      : "https://via.placeholder.com/300x200?text=No+Image"
  }
  alt={order.boxId?.title || "Order box"}
  style={{
    width: "100%",
    height: "150px",  
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  }}
/>

                      <p className="mb-2 ">
                        ₹{order.priceSnapshot}
                      </p>

                      <span className={`order-status ${order.status}`}>
                        {order.status}
                      </span>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="btn btn-outline-light mt-3 order-btn"
                    >
                      View Details →
                    </Link>

                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>

        {/* RIGHT: SUBSCRIPTIONS */}
        <div className="col-md-6">
          <div className="order-header">
            <h2>My Subscriptions</h2>
            <p>Manage your subscriptions and billing cycles</p>
          </div>



<div style={{maxHeight: "70vh", overflowY: "auto", paddingRight: "8px"}}>
          {subscribedOrders.length === 0 ? (
            <p className="">No subscriptions yet.</p>
          ) : (
            <div className="row col-md-12 g-4">
              {subscribedOrders.map((sub) => (
                <div key={sub._id} className="col-md-6">
                  <div className="order-card h-100 d-flex flex-column justify-content-between">

                    <div>
                      <h5 className="fw-bold mb-1">
                        {sub.titleSnapshot || sub.boxId?.title}
                      </h5>

                     <img
  src={
    sub.boxId?.images?.[0]
      ? `http://localhost:5000${sub.boxId.images[0]}`
      : "https://via.placeholder.com/300x200?text=No+Image"
  }
  alt={sub.titleSnapshot || "Subscription box"}
  style={{
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  }}
/>


                      <p className="mb-2 ">
                        ₹{sub.priceSnapshot} / {sub.billingCycle.toLowerCase()}
                      </p>

                      <span className={`order-status ${sub.status}`}>
                        {sub.status}
                      </span>

                      <p className="mt-2 text-muted" style={{ fontSize: "0.85rem" }}>
                        Next delivery:{" "}
                        {new Date(sub.nextBillingDate).toLocaleDateString()}
                      </p>
                    </div>

                    <Link
                      to={`/subscriptions/${sub._id}`}
                      className="btn btn-outline-light mt-3 order-btn"
                    >
                      Manage Subscription →
                    </Link>

                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>

      </div>
    </div>
  </div>
</>

  );
}

export default OrderHistory;
