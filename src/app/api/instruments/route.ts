import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Instrument = {
  risk: number;
  return: number;
  std: number;
  risk_level: string;
  category: string;
};

type InstrumentsMap = Record<string, Instrument>;

const dataFile = path.resolve(process.cwd(), 'src', 'data', 'instruments.json');

async function readInstruments(): Promise<InstrumentsMap> {
  try {
    const json = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(json);
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      // If file missing, initialize empty map
      return {};
    }
    throw err;
  }
}

async function writeInstruments(data: InstrumentsMap) {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  try {
    const instruments = await readInstruments();
    return NextResponse.json({ ok: true, data: instruments });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed to read instruments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, data } = body as { name?: string; data?: Instrument };

    if (!name || !data) {
      return NextResponse.json({ ok: false, error: 'name and data are required' }, { status: 400 });
    }

    const instruments = await readInstruments();
    if (instruments[name]) {
      return NextResponse.json({ ok: false, error: 'Instrument already exists' }, { status: 409 });
    }

    instruments[name] = data;
    await writeInstruments(instruments);
    return NextResponse.json({ ok: true, data: instruments });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed to add instrument' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { name, data } = body as { name?: string; data?: Partial<Instrument> };

    if (!name || !data) {
      return NextResponse.json({ ok: false, error: 'name and data are required' }, { status: 400 });
    }

    const instruments = await readInstruments();
    if (!instruments[name]) {
      return NextResponse.json({ ok: false, error: 'Instrument not found' }, { status: 404 });
    }

    instruments[name] = { ...instruments[name], ...data } as Instrument;
    await writeInstruments(instruments);
    return NextResponse.json({ ok: true, data: instruments[name] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed to update instrument' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // Support name from query or body
    const url = new URL(req.url);
    const qName = url.searchParams.get('name');
    let name = qName as string | null;

    if (!name) {
      try {
        const body = await req.json().catch(() => ({}));
        name = (body?.name as string) || null;
      } catch {
        // ignore
      }
    }

    if (!name) {
      return NextResponse.json({ ok: false, error: 'name is required' }, { status: 400 });
    }

    const instruments = await readInstruments();
    if (!instruments[name]) {
      return NextResponse.json({ ok: false, error: 'Instrument not found' }, { status: 404 });
    }

    delete instruments[name];
    await writeInstruments(instruments);
    return NextResponse.json({ ok: true, data: { name } });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Failed to delete instrument' }, { status: 500 });
  }
}