import { NextResponse } from 'next/server';

export function proxy(request) {
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '');

  // Redirect non-www to www (and ensure HTTPS)
  if (host === 'cinenovatv.com') {
    const url = request.nextUrl.clone();
    url.host = 'www.cinenovatv.com';
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  // Redirect HTTP to HTTPS
  if (proto === 'http') {
    const url = request.nextUrl.clone();
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}
