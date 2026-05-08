import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { ArrowLeft, Users, UsersRound } from 'lucide-react';
import { useChannelStore } from '@/stores/useChannelStore';
import { useMessageStore } from '@/stores/useMessageStore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useAuthStore } from '@/stores/useAuthStore';


const Header = () => {
    const {onlineusers,user}=useAuthStore()
    const { selectedChannel ,setSelectedChannel} = useChannelStore()
    const { selectedUser,setSelectedUser } = useMessageStore()
    const isdm = !!selectedUser
    const name = isdm ? selectedUser.username : selectedChannel?.name  
    const loggedUser=selectedChannel?.members?.find(m =>m._id === user?._id)
    const remaining=selectedChannel?.members?.filter(m =>m._id !== user?._id)
    const sortedMembers=loggedUser ?[loggedUser,...remaining]: remaining
    const onlineUsers=selectedChannel?.members?.filter((m)=>onlineusers.includes(m._id)).length
    const onlinedm=onlineusers.includes(selectedUser?._id)
    return (
        <div className='p-4 border-b border-white'>
            <button className='flex md:hidden items-center gap-1 text-sm mb-2 text-base-content/40'
              onClick={(()=>{
                setSelectedUser(null);
                setSelectedChannel(null)})}
            >
              <ArrowLeft className='w-4 h-4'/>
            </button>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='flex gap-2'>
                        {
                            isdm && (<Avatar>
                                <AvatarImage src={selectedUser.profileIMG} />
                                <AvatarFallback className="text-lg font-semibold bg-accent">{selectedUser?.username?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>)
                        }
                        {
                            !isdm &&
                            <Avatar>
                             <AvatarFallback className="text-lg font-semibold bg-accent">{selectedChannel?.name?.[0].toUpperCase()}</AvatarFallback>   
                            </Avatar>
                        }
                    </div>
                    <div className='flex flex-col'>
                        <h2 className='font-semibold text-base'>{name}</h2>
                        {
                            !isdm && 
                            <div className='flex gap-2 items-center'>
                                <Users className='w-4 h-4'/>
                                 <p className='text-xs text-base-content/40 '>{onlineUsers? onlineUsers :"0"} online</p>
                            </div>
                        }
                        {
                            isdm && <p className='text-xs text-base-content/40'>
                                  {onlinedm ? "active now":""}
                            </p>
                        }
                    </div>    
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
                        <DialogContent className="bg-base-200 border-2 border-white rounded-lg">
                            <DialogHeader>
                                <DialogTitle>Members: {selectedChannel?.members.length}</DialogTitle>
                                <DialogDescription>
                                   <p className='text-xs text-base-content/40 '>{onlineUsers? onlineUsers :"0"} online</p>
                                </DialogDescription>
                            </DialogHeader>
                              <ScrollArea className="h-72">
                                 {
                                    sortedMembers?.map((member)=>{
                                       const isonline=onlineusers.includes(member._id)
                                        return (
                                        <div key={member._id} className='flex items-center gap-2 py-2 hover:bg-base-300 rounded-lg transition-colors px-2'>
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
                                                   isonline &&<p className='text-xs text-green-500'>active now</p>
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
