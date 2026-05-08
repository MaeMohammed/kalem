import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import { toast } from "sonner";
import { useAuthStore } from "./useAuthStore";
export const useUserStore = create((set) => ({

    users: [],
    isLoadingUsers:false,
        getUsers: async () => {
        set({isLoadingUsers:true})
        try {
            const res = await axiosInstance.get("/users");
            set({ users: res.data.data,isLoadingUsers:false });
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Error loading users");
            set({isLoadingUsers:false})
        }
    },
    updateProfile: async (formData) => {
       
        try {
            const res = await axiosInstance.put("/users/update-profile", formData);
            useAuthStore.getState().setUser(res.data.data)    
            return true
        } catch (error) {    
            const errs = error.response?.data?.errors || error.response?.data?.error || error.response?.data?.msg;
            const message = errs ? errs[0].msg : "An error occurred while updating profile";
            toast.error(message);
            return false
}
}
}))