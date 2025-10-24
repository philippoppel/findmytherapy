import { z } from 'zod'

const baseStringArray = z.array(z.string().trim().min(2).max(160))

export const stringArraySchema = baseStringArray.min(1).max(12)
export const languagesArraySchema = z.array(z.string().trim().min(2).max(32)).min(1).max(6)

export const imageUrlSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .refine((value) => value.startsWith('http') || value.startsWith('/'), {
    message: 'Bitte gib eine gültige URL oder einen relativen Pfad an.',
  })

export const optionalUrlSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .refine((value) => /^https?:\/\//.test(value), {
    message: 'Bitte gib eine vollständige URL an.',
  })

export const setcardPayloadSchema = z
  .object({
    displayName: z.string().trim().min(3).max(120),
    title: z.string().trim().min(3).max(160),
    headline: z.string().trim().min(10).max(180),
    approachSummary: z.string().trim().min(30).max(1600),
    experienceSummary: z.string().trim().min(20).max(800),
    services: stringArraySchema,
    profileImageUrl: imageUrlSchema.nullish(),
    videoUrl: optionalUrlSchema.nullish(),
    acceptingClients: z.boolean(),
    yearsExperience: z.number().int().min(0).max(60).nullish(),
    responseTime: z.string().trim().min(3).max(160).nullish(),
    modalities: stringArraySchema,
    specialties: stringArraySchema,
    languages: languagesArraySchema,
    priceMin: z.number().int().min(0).nullish(),
    priceMax: z.number().int().min(0).nullish(),
    availabilityNote: z.string().trim().max(800).nullish(),
    pricingNote: z.string().trim().max(800).nullish(),
    about: z.string().trim().max(2500).nullish(),
    city: z.string().trim().max(120).nullish(),
    country: z.string().trim().length(2).nullish(),
    online: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.priceMin != null && data.priceMax != null && data.priceMin > data.priceMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Der Maximalpreis muss größer oder gleich dem Mindestpreis sein.',
        path: ['priceMax'],
      })
    }
  })

export type SetcardPayload = z.infer<typeof setcardPayloadSchema>

export const sanitizeStringArray = (values: string[]) =>
  Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
    )
  )

export const safeNullableString = (value: string | null | undefined) =>
  typeof value === 'string' && value.trim().length > 0 ? value.trim() : null

export const splitToList = (value: string) =>
  value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

export const joinList = (values: string[]) => values.join('\n')

export const parseCurrencyInput = (value: string): number | null => {
  const normalized = value.trim().replace(',', '.')
  if (!normalized) {
    return null
  }

  const parsed = Number.parseFloat(normalized)
  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return null
  }

  return Math.round(parsed * 100)
}

export const formatCurrencyInput = (value?: number | null) => {
  if (typeof value !== 'number') {
    return ''
  }

  const euros = value / 100
  return Number.isInteger(euros) ? euros.toString() : euros.toFixed(2)
}
