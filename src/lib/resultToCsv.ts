import { json2csv } from 'json-2-csv'

export const resultToCsv = (result: Array<Record<string, any>>) => {
  if (result.length === 0) {
    return ''
  }

  return json2csv(result, {
    useDateIso8601Format: true
  })
}
