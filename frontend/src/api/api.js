import axios from 'axios';
import { auth } from "../firebase";

const api=axios.create({
    baseURL:"http://localhost:4000"
    // baseURL:"https://boxdrop-backend-w7s7.onrender.com"
});


api.interceptors.request.use((config)=>{
    const user =auth.currentUser;
    if(user){
        return user.getIdToken().then((token)=>{
            config.headers.Authorization=`Bearer ${token}`;
            return config;
        });
    }
    return config;
})

export default api;