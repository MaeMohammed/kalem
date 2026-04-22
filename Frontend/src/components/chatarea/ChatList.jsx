import { useChannelStore } from '@/stores/useChannelStore'
import React, { useEffect, useRef } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useAuthStore } from '@/stores/useAuthStore'

const ChatList = () => {
    const {getChannelMessages,messages,selectedChannel}=useChannelStore()
    const {user}=useAuthStore()
    const bottomRef=useRef(null);
    useEffect(()=>{
        if(!selectedChannel) return;
        getChannelMessages(selectedChannel._id)
    }, [selectedChannel,getChannelMessages])
    useEffect(()=>{
        if(bottomRef.current){
            bottomRef.current.scrollIntoView({behavior:"smooth"})
        }
    },[ messages])
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <ScrollArea className="h-full">
        {messages.map((msg) => (
          <div key={msg._id} className={`chat ${user?._id === msg.sender._id ? "chat-end" : "chat-start"} `}>
            <div className='chat-image'>
            <Avatar>
            <AvatarImage src={msg.sender.avatarUrl} />
            <AvatarFallback>{msg.sender.username?.[0].toUpperCase()}</AvatarFallback>
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
