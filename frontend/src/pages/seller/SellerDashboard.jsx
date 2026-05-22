
import "./Seller.css";
import { Plus, TrendingUp, Users, IndianRupee } from "lucide-react";
import React from "react";
import api from "../../api/api";



function SellerDashboard() {
  
  const [subscribersCount,setSubscribersCount]=React.useState(0);
  const [liveBoxesCount,setLiveBoxesCount]=React.useState(0);
  const [revenue,setRevenue]=React.useState(0);
  const [boxPerformance,setBoxPerformance]=React.useState([]);
  const [trustScore,setTrustScore]=React.useState(0);
 
    const fetchSubscribersCount=async()=>{
      try{
        const res=await api.get("/sellers/subscribers-count");
        setSubscribersCount(res.data.totalSubscribers);
        const res2=await api.get("/sellers/live-boxes-count");
        setLiveBoxesCount(res2.data.totalLiveBoxes);
      }catch(err){
        console.log(err);
      }
    }

    const fetchRevenue=async()=>{
      try{
        const res=await api.get("/sellers/revenue");
        setRevenue(res.data.totalRevenue);
        
      }catch(err){
        console.log(err);
      }
    }

    const fetchTrustScore=async()=>{
      try{
        const res=await api.get("/sellers/trust-score");
        setTrustScore(res.data.trustScore);
        
      }catch(err){
        console.log(err);
      }
    }


    const fetchBoxPerformance=async()=>{
      try{
        const res=await api.get("/sellers/box-performance");
        setBoxPerformance(res.data.performance);
        
      }catch(err){
        console.log(err);
      }
    }

     React.useEffect(()=>{
    fetchSubscribersCount();
    fetchRevenue();
    fetchBoxPerformance();
    fetchTrustScore();
  },[])


     
  return (
    <div className="seller-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Track your boxes, subscribers, and revenue</p>
        </div>

        {/* <button className="create-btn">
          <Plus size={18} />
          Create Box
        </button> */}
      </div>

      {/* KPI GRID */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <Users />
          <div>
            <span>Subscribers</span>
            <h2>{subscribersCount}</h2>
          </div>
        </div>

        <div className="kpi-card">
          <TrendingUp />
          <div>
            <span>Active Boxes</span>
            <h2>{liveBoxesCount}</h2>
          </div>
        </div>

        <div className="kpi-card">
          {/* <IndianRupee /> */}
          <div>
            <span>Total Revenue</span>
            <h2>₹{revenue}</h2>
          </div>
        </div>

        <div className="kpi-card">
          <TrendingUp />
          <div>
            <span>Churn Rate</span>
            <h2>3.2%</h2>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">

        {/* LEFT */}
        <div className="dashboard-left">
          <div className="panel">
            <h3>Box Performance</h3>

            <table>
              <thead>
                <tr>
                  <th>Box</th>
                  <th>Status</th>
                  <th>Total Orders</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              {/* <tbody>
                <tr>
                  <td>{boxPerformance[0]?.title}</td>
                  <td><span className="badge live">{boxPerformance[0]?.status==true?"Live":"Pending"}</span></td>
                  <td>{boxPerformance[0]?.subscribers}</td>
                  <td>₹{boxPerformance[0]?.revenue}</td>
                </tr>

                <tr>
                  <td>{boxPerformance[1]?.title}</td>
                  <td><span className="badge review">{boxPerformance[1]?.status==true?"Live":""}</span></td>
                  <td>{boxPerformance[1]?.subscribers}</td>
                  <td>₹{boxPerformance[1]?.revenue}</td>
                </tr>

                <tr>
                  <td>{boxPerformance[2]?.title}</td>
                  <td><span className="badge live">{boxPerformance[2]?.status==true?"Live":""}</span></td>
                  <td>{boxPerformance[2]?.subscribers}</td>
                  <td>₹{boxPerformance[2]?.revenue}</td>
                </tr>
              </tbody> */}
              <tbody>
  {boxPerformance.map((box) => (
    <tr key={box.title}>
      <td>{box.title}</td>

      <td>
        <span
          className={`badge ${
            box.status === true ? "live" : "review"
          }`}
        >
          {box.status === true ? "Live" : "Pending"}
        </span>
      </td>

      <td>{box.subscribers || 0}</td>

      <td>₹{box.revenue || 0}</td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        </div>

        {/* RIGHT */}
        <div className="dashboard-right">
          <div className="panel">
            <h3>Seller Status</h3>

            <div className="status-row">
              <span>Approval</span>
              <span className="badge live">{boxPerformance[0]?.status==true?"Approved":"Pending"}</span>
            </div>

            <div className="status-row">
              <span>Trust Score</span>
              <strong>{trustScore}%</strong>
            </div>
          </div>

          <div className="panel">
            <h3>Growth Tips</h3>
            <ul>
              <li>Add 3+ images to each box</li>
              <li>Monthly billing converts best</li>
              <li>₹499–₹999 price range performs well</li>
            </ul>
          </div>
        </div>

      </div>
      {/* <div className="card bg-dark p-3 rounded-4">
  <p className="opacity-75">Boxes this month</p>
  <h3>
    {seller.boxesCreatedThisMonth} /{" "}
    {seller.plan === "FREE" ? 5 : "∞"}
  </h3>

  {seller.plan === "FREE" && (
    <button className="btn btn-primary mt-2">
      Upgrade to Pro – ₹200/month
    </button>
  )}
</div> */}
    </div>
  );
}

export default SellerDashboard;
