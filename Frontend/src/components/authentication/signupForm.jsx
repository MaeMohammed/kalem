import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useAuthStore } from '../../stores/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { Loader } from 'lucide-react'

const SignupForm = () => {
    const [data, setData]=useState({
        username:"",
        email:"",
        password:""
    })
    const navigate=useNavigate()
    const {signup, isLoading}=useAuthStore();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        await signup(data)
        navigate("/login")
    }
  return (
      <Card className="mx-auto mt-10 p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form  onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
            <Label>Username</Label>
            <Input type="text" value={data.username} onChange={(e) => setData({...data, username: e.target.value})}/>
            </div>
            <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
            </div>
            <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader className='animate-spin' />: "Sign Up"}
            </Button>
        </form>
      </Card>
  )
}

export default SignupForm
