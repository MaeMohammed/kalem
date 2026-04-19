import {create} from "zustand";
import {axiosInstance} from "../utils/axios";
import { toast } from "sonner";



export const useAuthStore = create((set) => ({
    user: null,
    isLoggedin: false,
    isLoading: false,
    ischeckingAuth: true,
    signup:async(data)=>{
        try {
            set({isLoading: true})
           const res= await axiosInstance.post("/auth/signup", data);
            set({user: res.data.data, isLoading: false})
            toast.success("account created successfully")
            return true;
        } catch (error) {
            const errs= error.response?.data?.errors
            const message = errs ? errs[0].msg : "error signing up"
            toast.error( message || "Error signing up")
            set({isLoading: false})
            return false;
        }
    },
    login:async(data)=>{
        try {
            set({isLoading: true})
            const res= await axiosInstance.post("/auth/login", data);
            console.log(res.data)
            set({user: res.data.data, isLoading: false})
            toast.success("welcome back, buddy!")
            return true;
        } catch (error) {
            const errs = error.response?.data?.errors;
            const message = errs ? errs[0].msg : "invalid email or password";
            set({isLoading: false})
            toast.error(message || "invalid email or password")
            return false;
        }
    },
    logout:async()=>{
        try {
            set({isLoading: true})
            await axiosInstance.post("/auth/logout");
            set({user: null, isLoading: false})
        } catch (error) {
            toast.error("error logging out")
        }   },
    
    checkAuth:async()=>{
        try {
            const res= await axiosInstance.get("/auth/checkauth");
            set({user: res.data.data.user, ischeckingAuth: false})
        } catch (error) {
             set({ischeckingAuth: false})
        }
    }    
}));