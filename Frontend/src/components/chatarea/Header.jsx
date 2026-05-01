import React from 'react'
import { Tooltip, TooltipContent,TooltipTrigger } from '../ui/tooltip'
import { UsersRound } from 'lucide-react';
import { useChannelStore } from '@/stores/useChannelStore';
import { useMessageStore } from '@/stores/useMessageStore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const Header = () => {
    const {selectedChannel}=useChannelStore()
    const {selectedUser}=useMessageStore()
    const isdm=!!selectedUser
    const name=isdm ? selectedUser.username : selectedChannel?.name
    const members=isdm ? "" : selectedChannel?.members?.length + " members"
  return (
    <div className='p-4 border-b border-base-300'>
        <div className='flex items-center justify-between'>
            <div>
              <div className='flex gap-2'>
                {
                    isdm && (<Avatar>
                         <AvatarImage src={selectedUser.profileIMG}/>
                         <AvatarFallback className="text-white text-2xl">{selectedUser?.username?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>)
                }         
                <h2>{name}</h2>
                </div>  
            <p>{members }</p>
            </div>
            {
                !isdm && <Tooltip>
                <TooltipTrigger>
                    <UsersRound className="w-5 h-5" />
                </TooltipTrigger>
                <TooltipContent>       
                     <p>members</p>      
                </TooltipContent>
            </Tooltip>
            }

        </div>
    </div>
  )
}

export default Header
