import { NextResponse } from 'next/server';
import { fetchAllVisitors } from '@/lib/visitor-data';

// This forces the route to be dynamic, preventing it from being cached.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const visitors = await fetchAllVisitors();
    return NextResponse.json(visitors);
  } catch (error) {
    console.error('Failed to fetch visitors:', error);
    // In a real app, you might want more sophisticated logging.
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
