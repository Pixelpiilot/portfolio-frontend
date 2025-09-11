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

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, delta: number) {
  const nd = new Date(d);
  nd.setUTCDate(nd.getUTCDate() + delta);
  return nd;
}

function clampRange(fromKey: string, toKey: string) {
  return { fromKey, toKey };
}

function aggregateTop(mapArr: Array<Record<string, number>>, topN = 10) {
  const agg: Record<string, number> = {};
  for (const m of mapArr) {
    for (const [k, v] of Object.entries(m)) {
      agg[k] = (agg[k] || 0) + v;
    }
  }
  return Object.entries(agg)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name, count]) => ({ name, count }));
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const range = url.searchParams.get('range'); // '7d' | '30d' | '90d'
    const fromParam = url.searchParams.get('from'); // YYYY-MM-DD
    const toParam = url.searchParams.get('to'); // YYYY-MM-DD

    const store = await readAnalytics();

    // Resolve date range
    const today = new Date();
    const todayKey = toDateKey(today);

    let fromKey: string;
    let toKey: string;

    if (fromParam && toParam) {
      fromKey = fromParam;
      toKey = toParam;
    } else {
      const days = range === '90d' ? 90 : range === '30d' ? 30 : 7;
      const fromDate = addDays(new Date(`${todayKey}T00:00:00.000Z`), -(days - 1));
      fromKey = toDateKey(fromDate);
      toKey = todayKey;
    }

    ({ fromKey, toKey } = clampRange(fromKey, toKey));

    // Collect keys in range (inclusive)
    const allKeys = Object.keys(store.daily).sort(); // ascending
    const keysInRange = allKeys.filter((k) => k >= fromKey && k <= toKey);

    // Build daily series
    const daily = keysInRange.map((k) => {
      const rec = store.daily[k];
      return {
        date: k,
        pageViews: rec?.pageViews ?? 0,
        instrumentAdded: rec?.events?.instrumentAdded ?? 0
      };
    });

    // Totals
    const totals = daily.reduce(
      (acc, d) => {
        acc.pageViews += d.pageViews;
        acc.instrumentAdded += d.instrumentAdded;
        return acc;
      },
      { pageViews: 0, instrumentAdded: 0 }
    );

    // Top instruments and pages in range
    const instrMaps = keysInRange.map((k) => store.daily[k]?.instrumentCounts ?? {});
    const pageMaps = keysInRange.map((k) => store.daily[k]?.pages ?? {});
    const topInstruments = aggregateTop(instrMaps, 10);
    const topPages = aggregateTop(pageMaps, 10);

    const result = {
      range: { from: fromKey, to: toKey },
      daily,
      totals,
      topInstruments,
      topPages,
      lastUpdated: store.lastUpdated
    };

    return NextResponse.json({ ok: true, data: result });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed to summarize analytics' }, { status: 500 });
  }
}