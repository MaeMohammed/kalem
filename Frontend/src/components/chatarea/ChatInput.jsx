import React, { useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ImageIcon, Send, X } from 'lucide-react'
import { useChannelStore } from '@/stores/useChannelStore'

import { toast } from 'sonner'
import { useMessageStore } from '@/stores/useMessageStore'
import ClickSpark from '../reactbits/ClickSpark'

const ChatInput = () => {
    const{sendChannelMessage,selectedChannel}=useChannelStore()
    const [message, setMessage] = useState("")
    const {selectedUser,sendMessage}=useMessageStore()
    const[image,setImage]=useState(null)
    const[preview,setPreview]=useState(null)
    const imageRef=useRef()

   const handlemsgsubmit=async()=>{
        if(!message.trim() && !image) return;
        const formdata=new FormData()
        if(message) formdata.append("message",message)
        if(image) formdata.append("image",image)
          setMessage("")
          setImage(null)
          setPreview(null)
          if(imageRef.current){
            imageRef.current.value=""
          }
        if(selectedChannel) {await sendChannelMessage(selectedChannel._id,formdata)}
        else if(selectedUser) {
            await sendMessage(selectedUser._id,formdata)
        }
    }
  
  const handleImage=(e)=>{
  const file=e.target.files[0]
  if(file){
    setImage(file);
    setPreview(URL.createObjectURL(file))
  }
  }  
  return (
  <div className='flex flex-col gap-2'>
  {
    preview && (
      <div className='relative w-24 bg-base-100'>
         <img
         src={preview}
         className='rounded-xl w-24 h-24 object-cover'
         />
         <button onClick={()=>{
          setImage(null);
          setPreview(null)
         }}
         className='absolute top-0 right-0 rounded-full flex items-center justify-center text-xs text-primary-content bg-black'
         >
          <X  className='w-3 h-3'/>
         </button>
      </div>
    )
  }

 <ClickSpark
        sparkColor="#ffffff"
        sparkSize={12}
        sparkRadius={16}
        sparkCount={10}
        duration={500}
        style={{display:"contents"}}
           >
    <div className="flex items-center gap-2">
      < label htmlFor="imgupload" className="cursor-pointer p-2 rounded-lg hover:bg-secondary">
        <ImageIcon className='w-6 h-6'/>
      </label>
      <input type="file" id='imgupload' ref={imageRef} className='hidden' onChange={handleImage} accept='image/*'/>
      <Input placeholder="Message..." value={message} onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handlemsgsubmit()} />
             <Button type='submit' onClick={handlemsgsubmit} className="rounded-xl">
                <Send className='w-6 h-6'/>
              </Button>
    </div>
             </ClickSpark>
  </div>
  )
}

export default ChatInput
