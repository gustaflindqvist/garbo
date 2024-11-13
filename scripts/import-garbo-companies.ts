import { Prisma } from '@prisma/client'

import garboCompanies from '../companies.json'
import { DATA_ORIGIN, InitialDBState, prisma } from './import'

function getFirstDefinedValue(...values: (string | null | undefined)[]) {
  for (const value of values) {
    if (value && value.length) {
      return value
    }
  }
}

export function getName(company: (typeof garboCompanies)[number]) {
  let name = getFirstDefinedValue(
    company.facit?.companyName,
    company.wikidata?.label,
    company.companyName
  )
  if (!name) {
    throw new Error('name missing for ' + JSON.stringify(company, null, 2))
  }

  return name
}

export function getWikidataId(company: (typeof garboCompanies)[number]) {
  let wikidataId = getFirstDefinedValue(
    company.wikidata?.node,
    company.wikidataId
  )
  if (!wikidataId) {
    throw new Error('wikidataId missing for ' + getName(company))
  }

  return wikidataId
}

export async function importGarboData({
  users: { garbo },
  gicsCodes,
}: InitialDBState) {
  // TODO: properly create metadata for every datapoint
  const metadata = await prisma.metadata.create({
    data: {
      comment: 'Initial import',
      source: 'https://klimatkollen.se',
      updatedAt: new Date(),
      userId: garbo.id,
      dataOrigin: DATA_ORIGIN.garbo,
    },
  })

  async function createEconomy(economy) {
    const currency = economy.currency?.trim()?.toUpperCase() || null

    const { id } = await prisma.economy.create({
      data: {
        turnover: {
          create: {
            value: economy.turnover,
            currency,
            metadataId: metadata.id,
          },
        },
        employees: {
          create: {
            value: economy.employees,
            metadataId: metadata.id,
          },
        },
      },
      select: { id: true },
    })

    return id
  }

  const tCO2e = 'tCO2e'

  async function createEmissionsForYear(
    year: string,
    company: (typeof garboCompanies)[number]
  ) {
    const emissions = company.emissions?.[year]
    if (!emissions) return null

    function createScope3Category(category: number, key: string) {
      return {
        category,
        total: emissions.scope3?.categories?.[key],
        unit: tCO2e,
        metadataId: metadata.id,
      }
    }

    const biogenicEmissions:
      | Prisma.BiogenicEmissionsCreateNestedOneWithoutEmissionsInput
      | undefined = Number.isFinite(emissions.totalBiogenic)
      ? {
          create: {
            total: emissions.totalBiogenic,
            unit: tCO2e,
            metadataId: 1,
          },
        }
      : undefined

    const statedTotalScope3Emissions:
      | Prisma.StatedTotalEmissionsUncheckedCreateNestedOneWithoutScope3Input
      | undefined = Number.isFinite(emissions.scope3?.emissions)
      ? {
          create: {
            total: Number(emissions.scope3?.emissions ?? 0),
            unit: tCO2e,
            metadataId: 1,
          },
        }
      : undefined

    const { id } = await prisma.emissions.create({
      data: {
        biogenicEmissions,
        scope1: {
          create: {
            total: emissions.scope1?.emissions || null,
            unit: tCO2e,
            metadataId: 1,
          },
        },
        scope2: {
          create: {
            mb: emissions.scope2?.mb || null,
            lb: emissions.scope2?.lb || null,
            unknown: emissions.scope2?.emissions || null,
            unit: tCO2e,
            metadataId: 1,
          },
        },

        // TODO: handle import for scope1And2
        // TODO: Add scope1And2 to the API response and calculations if it exists. Ignore if scope 1 and scope 2 have been added separately.
        scope3: {
          create: {
            statedTotalEmissions: statedTotalScope3Emissions,
            categories: {
              createMany: {
                data: [
                  '1_purchasedGoods',
                  '2_capitalGoods',
                  '3_fuelAndEnergyRelatedActivities',
                  '4_upstreamTransportationAndDistribution',
                  '5_wasteGeneratedInOperations',
                  '6_businessTravel',
                  '7_employeeCommuting',
                  '8_upstreamLeasedAssets',
                  '9_downstreamTransportationAndDistribution',
                  '10_processingOfSoldProducts',
                  '11_useOfSoldProducts',
                  '12_endOfLifeTreatmentOfSoldProducts',
                  '13_downstreamLeasedAssets',
                  '14_franchises',
                  '15_investments',
                  '16_other',
                ].map((key) =>
                  createScope3Category(parseInt(key.split('_')?.[0]), key)
                ),
              },
            },
            metadataId: 1,
          },
        },
      },
      select: {
        id: true,
      },
    })

    return id
  }

  // IMPORT
  for (const company of garboCompanies) {
    const subIndustryCode = company.industryGics?.subIndustry?.code
    const gicsCode = subIndustryCode
      ? gicsCodes[subIndustryCode]?.subIndustryCode
      : undefined
    console.log(gicsCode, getName(company))

    const years = [
      ...new Set([
        ...Object.keys(company.baseFacts ?? {}),
        ...Object.keys(company.emissions ?? {}),
      ]),
    ]

    const added = await prisma.company.create({
      select: { wikidataId: true },
      data: {
        name: getName(company),
        description: company.description,
        wikidataId: getWikidataId(company),
        industry: gicsCode
          ? {
              create: {
                gicsSubIndustryCode: gicsCode,
                metadataId: metadata.id,
              },
            }
          : undefined,
        initiatives: Array.isArray(company.initiatives)
          ? {
              createMany: {
                data: company.initiatives.map(
                  (initiative: (typeof company.initiatives)[number]) => ({
                    title: initiative.title,
                    description: initiative.description,
                    year: initiative.year,
                    scope: Array.isArray(initiative.scope)
                      ? initiative.scope.join(',')
                      : initiative.scope,
                    metadataId: metadata.id,
                  })
                ),
              },
            }
          : undefined,
        goals: Array.isArray(company.goals)
          ? {
              createMany: {
                data: company.goals.map(
                  (goal: (typeof company.goals)[number]) => ({
                    description: goal.description,
                    year: goal.year?.toString() || null,
                    target: goal.target,
                    baseYear: goal.baseYear,
                    metadataId: metadata.id,
                  })
                ),
              },
            }
          : undefined,
          diversityInclusions: Array.isArray(company.diversityInclusions)
          ? {
              createMany: {
                data: company.diversityInclusions.map(
                  (diversityInclusion: (typeof company.diversityInclusions)[number]) => ({
                    description: diversityInclusion.description,
                    year: diversityInclusion.year?.toString() || null,
                    value: diversityInclusion.value || null,
                    metadataId: metadata.id,
                  })
                ),
              },
            }
          : undefined,

        reportingPeriods:
          company.baseFacts || company.emissions
            ? {
                createMany: {
                  data: await Promise.all(
                    years.map(async (year) => {
                      const {
                        turnover,
                        employees,
                        unit: currency,
                      } = company.baseFacts?.[year] ?? {
                        turnover: null,
                        employees: null,
                        unit: null,
                      }
                      return {
                        startDate: new Date(`${year}-01-01`),
                        endDate: new Date(`${year}-12-31`),
                        economyId: await createEconomy({
                          turnover: turnover ? parseFloat(turnover) : null,
                          employees,
                          currency: currency || null,
                        }),
                        emissionsId: await createEmissionsForYear(
                          year,
                          company
                        ),
                        metadataId: metadata.id,
                      }
                    })
                  ),
                },
              }
            : undefined,
      },
    })
  }
}
