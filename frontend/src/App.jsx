import './App.css'
import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {   Routes, Route } from 'react-router-dom';
// import Navbar from './component/Navbar';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Browse from './pages/Browse.jsx';
import BoxDetails from './pages/BoxDetails.jsx';
import SellerApply from './pages/SellerApply.jsx';
import ProtectedRoute from './component/ProtectedRoute.jsx';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "./firebase";
import api from "./api/api";
import { setUser,stopLoading } from "./features/auth/authSlice";
import UserProfile from './pages/UserProfile.jsx';
import HowItWorks from './pages/HowItWorks.jsx';
import AdminSellerApproval from './pages/AdminSellerApproval.jsx';
import RejectModal from './component/RejectModal.jsx';
import SellerLayout from './pages/seller/SellerLayout.jsx';
import SellerDashboard from './pages/seller/SellerDashboard.jsx';
import SellerBoxes from './pages/seller/SellerBoxes.jsx';
import SellerOrder from './pages/seller/SellerOrder.jsx';
import SellerOrderDetailPage from './pages/seller/SellerOrderDetailPage.jsx';
import Subscription from './pages/seller/Subscription.jsx';
import CreateBox from './pages/seller/CreateBox.jsx';
import Analytics from './pages/seller/Analytics.jsx';
import AdminBoxesApproval from './pages/AdminBoxesAproval.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import OrderHistory from './pages/user/OrderHistory.jsx';
import OrderDetails from './pages/user/OrderDetails.jsx';
import SubscriptionDetail from './pages/user/SubscriptionDetail.jsx';
import PrivacyPolicy from './pages/footer/PrivacyPolicy.jsx';
import TermsandConditions from './pages/footer/TermsandCondition.jsx';

// import AdminAnalytics from './pages/admin/AdminAnalytics.jsx';


function App() {
   const dispatch = useDispatch();
  // const [checkingAuth, setCheckingAuth] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  //     if (firebaseUser) {
  //       const token = await firebaseUser.getIdToken();

  //       try {
  //         const res = await api.get("/users/me", {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });

  //         dispatch(setUser(res.data.user));
  //       } catch (err) {
  //         console.error("Auth rehydrate failed", err);
  //       }
  //     }

  //     setCheckingAuth(false);
  //   });

  //   return () => unsubscribe();
  // }, [dispatch]);
//  if (checkingAuth) {
//     return <div>Loading...</div>;
//   }else{
// return children;
//   }

  // const dispatch = useDispatch();

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
    try {
      if (!firebaseUser) {
        dispatch(stopLoading()); // 👈 important
        return;
      }

      const token = await firebaseUser.getIdToken();

      const res = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      dispatch(setUser(res.data.user));
    } catch (err) {
      dispatch(stopLoading());
    }
  });

  return () => unsubscribe();
}, [dispatch]);



  return (
    <>
    
      
   
      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
        </Route>
   <Route path="/login" element={<Login />} />
   
    <Route
        path="/userprofile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/browse"
        element={
          <ProtectedRoute>
            <Browse />
          </ProtectedRoute>
         
        }
      />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/boxes/:id" element={
        <ProtectedRoute>
          <BoxDetails />
        </ProtectedRoute>
      } />
      <Route
        path="/apply-seller"
        element={
          <ProtectedRoute>
            <SellerApply />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/seller-approvals"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminSellerApproval />
          </ProtectedRoute>
        }
      />

      <Route
  path="/seller/*"
  element={
    <ProtectedRoute allowedRoles={["SELLER"]}>
      <SellerLayout />
    </ProtectedRoute>
  }
>
  <Route path="dashboard" element={<SellerDashboard />} />
  <Route path="boxes" element={<SellerBoxes />} />
  <Route path="boxes/new" element={<CreateBox />} />
  <Route path="analytics" element={<Analytics />} />
  <Route path="orders" element={<SellerOrder />} />
  <Route path="subscriptions" element={<Subscription />} />
  <Route path="orders/:id" element={<SellerOrderDetailPage />} />
</Route>

      <Route
        path="/admin/box-approvals"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminBoxesApproval />
          </ProtectedRoute>
        }
      />

      

      
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* DEFAULT */}
          <Route index element={<AdminDashboard />} />

          {/* DASHBOARD */}
          <Route path="dashboard" element={<AdminDashboard />} />

        
        </Route>
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/subscriptions/:subscriptionId" element={<SubscriptionDetail />} />

        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsandConditions />} />

        <Route path="/reject-modal" element={<RejectModal />} />
        
      

    </Routes>
    
    
     
    
    </>
  )
}

export default App
