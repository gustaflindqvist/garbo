import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<Prisma.Scope2AvgAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    value: z.literal(true).optional(),
    biogenic: z.literal(true).optional(),
    mb: z.literal(true).optional(),
    lb: z.literal(true).optional(),
    metadataId: z.literal(true).optional(),
    emissionsId: z.literal(true).optional(),
  })
  .strict()

export const Scope2AvgAggregateInputObjectSchema = Schema