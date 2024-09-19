import { z } from "zod";
import { calculateAge } from "../util";

export const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6, {
        message: "Password charactor must be greater than 6"
    })
})

// 添加注册表收集更多信息的定义
export const profileSchema = z.object({
    gender: z.string().min(1),
    description: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    // 添加了验证，只有18岁以上才能注册
    dateOfBirth: z.string().min(1, {
        message: 'Date of birth is required'
    }).refine(dateString => {
        const age = calculateAge(new Date(dateString))
        return age >= 18
    }, {
        message: 'You must be at least 18 to use this app'
    })
})

// 这行代码通过合并 registerSchema 和 profileSchema，创建了一个新的验证模式 combinedRegisterSchema。
export const combinedRegisterSchema = registerSchema.and(profileSchema);

// 让RegisterSchema同时包含profileSchema和registerSchema的属性定义
export type RegisterSchema = z.infer<typeof registerSchema & typeof profileSchema>