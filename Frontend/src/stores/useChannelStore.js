import {create} from "zustand";
import {axiosInstance} from "../utils/axios";
import { toast } from "sonner";
import { useAuthStore } from "./useAuthStore";


export const useChannelStore = create((set,get)=>({
  channels: [],
  selectedChannel:null,
  messages: [],
    clearChannelMessages:()=>{
        set({messages:[]})
    },
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
    },
    setSelectedChannel:(channel)=>{
        set({selectedChannel: channel})
    },
    getChannelMessages:async(channelId)=>{
        try {
            const res= await axiosInstance.get(`/channels/${channelId}/messages`);
            console.log(res.data)
            set( {messages: res.data.data})
        }   catch (error) {
            const errs= error.response?.data?.errors
            const message = errs ? errs[0].msg : "an error occured while fetching messages"
            toast.error( message)

        }  },
    sendChannelMessage:async(channelId, data)=>{
        try {
            const res= await axiosInstance.post(`/channels/${channelId}/messages`, data);
             set((state)=>({messages: [...state.messages, res.data.data]}))
            return res.data.data
        }   catch (error) {
            const errs= error.response?.data?.errors
            const message = errs ? errs[0].msg : "an error occured while sending message"
            toast.error( message)
        
        }},
        joinChannel:async(channelId)=>{
            try {
                const res=await axiosInstance.patch(`/channels/${channelId}/join`)
                set((state)=>({
                    channels:state.channels.map((channel)=>{
                      return channel._id === channelId? res.data.data : channel
                    })
                }))
            } catch (error) {
                const errs= error.response?.data?.errors
                const message = errs ? errs[0].msg : "an error occured while joining channel"
                toast.error( message)
            }
        },subscribeToChannelMessages:()=>{
                    const { selectedChannel }=get()
                    if(!selectedChannel) return ;
                    const socket=useAuthStore.getState().socket
                    socket.emit("joinChannel",selectedChannel._id)    
                    socket.on("newChannelMessage",(newMessage)=>{
                        if(newMessage.channelId !== selectedChannel._id) return ;
                        if(newMessage.sender._id === useAuthStore.getState().user._id) return ;
                        set({
                            messages:[...get().messages,newMessage]
                        })
                    })
                },
                unsubscribeFromChannelMessages:()=>{
                 const socket=useAuthStore.getState().socket
                 socket.off("newChannelMessage")
                }

}))