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
    
  return (
    <div className="flex-1 p-4 overflow-y-auto">
    
        {filtered.map((msg,index) =>{
          const senderId= typeof msg.sender === "object" ? msg.sender._id :msg.sender
          const myMsg=user?._id === senderId?.toString()
          const senderObj = msg.sender && typeof msg.sender ==="object" ? msg.sender: (myMsg? user : selectedUser ?? null)
          const grouped=groupedmsgs(index)
          return(
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
            <div className='chat-header'>
              <p>{senderObj?.username}</p>
            </div>
            <div className='chat-bubble'>
            { msg.message && <p>{msg.message}</p>}
            {msg.image && (<img src={msg.image} className='rounded-xl mt-3 max-w-xs' 
            onLoad={()=>bottomRef.current?.scrollIntoView({behavior:"smooth"})}/>)}
            </div>
            <div className='chat-footer'>
             <time>
             {new Date(msg.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:"2-digit"})}
             </time>
            </div>
          </div>
        )})}
        <div ref={bottomRef} />
     
    </div>
  )
}

export default ChatList
