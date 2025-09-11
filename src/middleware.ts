import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BLOCKED_REGEXPS = [
  /^\/.*\.map$/i,
  /^\/.*\.env(?:\..*)?$/i,
  /^\/\.?git(?:\/|$)/i,
  /^\/\.?svn(?:\/|$)/i,
  /^\/\.?hg(?:\/|$)/i,
  /^\/.*\.(log|sql|sqlite|bak|old|ini|cfg|config)$/i,
  /^\/next\.config\.(js|ts|mjs)$/i,
  /^\/tsconfig\.json$/i,
  /^\/package(?:-lock)?\.json$/i,
  /^\/(yarn\.lock|pnpm-lock\.yaml|bun\.lockb?)$/i,
];

export function middleware(req: NextRequest) {
  const { nextUrl, headers } = req;
  const pathname = nextUrl.pathname;


  // Block path traversal attempts
  if (pathname.includes('..')) {
    return new NextResponse('Not found', { status: 404 });
  }

  // Block access to sensitive files and sourcemaps anywhere
  if (BLOCKED_REGEXPS.some((rx) => rx.test(pathname))) {
    return new NextResponse('Not found', { status: 404 });
  }

  // Enforce HTTPS in production environments behind proxies
  const proto = headers.get('x-forwarded-proto');
  const host = headers.get('host') || '';
  const isLocalhost =
    host.startsWith('localhost') || host.startsWith('127.0.0.1');
  if (proto === 'http' && !isLocalhost) {
    const url = nextUrl.clone();
    url.protocol = 'https:';
    return NextResponse.redirect(url, 308);
  }

  // Admin UI removed: redirect any /admin or /admin/* requests to home
  if (pathname.startsWith('/admin')) {
    const url = nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all paths so we can catch .map, dotfiles, and config files anywhere
  matcher: '/:path*',
};