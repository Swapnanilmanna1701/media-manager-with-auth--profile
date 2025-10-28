import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { entries } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { z } from 'zod';

const entrySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['movie', 'tv_show']),
  genre: z.string().min(1, 'Genre is required'),
  releaseYear: z.number().int().min(1900).max(new Date().getFullYear() + 5),
  rating: z.number().min(0).max(10),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().optional(),
});

// GET - List entries with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const userEntries = await db
      .select()
      .from(entries)
      .where(eq(entries.userId, session.user.id))
      .orderBy(desc(entries.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ data: userEntries, page, limit });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

// POST - Create new entry
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = entrySchema.parse(body);

    const [newEntry] = await db
      .insert(entries)
      .values({
        ...validatedData,
        userId: session.user.id,
      })
      .returning();

    return NextResponse.json({ data: newEntry }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Error creating entry:', error);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
