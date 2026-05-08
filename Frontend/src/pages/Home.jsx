
import ChatArea from '@/components/Home/ChatArea'
import Sidebar from '@/components/Home/Sidebar'
import SplitText from '@/components/reactbits/SplitText'
import TextType from '@/components/reactbits/TextType'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChannelStore } from '@/stores/useChannelStore'
import { useMessageStore } from '@/stores/useMessageStore'
import React from 'react'

const Home = () => {
  const { channels, selectedChannel } = useChannelStore()
  const { selectedUser } = useMessageStore()
  const { user } = useAuthStore()
  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`${(selectedUser || selectedChannel)? "hidden md:flex" : "flex"} w-full md:w-72 h-full`}>
        <Sidebar />
      </div>

      {
        (selectedUser || selectedChannel) ? (
          <div className="flex flex-1 flex-col"> <ChatArea /></div>
        ):
        (
          <div className='hidden md:flex flex-1 items-center justify-center flex-col gap-6 text-primary-content'>
            <SplitText
              text={`Welcome back, ${user?.username} !`}
              className='text-4xl'
              delay={50}
              duration={1.25}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
            <TextType
              text={["join a channel or pick one of the buddies and start chatting"]}
              className='text-xl'
              typingSpeed={100}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
              deletingSpeed={75}
            />
          </div>
        )
      }

    </div>
  )
}

export default Home
