import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { entries } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
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
  director: z.string().min(1, 'Director is required'),
  budget: z.number().optional(),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute'),
  location: z.string().optional(),
});

// GET - Get single entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const entryId = parseInt(id);

    const [entry] = await db
      .select()
      .from(entries)
      .where(and(eq(entries.id, entryId), eq(entries.userId, session.user.id)));

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ data: entry });
  } catch (error) {
    console.error('Error fetching entry:', error);
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}

// PUT - Update entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const entryId = parseInt(id);
    const body = await request.json();
    const validatedData = entrySchema.parse(body);

    const [updatedEntry] = await db
      .update(entries)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(and(eq(entries.id, entryId), eq(entries.userId, session.user.id)))
      .returning();

    if (!updatedEntry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updatedEntry });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Error updating entry:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

// DELETE - Delete entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const entryId = parseInt(id);

    const [deletedEntry] = await db
      .delete(entries)
      .where(and(eq(entries.id, entryId), eq(entries.userId, session.user.id)))
      .returning();

    if (!deletedEntry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ data: deletedEntry });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}