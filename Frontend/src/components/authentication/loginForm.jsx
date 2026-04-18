
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Card } from '../ui/card'
import { useAuthStore } from '../../stores/useAuthStore'

const LoginForm = () => {
    const [data, setData]=useState({
        email:"",
        password:""
    })
    const {login}=useAuthStore();
    const handleSubmit=(e)=>{
        e.preventDefault();
        login(data)
    }
  return (
      <Card className="mx-auto mt-10 p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form  onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
            </div>
            <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
            </div>
            <Button type="submit" className="w-full">Login</Button>
        </form>
      </Card>
  )
}

export default LoginForm
