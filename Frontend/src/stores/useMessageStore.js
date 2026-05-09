import {create} from "zustand"
import { axiosInstance } from "../utils/axios"
import { toast } from "sonner"
import { useAuthStore } from "./useAuthStore";


export const useMessageStore = create((set,get)=>({
    messages: [],
    selectedUser: null,
    unreaddms:new Set(),
    isLoadingMessages:false,
    getMessages:async(userId)=>{
        set({isLoadingMessages:true})
        try {
            const res= await axiosInstance.get(`/dm/${userId}/messages`);
            set({messages: res.data.data,isLoadingMessages:false})
        } catch (error) {
            const message  = error.response?.data?.message || "an error occured while loading messages";
            toast.error(message)
            set({isLoadingMessages:false})
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
            const message  = error.response?.data?.message || "an error occured while sending message";
            toast.error(message)
        }},
        setSelectedUser:(user)=>{
        
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
