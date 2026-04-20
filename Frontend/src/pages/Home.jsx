
import ChatArea from '@/components/Home/ChatArea'
import Sidebar from '@/components/Home/Sidebar'
import React from 'react'

const Home = () => {
  return (
    <div className="flex h-screen">
       <Sidebar />
       <ChatArea /> 
    </div>
  )
}

export default Home
