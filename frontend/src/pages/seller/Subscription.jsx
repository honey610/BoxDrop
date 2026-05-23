import { useState, useEffect } from "react";
import api from "../../api/api";
// import Navbar from "../../component/Navbar";
const BACKEND_URL = "https://boxdrop-backend-w7s7.onrender.com";
function Subscription() {
  const [subscriptions, setSubscriptions] = useState([]);

  const fetchSubscriptions = async () => {
    try {
      const res = await api.get("/sellers/subscriptions");
      setSubscriptions(res.data.subscriptions);
    } catch (err) {
      console.error("Failed to fetch subscriptions", err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <>
      {/* <Navbar /> */}

      <div className="container py-5">
        <div className="order-header">
          <h2>Subscriptions</h2>
          <p>Manage and track customer subscriptions</p>
        </div>

        {subscriptions.length === 0 ? (
          <p>No active subscriptions yet.</p>
        ) : (
          <div className="row g-4">
            {subscriptions.map((sub) => (
              <div key={sub._id} className="col-md-4">
                <div className="order-card h-100 d-flex flex-column justify-content-between">

                  <div>
                    <h5 className="fw-bold mb-1">
                      {sub.boxId?.title}
                    </h5>

                    <p className="mb-1">
                      Subscriber: <strong>{sub.userId?.name}</strong>
                    </p>

                    <p className="mb-1 ">
                      Email: {sub.userId?.email}
                    </p>

                    <p className="mb-1">
                      Billing: {sub.billingCycle?.toLowerCase()}
                    </p>
                    <p>
                      Price: <strong>₹{sub.priceSnapshot}</strong>
                    </p>

                    <span className={`order-status ${sub.status}`}>
                        <p style={{fontSize:"0.85rem"}}>
                      Status: {sub.status}
                      </p>
                    </span>

                  
                   <img
            src={`${BACKEND_URL}${sub.boxId?.images[0]}`}
            alt="Box"
            className="box-image"
            style={{width:"200px",height:"200px"}}
          />
                  </div>

                  <p className="mt-3 " style={{ fontSize: "0.85rem" }}>
                    Started on:{" "}
                    {new Date(sub.startedAt).toLocaleDateString()}
                  </p>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Subscription;
