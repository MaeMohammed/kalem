import {create} from "zustand"
import { axiosInstance } from "../utils/axios"
import { toast } from "sonner"

export const useMessageStore = create((set)=>({
    messages: [],
    selectedUser: null,
    getMessages:async(userId)=>{
        try {
            const res= await axiosInstance.get(`/dm/${userId}/messages`);
            set({messages: res.data.data})
        } catch (error) {
            console.error("Error fetching messages:", error);
                toast.error("error loading messages")

        }
    },
    sendMessage:async(userId, message)=>{
        try {
            const res= await axiosInstance.post(`/dm/${userId}/messages`, {message});
            set((state)=>({messages: [...state.messages, res.data.data]}))
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("error sending message")
        }},
        setSelectedUser:(user)=>{
            set({selectedUser: user})
        },
        clearMessages:()=>{
            set({messages:[]})
        }
}))
