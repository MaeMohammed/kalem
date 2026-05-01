import {create} from "zustand"
import { axiosInstance } from "../utils/axios"
import { toast } from "sonner"
import { useAuthStore } from "./useAuthStore";


export const useMessageStore = create((set,get)=>({
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
            console.log("setting selected user to:", user)
            set({selectedUser: user})
        },
        clearMessages:()=>{
            set({messages:[]})
        },
        subscribeToMessages:()=>{
            const { selectedUser }=get()
            if(!selectedUser) return ;
            const socket=useAuthStore.getState().socket

            socket.on("newMessage",(newMessage)=>{
               
                console.log("full message object:", JSON.stringify(newMessage))

                if(newMessage.sender !== selectedUser._id) return ;
                const populatedMessage={
                    ...newMessage,sender:selectedUser
                }
                set({
                    messages:[...get().messages,populatedMessage]
                })
            })
        },
        unsubscribeFromMessages:()=>{
         const socket=useAuthStore.getState().socket
         socket.off("newMessage")
        }
}))
