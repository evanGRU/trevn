import { NextResponse, type NextRequest } from "next/server";

export function updateSession(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("sb-access-token")?.value;

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

    if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/:path*",
};
