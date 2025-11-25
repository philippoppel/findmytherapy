import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || 'NOT SET';
  const postgresUrl = process.env.POSTGRES_URL || 'NOT SET';
  const prismaUrl = process.env.PRISMA_DATABASE_URL || 'NOT SET';

  // Mask credentials
  const maskUrl = (url: string) => {
    if (url === 'NOT SET') return url;
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.username}:***@${urlObj.host}${urlObj.pathname}${urlObj.search}`;
    } catch {
      return 'INVALID URL';
    }
  };

  return NextResponse.json({
    DATABASE_URL: maskUrl(dbUrl),
    POSTGRES_URL: maskUrl(postgresUrl),
    PRISMA_DATABASE_URL: maskUrl(prismaUrl),
  });
}
