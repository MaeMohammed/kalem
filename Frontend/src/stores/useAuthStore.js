import {create} from "zustand";
import {axiosInstance} from "../utils/axios";



export const useAuthStore = create((set) => ({
    user: null,
    isLoggedin: false,
    isLoading: false,
    signup:async(data)=>{
        try {
            set({isLoading: true})
           const res= await axiosInstance.post("/auth/signup", data);
            set({user: res.data.data.user, isLoading: false})
        } catch (error) {
            console.log(`error signingup: ${error.message}`)
            set({isLoading: false})
        }
    },
    login:async(data)=>{
        try {
            set({isLoading: true})
            const res= await axiosInstance.post("/auth/login", data);
            set({user: res.data.data.user, isLoading: false})
        } catch (error) {
            set({isLoading: false})
            console.log(`error logging in: ${error.message}`)
        }
    },
    logout:async()=>{
        try {
            set({isLoading: true})
            await axiosInstance.post("/auth/logout");
            set({user: null, isLoading: false})
        } catch (error) {
            console.log(`error logging out: ${error.message}`)
        }   },
    
    checkAuth:async()=>{
        try {
            set({isLoading: true})
            const res= await axiosInstance.get("/auth/checkauth");
            set({user: res.data.data.user, isLoading: false})
        } catch (error) {
            console.log(`error: ${error.message}`)
             set({isLoading: false})
        }
    }    
}));