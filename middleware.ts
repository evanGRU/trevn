import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isPublicRoute =
        pathname === "/" ||
        pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.match(/\.(png|jpg|jpeg|gif|svg|webp)$/);

    if (isPublicRoute) {
        return NextResponse.next();
    }

    if (process.env.NEXT_PUBLIC_APP_ENV === "local") {
        return NextResponse.next();
    }

    const token = request.cookies.get("sb-access-token")?.value;

    // if (!token) {
    //     const url = request.nextUrl.clone();
    //     url.pathname = "/login";
    //     return NextResponse.redirect(url);
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
