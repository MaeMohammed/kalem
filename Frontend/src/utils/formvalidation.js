import {z} from "zod";

export const signupSchema= z.object({
    username: z.string().min(2, "please enter a username"),
    email: z.string().email("invalid email address"),
    password: z.string().min(8, "password must be at least 8 characters")
})
export const loginSchema= z.object({
    email: z.string().email("invalid email address"),
    password: z.string().min(8, "password must be at least 8 characters")
})
export const channelSchema= z.object({
    name: z.string().min(2, "channel name must be at least 2 characters"),
    description: z.string().optional()
})
export const profileSchema= z.object({
    bio: z.string().min(1, "bio cannot be empty").max(200, "bio must be less than 200 characters").optional()
})