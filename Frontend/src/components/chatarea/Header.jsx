import React from 'react'
import { Tooltip, TooltipContent,TooltipTrigger } from '../ui/tooltip'
import { UsersRound } from 'lucide-react';
import { useChannelStore } from '@/stores/useChannelStore';
const Header = () => {
    const {selectedChannel}=useChannelStore()
  return (
    <div className='p-4 border-b border-base-300'>
        <div className='flex items-center justify-between'>
            <div>
            <h2>{selectedChannel?.name }</h2>
            <p>{selectedChannel?.members?.length} members</p>
            </div>
            <Tooltip>
                <TooltipTrigger>
                    <UsersRound className="w-5 h-5" />
                </TooltipTrigger>
                <TooltipContent>       
                     <p>members</p>      
                </TooltipContent>
            </Tooltip>
        </div>
    </div>
  )
}

export default Header
