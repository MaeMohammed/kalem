import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { profileSchema } from '@/utils/formvalidation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowBigLeft, Camera, CircleAlert, Loader2, LogOutIcon, Mail, Pen, X } from 'lucide-react'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { useUserStore } from '@/stores/useUserStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useNavigate } from 'react-router-dom'
import ClickSpark from '@/components/reactbits/ClickSpark'

const Profile = () => {
    const {updateProfile}=useUserStore()
    const {user,logout}=useAuthStore()
    
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
    const navigate=useNavigate()
  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
        <div className='flex flex-col w-full max-w-md gap-4'>
            <button className='flex items-center gap-2' onClick={()=>navigate("/")}>
                <ArrowBigLeft className='w-6 h-6' />
                <span className='text-sm'>back to home</span>
            </button>
            <div className='bg-base-200 border border-base-300 rounded-2xl p-8 flex flex-col items-center gap-3'>
            <div className='w-28 h-38 relative'> 
                <Avatar className='rounded-full w-28 h-28'>
                    <AvatarImage src={user?.profileIMG} />
                    <AvatarFallback className="text-lg font-semibold bg-accent">{user?.username?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <label htmlFor="prfimg" className='absolute bottom-1 right-1 rounded-full p-2 cursor-pointer bg-secondary hover:bg-primary transition-colors'>
                    <input type="file" id="prfimg" className='hidden' onChange={handleimageUpdate} />
                    <Camera className='w-4 h-4' />
                </label>
            </div>
               <h1 className='text-2xl font-black'>{user?.username}</h1>
               <p className='text-xs text-base-content/40 uppercase tracking-widest'>joinied in:{new Date(user?.createdAt).toLocaleDateString("en-US",{
                year:"numeric",
                month:"long",
                day:"numeric"
            })}</p>
            <div className='w-full border-t border-base-300 pt-4'>
               <div className='flex items-center justify-between mb-2'>
                <p className='text-xs text-base-content/20 uppercase tracking-widest'>bio:</p>
              <Dialog>
                    <DialogTrigger >
                        <Pen className='w-4 h-4 text-base-content/40 hover:text-base-content transition-colors' />
                    </DialogTrigger>
                    <DialogContent className="bg-base-200 border-2 border-white rounded-lg sm:max-w-sm">
                        <DialogHeader>
                             <DialogTitle>set bio</DialogTitle>
                            <DialogDescription>
                                if you wanted to tell the people something about you, what would it be?
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
                                        <Input id="bio" name="bio" {...register("bio")} className="h-10 bg-base-300 border-base-300 rounded-xl mt-2" />
                                        {errors.bio && 
                                          <div className='flex gap-2 items-center justify-start'>
                                           <CircleAlert className="w-4 h-4"/>   
                                           <p className="text-primary-content text-sm">{errors.bio.message}</p>
                                          </div>
                                        }
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
                                    <Button type="submit" disabled={isSubmitting} className="rounded-lg font-semibold mx-auto">
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : "update bio"}
                                    </Button>
                                     </ClickSpark>
                                </DialogFooter>
                        </form>
                            </DialogContent>
                    </Dialog>
               </div>
                <p className='text-base-content/70'>{user?.bio || "no bio yet"}</p>
            </div>
         </div>
                <div className='bg-base-200 border border-base-300 rounded-2xl p-6 flex flex-col gap-3'>
                   <p className='text-xs text-base-content/40 uppercase tracking-widest'></p>
                   <div className='flex items-center gap-3 py-2 border-b border-base-300'>
                     <Mail className='w-5 h-5 text-base-content/50'/>
                     <span className='text-sm'>{user?.email}</span>
                   </div>
                   <button className='flex items-center gap-3 py-2' onClick={()=>logout()}>
                     <LogOutIcon className='w-5 h-5'/>
                     <span className='text-sm'>logout</span>
                   </button>
                </div>
        </div>
    </div>
  )
}

export default Profile
