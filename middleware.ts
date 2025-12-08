import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Routes publiques (pas de protection)
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

    // --- Local environment ---
    if (process.env.NEXT_PUBLIC_APP_ENV === "local") {
        // En local, on ne force pas le cookie
        console.log("Token middleware:");
        return NextResponse.next();
    }

    // --- Préprod / Prod ---
    const token = request.cookies.get("sb-access-token")?.value;

    if (!token) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    console.log("Token middleware:", token);

    return NextResponse.next();
}

// Appliquer le middleware sur toutes les routes sauf ressources statiques/images
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
