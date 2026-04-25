import React from 'react'
import { Tooltip, TooltipContent,TooltipTrigger } from '../ui/tooltip'
import { UsersRound } from 'lucide-react';
import { useChannelStore } from '@/stores/useChannelStore';
import { useMessageStore } from '@/stores/useMessageStore';
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
            <h2>{name}</h2>
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
