import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../api/api";
import { Link } from "react-router-dom";
import "./Seller.css";

function SellerOrder() {
  const [orders, setOrders] = useState([]);
  const { user, loading } = useSelector((state) => state.auth);

  const getOrders = async () => {
    try {
      const res = await api.get("/orders/seller");
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch seller orders", err);
    }
  };

  const getStatusClass = (status) => {
  switch (status) {
    case "PLACED":
      return "review";   // yellow
    case "SHIPPED":
      return "info";     // blue
    case "DELIVERED":
      return "live";     // green
    case "CANCELLED":
      return "danger";   // red
    default:
      return "review";
  }
};


  useEffect(() => {
    if (!loading && user) {
      getOrders();
    }
  }, [loading, user]);

  return (
    <div className="seller-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Orders</h1>
          <p>Manage and fulfill customer orders</p>
        </div>
      </div>

      {/* KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span>Total Orders</span>
          <h2>{orders.length}</h2>
        </div>

        <div className="kpi-card">
          <span>Pending</span>
          <h2>{orders.filter(o => o.status === "PLACED").length}</h2>
        </div>

        <div className="kpi-card">
          <span>Delivered</span>
          <h2>{orders.filter(o => o.status === "DELIVERED").length}</h2>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="panel mt-4">
        <h3>Incoming Orders</h3>

        {orders.length === 0 ? (
          <p className="">No orders received yet.</p>
        ) : (
          <table className="table table-dark table-hover mt-3">
            <thead>
              <tr>
                <th>Box</th>
                <th>Customer</th>
                <th>City</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.boxId?.title}</td>
                  <td>{order.shippingAddress?.name}</td>
                  <td>{order.shippingAddress?.city}</td>

                  <td>
                    <span className={`badge ${
                      getStatusClass(order.status)
                    }`}>
                      {order.status}
                    </span>
                  </td>

                  <td>
                    <Link to={`/seller/orders/${order._id}`} className="btn btn-outline-light btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
}

export default SellerOrder;
