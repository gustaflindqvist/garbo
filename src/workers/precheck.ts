import { FlowProducer } from 'bullmq'
import redis from '../config/redis'
import wikidata from '../prompts/wikidata'
import fiscalYear from '../prompts/followUp/fiscalYear'
import { askPrompt } from '../lib/openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { DiscordJob, DiscordWorker } from '../lib/DiscordWorker'
import diversityInclusions from '../prompts/followUp/diversityInclusions'

class JobData extends DiscordJob {
  declare data: DiscordJob['data'] & {
    cachedMarkdown?: string
    companyName?: string
  }
}

const flow = new FlowProducer({ connection: redis })

const precheck = new DiscordWorker('precheck', async (job: JobData) => {
  try {
    const { cachedMarkdown, ...baseData } = job.data
    const { markdown = cachedMarkdown } = await job.getChildrenEntries()

    const companyName = await askPrompt(
      'What is the name of the company? Respond only with the company name. We will search Wikidata after this name. The following is an extract from a PDF:',
      markdown.substring(0, 5000)
    )

    job.log('Company name: ' + companyName)
    job.setThreadName(companyName)

    const base = {
      queueName: 'followUp',
      data: { ...baseData, companyName },
      opts: {
        attempts: 3,
      },
    }

    job.sendMessage(`🤖 Ställer frågor om basfakta...`)

    job.sendMessage(`🤖 Adding job to flow for company ` + companyName)

    await flow.add({
      name: 'precheck done ' + companyName,
      queueName: 'extractEmissions', // this is where the result from the children will be sent
      data: { ...base.data },
      children: [
        {
          ...base,
          name: 'guessWikidata ' + companyName,
          queueName: 'guessWikidata',
          data: {
            ...base.data,
            schema: zodResponseFormat(wikidata.schema, 'wikidata'),
          },
        },
        {
          ...base,
          name: 'fiscalYear ' + companyName,
          data: {
            ...base.data,
            prompt: fiscalYear.prompt,
            schema: zodResponseFormat(fiscalYear.schema, 'fiscalYear'),
          },
        },
        {
          ...base,
          name: 'diversityInclusions ' + companyName,
          data: {
            ...base.data,
            apiSubEndpoint: 'diversityInclusions',
            prompt: diversityInclusions.prompt,
            schema: zodResponseFormat(diversityInclusions.schema, 'diversityInclusions'),
          },
        }, 
      ],
      opts: {
        attempts: 3,
      },
    }).then(() => {
      job.sendMessage(`🤖 Job added to flow...`)
    }).catch((error) => {
      job.sendMessage(`🤖 Error when adding job to flow: ${error.message}`)
    })
  } catch (error) {
    job.sendMessage(`🤖 Error: ${error.message}`)
  }
})

export default precheck
