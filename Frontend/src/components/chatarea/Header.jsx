import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { UsersRound } from 'lucide-react';
import { useChannelStore } from '@/stores/useChannelStore';
import { useMessageStore } from '@/stores/useMessageStore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useAuthStore } from '@/stores/useAuthStore';


const Header = () => {
    const {onlineusers,user}=useAuthStore()
    const { selectedChannel } = useChannelStore()
    const { selectedUser } = useMessageStore()
    const isdm = !!selectedUser
    const name = isdm ? selectedUser.username : selectedChannel?.name
    const members = isdm ? "" : selectedChannel?.members?.length + " members"
    const loggedUser=selectedChannel?.members?.find(m =>m._id === user?._id)
    const remaining=selectedChannel?.members?.filter(m =>m._id !== user?._id)
    const sortedMembers=loggedUser ?[loggedUser,...remaining]: remaining
    return (
        <div className='p-4 border-b border-base-300'>
            <div className='flex items-center justify-between'>
                <div>
                    <div className='flex gap-2'>
                        {
                            isdm && (<Avatar>
                                <AvatarImage src={selectedUser.profileIMG} />
                                <AvatarFallback className="text-lg font-semibold bg-accent">{selectedUser?.username?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>)
                        }
                        <h2>{name}</h2>
                    </div>
                    <p>{members}</p>
                </div>
                {!isdm && <Dialog>
                        <DialogTrigger asChild>
                            <Tooltip>
                                <TooltipTrigger>
                                    <UsersRound className="w-5 h-5" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>members</p>
                                </TooltipContent>
                            </Tooltip>
                        </DialogTrigger>
                        <DialogContent className="bg-base-200 border-base-300 rounded-lg">
                            <DialogHeader>
                                <DialogTitle>Members: {selectedChannel?.members.length}</DialogTitle>
                                <DialogDescription>
                                    members in this channel
                                </DialogDescription>
                            </DialogHeader>
                              <ScrollArea className="h-72">
                                 {
                                    sortedMembers?.map((member)=>{
                                       const isonline=onlineusers.includes(member._id)
                                        return (
                                        <div key={member._id} className='flex items-center gap-2 py-2'>
                                         <div className='relative'>
                                          <Avatar>
                                            <AvatarImage src={member.profileIMG}/>
                                            <AvatarFallback className="text-lg font-semibold bg-accent">{member.username?.[0].toUpperCase()}</AvatarFallback>
                                          </Avatar>
                                          {
                                                isonline && <span className="bg-green-600 dark:bg-green-800 border-2 border-base-100 absolute bottom-0 right-0 rounded-full w-3 h-3" />
                                    
                                          }
                                            </div>   
                                            <div className='flex flex-col'>
                                               <p>{member._id === user._id? "You":member?.username}</p>
                                                {
                                                   isonline &&<p>active now</p>
                                                }
                                            </div>
                                        </div>
                                    )})
                                 }
                              </ScrollArea>
                        </DialogContent>
                    </Dialog>


                }

            </div>
        </div>
    )
}

export default Header
