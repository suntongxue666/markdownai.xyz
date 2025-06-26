import { type NextRequest, NextResponse } from 'next/server';

export async function POST() {
  console.log('Received POST request to /api/convert'); // Add logging
  return NextResponse.json({ message: 'POST request received successfully!' }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ message: 'GET request received!' }, { status: 200 });
}
