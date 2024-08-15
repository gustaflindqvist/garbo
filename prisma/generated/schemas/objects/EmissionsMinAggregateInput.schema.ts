import { z } from 'zod'

import type { Prisma } from '@prisma/client'

const Schema: z.ZodType<Prisma.EmissionsMinAggregateInputType> = z
  .object({
    id: z.literal(true).optional(),
    fiscalYearId: z.literal(true).optional(),
    scope1Id: z.literal(true).optional(),
    scope2Id: z.literal(true).optional(),
    scope3Id: z.literal(true).optional(),
  })
  .strict()

export const EmissionsMinAggregateInputObjectSchema = Schema