import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import { toast } from "sonner";

export const useUserStore = create((set) => ({
    users: [],
    getUsers: async () => {
        try {
            const res = await axiosInstance.get("/users");
            set({ users: res.data.data });
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Error loading users");
        }
    },
}));