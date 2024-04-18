## NVAA AI colleague

## Data Flow

Some of the following steps will be performed in parallel and most will be asynchronous. If a process is failed it's important to be able to restart it after a new code release so we can iterate on the prompts etc without having to restart the whole process again.

1. Import PDF from URL
2. Parse Text
3. Send text to OpenAI for embeddings
4. Index vector database with embeddings
5. Build query from prompt together with relevant embeddings
6. Send to LLM
7. Verify the results first automatically
8. Verify results in Discord channel
9. Save to Wikidata or other database (not done)

### Get Started

Get an OPENAI_API_KEY from OpenAI and add it to a .env file in the root directory. Run redis locally or add REDIS_HOST and REDIS_PORT into the .env file.

    nvm use
    npm i
    docker compose up -d &
    npm run dev

NOTE: To add a new job to the queue manually you can uncomment the lines in index.ts to create a new downloadPDF job.

### Environment/Secrets

Create a .env file in the root lib and add these tokens/secrets before running the application:

    OPENAI_API_KEY=
    OPENAI_ORG_ID=
    DISCORD_APPLICATION_ID=
    DISCORD_TOKEN=
    DISCORD_SERVER_ID=

### Next steps / Tasks

### Operations

This application is run in Kubernetes and uses FluxCD as CD pipeline. To create secret in the k8s cluster - use this command to transfer your .env file as secret to the application

    kubectl create secret generic env --from-env-file=.env

### License

MIT
