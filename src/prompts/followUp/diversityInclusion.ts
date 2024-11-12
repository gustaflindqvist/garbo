import { z } from 'zod'

export const schema = z.object({
    diversityInclusion: z.object({
        summary: z.string(),
        metrics: z.array(
          z.object({
            metric: z.string(),
            value: z.number(),
          })
        ),
      }),
    })

export const prompt = `
    Extract a summary of ABB's diversity and inclusion efforts and metrics from the text.

    The summary should include a brief description of the company's commitment to diversity and inclusion and any notable initiatives or achievements.

    The metrics should list key statistics related to diversity and inclusion, such as the percentage of female employees, the number of women in leadership positions, or other relevant metrics.

    ** LANGUAGE: WRITE IN SWEDISH. If text is in english, translate to Swedish **

    Example:
\`\`\`json
{
    "diversityAndInclusion": [
        {
            "summary": "Brief description of the company's diversity and inclusion efforts",
            "metrics": [
                {
                "year": 2021,
                "description": "Andel kvinnliga anställda",
                "value": 50
                },
                {
                "year": 2021,
                "metric": "Antal kvinnor i ledande positioner",
                "value": 10
                },
                {
                "metric": "Annat relevant mått på mångfald",
                "value": 10
                }
            ]
        }
    ]
}
\`\`\`
`

export default { schema, prompt }
