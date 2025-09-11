'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function TrackPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Fire and forget; ignore errors for UX
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event: 'page_view',
        path: pathname,
      }),
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}