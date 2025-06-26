import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('--- Simplified POST request received ---');
  return NextResponse.json({ message: 'Simplified POST API is working!' }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ message: 'GET request received!' }, { status: 200 });
}
