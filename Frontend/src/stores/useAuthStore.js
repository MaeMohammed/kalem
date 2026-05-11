import {create} from "zustand";
import {axiosInstance} from "../utils/axios";
import { toast } from "sonner";
import {io} from "socket.io-client"
import { useMessageStore } from "./useMessageStore";
import { useChannelStore } from "./useChannelStore";



export const useAuthStore = create((set,get) => ({
    user: null,
    isLoggedin: false,
    isLoading: false,
    ischeckingAuth: true,
    socket:null,
    onlineUsers:[],

    setUser:(user)=>{set({user})},

    signup:async(data)=>{
        try {
            set({isLoading: true})
           const res= await axiosInstance.post("/auth/signup", data);
            set({user: res.data.data, isLoading: false})
            toast.success("account created successfully")
             get().connectSocket()
            return true;
        } catch (error) {
            const message  = error.response?.data?.message || "an error occured while signing up";
            toast.error(message)
            set({isLoading: false})
            return false;
        }
    },
    login:async(data)=>{
        try {
            set({isLoading: true})
            const res= await axiosInstance.post("/auth/login", data);
            console.log(res.data)
            set({user: res.data.data, isLoading: false})
            toast.success("welcome back, buddy!")
            get().connectSocket()
            return true;
        } catch (error) {
            const message  = error.response?.data?.message || "Invalid email or password";
            set({isLoading: false})
            toast.error(message)
            return false;
        }
    },
    logout:async()=>{
        try {
            set({isLoading: true})
            await axiosInstance.post("/auth/logout");
            set({user: null, isLoading: false})
            get().disconnectSocket()
            useChannelStore.getState().setSelectedChannel(null)
            useMessageStore.getState().setSelectedUser(null)
        } catch (error) {
            toast.error("an error occured while logging out")
        }   },
    
    checkAuth:async()=>{
        try {
            set({ischeckingAuth: true})
            const res= await axiosInstance.get("/auth/checkauth");
            console.log("checkauth response", res.data)
            set({user: res.data.data, ischeckingAuth: false})
             get().connectSocket()
        } catch (error) {
            const message  = error.response?.data?.message || "error checking auth";
            toast.error(message)
            set({ischeckingAuth: false})
        }
    },
    connectSocket:()=>{
       const {user}=get()
       if(!user || get().socket?.connected) return ; 
       const socket = io( import.meta.env.VITE_KALEM_SOCKET_URL || "http://localhost:5001",{
        query:{
            userId:user._id
        }
       })
       socket.connect()
       set({socket:socket})
       socket.on("getOnlineUsers",(onlineusersIDS)=>{
       set({onlineUsers:onlineusersIDS})
       })
       socket.on("newMessage",(newMessage)=>{
        const selectedUser=useMessageStore.getState().selectedUser
        if(newMessage.sender === selectedUser?._id) return;
        useMessageStore.getState().addunreaddm(newMessage.sender)
       })
       socket.on("newChannelMessage",(newchannelMessage)=>{

        const selectedChannel=useChannelStore.getState().selectedChannel
        const channelId=typeof newchannelMessage.channelId === "object"? newchannelMessage.channelId._id : newchannelMessage.channelId
        if(channelId === selectedChannel?._id) return;

        useChannelStore.getState().addunread(channelId)
       })
    },
    disconnectSocket:()=>{
     if(get().socket?.connected) get().socket?.disconnect();
    }
}));