import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { storeBlogImage, initializeBlogImagesStorage } from '@/lib/storage';

// POST - Upload a blog image
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    // Get therapist profile
    const therapist = await prisma.therapistProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapeutenprofil nicht gefunden' }, { status: 404 });
    }

    // Initialize storage
    await initializeBlogImagesStorage();

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Keine Datei hochgeladen' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Store the image
    const result = await storeBlogImage(
      buffer,
      file.name,
      file.type,
      therapist.id
    );

    return NextResponse.json({
      success: true,
      image: result,
    });
  } catch (error) {
    console.error('[BLOG IMAGE UPLOAD] Error:', error);
    const message = error instanceof Error ? error.message : 'Fehler beim Hochladen des Bildes';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
