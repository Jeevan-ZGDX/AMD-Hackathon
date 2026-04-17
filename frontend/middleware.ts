import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request)

  const url = request.nextUrl.clone()

  // 1. If no session and trying to access dashboard -> redirect to login
  if (!user && url.pathname.startsWith('/dashboard')) {
    if (url.pathname.startsWith('/dashboard/retailer')) {
      return NextResponse.redirect(new URL('/login/retailer', request.url))
    }
    return NextResponse.redirect(new URL('/login/customer', request.url))
  }

  // 2. If session exists, check role for cross-access protection
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile) {
      // Prevent customer from accessing retailer dashboard
      if (profile.role === 'customer' && url.pathname.startsWith('/dashboard/retailer')) {
        return NextResponse.redirect(new URL('/dashboard/customer', request.url))
      }
      // Prevent retailer from accessing customer dashboard
      if (profile.role === 'retailer' && url.pathname.startsWith('/dashboard/customer')) {
        return NextResponse.redirect(new URL('/dashboard/retailer', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
