import axios, { AxiosResponse } from 'axios'
import mistral from '../config/mistral'
import { runQuery } from './dbAccess'

type MistralRole = 'system' | 'user' | 'assistant' | 'tool'

type MistralMessage = {
  role: MistralRole
  content: string
}

type MistralModels =
  | 'open-mistral-7b'
  | 'mistral-large-latest'
  | 'open-mixtral-8x7b'
  | 'open-mixtral-8x22b'
  | 'mistral-small-latest'
  | 'mistral-medium-latest'
  | 'mistral-large-latest'
type MistralReplyModes = 'text' | 'json' | 'maybeFunction' | 'function'
type MistralCompletionsOptions = {
  replyMode?: MistralReplyModes
  max_tokens?: number
  model?: MistralModels
}

const defaultOptions: MistralCompletionsOptions = {
  replyMode: 'text',
  max_tokens: 512,
  model: 'mistral-large-latest',
}

export const createCompletion = async (
  messages: MistralMessage[],
  options: MistralCompletionsOptions = {}
) => {
  options = { ...defaultOptions, ...options }
  const data: Record<string, any> = {
    model: options.model,
    messages,
    temperature: 0.7,
    top_p: 1,
    max_tokens: options.max_tokens,
    stream: false,
    safe_prompt: false,
    random_seed: Date.now(),
  }
  if (['maybeFunction', 'function'].includes(options.replyMode)) {
    data['tools'] = tools()
    if (options.replyMode === 'function') {
      data['tool_choice'] = 'any' // Tool must be used
    } else {
      data['tool_choice'] = 'auto' // Tool may be used
    }
  }
  if (options.replyMode === 'json') {
    data['response_format'] = { type: 'json_object' }
  }
  const axiosOptions = {
    method: 'post',
    url: mistral.baseUrl + '/completions',
    headers: {
      Authorization: 'Bearer ' + mistral.apiKey,
      'Content-type': 'text/plain',
    },
    data: JSON.stringify(data),
    timeout: 60000,
  }

  let result: AxiosResponse | null = null
  try {
    result = await axios(axiosOptions)
    const tool_calls = result?.data?.choices?.[0]?.message?.tool_calls || []
    if (tool_calls.length > 0) {
      console.log('Tool calls', tool_calls)
      const tool_results = {}
      for (const tool_call of tool_calls) {
        const tool = toolBelt[tool_call.function.name]
        if (tool) {
          const result = await tool(...tool_call.function.arguments)
          tool_results[tool_call.function.name] = result
        }
      }
      result = await createCompletion([
        ...messages,
        {
          role: 'assistant',
          content: JSON.stringify(tool_results),
        },
      ])
    }
    console.log('Mistral result', result.data)
    return result.data
  } catch (error) {
    console.log('RESULT DATA', JSON.stringify(result?.data))
    console.log('Axios error', error)
    return result.data
  }
}

const tools = () => [
  {
    type: 'function',
    function: {
      name: 'exectueTSQL',
      description:
        'Executes a T-SQL query towards the customer database and returns the result',
      parameters: [
        {
          type: 'object',
          properties: {
            sql: {
              type: 'string',
              description: 'The T-SQL query to execute',
            },
          },
          required: ['sql'],
        },
      ],
    },
  },
]

export const toolBelt = {
  exectueTSQL: runQuery,
}
