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
    const { channels, createChannel,getChannels ,setSelectedChannel,selectedChannel,joinChannel} = useChannelStore();
    const {selectedUser,setSelectedUser}=useMessageStore();
    const {getUsers,users}=useUserStore();

    useEffect(()=>{
        getChannels()
        getUsers()
    },[getChannels,getUsers])
    return (
        <div className='h-full w-72 border-r border-base-300 flex flex-col '>
            <div className='border-b border-base-300 p-4 text-3xl'>
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
            <ScrollArea className="flex-1">
                <div>

                <div className='flex items-center justify-between'>
                    <h3 className='px-3 py-2 font-semibold -tracking-widest text-sm uppercase text-base-content/20'>Channels </h3>
                    <Dialog className="bg-base-200 border-base-300">
                            <DialogTrigger className="flex px-2" >
                                <Plus className="w-4 h-4" />
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm bg-base-200 border-base-300 rounded-lg">
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
                    {channels.map((channel) => {
                        const member=channel.members?.some(member=> 
                        (member._id || member).toString() === user._id.toString()
)
                       return (
                        <div key={channel._id} onClick={() =>{
                            if(!member) {
                                toast.error("you are not a member of this channel,please join to be able to chat")
                                return
                            }
                            setSelectedChannel(channel)
                             setSelectedUser(null)}}
                           className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${selectedChannel?._id === channel._id ? "bg-primary/25 text-primary" : "hover:bg-base-200"} `}>
                            <p>{channel.name}</p>
                            {!member && (
                                <button className='bg-secondary/25 text-primary-content w-12 h-12' onClick={(e)=>{
                                    e.stopPropagation()
                                    joinChannel(channel._id)}}>join</button>
                            )}
                        </div>
                    )})}
                </div>
                <Separator className="h-1 bg-base-300"/>
                <div>
                    <h3 className='px-3 py-2 font-semibold -tracking-widest text-sm uppercase text-base-content/20'>Available users </h3>
                    {
                        users && users.map((u) => 
                        {  
                          const isonline=onlineusers.includes(u._id)
                          return (
                            <HoverCard key={u._id} >
                                <HoverCardTrigger>
                                 <div  onClick={() =>{ 
                                   setSelectedUser(u) 
                                   setSelectedChannel(null)}}
                                   className={`flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer  ${selectedUser?._id === u._id ? "bg-primary/25 text-primary" : "hover:bg-base-200"} `}>
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
                                     <p>{u.username}</p>
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
            </ScrollArea>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <div className='border-t border-base-300 flex items-center justify-between gap-2 p-4'>
                <div className="flex items-center gap-2">
                   <Avatar >
                      <AvatarImage src={user.profileIMG} />
                      <AvatarFallback className="text-lg font-semibold bg-accent">{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                   </Avatar>
                    <p>{user?.username}</p>
                </div>
                  <ChevronUp className='w-4 h-4'/>   
            </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={()=>navigate("/profile")}>
                    <div className='flex gap-2'>
                        <User className='w-2 h-2' />
                        <p>profile</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>logout()}>
                    <div className="flex gap-2">
                        <LogOut className="w-2 h-2"/>
                        <p>logout</p>
                    </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Sidebar
