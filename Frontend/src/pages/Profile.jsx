import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { profileSchema } from '@/utils/formvalidation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Loader2, Pen, X } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/stores/useUserStore'
import { useAuthStore } from '@/stores/useAuthStore'

const Profile = () => {
    const {updateProfile}=useUserStore()
    const {user}=useAuthStore()
    
    if(!user ){
        return(<Loader2/>)
    }
    const {
                register,
                handleSubmit,
                formState: { errors, isSubmitting },
                reset
            } = useForm({
                resolver: zodResolver(profileSchema)
            })
    const handleimageUpdate=async(e)=>{
        const file=e.target.files[0];
        if(file){
            const formData=new FormData();
            formData.append("profileIMG",file);
            const res= await updateProfile(formData)
            e.target.value=''
        }
    }
  return (
    <div className='min-h-screen flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4 p-6'>
            <div className='w-32 h-32 relative'> 
                <Avatar className='rounded-full w-32 h-32'>
                    <AvatarImage src={user?.profileIMG} />
                    <AvatarFallback className='text-4xl'>{user?.username?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <label htmlFor="prfimg" className='absolute bottom-0 right-0 rounded-full p-2'>
                    <input type="file" id="prfimg" className='hidden' onChange={handleimageUpdate} />
                    <Camera className='w-5 h-5' />
                </label>
            </div>
            <h1>{user?.username}</h1>
            <div className='flex flex-col'>
              <p>{user?.bio}</p>
              <Dialog>
                            <DialogTrigger >
                               <Pen className='w-4 h-4' />
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm">
                                <DialogHeader>
                                    <DialogTitle>set bio</DialogTitle>
                                    <DialogDescription>
                                       if you wanted to tell the people something , what would it be?
                                    </DialogDescription>
                                </DialogHeader>
                       <form onSubmit={handleSubmit(async (data) => {
                           const formdata=new FormData()
                           formdata.append("bio",data.bio)
                           const res= await updateProfile(formdata)
                           if(res) toast.success("bio updated successfully")
                            reset()
                        })} >
                                <div className="grid gap-4 py-4">
                                    <div>
                                        <Label htmlFor="bio">bio</Label>
                                        <Input id="bio" name="bio" {...register("bio")} />
                                        {errors.bio && <p className="text-red-700 text-sm">{errors.bio.message}</p>}
                                    </div>   
                                </div>
                                <DialogFooter>
                                    <DialogClose>
                                      <X className="w-2 h-2" />
                                    </DialogClose>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : "update bio"}
                                    </Button>
                                </DialogFooter>
                        </form>
                            </DialogContent>
                    </Dialog>
            </div>
            <span>joinied in:{new Date(user?.createdAt).toLocaleDateString("en-US",{
                year:"numeric",
                month:"long",
                day:"numeric"
            })}</span>
        </div>
    </div>
  )
}

export default Profile
