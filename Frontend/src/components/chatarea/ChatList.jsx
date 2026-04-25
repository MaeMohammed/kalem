import { useChannelStore } from '@/stores/useChannelStore'
import React, { useEffect, useRef } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useAuthStore } from '@/stores/useAuthStore'
import { useMessageStore } from '@/stores/useMessageStore'

const ChatList = () => {
    const {messages:channelmsgs,getChannelMessages,selectedChannel}=useChannelStore()
    const {selectedUser,messages:Usermsgs,getMessages,clearMessages}=useMessageStore()
    const {user}=useAuthStore()
    const bottomRef=useRef(null);
    const messages=selectedChannel ? channelmsgs : Usermsgs
    useEffect(()=>{
        if(selectedChannel){
            getChannelMessages(selectedChannel._id)
        }
        else if(selectedUser){
            clearMessages()
            getMessages(selectedUser._id)
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
        {messages.map((msg) => (
          <div key={msg._id} className={`chat ${user?._id === msg.sender._id ? "chat-start" : "chat-end"} `}>
            <div className='chat-image'>
            <Avatar>
            <AvatarImage src={msg.sender.avatarUrl} />
            <AvatarFallback className="text-white text-2xl">{msg.sender.username?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            </div>
            <div className='chat-header'>
              <p>{msg.sender.username}</p>
            </div>
            <p className='chat-bubble'>{msg.message}</p>
            <div className='chat-footer'>
             <time>
             {new Date(msg.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:"2-digit"})}
             </time>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </ScrollArea>
    </div>
  )
}

export default ChatList
