import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'
import { useChannelStore } from '@/stores/useChannelStore'
import { set } from 'zod'
import { toast } from 'sonner'

const ChatInput = () => {
    const{sendChannelMessage,selectedChannel}=useChannelStore()
    const [message, setMessage] = useState("")
   const handlemsgsubmit=async()=>{
        if(!message.trim()) return;
        if(!selectedChannel) return toast.error("no channel selected");
        await sendChannelMessage(selectedChannel._id,{message})
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
