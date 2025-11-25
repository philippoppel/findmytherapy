import { prisma } from './prisma';

/**
 * Validiert, dass alle kritischen Datenbanktabellen existieren
 * Wirft einen Fehler bei fehlenden Tabellen
 */
export async function validateDatabaseSchema() {
  const criticalTables = ['User', 'TherapistProfile', 'Match', 'MatchingPreferences'];

  const missingTables: string[] = [];

  for (const table of criticalTables) {
    try {
      // Versuche eine einfache Query auf jede Tabelle
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (prisma as any)[table.charAt(0).toLowerCase() + table.slice(1)].findFirst({
        take: 1,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('does not exist')) {
        missingTables.push(table);
      }
    }
  }

  if (missingTables.length > 0) {
    throw new Error(
      `Kritische Datenbank-Tabellen fehlen: ${missingTables.join(', ')}\n` +
        `Database URL: ${process.env.DATABASE_URL?.substring(0, 30)}...\n` +
        `Bitte führe 'prisma db push' mit der korrekten DATABASE_URL aus.`,
    );
  }

  return true;
}

/**
 * Gibt Informationen über den Datenbank-Status zurück
 */
export async function getDatabaseHealth() {
  try {
    const userCount = await prisma.user.count();
    const therapistCount = await prisma.therapistProfile.count();
    const matchCount = await prisma.match.count();
    const preferencesCount = await prisma.matchingPreferences.count();

    return {
      status: 'healthy',
      connection: 'active',
      database: process.env.DATABASE_URL?.match(/@(.+?):/)?.[1] || 'unknown',
      tables: {
        users: userCount,
        therapists: therapistCount,
        matches: matchCount,
        preferences: preferencesCount,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      connection: 'failed',
      error: error instanceof Error ? error.message : String(error),
      database: process.env.DATABASE_URL?.match(/@(.+?):/)?.[1] || 'unknown',
      timestamp: new Date().toISOString(),
    };
  }
}
