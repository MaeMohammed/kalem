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
    sendChannelMessage:async(channelId, formdata)=>{
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
            const res= await axiosInstance.post(`/channels/${channelId}/messages`, formdata);
            set((state)=>({messages:state.messages.filter((m)=>m._id !== tempImg._id ).concat(res.data.data)}))
        } catch (error) {
            const errs= error.response?.data?.errors
            const message = errs ? errs[0].msg : "an error occured while sending message"
            toast.error( message)
        }
     }, 
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
                        const channelId= typeof newMessage.channelId === "object" ?newMessage.channelId._id : newMessage.channelId
                        if(channelId.toString() !== selectedChannel._id.toString()) return;
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