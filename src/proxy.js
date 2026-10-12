import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function proxy(request) {
  return NextResponse.redirect(new URL('/home', request.url))
}
 
