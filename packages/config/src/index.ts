import { z } from 'zod';

const sanitizeEnvValue = (value: string | undefined): string | undefined => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return trimmed;
  }

  return trimmed.replace(/^['"]+|['"]+$/g, '');
};

const sanitizeProcessEnv = (env: NodeJS.ProcessEnv): Record<string, string | undefined> => {
  return Object.entries(env).reduce<Record<string, string | undefined>>((acc, [key, value]) => {
    const sanitized = sanitizeEnvValue(value);
    if (sanitized !== undefined) {
      acc[key] = sanitized;
    }
    return acc;
  }, {});
};

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  EMAIL_FROM: z.string().email('EMAIL_FROM must be a valid email'),
  EMAIL_PROVIDER_API_KEY: z.string().min(1, 'EMAIL_PROVIDER_API_KEY is required'),
  EMAIL_SMTP_HOST: z.string().min(1, 'EMAIL_SMTP_HOST is required').default('localhost'),
  EMAIL_SMTP_PORT: z.coerce.number().positive('EMAIL_SMTP_PORT must be positive').default(1025),
  EMAIL_SMTP_USER: z.string().optional().default(''),
  EMAIL_SMTP_PASS: z.string().optional().default(''),
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'STRIPE_PUBLISHABLE_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
  STRIPE_CONNECT_CLIENT_ID: z.string().min(1, 'STRIPE_CONNECT_CLIENT_ID is required'),
  STRIPE_PRICE_LISTING_MONTHLY: z.string().min(1, 'STRIPE_PRICE_LISTING_MONTHLY is required'),
  STRIPE_PRICE_LISTING_YEARLY: z.string().min(1, 'STRIPE_PRICE_LISTING_YEARLY is required'),
  STRIPE_TAX_ENABLED: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
  S3_ENDPOINT: z.string().url('S3_ENDPOINT must be a valid URL'),
  S3_REGION: z.string().min(1, 'S3_REGION is required'),
  S3_BUCKET: z.string().min(1, 'S3_BUCKET is required'),
  S3_ACCESS_KEY_ID: z.string().min(1, 'S3_ACCESS_KEY_ID is required'),
  S3_SECRET_ACCESS_KEY: z.string().min(1, 'S3_SECRET_ACCESS_KEY is required'),
  APP_BASE_URL: z.string().url('APP_BASE_URL must be a valid URL'),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

const toBoolean = (value: string | undefined): boolean =>
  value === 'true' || value === '1';

const buildFallbackEnvInput = (
  sanitizedEnv: Record<string, string | undefined>,
  nodeEnv: string
) => ({
  NODE_ENV: nodeEnv,
  DATABASE_URL:
    sanitizedEnv.DATABASE_URL ?? 'postgresql://postgres:password@localhost:5432/mental_health_dev',
  REDIS_URL: sanitizedEnv.REDIS_URL ?? 'redis://localhost:6379',
  NEXTAUTH_URL: sanitizedEnv.NEXTAUTH_URL ?? 'http://localhost:3000',
  NEXTAUTH_SECRET:
    sanitizedEnv.NEXTAUTH_SECRET ?? 'development-nextauth-secret-please-change-me',
  EMAIL_FROM: sanitizedEnv.EMAIL_FROM ?? 'noreply@mental-health-platform.test',
  EMAIL_PROVIDER_API_KEY: sanitizedEnv.EMAIL_PROVIDER_API_KEY ?? 'test-email-api-key',
  EMAIL_SMTP_HOST: sanitizedEnv.EMAIL_SMTP_HOST ?? 'localhost',
  EMAIL_SMTP_PORT: sanitizedEnv.EMAIL_SMTP_PORT ?? '1025',
  EMAIL_SMTP_USER: sanitizedEnv.EMAIL_SMTP_USER ?? '',
  EMAIL_SMTP_PASS: sanitizedEnv.EMAIL_SMTP_PASS ?? '',
  STRIPE_SECRET_KEY: sanitizedEnv.STRIPE_SECRET_KEY ?? 'sk_test_dummy',
  STRIPE_PUBLISHABLE_KEY: sanitizedEnv.STRIPE_PUBLISHABLE_KEY ?? 'pk_test_dummy',
  STRIPE_WEBHOOK_SECRET: sanitizedEnv.STRIPE_WEBHOOK_SECRET ?? 'whsec_test_dummy',
  STRIPE_CONNECT_CLIENT_ID: sanitizedEnv.STRIPE_CONNECT_CLIENT_ID ?? 'ca_test_dummy',
  STRIPE_PRICE_LISTING_MONTHLY:
    sanitizedEnv.STRIPE_PRICE_LISTING_MONTHLY ?? 'price_listing_monthly_test',
  STRIPE_PRICE_LISTING_YEARLY:
    sanitizedEnv.STRIPE_PRICE_LISTING_YEARLY ?? 'price_listing_yearly_test',
  STRIPE_TAX_ENABLED: sanitizedEnv.STRIPE_TAX_ENABLED ?? 'false',
  S3_ENDPOINT: sanitizedEnv.S3_ENDPOINT ?? 'http://localhost:9000',
  S3_REGION: sanitizedEnv.S3_REGION ?? 'eu-central-1',
  S3_BUCKET: sanitizedEnv.S3_BUCKET ?? 'mental-health-platform',
  S3_ACCESS_KEY_ID: sanitizedEnv.S3_ACCESS_KEY_ID ?? 'minio',
  S3_SECRET_ACCESS_KEY: sanitizedEnv.S3_SECRET_ACCESS_KEY ?? 'minio-secret',
  APP_BASE_URL: sanitizedEnv.APP_BASE_URL ?? 'http://localhost:3000',
});

export const loadEnv = (): Env => {
  if (cachedEnv) {
    return cachedEnv;
  }

  const sanitizedEnv = sanitizeProcessEnv(process.env);
  const parsed = envSchema.safeParse(sanitizedEnv);

  if (!parsed.success) {
    const formattedErrors = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`Invalid environment configuration:\n${formattedErrors}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
};

export const env = (() => {
  try {
    return loadEnv();
  } catch (error) {
    const sanitizedEnv = sanitizeProcessEnv(process.env);
    const nodeEnv = sanitizedEnv.NODE_ENV ?? 'development';
    const nextPhase = sanitizedEnv.NEXT_PHASE ?? '';
    const allowIncompleteEnv = toBoolean(sanitizedEnv.ALLOW_INCOMPLETE_ENV);
    const isBuildPhase =
      nextPhase === 'phase-production-build' || nextPhase === 'phase-development-build';

    if (nodeEnv !== 'production' || isBuildPhase || allowIncompleteEnv) {
      const reason =
        nodeEnv !== 'production'
          ? '[config] Environment not fully configured yet:'
          : isBuildPhase
              ? '[config] NEXT_PHASE indicates build step – using fallback environment values:'
              : '[config] ALLOW_INCOMPLETE_ENV=1 detected – using fallback environment values:';
      console.warn(reason, (error as Error).message);

      return envSchema.parse(buildFallbackEnvInput(sanitizedEnv, nodeEnv));
    }

    throw error;
  }
})();

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
