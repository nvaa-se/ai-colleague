# NVAA AI colleague

## Data Flow

Some of the following steps will be performed in parallel and most will be asynchronous. If a process is failed it's important to be able to restart it after a new code release so we can iterate on the prompts etc without having to restart the whole process again.

### onCommand flow
```mermaid
flowchart TB

    0(Discord onCommand)
    A[handleCommandSamtal]
    B(Lookup CustomerID)
    C{Customer Found}
    D1(Reply Not Found)
    D2(Reply found)
    E(Initiate Thread)
    F(Discord — Create Thread)
    G(Redis — Store ThreadID with CustomerID)
    H(Discord — Reply with Customer Card)
    I(Redis — add reply to threadcontext)

    0 --> A --> B --> C --Found--> D2 --> E
    C --Not found--> D1
    E --> F --> G --> H --> I

    %% Discord Style
    style 0 color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style D1 color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style D2 color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style F color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style H color:#FFFFFF, fill:#5865F2, stroke:#5865F2

    %% Redis Style
    style G color:#FFFFFF, stroke:#A41e11, fill:#A41e11
    style I color:#FFFFFF, stroke:#A41e11, fill:#A41e11
```

### onMessage flow
```mermaid
flowchart TB

    0(Discord onMessage)
    A[handleReply]
    B{Redis — Lookup thread-customer connection}
    C[Redis — Save message in thread]
    D[answerReply]
    E[Discord — Reply too old thread]
    

    0 --> A --> B --Found--> C --> D
    B --Not found--> E

    %% Discord Style
    style 0 color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style 0 color:#FFFFFF, fill:#5865F2, stroke:#5865F2

    %% Redis Style
    style B color:#FFFFFF, stroke:#A41e11, fill:#A41e11
    style C color:#FFFFFF, stroke:#A41e11, fill:#A41e11
```

### AI overarching flow
```mermaid
flowchart TB

    0[handleReply]
    A[answerReply]
    B(Discord — sendTyping)
    C(Redis — Lookup thread-customer connection)
    D(Redis — Lookup messages in thread)
    E[Mistral — Summarize Ask]
    F[Mistral - Plan how to answer]
    G[Split Mistral plan into tasks]
    H[Mistral - For each task, generate SQL]
    I{Run SQL against MSSQL}
    J[Mistral - Ask to verify SQL]
    
    K[Join data into prompt with question and plan]
    L[Mistral - Answer Questions with prompt]
    M[Discord Reply answer]
    

    0 --> A --Found--> C --> D --> E --> F --> G --> K --> L --> M
    G --> H --> I --SUCCESS--> K
    I --FAIL--> J --> H
    A --> B --every 8 seconds--> B

    %% Discord Style
    style B color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style M color:#FFFFFF, fill:#5865F2, stroke:#5865F2

    %% Redis Style
    style C color:#FFFFFF, stroke:#A41e11, fill:#A41e11
    style D color:#FFFFFF, stroke:#A41e11, fill:#A41e11

    %% Mistral Style
    style E color:#000000, stroke:#ff4900, fill:#ff7000
    style F color:#000000, stroke:#ff4900, fill:#ff7000
    style H color:#000000, stroke:#ff4900, fill:#ff7000
    style I color:#000000, stroke:#ff4900, fill:#ff7000
    style L color:#000000, stroke:#ff4900, fill:#ff7000
```

## New workflow
1. Find customer based on phone number (workers/handleCall.ts)
2. Reply with customer information (workers/handleReply.ts)

## Get Started

Get an OPENAI_API_KEY from OpenAI and add it to a .env file in the root directory. Run redis locally or add REDIS_HOST and REDIS_PORT into the .env file.

    nvm use # or some other node version manager
    npm i
    docker compose up -d &
    npm run dev

NOTE: To add a new job to the queue manually you can uncomment the lines in index.ts to create a new downloadPDF job.

## Environment/Secrets

Create a .env file in the root lib and add these tokens/secrets before running the application:

    MISTRAL_API_KEY=
    DISCORD_APPLICATION_ID=
    DISCORD_TOKEN=
    DISCORD_SERVER_ID=
    DISCORD_CHANNEL_ID=
    REDIS_HOST=
    REDIS_PORT=
    # REDIS_PASSWORD=

## Next steps / Tasks

## Operations

This application is run in Kubernetes and uses FluxCD as CD pipeline. To create secret in the k8s cluster - use this command to transfer your .env file as secret to the application

    kubectl create secret generic env --from-env-file=.env

## License

MIT
