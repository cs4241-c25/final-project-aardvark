// app/api/admin/route.ts
import { NextResponse } from 'next/server';
import { Consensi } from '@/lib/datalayer'


export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received data:', data);

    const consensi = new Consensi();
    await consensi.saveConsensus(data);
    return NextResponse.json({ consensusData: data });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}
