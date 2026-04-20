import {create} from "zustand";
import {axiosInstance} from "../utils/axios";
import { toast } from "sonner";


export const useChannelStore = create((set)=>({
  channels: [],
    createChannel: async(data)=>{
        try {
            const res= await axiosInstance.post("/channels", data);
            set((state)=>({channels: [...state.channels, res.data.data]}))
            toast.success("channel created successfully")
            return true;
        } catch (error) {
            const errs= error.response?.data?.errors
            const message = errs ? errs[0].msg : "an error occured while creating this channel"
            toast.error( message)
            return false;
        }
    },
    getChannels:async()=>{
        try {
            const res= await axiosInstance.get("/channels");
            set((state)=>({channels: res.data.data}))
        } catch (error) {
            const errs= error.response?.data?.errors
            const message = errs ? errs[0].msg : "an error occured while fetching channels"
            toast.error( message)
        }
    }
}))