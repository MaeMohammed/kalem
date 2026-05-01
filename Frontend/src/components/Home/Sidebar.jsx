import React, { useEffect } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { useAuthStore } from '@/stores/useAuthStore'
import { Loader2, Plus, X } from 'lucide-react'
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
    const { user } = useAuthStore();
    const { channels, createChannel,getChannels ,setSelectedChannel,selectedChannel} = useChannelStore();
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
                    {channels.map((channel) => (
                        <div key={channel._id} onClick={() =>{ setSelectedChannel(channel)
                             setSelectedUser(null)}}
                        className={`${selectedChannel?._id === channel._id ? "bg-base-300" : ""} `}>
                            <p>{channel.name}</p>
                        </div>
                    ))}
                </div>
                <Separator />
                <div>
                    <h3>Available users </h3>
                    {
                        users && users.map((u) => (
                            <div key={u._id} onClick={() =>{
                                 setSelectedUser(u) 
                                 setSelectedChannel(null)}}
                                className={`${selectedUser?._id === u._id ? "bg-base-300 flex  gap-2 my-2 mx-auto px-4" : "flex gap-2 my-2 mx-auto px-4"} `}>
                                <Avatar>
                                  <AvatarImage src={u.profileIMG}/>
                                  <AvatarFallback>{u?.username?.[0].toUpperCase()}</AvatarFallback>
                                </Avatar>    
                                <p>{u.username}</p>
                            </div>
                        ))
                    }
                </div>
            </ScrollArea>
            <div className='border-t border-base-300 flex items-center gap-2 p-4' onClick={()=>navigate("/profile")}>
                <Avatar >
                    <AvatarImage src={user.profileIMG} />
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
