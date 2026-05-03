import React, { useEffect } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from '../ui/avatar'
import { useAuthStore } from '@/stores/useAuthStore'
import { ChevronUp, Loader2, LogOut, Plus, User, X } from 'lucide-react'
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
            <div className='border-b border-base-300 p-4'>
                <h1>Kalem</h1>
            </div>
            <ScrollArea className="flex-1">
                <div>

                <div className='flex items-center justify-between'>
                    <h3>Channels </h3>
                    <Dialog>
                            <DialogTrigger >
                                <Plus className="w-2 h-2" />
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm">
                                <DialogHeader>
                                    <DialogTitle>Create Channel</DialogTitle>
                                    <DialogDescription>
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
                                        <Input id="name-1" name="name" {...register("name")} />
                                        {errors.name && <p className="text-red-700 text-sm">{errors.name.message}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="description-1">Description</Label>
                                        <Input id="description-1" name="description" {...register("description")} />
                                        {errors.description && <p className="text-red-700 text-sm">{errors.description.message}</p>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose>
                                      <X className="w-2 h-2" />
                                    </DialogClose>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Create Channel"}
                                    </Button>
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
                        className={`${selectedChannel?._id === channel._id ? "bg-base-300 flex items-center justify-between px-2 py-1" : "flex items-center justify-between px-2 py-1"} `}>
                            <p>{channel.name}</p>
                            {!member && (
                                <button onClick={(e)=>{
                                    e.stopPropagation()
                                    joinChannel(channel._id)}}>join</button>
                            )}
                        </div>
                    )})}
                </div>
                <Separator />
                <div>
                    <h3>Available users </h3>
                    {
                        users && users.map((u) => 
                        {  
                          const isonline=onlineusers.includes(u._id)
                          return (
                            <div key={u._id} onClick={() =>{
                                 setSelectedUser(u) 
                                 setSelectedChannel(null)}}
                                className={`${selectedUser?._id === u._id ? "bg-base-300 flex  gap-2 my-2 mx-auto px-4" : "flex gap-2 my-2 mx-auto px-4"} `}>
                                <div className='relative'>
                                   <Avatar>
                                      <AvatarImage src={u.profileIMG}/>
                                      <AvatarFallback>{u?.username?.[0].toUpperCase()}</AvatarFallback>
                                   </Avatar>    
                                    {
                                        isonline &&
                                        <span className="bg-green-600 dark:bg-green-800 border-2 border-base-100 absolute bottom-0 right-0 rounded-full w-3 h-3" />
                                    }

                                 </div>
                                <p>{u.username}</p>
                            </div>
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
                      <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
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
