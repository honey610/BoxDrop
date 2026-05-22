import React,{useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Navbar from "../component/Navbar";
import Order from "../component/Order";
import "./BoxDetails.css";
import loadRazorpay from "../utils/loadRazorpay";
import { useSelector } from "react-redux";

import MuiAlert from "@mui/material/Alert";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';




function BoxDetails() {
     const { id } = useParams(); // 👈 get box id from URL
  const [box, setBox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddress, setShowAddress] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [open,setOpen]=useState(false);
  const [snackbarMsg,setSnackbarMsg]=useState("");
  
   const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };
const action = (
    <React.Fragment>
      <Button color="white" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  




const handleSubscribePayment = async () => {
  try {
    const res = await api.post("/payments/charge-subscription", {
      boxId: box._id,
    });

    // success → open Razorpay
    const loaded = await loadRazorpay();
    if (!loaded) throw new Error("Razorpay SDK failed");

    const options = {
      key: res.data.razorpayKey,
      amount: res.data.amount,
      currency: res.data.currency,
      order_id: res.data.razorpayOrderId,
      name: "BoxDrop",
      description: "Subscription Payment",
    };

    new window.Razorpay(options).open();

  } catch (err) {
    // ✅ EXPECTED CASE — DO NOT LOG AS ERROR
    if (err.response?.status === 409) {
      setSnackbarMsg(err.response.data.message);
      setOpen(true);
      return;
    }

    // ❌ REAL ERRORS ONLY
    console.error(err);
    setSnackbarMsg("Subscription failed");
    setOpen(true);
  }
};





  // const placeOrder=async(shippingAddress)=>{
  //   try {
  //   await api.post("/orders/create", {
  //     boxId: box._id,
  //     quantity: 1,
  //     shippingAddress,
  //   });

  //   alert("Order placed successfully");
  //   setShowAddress(false);
  // } catch (err) {
  //   alert(err.response?.data?.message || "Failed to place order");
  // }
  // }

  const handlePayment=async(shippingAddress)=>{
    try{
    const loaded=await loadRazorpay();
    if(!loaded){
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const res = await api.post("/payments/create-order", {
    boxId: box._id,
    shippingAddress,
  });

  const options = {
    key: res.data.razorpayKey,
    amount: res.data.amount,
    currency: res.data.currency,
    name: "BoxDrop",
    description: "Subscription Box Order",
    order_id: res.data.razorpayOrderId,
    method: {
      upi: true,
      card: true,
      netbanking: true,
    },
    handler: function () {
      setShowAddress(false);
      setSnackbarMsg("Payment successful");
      setOpen(true);
      // Webhook will finalize payment securely
      
    },
    prefill: {
      name: user.name,
      email: user.email,
    },
    theme: {
      color: "#121212",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}catch(err){
   // ✅ HANDLE 403 CLEANLY
    if (err.response?.status === 403) {
      setSnackbarMsg(err.response.data.message);
      setOpen(true);
      return;
    }

    setSnackbarMsg(
      err.response?.data?.message || "Something went wrong"
    );
    setOpen(true);
  
}
  }
  

  useEffect(() => {
    const fetchBox = async () => {
      try {
        const res = await api.get(`/boxes/${id}`);
        setBox(res.data.box);
      } catch (err) {
        console.error("Failed to fetch box", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBox();
  }, [id]);
    if (loading) {
    return <div className="page-center">Loading box details...</div>;
  }

  if (!box) {
    return <div className="page-center">Box not found</div>;
  }

  return (
    <>
    <Navbar />
    <div style={{background:"radial-gradient(circle at top, #0f2027, #000)" ,minHeight:"100vh",minWidth:"100%"}} className="box-details-page text-white py-5">
   <div className="container py-5">
        <div className="row g-5 align-items-center">

          {/* Image Section */}
          <div className="col-md-6">
            {/* <img
              src={box.images?.[0] || "/placeholder.png"}
              alt={box.title}
              className="img-fluid rounded shadow"
            /> */}
            <div style={{width:"80%"}}>
            <img
  src={
    box.images?.[0]
      ? `http://localhost:5000${box.images[0]}`
      // ?`box.images[0]`
      : "https://images.unsplash.com/photo-1582650859079-ee63913ecb84?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
  alt={box.title}
  className="box-image"
/>
</div>
          </div>

          {/* Details Section */}
          <div className="col-md-6">
            <span className="badge bg-light text-dark mb-3">
              {box.billingCycle} SUBSCRIPTION
            </span>

            <h1 className="fw-bold mt-2">{box.title}</h1>

            <p className=" mt-3">{box.description}</p>

            <div className="mt-4">
              <h4 className="fw-bold">
                ₹{box.price} <small className="">/ {box.billingCycle.toLowerCase()}</small>
              </h4>
            </div>

            <p className="mt-3">
              <strong>What’s inside:</strong><br />
              {box.itemsSummary}
            </p>

            <p className=" mt-2">
              {box.subscriberCount || 0} subscribers
            </p>

            {/* <button className="btn btn-primary btn-lg mt-4 px-5"
            onClick={() => setShowAddress(true)}
            >
              Place order
            </button> */}
            <div className="d-flex gap-3 mt-4">

  {/* One-time order */}
  <button
    className="btn btn-outline-light btn-lg px-5"
    onClick={() => setShowAddress(true)}
  >
    Place order
  </button>

  {/* Subscription */}
  {/* <button
    className="btn btn-primary btn-lg px-5"
    onClick={subscribeToBox}
    disabled={subscribing}
  >
    {subscribing ? "Subscribing..." : `Subscribe ${box.billingCycle.toLowerCase()}`}
  </button> */}
  <button
  className="btn btn-primary btn-lg px-5"
  onClick={handleSubscribePayment}
  disabled={subscribing}
>
  Subscribe ₹{box.price}/{box.billingCycle.toLowerCase()}
</button>


</div>

            {showAddress && (
  <div className="order-center-wrapper">
    <Order
      onSubmit={handlePayment}

      onClose={() => setShowAddress(false)}
    />
  </div>
)}

<p className=" mt-3" style={{ fontSize: "0.9rem" }}>
  • Place order = one-time purchase<br />
  • Subscribe = automatic delivery every {box.billingCycle.toLowerCase()}
</p>
          </div>
          
        </div>
        
      </div>
    </div>

    {/* ✅ SNACKBAR */}
  <Snackbar
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
</Snackbar>
    </>
  );
}
export default BoxDetails;