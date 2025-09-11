import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type DailyRecord = {
  pageViews: number;
  events: {
    instrumentAdded: number;
  };
  instrumentCounts: Record<string, number>;
  pages: Record<string, number>;
};

type AnalyticsStore = {
  daily: Record<string, DailyRecord>;
  lastUpdated: string | null;
};

const dataFile = path.resolve(process.cwd(), 'src', 'data', 'analytics.json');

async function readAnalytics(): Promise<AnalyticsStore> {
  try {
    const json = await fs.readFile(dataFile, 'utf8');
    const data = JSON.parse(json);
    // Basic shape guard
    if (!data || typeof data !== 'object' || !data.daily) {
      return { daily: {}, lastUpdated: null };
    }
    return data as AnalyticsStore;
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      return { daily: {}, lastUpdated: null };
    }
    throw err;
  }
}

async function writeAnalytics(store: AnalyticsStore) {
  await fs.writeFile(dataFile, JSON.stringify(store, null, 2), 'utf8');
}

function todayKeyUTC() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function ensureDay(store: AnalyticsStore, dayKey: string) {
  if (!store.daily[dayKey]) {
    store.daily[dayKey] = {
      pageViews: 0,
      events: { instrumentAdded: 0 },
      instrumentCounts: {},
      pages: {}
    };
  }
  return store.daily[dayKey];
}

export async function POST(req: Request) {
  try {
    const { event, path: pathname, instrument } = (await req.json().catch(() => ({}))) as {
      event?: 'page_view' | 'instrument_add';
      path?: string;
      instrument?: string;
    };

    if (!event || (event !== 'page_view' && event !== 'instrument_add')) {
      return NextResponse.json({ ok: false, error: 'Invalid or missing event' }, { status: 400 });
    }

    const store = await readAnalytics();
    const dayKey = todayKeyUTC();
    const day = ensureDay(store, dayKey);

    if (event === 'page_view') {
      day.pageViews += 1;
      if (pathname) {
        day.pages[pathname] = (day.pages[pathname] || 0) + 1;
      }
    } else if (event === 'instrument_add') {
      day.events.instrumentAdded += 1;
      if (instrument) {
        day.instrumentCounts[instrument] = (day.instrumentCounts[instrument] || 0) + 1;
      }
    }

    store.lastUpdated = new Date().toISOString();
    await writeAnalytics(store);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed to track analytics' }, { status: 500 });
  }
}

// Optional GET handler for quick health/debug
export async function GET() {
  try {
    const store = await readAnalytics();
    return NextResponse.json({ ok: true, data: store });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed to read analytics' }, { status: 500 });
  }
}