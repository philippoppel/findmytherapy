import { authenticator } from 'otplib';

process.env.DATABASE_URL ??= 'postgresql://postgres:password@localhost:5432/test_db';
process.env.REDIS_URL ??= 'redis://localhost:6379';
process.env.NEXTAUTH_URL ??= 'http://localhost:3000';
process.env.NEXTAUTH_SECRET ??= 'test-nextauth-secret-please-change-this-123456';
process.env.EMAIL_FROM ??= 'demo@klarthera.test';
process.env.EMAIL_PROVIDER_API_KEY ??= 'test-email-api-key';
process.env.EMAIL_SMTP_HOST ??= 'localhost';
process.env.EMAIL_SMTP_PORT ??= '1025';
process.env.EMAIL_SMTP_USER ??= '';
process.env.EMAIL_SMTP_PASS ??= '';
process.env.STRIPE_SECRET_KEY ??= 'sk_test_placeholder';
process.env.STRIPE_PUBLISHABLE_KEY ??= 'pk_test_placeholder';
process.env.STRIPE_WEBHOOK_SECRET ??= 'whsec_test_placeholder';
process.env.STRIPE_CONNECT_CLIENT_ID ??= 'ca_test_placeholder';
process.env.STRIPE_PRICE_LISTING_MONTHLY ??= 'price_monthly';
process.env.STRIPE_PRICE_LISTING_YEARLY ??= 'price_yearly';
process.env.STRIPE_TAX_ENABLED ??= 'false';
process.env.S3_ENDPOINT ??= 'http://localhost:9000';
process.env.S3_REGION ??= 'eu-central-1';
process.env.S3_BUCKET ??= 'klarthera-demo';
process.env.S3_ACCESS_KEY_ID ??= 'minio';
process.env.S3_SECRET_ACCESS_KEY ??= 'minio-secret';
process.env.APP_BASE_URL ??= 'http://localhost:3000';

const {
  createTotpUri,
  generateTotpSecret,
  sealTotpSecret,
  unsealTotpSecret,
  verifyTotpCode,
} = require('./totp') as typeof import('./totp');

describe('totp helpers', () => {
  const fixedDate = new Date('2024-01-01T00:00:00Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('generates a secret and builds an otpauth uri for the email', () => {
    const secret = generateTotpSecret();
    expect(typeof secret).toBe('string');
    expect(secret.length).toBeGreaterThan(8);

    const uri = createTotpUri(secret, 'pilot@example.com');
    expect(uri).toContain(secret);
    expect(uri).toContain('Klarthera:pilot%40example.com');
  });

  it('seals and unseals secrets transparently', async () => {
    const original = 'KVKXI4KW';
    const sealed = await sealTotpSecret(original);

    expect(sealed).not.toEqual(original);
    await expect(unsealTotpSecret(sealed)).resolves.toEqual(original);
  });

  it('validates a correct time-based token whether stored sealed or raw', async () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const token = authenticator.generate(secret);

    await expect(verifyTotpCode(token, secret)).resolves.toBe(true);

    const sealed = await sealTotpSecret(secret);
    await expect(verifyTotpCode(token, sealed)).resolves.toBe(true);
  });

  it('rejects malformed or incorrect tokens', async () => {
    const secret = 'JBSWY3DPEHPK3PXP';
    const token = authenticator.generate(secret);

    await expect(verifyTotpCode('abc', secret)).resolves.toBe(false);
    await expect(verifyTotpCode('12345', secret)).resolves.toBe(false);
    await expect(verifyTotpCode(token.replace(/\d/, '9'), secret)).resolves.toBe(false);
  });
});
