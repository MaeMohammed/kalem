import React from 'react'
import { Card } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useAuthStore } from '../../stores/useAuthStore'
import { Link, useNavigate } from 'react-router-dom'
import { Loader } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '@/utils/formvalidation'

const SignupForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(signupSchema)
    })
    const navigate = useNavigate()
    const { signup, isLoading } = useAuthStore();
    return (
        <Card className="mx-auto mt-10 p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
            <form onSubmit={handleSubmit(async (data) => {
                const res = await signup(data); 
                if(res) navigate("/login")
            })} className="space-y-4">
                <div className="space-y-1">
                    <Label>Username</Label>
                    <Input type="text" {...register("username")} />
                    {errors.username && <p className="text-red-700 text-sm">{errors.username.message}</p>}
                </div>
                <div className="space-y-1">
                    <Label>Email</Label>
                    <Input type="email" {...register("email")} />
                    {errors.email && <p className="text-red-700 text-sm">{errors.email.message}</p>}
                </div>
                <div className="space-y-1">
                    <Label>Password</Label>
                    <Input type="password" {...register("password")} />
                    {errors.password && <p className="text-red-700 text-sm">{errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader className='animate-spin' /> : "Sign Up"}
                </Button>
                <div className='text-center '>

                    <Link to="/login">
                        Already have an account? Login
                    </Link>
                </div>
            </form>
        </Card>
    )
}

export default SignupForm
