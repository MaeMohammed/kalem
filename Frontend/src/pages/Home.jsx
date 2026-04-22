
import ChatArea from '@/components/Home/ChatArea'
import Sidebar from '@/components/Home/Sidebar'
import { useChannelStore } from '@/stores/useChannelStore'
import React from 'react'

const Home = () => {
  const {channels, selectedChannel }=useChannelStore()
  return (
    <div className="flex h-screen">
       <Sidebar />
      
      {
        selectedChannel ? <ChatArea /> : (
          <div>welcome back buddy!!!</div>
        )
      }
    
    </div>
  )
}

export default Home
