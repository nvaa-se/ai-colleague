import { createObjectCsvStringifier } from 'csv-writer'

export const resultToCsv = (result: Array<Record<string, any>>) => {
  if (result.length === 0) {
    return ''
  }

  const keys = Object.keys(result[0])
  const header = keys.map((key) => ({ id: key, title: key }))
  const csvStringifier = createObjectCsvStringifier({
    header,
  })

  return (
    csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(result)
  )
}
