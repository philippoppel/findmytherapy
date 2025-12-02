import { NextRequest, NextResponse } from 'next/server';
import { retrieveBlogImage } from '@/lib/storage';

type RouteParams = { params: Promise<{ therapistId: string; filename: string }> };

// GET - Retrieve a blog image
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const { therapistId, filename } = await context.params;

    const result = await retrieveBlogImage(therapistId, filename);

    if (!result) {
      return NextResponse.json({ error: 'Bild nicht gefunden' }, { status: 404 });
    }

    // Return the image with proper headers
    return new NextResponse(new Uint8Array(result.buffer), {
      headers: {
        'Content-Type': result.mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('[BLOG IMAGE] Error retrieving image:', error);
    return NextResponse.json({ error: 'Fehler beim Laden des Bildes' }, { status: 500 });
  }
}
