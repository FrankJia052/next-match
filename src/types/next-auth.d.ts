import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth"

declare module 'next-auth' {
    interface User {
        profileComplete: boolean;
        // 重点
        role: Role
    }

    interface Session {
        user: {
            profileComplete: boolean;
            // 重点
            role: Role;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        profileCompelete: boolean,
        // 重点
        role: Role
    }
}