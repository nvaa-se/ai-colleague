import { Worker, Job } from 'bullmq'
import redis from '../config/redis'
import { ChromaClient } from 'chromadb'
import { indexDocuments } from '../queues'
import chromadb from '../config/chromadb'
import { createEmbedder } from '../services/mistral'
import { v4 as uuidv4 } from 'uuid'


class JobData extends Job {
  data: {
    documents: string[]
    collectionName: string
  }
}

const worker = new Worker(
  'indexDocuments',
  async (job: JobData) => {
    const client = new ChromaClient(chromadb)

    const { documents, collectionName } = job.data

    job.log('Indexing ' + documents.length + ' documents')

    const embedder = createEmbedder()

    try {
      const collection = await client.getOrCreateCollection({
        name: collectionName,
        embeddingFunction: embedder,
      })

      const ids = documents.map((p, i) => uuidv4())
      const metadatas = documents.map((p, i) => ({
        created_at: new Date().toISOString(),
      }))
      await collection.add({
        ids,
        metadatas,
        documents,
      })
      job.log(`✅ Sparad i vektordatabasen`)

      return ids
    } catch (error) {
      job.log(
        `❌ Ett fel uppstod när vektordatabasen skulle nås: ${error}`
      )
      throw error
    }
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker
