import config from '../config/openai'
import OpenAI from 'openai'

type AIRole = 'system' | 'user' | 'assistant'

type AIMessage = {
  role: AIRole
  content: string
}
const openai = new OpenAI(config)
export const createCompletion = async (
  messages: AIMessage[],
  model = 'gpt-4o'
) => {
  try {
    const stream = await openai.chat.completions.create({
      messages,
      model,
      stream: true,
    })
    let response = ''
    for await (const part of stream) {
      response += part.choices[0]?.delta?.content || ''
    }

    console.log(response)
    return response
  } catch (error) {
    console.error('Error in createCompletion: ', error)
    return error
  }
}
