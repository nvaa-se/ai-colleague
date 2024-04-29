import axios from 'axios'
import mistral from '../config/mistral'

type MistralRole = 'system' | 'user' | 'assistant' | 'tool'

type MistralMessage = {
  role: MistralRole
  content: string
}

export const createCompletion = async (messages: MistralMessage[]) => {
  const axiosOptions = {
    method: 'post',
    url: mistral.baseUrl + '/completions',
    headers: {
      Authorization: 'Bearer ' + mistral.apiKey,
    },
    data: {
      model: mistral.model,
      messages,
      temperature: 0.7,
      top_p: 1,
      max_tokens: 512,
      stream: false,
      safe_prompt: false,
      random_seed: Date.now(),
    },
    timeout: 60000,
  }

  try {
    const result = await axios(axiosOptions)

    return result.data
  } catch (error) {
    console.log('Axios error', error)
  }
}
