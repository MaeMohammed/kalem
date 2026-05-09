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
            const message  = error.response?.data?.message || "an error occured while fetching users";
            toast.error(message)
            set({isLoadingUsers:false})
        }
    },
    updateProfile: async (formData) => {
       
        try {
            const res = await axiosInstance.put("/users/update-profile", formData);
            useAuthStore.getState().setUser(res.data.data)    
            return true
        } catch (error) {    
           const message  = error.response?.data?.message || "an error occured while updating profile";
            toast.error(message)
            return false
}
}
}))