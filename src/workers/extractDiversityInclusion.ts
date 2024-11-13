import { FlowProducer } from 'bullmq'
import { zodResponseFormat } from 'openai/helpers/zod'
import redis from '../config/redis'
import { DiscordJob, DiscordWorker } from '../lib/DiscordWorker'
import diversityInclusion from '../prompts/followUp/diversityInclusion'

class JobData extends DiscordJob {
  declare data: DiscordJob['data'] & {
    companyName: string
  }
}

const flow = new FlowProducer({ connection: redis })

const extractDiversityInclusion = new DiscordWorker<JobData>(
  'extractDiversityInclusion',
  async (job) => {
    const { companyName } = job.data
    job.sendMessage(`🤖 Hämtar summering av jämställdhetsarbetet...`)

    const childrenValues = await job.getChildrenEntries()

    const base = {
      name: companyName,
      data: { ...job.data, ...childrenValues },
      queueName: 'followUp',
      opts: {
        attempts: 3,
      },
    }

    await flow.add({
      name: companyName,
      queueName: 'checkDB',
      data: {
        ...base.data,
      },
      children: [     
      {
        ...base,
        name: 'DiversityInclusion ' + companyName,
        data: {
          ...base.data,
          apiSubEndpoint: 'DiversityInclusion',
          prompt: diversityInclusion.prompt,
          schema: zodResponseFormat(diversityInclusion.schema, 'DiversityInclusion'),
        },
      }, 
      ],
      opts: {
        attempts: 3,
      },
    })

    job.sendMessage(`🤖 Ställer följdfrågor...`)
  }
)

export default extractDiversityInclusion
