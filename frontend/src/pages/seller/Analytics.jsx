import {
  TrendingUp,
  Users,
  IndianRupee,
  BarChart3,
} from "lucide-react";
import "./Analytics.css";
import { use, useEffect, useState } from "react";
import api from "../../api/api";
import RevenueChart from "./RevenueCharts";

function Analytics() {
   const [revenue,setRevenue]=useState(0);
   const [subscribersCount,setSubscribersCount]=useState(0);
   const [revenueTrend,setRevenueTrend]=useState([]);



  const fetchRevenue=async()=>{
      try{
        const res=await api.get("/sellers/revenue");
        setRevenue(res.data.totalRevenue);
        
      }catch(err){
        console.log(err);
      }
    }

    const fetchSubscribersCount=async()=>{
          try{
            const res=await api.get("/sellers/subscribers-count");
            setSubscribersCount(res.data.totalSubscribers);
           
           
          }catch(err){
            console.log(err);
          }
        }

        const fetchRevenueTrend=async()=>{
          try{
            const res=await api.get("/sellers/revenue-trend");
            setRevenueTrend(res.data.trend);
          }catch(err){
            console.log(err);
          }
        }

       

  useEffect(()=>{
    fetchRevenue();
    fetchSubscribersCount();
    fetchRevenueTrend();
  },[]);
  


  // if (!data) return null;
  return (
   
    <div className="seller-analytics">
      {/* KPI */}
      <div className="analytics-kpis">
        <div className="kpi">
          <span>Total Revenue</span>
          <h2>₹{revenue}</h2>
        </div>

        <div className="kpi">
          <span>Subscribers</span>
          <h2>{subscribersCount}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="panel">
        <h3>Revenue Trend</h3>
        <RevenueChart data={revenueTrend} />
      </div>

      {/* Top Boxes */}
      {/* <div className="panel">
        <h3>Top Boxes</h3>
        {data.topBoxes.map((b) => (
          <div key={b._id} className="box-rank">
            <span>{b.box.title}</span>
            <strong>₹{b.revenue}</strong>
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default Analytics;
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// function RevenueChart({ data }) {
//   if (!data || data.length === 0) {
//     return <p className="opacity-50">No revenue data yet</p>;
//   }

//   return (
//     <ResponsiveContainer width="100%" height={250}>
//       <LineChart data={data}>
//         <XAxis dataKey="label" />
//         <YAxis />
//         <Tooltip />
//         <Line
//           type="monotone"
//           dataKey="revenue"
//           stroke="#22c55e"
//           strokeWidth={3}
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// }

// export default RevenueChart;
