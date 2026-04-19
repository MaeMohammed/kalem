import React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { Avatar,AvatarImage,AvatarFallback} from '../ui/avatar'
import { useAuthStore } from '@/stores/useAuthStore'




const Sidebar = () => {
 
    const {user}=useAuthStore();

  return (
    <div className='h-full w-72 border-r border-base-300 flex flex-col '>
         <div className='border-b border-base-300 p-4'>
            <h1>Kalem</h1>
         </div>
           <ScrollArea className="flex-1">
            <div>
                <h3>channels</h3>
            </div>
           <Separator />
            <div>
                <h3>Available users </h3>
            </div>
           </ScrollArea>
          <div className='border-t border-base-300 flex items-center gap-2 p-4'>
            <Avatar >
              <AvatarImage src="" />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                <p>{user?.username}</p>
            </div>
         </div>
    </div>
  )
}

export default Sidebar
