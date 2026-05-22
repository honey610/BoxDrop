import React, { useEffect, useState } from "react";
import api from "../../api/api";

function AdminDashboard() {
  const [boxes, setBoxes] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [totalSellers, setTotalSellers] = useState(0);
  const [totalBoxes, setTotalBoxes] = useState(0);

  const fetchDashboardData = async () => {
    try {
      // Fetch pending boxes
      const boxesRes = await api.get("/boxes/pending");
      setBoxes(boxesRes.data.boxes);

      // Fetch pending sellers
      const sellersRes = await api.get("/sellers/pending");
      setSellers(sellersRes.data.sellers);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  const fetchTotalSellers = async () => {
    try {
      const res = await api.get("/sellers/total");
      setTotalSellers(res.data.totalSellers);
      console.log(res.data.totalSellers);
    } catch (err) { 
      console.error("Failed to fetch total sellers", err);
    }
  };

  const fetchTotalBoxes = async () => {
    try {
      const res = await api.get("/boxes/total");
      setTotalBoxes(res.data.totalBoxes);
      console.log(res.data.totalBoxes);
    } catch (err) {
      console.error("Failed to fetch total boxes", err);
    }
  };

  


  useEffect(() => {
    fetchDashboardData();
    fetchTotalSellers();
    fetchTotalBoxes();
  }, []);

  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="mb-4">
        <h1 className="fw-bold">Admin Dashboard</h1>
        <p className="opacity-75">
          Platform overview and moderation control
        </p>
      </div>

      {/* KPI GRID */}
      <div className="row g-3 mb-4">
        {[
          { label: "Pending Boxes", value: boxes.length },
          { label: "Pending Sellers", value: sellers.length },
          { label: "Total Sellers", value: totalSellers },
          { label: "Active Boxes", value: totalBoxes },
        ].map((kpi) => (
          <div className="col-md-3" key={kpi.label}>
            <div className="card bg-dark text-white p-3 rounded-4">
              <p className="opacity-75">{kpi.label}</p>
              <h3 className="fw-bold">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ACTION PANELS */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card bg-dark p-4 text-white rounded-4">
            <h5 className="fw-bold mb-3">Recent Activity</h5>
            <ul className="opacity-75">
              <li>New box submitted for approval</li>
              <li>Seller approved</li>
              <li>Box rejected due to policy</li>
            </ul>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-dark p-4 text-white rounded-4">
            <h5 className="fw-bold mb-3">Admin Tips</h5>
            <ul className="opacity-75">
              <li>Review boxes daily</li>
              <li>Ensure seller KYC compliance</li>
              <li>Monitor subscription abuse</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;
