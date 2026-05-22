import {createSlice} from '@reduxjs/toolkit';


const authSlice=createSlice({
    name:'auth',
    initialState:{
         user: null,
    isAuthenticated: false,
    loading:true,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    stopLoading(state) {
      state.loading = false;
    },
  },
});

export const { setUser, logout , stopLoading} = authSlice.actions;
export default authSlice.reducer;