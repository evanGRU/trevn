import { NextResponse, type NextRequest } from "next/server";

export function updateSession(request: NextRequest) {
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

    const token = request.cookies.get("sb-access-token")?.value;

    if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";

        if (process.env.NEXT_PUBLIC_APP_ENV === "local") {
            url.protocol = "http:";
            url.hostname = "localhost";
        }

        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/:path*",
};