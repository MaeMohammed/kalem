import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'
import { useChannelStore } from '@/stores/useChannelStore'
import { set } from 'zod'
import { toast } from 'sonner'
import { useMessageStore } from '@/stores/useMessageStore'

const ChatInput = () => {
    const{sendChannelMessage,selectedChannel}=useChannelStore()
    const [message, setMessage] = useState("")
    const {selectedUser,sendMessage}=useMessageStore()
   const handlemsgsubmit=async()=>{
        if(!message.trim()) return;
       
        if(selectedChannel) {await sendChannelMessage(selectedChannel._id,{message})}
        else if(selectedUser) {
            await sendMessage(selectedUser._id,message)
        }
        setMessage("")
    }
  return (
    <div className="flex items-center justify-between">
      <Input placeholder="Message..." value={message} onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handlemsgsubmit()} />
      <Button type='submit' onClick={handlemsgsubmit}>
        <Send className='w-5 h-5'/>
      </Button>
    </div>
  )
}

export default ChatInput
