import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api.js";

// export const applyForSeller = createAsyncThunk(
//   "seller/applyForSeller",
//   async (sellerData, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/sellers/apply", sellerData);

//       // axios response
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to apply as seller"
//       );
//     }
//   }
// );
export const applyForSeller = createAsyncThunk(
  "seller/apply",
  async ({ brandName, description, mode }, { rejectWithValue }) => {
    try {
      const endpoint =
        mode === "REAPPLY" ? "/sellers/reapply" : "/sellers/apply";

      const res = await api.post(endpoint, {
        brandName,
        description,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Application failed"
      );
    }
  }
);


const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    applicationStatus: null, // message from backend
    loading: false,
    error: null,
  },
  reducers: {
    clearSellerState(state) {
      state.applicationStatus = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyForSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.applicationStatus = action.payload.message;
      })
      .addCase(applyForSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.applicationStatus = null;
      });
  },
});

export const { clearSellerState } = sellerSlice.actions;
export default sellerSlice.reducer;
