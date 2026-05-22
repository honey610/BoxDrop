import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { auth } from '../firebase';
import applyForSeller from '../features/seller/sellerSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    seller: applyForSeller,
   
  },
});
