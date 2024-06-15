import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, {
        message: "Password charactor must be greater than 6"
    })
})

export type LoginSchema = z.infer<typeof loginSchema>