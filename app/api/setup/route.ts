// app/api/setup/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create RSVPs table
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP NOT NULL,
        attending BOOLEAN NOT NULL,
        name VARCHAR(255) NOT NULL,
        guests TEXT,
        song_request TEXT,
        traveling BOOLEAN NOT NULL,
        travel_from TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create Wishes table
    await sql`
      CREATE TABLE IF NOT EXISTS wishes (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    return NextResponse.json({ success: true, message: 'Tables created successfully' });
  } catch (error) {
    console.error('Error creating tables:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
