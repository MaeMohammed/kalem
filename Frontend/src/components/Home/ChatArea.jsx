import React from 'react'
import Header from '../chatarea/Header'
import ChatList from '../chatarea/ChatList'
import ChatInput from '../chatarea/ChatInput'

const ChatArea = () => {
  return (
    <div className='flex flex-col flex-1 h-full'>
      <Header/>
      <ChatList/>
      <ChatInput/>
    </div>
  )
}

export default ChatArea
