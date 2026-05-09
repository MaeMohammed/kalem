import { useChannelStore } from '@/stores/useChannelStore'
import React, { useEffect, useRef } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useAuthStore } from '@/stores/useAuthStore'
import { useMessageStore } from '@/stores/useMessageStore'
import{ ChatSkeleton } from "../Home/Skeletons"

const ChatList = () => {
    const {messages:channelmsgs,getChannelMessages,selectedChannel,subscribeToChannelMessages,unsubscribeFromChannelMessages,clearChannelMessages,isLoading:isLoadingChannel}=useChannelStore()
    const {selectedUser,messages:Usermsgs,getMessages,clearMessages,subscribeToMessages,unsubscribeFromMessages,isLoadingMessages}=useMessageStore()
    const {user}=useAuthStore()
    const bottomRef=useRef(null);
    const messages=selectedChannel ? channelmsgs : Usermsgs
    const filtered=messages.filter(msg => msg.sender !== null)

    const getsenderId=(msg)=> msg.sender?._id || msg.sender
    const groupedmsgs=(index)=> index > 0 &&
    getsenderId(filtered[index]) === getsenderId(filtered[index -1])

    useEffect(()=>{
        if(selectedChannel){
            clearChannelMessages()
            getChannelMessages(selectedChannel._id)
            subscribeToChannelMessages()
        }
        else if(selectedUser){
            clearMessages()
            getMessages(selectedUser._id);
            subscribeToMessages()
        }
      return ()=>{
        unsubscribeFromMessages()
        unsubscribeFromChannelMessages()
      }
      
    }, [selectedChannel,selectedUser])
    useEffect(()=>{
      setTimeout(()=>{
        if(bottomRef.current){
            bottomRef.current.scrollIntoView({behavior:"instant"})
        }
      },150      
      )
    },[filtered.length])
    
    const getDate=(date)=>{
        const d = new Date(date);
        const today=new Date()
        const yesterday=new Date()
        yesterday.setDate(today.getDate() -1)
        if(d.toDateString() == today.toDateString()) return "Today"
        if(d.toDateString() == yesterday.toDateString()) return "Yesterday"
        return d.toLocaleDateString("en-US",{month:"long",day:"numeric"})

    }
  return (
    <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
     {
      selectedChannel && !isLoadingMessages &&
         <div className='flex flex-col items-center gap-2 text-center bg-base-200 p-6 mb-4 border border-white rounded-2xl'>
           <Avatar>
              <AvatarFallback className="text-lg font-semibold bg-accent">{selectedChannel?.name?.[0].toUpperCase()}</AvatarFallback>   
           </Avatar>
           <p className='font-semibold text-lg '>{selectedChannel?.name}</p>
           <p className='text-sm text-base-content/50'>{selectedChannel?.description || "no description yet"}</p>
           <p className='text-sm text-base-content/40'> created by: {selectedChannel?.createdBy?.username}</p>
           <p className='text-xs text-base-content/30'>{selectedChannel?.members?.length} members</p>
        </div>
     }
        {isLoadingMessages || isLoadingChannel? <ChatSkeleton/>:filtered.map((msg,index) =>{
          const senderId= typeof msg.sender === "object" ? msg.sender._id :msg.sender
          const myMsg=user?._id === senderId?.toString()
          const senderObj = msg.sender && typeof msg.sender ==="object" ? msg.sender: (myMsg? user : selectedUser ?? null)
          const grouped=groupedmsgs(index)
          const datedivider=index ===0 ||new Date(filtered[index].createdAt).toDateString() !==
          new Date(filtered[index -1].createdAt).toDateString()
        return(
          <React.Fragment key={msg._id}>        
            {
              datedivider && (           
                <div className='flex items-center gap-3 my-4'>
                  <div className='flex-1 h-px bg-base-300'/>
                  <p className='text-xs text-base-300/30'>{getDate(msg.createdAt)}</p>
                  <div className='flex-1 h-px bg-base-300'/>
                </div>
              )
            }
          <div key={msg._id} className={`chat ${user?._id === senderId ? "chat-end" : "chat-start"} ${grouped? "mt-1":"mt-3"}`}>
            <div className='chat-image'>
            {
              !grouped && (
                <Avatar className={grouped? "invisible":""}>
                  <AvatarImage src={senderObj?.profileIMG} />
                  <AvatarFallback className="text-lg font-semibold bg-accent">{senderObj?.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
             )
            }
            </div>
            {
              !grouped &&
              <div className='chat-header'>
                  <p>{senderObj?.username}</p>
               </div>}
            <div className='chat-bubble'>
            {msg.message && <p style={{whiteSpace:"pre-wrap",wordBreak:"break-all",overflowWrap:"anywhere"}}>{msg.message}</p>}
            {msg.image && (<img src={msg.image} className='rounded-xl mt-3 max-w-[200px] md:max-w-xs' 
            onLoad={()=>bottomRef.current?.scrollIntoView({behavior:"smooth"})}/>)}
            </div>
            <div className='chat-footer'>
             <time>
             {new Date(msg.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:"2-digit"})}
             </time>
            </div>
          </div>
        </React.Fragment>
        )})}
        <div ref={bottomRef} />
     
    </div>
  )
}

export default ChatList
