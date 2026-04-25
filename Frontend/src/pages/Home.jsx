
import ChatArea from '@/components/Home/ChatArea'
import Sidebar from '@/components/Home/Sidebar'
import { useChannelStore } from '@/stores/useChannelStore'
import { useMessageStore } from '@/stores/useMessageStore'
import React from 'react'

const Home = () => {
  const {channels, selectedChannel }=useChannelStore()
  const {selectedUser}=useMessageStore()
  return (
    <div className="flex h-screen">
       <Sidebar />
      
      {
        (selectedUser || selectedChannel) ? <ChatArea /> : (
          <div>welcome back buddy!!!</div>
        )
      }
    
    </div>
  )
}

export default Home
