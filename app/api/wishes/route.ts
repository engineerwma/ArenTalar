// app/api/wishes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, timestamp } = body;

    await sql`
      INSERT INTO wishes (timestamp, message)
      VALUES (${timestamp || new Date().toISOString()}, ${message})
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'Your wish has been sent! Thank you!' 
    });
    
  } catch (error) {
    console.error('Error saving wish:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send wish' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await sql`
      SELECT id, timestamp, message 
      FROM wishes 
      ORDER BY timestamp DESC
    `;
    
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error reading wishes:', error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
