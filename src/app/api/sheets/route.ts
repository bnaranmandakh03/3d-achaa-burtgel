import { NextRequest, NextResponse } from 'next/server';

const GAS_URL = process.env.GAS_URL ?? '';

async function gasGet(): Promise<unknown> {
  const res = await fetch(`${GAS_URL}?action=get`, { cache: 'no-store' });
  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('json')) {
    const text = await res.text();
    throw new Error(`GAS returned non-JSON (${res.status}): ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function gasPost(body: object): Promise<unknown> {
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body),
  });
  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('json')) {
    const text = await res.text();
    throw new Error(`GAS returned non-JSON (${res.status}): ${text.slice(0, 300)}`);
  }
  return res.json();
}

export async function GET() {
  if (!GAS_URL) return NextResponse.json([]);
  try {
    const data = await gasGet();
    return NextResponse.json(data);
  } catch (err) {
    console.error('GAS GET error:', err);
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  if (!GAS_URL) return NextResponse.json({ ok: false }, { status: 503 });
  try {
    const body = await req.json();
    const data = await gasPost(body);
    return NextResponse.json(data);
  } catch (err) {
    console.error('GAS POST error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 502 });
  }
}
