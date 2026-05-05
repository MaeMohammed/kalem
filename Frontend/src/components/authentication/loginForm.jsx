
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Card } from '../ui/card'
import { useAuthStore } from '../../stores/useAuthStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/utils/formvalidation'
import { CircleAlert, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import ClickSpark from '../reactbits/ClickSpark'
import GradientText from '../reactbits/GradientText'


const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(loginSchema)
    })

    const { login } = useAuthStore();

    return (
      <div className="p-12 w-full">
            <GradientText
               colors={["#5227FF","#FF9FFC","#B497CF"]}
               animationSpeed={8}
               showBorder={false}
               className="text-3xl font-black mb-8 text-center"
               >
                LOGIN
               </GradientText>
        
        <form  onSubmit={handleSubmit(async (data) => {
             await login(data);
        })} className="space-y-6">
            <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" {
                ...register("email")
            } 
            className="h-10 bg-base-300 border-base-300 rounded-xl"
            />
            {
            errors.email && 
            <div className='flex gap-2 items-center justify-start'>
                 <CircleAlert className="w-4 h-4"/>   
                 <p className="text-primary-content text-sm">{errors.email.message}</p>
            </div>
            }
            </div>
            <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" {
                ...register("password")
            } 
            className="h-10 bg-base-300 border-base-300 rounded-xl"
            />
            {errors.password && 
                <div className='flex gap-2 items-center justify-start'>
                 <CircleAlert className="w-4 h-4"/>   
                 <p className="text-primary-content text-sm">{errors.password.message} </p>
                </div>
              }
            </div>
            <ClickSpark
               sparkColor="#ffffff"
               sparkSize={12}
               sparkRadius={16}
               sparkCount={10}
               duration={500}
               style={{width:"100%"}}
             >
            <Button type="submit" className="w-full h-12 bg-secondary text-primary-content rounded-xl font-bold " disabled={isSubmitting}>
                {isSubmitting? <Loader2 className="animate-spin" />: "Login"}
            </Button>
             </ClickSpark>
            <div className='text-center '>

            <Link to="/signup" className='text-primary-content'>
                Don't have an account? <span className='hover:text-primary'> Sign Up</span>
            </Link>
            </div>
        </form>
      </div>

    )
}

export default LoginForm
