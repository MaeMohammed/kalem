import { useChannelStore } from '@/stores/useChannelStore'
import React, { useEffect, useRef } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useAuthStore } from '@/stores/useAuthStore'
import { useMessageStore } from '@/stores/useMessageStore'

const ChatList = () => {
    const {messages:channelmsgs,getChannelMessages,selectedChannel,subscribeToChannelMessages,unsubscribeFromChannelMessages,clearChannelMessages}=useChannelStore()
    const {selectedUser,messages:Usermsgs,getMessages,clearMessages,subscribeToMessages,unsubscribeFromMessages}=useMessageStore()
    const {user}=useAuthStore()
    const bottomRef=useRef(null);
    const messages=selectedChannel ? channelmsgs : Usermsgs
    const filtered=messages.filter(msg => msg.sender !== null)
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
        if(bottomRef.current){
            bottomRef.current.scrollIntoView({behavior:"smooth"})
        }
    },[ channelmsgs,Usermsgs])
    
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <ScrollArea className="h-full">
        {filtered.map((msg) => {
          const senderId= typeof msg.sender === "object" ? msg.sender._id :msg.sender
          const myMsg=user?._id === senderId?.toString()
          const senderObj = msg.sender && typeof msg.sender ==="object" ? msg.sender: (myMsg? user : selectedUser ?? null)
          
          return(
          <div key={msg._id} className={`chat ${user?._id === senderId ? "chat-end" : "chat-start"} `}>
            <div className='chat-image'>
            <Avatar>
            <AvatarImage src={senderObj?.profileIMG} />
            <AvatarFallback className="text-lg font-semibold bg-accent">{senderObj?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            </div>
            <div className='chat-header'>
              <p>{senderObj?.username}</p>
            </div>
            <p className='chat-bubble'>{msg.message}</p>
            <div className='chat-footer'>
             <time>
             {new Date(msg.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:"2-digit"})}
             </time>
            </div>
          </div>
        )})}
        <div ref={bottomRef} />
      </ScrollArea>
    </div>
  )
}

export default ChatList
