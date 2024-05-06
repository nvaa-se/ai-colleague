import axios from 'axios'
import mistral from '../config/mistral'

type MistralRole = 'system' | 'user' | 'assistant' | 'tool'

type MistralMessage = {
  role: MistralRole
  content: string
}

export const createCompletion = async (
  messages: MistralMessage[],
  json_mode = false,
  max_tokens = 512
) => {
  const data: Record<string, any> = {
    model: mistral.model,
    messages,
    temperature: 0.7,
    top_p: 1,
    max_tokens,
    stream: false,
    safe_prompt: false,
    random_seed: Date.now(),
  }
  if (json_mode) {
    data['response_format'] = { type: 'json_object' }
  }
  const axiosOptions = {
    method: 'post',
    url: mistral.baseUrl + '/completions',
    headers: {
      Authorization: 'Bearer ' + mistral.apiKey,
    },
    data,
    timeout: 60000,
  }

  try {
    const result = await axios(axiosOptions)

    return result.data
  } catch (error) {
    console.log('Axios error', error)
  }
}
