
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Card } from '../ui/card'
import { useAuthStore } from '../../stores/useAuthStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/utils/formvalidation'
import { Loader2 } from 'lucide-react'
import {  Link, useNavigate } from 'react-router-dom'

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors , isSubmitting},
        reset
    } = useForm({
        resolver:zodResolver(loginSchema)
    })
    
    const {login}=useAuthStore();

  return (
      <Card className="mx-auto mt-10 p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form  onSubmit={handleSubmit(async (data) => {
             await login(data);
        })} className="space-y-4">
            <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" {
                ...register("email")
            } />
             {errors.email && <p className="text-red-700 text-sm">{errors.email.message}</p>}    
            </div>
            <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" {
                ...register("password")
            } />
            {errors.password && <p className="text-red-700 text-sm">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting? <Loader2 className="animate-spin" />: "Login"}
            </Button>
            <div className='text-center '>

            <Link to="/signup">
                Don't have an account? Sign Up
            </Link>
            </div>
        </form>
      </Card>
  )
}

export default LoginForm
