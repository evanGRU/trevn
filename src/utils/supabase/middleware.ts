// utils/supabase/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function updateSession(request: NextRequest) {
    try {
        const token = request.cookies.get("sb-access-token")?.value;

        if (!token && !request.nextUrl.pathname.startsWith("/login") && !request.nextUrl.pathname.startsWith("/auth")) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    } catch (err) {
        console.error("updateSession error:", err);
        return new NextResponse("Middleware failed", { status: 500 });
    }
}
