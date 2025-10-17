import { authenticator } from 'otplib';
import Iron from '@hapi/iron';
import { env } from '@mental-health/config';

const SERVICE_NAME = 'Klarthera';

export const generateTotpSecret = () => authenticator.generateSecret();

export const createTotpUri = (secret: string, email: string) =>
  authenticator.keyuri(email, SERVICE_NAME, secret);

export const sealTotpSecret = (secret: string) =>
  Iron.seal(secret, env.NEXTAUTH_SECRET, Iron.defaults);

export const unsealTotpSecret = async (storedSecret: string) => {
  try {
    return await Iron.unseal(storedSecret, env.NEXTAUTH_SECRET, Iron.defaults);
  } catch {
    return storedSecret;
  }
};

export const verifyTotpCode = async (token: string, storedSecret: string) => {
  const normalizedToken = token.replace(/\s+/g, '');

  if (!/^\d{6}$/.test(normalizedToken)) {
    return false;
  }

  const secret = await unsealTotpSecret(storedSecret);
  return authenticator.verify({ token: normalizedToken, secret });
};
