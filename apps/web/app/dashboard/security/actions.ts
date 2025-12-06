'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRoles } from '@/lib/auth-guards';
import {
  createTotpUri,
  generateTotpSecret,
  sealTotpSecret,
  verifyTotpCode,
} from '@/lib/totp';

const ALLOWED_ROLES: import('@/lib/prisma').UserRole[] = ['THERAPIST', 'ADMIN'];

export const startTotpSetup = async () => {
  const session = await requireRoles(ALLOWED_ROLES);
  const secret = generateTotpSecret();
  const otpauthUrl = createTotpUri(secret, session.user.email ?? '');

  return { secret, otpauthUrl };
};

export const enableTotp = async (secret: string, token: string) => {
  const session = await requireRoles(ALLOWED_ROLES);

  if (!secret || !token) {
    return { ok: false, error: 'missing' as const };
  }

  const isValid = await verifyTotpCode(token, secret);

  if (!isValid) {
    return { ok: false, error: 'invalid' as const };
  }

  const sealedSecret = await sealTotpSecret(secret);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFASecret: sealedSecret,
    },
  });

  revalidatePath('/dashboard/security');
  return { ok: true } as const;
};

export const disableTotp = async () => {
  const session = await requireRoles(ALLOWED_ROLES);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twoFASecret: null,
    },
  });

  revalidatePath('/dashboard/security');
  return { ok: true } as const;
};
