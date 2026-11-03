import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { safeErrorResponse } from '@/lib/api-helpers';

export async function GET() {
  try {
    const records = await db.siteContent.findMany();
    const map: Record<string, string> = {};
    for (const r of records) {
      map[r.key] = r.value;
    }
    return NextResponse.json(map);
  } catch (error) {
    console.error('Error fetching public site content:', error);
    return safeErrorResponse('Failed to fetch site content', 500);
  }
}