import { NextResponse } from "next/server";
import { auth } from "./auth";
import { authRoutes, publicRoutes } from "./routes";

export default auth((req) => {
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth;

    const isPublic = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isProfileComplete = req.auth?.user.profileComplete;
    // 添加是否admin和admin route的判定
    const isAdmin = req.auth?.user.role === 'ADMIN';
    const isAdminRoute = nextUrl.pathname.startsWith('/admin');

    // 更新条件添加admin判定, 当admin判定为真，则不会进入下面的补充信息页面isProfileComplete
    if (isPublic || isAdmin) {
        return NextResponse.next();
    }

    // 添加admin路径的保护
    if (isAdminRoute && !isAdmin) {
        return NextResponse.redirect(new URL('/', nextUrl));
    }

    if (isAuthRoute) {
        if(isLoggedIn) {
            return NextResponse.redirect(new URL('/members', nextUrl))
        }
        return NextResponse.next()
    }

    if (!isPublic && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', nextUrl))
    }

    if (isLoggedIn && !isProfileComplete && nextUrl.pathname !== '/complete-profile') {
        return NextResponse.redirect(new URL('/complete-profile', nextUrl))
    }


    return NextResponse.next();
})

// middleware is not going to be applied to anything that's listed inside here
// 更新public中images的无需经过中间件
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)']
}