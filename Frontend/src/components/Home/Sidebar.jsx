import React, { useEffect } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from '../ui/avatar'
import { useAuthStore } from '@/stores/useAuthStore'
import { ChevronUp, CircleAlert, Loader2, LogOut, Plus, User, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { channelSchema } from '@/utils/formvalidation'
import { useChannelStore } from '@/stores/useChannelStore'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Button } from '../ui/button'
import { useUserStore } from '@/stores/useUserStore'
import { useMessageStore } from '@/stores/useMessageStore'
import { useNavigate } from 'react-router-dom'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import ShinyText from '../reactbits/ShinyText'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import ClickSpark from '../reactbits/ClickSpark'
import {UsersSkeleton,Sideskeleton}from "./Skeletons"


const Sidebar = () => {
  const navigate=useNavigate()
    const {
            register,
            handleSubmit,
            formState: { errors, isSubmitting },
            reset
        } = useForm({
            resolver: zodResolver(channelSchema)
        })
    const { user , onlineusers ,logout} = useAuthStore();
    const { channels, createChannel,getChannels ,setSelectedChannel,selectedChannel,joinChannel,unreadchannels,clearUnread,isLoadingChannels} = useChannelStore();
    const {selectedUser,setSelectedUser,unreaddms,clearUnreaddms}=useMessageStore();
    const {getUsers,users,isLoadingUsers}=useUserStore();

    useEffect(()=>{
        getChannels()
        getUsers()
    },[getChannels,getUsers])
    return (
        <div className='h-full w-full md:w-72 border-r border-white flex flex-col '>
            <div className='border-b-3 border-base-300 p-4 flex items-center gap-3'>
              <img src='./kalem.svg' className='w-9 h-9'/>   
            <ShinyText
                text="Kalem"
                className='text-3xl font-black '
                speed={3}
                delay={0}
                color="#b5b5b5"
                shineColor="#ffffff"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={false}
                disabled={false}
/>
            </div>
            <div className="flex-1 flex flex-col min-h-0">
             <div>
                <div className='flex items-center justify-between'>
                    <h3 className='px-3 py-2 font-semibold -tracking-widest text-sm uppercase text-base-content/20'>Channels </h3>
                    <Dialog className="bg-base-200 border-base-300">
                            <DialogTrigger className="flex px-2" >
                                <Plus className="w-4 h-4" />
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm bg-base-200 border-2 border-white rounded-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-xl">Create Channel</DialogTitle>
                                    <DialogDescription className="text-sm pl-2">
                                       create a new channel
                                    </DialogDescription>
                                </DialogHeader>
                       <form onSubmit={handleSubmit(async (data) => {
                           const res= await createChannel(data)
                           if(res) toast.success("channel created successfully")
                            reset()
                        })} >
                                <div className="grid gap-4 py-4">
                                    <div>
                                        <Label htmlFor="name-1">Name</Label>
                                        <Input id="name-1" name="name" {...register("name")}  className="h-10 bg-base-300 border-base-300 rounded-xl mt-2"/>
                                        {errors.name && 
                                          <div className='flex gap-2 items-center justify-start'>
                                              <CircleAlert className="w-4 h-4"/>   
                                              <p className="text-primary-content text-sm">{errors.name.message} </p>
                                          </div> }
                                    </div>
                                    <div>
                                        <Label htmlFor="description-1">Description</Label>
                                        <Input id="description-1" name="description" {...register("description")} className="h-10 bg-base-300 border-base-300 rounded-xl mt-2"/>
                                        {errors.description &&
                                          <div className='flex gap-2 items-center justify-start'>
                                              <CircleAlert className="w-4 h-4"/>   
                                              <p className="text-primary-content text-sm">{errors.description.message} </p>
                                          </div> }
                                    </div>
                                </div>
                                <DialogFooter>
                                    <ClickSpark
                                     sparkColor="#ffffff"
                                     sparkSize={12}
                                     sparkRadius={16}
                                     sparkCount={10}
                                     duration={500}
                                     >
                                    <Button type="submit" disabled={isSubmitting} className="rounded-lg font-semibold">
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Create Channel"}
                                    </Button>
                                     </ClickSpark>
                                </DialogFooter>
                        </form>
                            </DialogContent>
                    </Dialog>
                </div>
                <div className='overflow-y-auto max-h-48 overflow-x-hidden '>
                    {isLoadingChannels? <Sideskeleton/> : channels.map((channel) => {
                        const member=channel.members?.some(member=> 
                        (member._id || member).toString() === user._id.toString())
                       return (
                        <div key={channel._id} onClick={() =>{
                            if(!member) {
                                toast.error("you are not a member of this channel,please join to be able to chat")
                                return
                            }
                            setSelectedChannel(channel)
                            setSelectedUser(null)
                            clearUnread(channel?._id)
                        }}
                           className={`min-w-0 flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${selectedChannel?._id === channel._id ? "bg-primary/25 text-primary" : "hover:bg-base-200"} `}>
                            <div className='flex items-center justify-between flex-1 min-w-0 gap-2'>
                                <p className='min-w-0 truncate'>{channel.name}</p>
                                {
                                    unreadchannels.has(channel._id) && 
                                    <span className='w-2 h-2 rounded-full bg-primary flex-shrink-0'></span>
                                }
                            </div>
                            {!member && (
                                <button className='text-xs px-2 py-1 bg-secondary text-primary-content hover:bg-primary transition-colors rounded-lg' onClick={(e)=>{
                                    e.stopPropagation()
                                    joinChannel(channel._id)}}>join</button>
                            )}
                        </div>
                    )})}
                </div>
                </div>
                <Separator className="h-1 bg-white"/>
                <div className='flex flex-col flex-1 min-h-0'>
                    <h3 className='px-3 py-2 font-semibold -tracking-widest text-sm uppercase text-base-content/20'>Available users </h3>
                    <div className='overflow-y-auto flex-1 overflow-x-hidden custom-scroll'>
                    {
                      isLoadingUsers?<UsersSkeleton/>: users && users.map((u) => 
                        {  
                          const isonline=onlineusers?.includes(u._id)
                          return (
                            <HoverCard key={u._id} >
                                <HoverCardTrigger>
                                 <div  onClick={() =>{ 
                                   setSelectedUser(u) 
                                   setSelectedChannel(null)
                                   clearUnreaddms(u?._id)
                                }}
                                   className={`flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer  ${selectedUser?._id === u._id ? "bg-base-200" : "hover:bg-base-200"} `}>
                                     <div className='relative'>
                                      <Avatar>
                                         <AvatarImage src={u.profileIMG}/>
                                          <AvatarFallback className="text-lg font-semibold bg-accent">{u?.username?.[0].toUpperCase()}</AvatarFallback>
                                      </Avatar>    
                                        {
                                           isonline &&
                                           <span className="bg-green-600 dark:bg-green-800 border-2 border-base-100 absolute bottom-0 right-0 rounded-full w-3 h-3" />
                                         }
                                     </div>
                                     <div className='flex items-center justify-between w-full'>
                                       <p>{u.username}</p>
                                          {
                                             unreaddms.has(u?._id) &&
                                               <span className='w-2 h-2 rounded-full bg-primary'></span>
                                          }
                                     </div>
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent side="right" className="w-64 bg-base-200 border-primary-content">
                                  <div className="flex gap-3 items-start">
                                    <Avatar className="w-12 h-12">
                                         <AvatarImage src={u.profileIMG}/>
                                          <AvatarFallback className="text-lg font-semibold bg-accent">{u?.username?.[0].toUpperCase()}</AvatarFallback>
                                      </Avatar> 
                                      <div className="flex flex-col gap-1">
                                        <p className='font-semibold pt-1'>{u.username}</p>
                                        {isonline && <p className='text-xs text-green-500'>active now</p>}
                                        <p className='text-xs text-base-content/50'>{u.bio || ""}</p>
                                        </div> 
                                  </div>
                                </HoverCardContent>
                            </HoverCard>
                        )})
                    }
                    </div>
                </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <div className='border-t border-white flex items-center justify-between gap-2 p-4'>
                <div className="flex items-center gap-2">
                  <div className='relative'>
                            <Avatar>
                                <AvatarImage src={user?.profileIMG}/>
                                <AvatarFallback className="text-lg font-semibold bg-accent">{user?.username?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>                     
                            <span className="bg-green-600 dark:bg-green-800 border-2 border-base-100 absolute bottom-0 right-0 rounded-full w-3 h-3" />                    
                     </div>
                    <p>{user?.username}</p>
                </div>
                  <ChevronUp className='w-4 h-4'/>   
            </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border border-white bg-base-100">
                <DropdownMenuItem onClick={()=>navigate("/profile")}>
                    <div className='flex gap-2'>
                        <User className='w-4 h-4' />
                        <p>profile</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>logout()}>
                    <div className="flex gap-2">
                        <LogOut className="w-4 h-4"/>
                        <p>logout</p>
                    </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Sidebar
