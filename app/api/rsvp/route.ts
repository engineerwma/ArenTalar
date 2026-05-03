// app/api/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attending, name, guests, song, traveling, travelFrom, timestamp } = body;

    // Insert into database
    await sql`
      INSERT INTO rsvps (timestamp, attending, name, guests, song_request, traveling, travel_from)
      VALUES (
        ${timestamp || new Date().toISOString()}, 
        ${attending}, 
        ${name}, 
        ${guests.join(', ')}, 
        ${song || ''}, 
        ${traveling}, 
        ${travelFrom || ''}
      )
    `;

    return NextResponse.json({ 
      success: true, 
      message: 'RSVP saved successfully! Thank you!' 
    });
    
  } catch (error) {
    console.error('Error saving RSVP:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to save RSVP. Please try again.' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await sql`
      SELECT id, timestamp, attending, name, guests, song_request, traveling, travel_from 
      FROM rsvps 
      ORDER BY timestamp DESC
    `;
    
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error reading RSVPs:', error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
