import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/cookies";
import routes from "@/constants/routes";
import { isAuthenticatedRoute, isUnAuthenticatedRoute } from "@/lib/utils";
import { NextResponse, type NextRequest } from "next/server";

const redirectTo = (url: string, req: NextRequest) => {
  return NextResponse.redirect(new URL(url, req.url));
};

export async function middleware(req: NextRequest) {  
  const { pathname } = req.nextUrl;  
  const accessToken = req.cookies.get(ACCESS_TOKEN.name)?.value;  
  const refreshToken = req.cookies.get(REFRESH_TOKEN.name)?.value;  

  if (isUnAuthenticatedRoute(pathname) && (accessToken || refreshToken)) {  
    return redirectTo(routes.dashboard, req);  
  }  

  if (isAuthenticatedRoute(pathname) && !accessToken && !refreshToken) {
    return redirectTo(routes.login, req);  
  }  

  return NextResponse.next();  
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
