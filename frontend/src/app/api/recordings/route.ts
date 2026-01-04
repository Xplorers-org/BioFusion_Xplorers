import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default-user';

    const dbPath = path.join(process.cwd(), 'data', 'recordings.json');

    if (!existsSync(dbPath)) {
      return NextResponse.json([]);
    }

    const data = await readFile(dbPath, 'utf-8');
    const allRecordings = JSON.parse(data);

    // Filter by userId if needed
    const recordings = allRecordings.filter((rec: any) => rec.userId === userId);

    return NextResponse.json(recordings);

  } catch (error) {
    console.error('Fetch recordings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recordings' },
      { status: 500 }
    );
  }
}
