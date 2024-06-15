import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6, {
        message: "Password charactor must be greater than 6"
    })
})

export type RegisterSchema = z.infer<typeof registerSchema>