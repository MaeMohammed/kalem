import {create} from "zustand"
import { axiosInstance } from "../utils/axios"
import { toast } from "sonner"
import { useAuthStore } from "./useAuthStore";


export const useMessageStore = create((set,get)=>({
    messages: [],
    selectedUser: null,
    unreaddms:new Set(),
    getMessages:async(userId)=>{
        try {
            const res= await axiosInstance.get(`/dm/${userId}/messages`);
            set({messages: res.data.data})
        } catch (error) {
            console.error("Error fetching messages:", error);
                toast.error("error loading messages")

        }
    },
    addunreaddm:(userId)=>{
     set(state=>({unreaddms:new Set([...state.unreaddms,userId])}))
    },
    clearUnreaddms:(userId)=>{
        set(state=>{
            const s = new Set(state.unreaddms)
            s.delete(userId);
            return {unreaddms: s}
        })
    }
    ,
    sendMessage:async(userId, formdata)=>{
        try {
            const preview=formdata.get("image") ? URL.createObjectURL(formdata.get("image")) : null
            const tempImg={
                _id:Date.now(),
                sender:useAuthStore.getState().user,
                message:formdata.get("message"),
                image:preview,
                createdAt:new Date()
            }
            set(state=>({messages:[...state.messages,tempImg]}))
            const res= await axiosInstance.post(`/dm/${userId}/messages`, formdata);
            set((state)=>({messages:state.messages.filter((m)=>m._id !== tempImg._id ).concat(res.data.data)}))
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

                if(newMessage.sender !== selectedUser._id){
                    get().addunreaddm(newMessage.sender)
                    return ;
                };
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
