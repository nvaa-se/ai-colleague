import axios from 'axios'
import mistral from '../config/mistral'
import { generate } from 'csv/.'

type MistralRole = 'system' | 'user' | 'assistant' | 'tool'

type MistralMessage = {
  role: MistralRole
  content: string
}

export const createCompletion = async (
  messages: MistralMessage[],
  json_mode = false,
  max_tokens = 512,
  model = 'mistral-large-latest'
) => {
  const data: Record<string, any> = {
    model,
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
    url: mistral.baseUrl + '/chat/completions',
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
    return error?.response?.data
  }
}


export const createEmbedder = (model = 'mistral-embed') => ({
  generate: async (input: string[]): Promise<number[][]> => {
    const data: Record<string, any> = {
      model,
      input,
    }
    const axiosOptions = {
      method: 'post',
      url: mistral.baseUrl + '/embeddings',
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
      return error?.response?.data
    }
  },
})