# NVAA AI colleague

## Data Flow

Some of the following steps will be performed in parallel and most will be asynchronous. If a process is failed it's important to be able to restart it after a new code release so we can iterate on the prompts etc without having to restart the whole process again.

### onCommand flow

```mermaid
flowchart TB
    LD[DISCORD]
    LR[REDIS]

    0(onCommand)
    A[handleCommandSamtal]
    B([Lookup CustomerID])
    C{Customer Found}
    D1([Reply Not Found])
    D2([Reply found])
    E([Initiate Thread])
    F([Create Thread])
    G([Store ThreadID with CustomerID])
    H([Reply with Customer Card])
    I([add reply to threadcontext])

    subgraph LEGEND
        direction TB
        LD
        LR
    end

    0 --> A --> B --> C --Found--> D2 --> E
    C --Not found--> D1
    E --> F --> G --> H --> I

    %% Discord Style
    style LD color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style 0 color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style D1 color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style D2 color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style F color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style H color:#FFFFFF, fill:#5865F2, stroke:#5865F2

    %% Redis Style
    style LR color:#FFFFFF, stroke:#A41e11, fill:#A41e11
    style G color:#FFFFFF, stroke:#A41e11, fill:#A41e11
    style I color:#FFFFFF, stroke:#A41e11, fill:#A41e11
```

### onMessage flow

```mermaid
flowchart TB
    LD[DISCORD]
    LR[REDIS]
    LW[BullMQ Queue/Worker]

    0(onMessage)
    A[handleReply]
    B{Lookup thread-customer connection}
    C([Save message in thread])
    D[summarizeAsk]
    E([Reply too old thread])

    subgraph LEGEND
        direction TB
        LD
        LR
        LW
    end


    0 --> A --> B --Found--> C --> D
    B --Not found--> E

    %% BullMQ Queue Style
    style LW color:#ffffff, fill:#303a4b, stroke:#454b52
    style A color:#ffffff, fill:#303a4b, stroke:#454b52
    style D color:#ffffff, fill:#303a4b, stroke:#454b52

    %% Discord Style
    style LD color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style 0 color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style E color:#FFFFFF, fill:#5865F2, stroke:#5865F2

    %% Redis Style
    style LR color:#FFFFFF, stroke:#A41e11, fill:#A41e11
    style B color:#FFFFFF, stroke:#A41e11, fill:#A41e11
    style C color:#FFFFFF, stroke:#A41e11, fill:#A41e11

```

### AI overarching flow

```mermaid
flowchart TB
    LD[DISCORD]
    LM[MISTRAL]
    LS[MSSQL]
    LR[REDIS]
    LW[BullMQ Queue/Worker]

    0(onMessage)
    A[handleReply]

    B1([fetch thread context])
    B2([take first 2 and last message])
    B3[Ask to summarize]

    C1[Plan how to answer]

    D1([Split Mistral plan into tasks])
    D2[For each task, generate SQL]
    D3{Run SQL against MSSQL}
    D4[Ask to verify, and generate new SQL]

    D5[Join data into prompt with question and plan]
    L[Answer Questions with prompt]
    M[Reply answer]

    NA(["NOT IMPLEMENTED YET"])

    subgraph LEGEND
        direction TB
        LD
        LM
        LS
        LR
        LW
    end

    0 ==> A ==> summarizeAsk ==> planAnswer ==> dataFetcher ==> answerQuestion ==> M
    subgraph summarizeAsk
        direction TB
        B1 --> B2 --> B3
    end
    subgraph planAnswer
        direction TB
        C1
    end
    subgraph dataFetcher
        direction TB
        %%NA
        D1 --> D2 --> D3 --SUCCESS--> D5
        D3 --FAIL--> D4 --> D3
    end
    subgraph answerQuestion
        direction TB
        L
    end


    %% BullMQ Queue Style
    style LW color:#ffffff, fill:#303a4b, stroke:#454b52
    style A color:#ffffff, fill:#303a4b, stroke:#454b52
    style summarizeAsk color:#ffffff, fill:#303a4b, stroke:#454b52
    style planAnswer color:#ffffff, fill:#303a4b, stroke:#454b52
    style dataFetcher color:#ffffff, fill:#303a4b, stroke:#454b52
    style answerQuestion color:#ffffff, fill:#303a4b, stroke:#454b52

    %% Discord Style
    style LD color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style 0 color:#FFFFFF, fill:#5865F2, stroke:#5865F2
    style M color:#FFFFFF, fill:#5865F2, stroke:#5865F2

    %% Redis Style
    style LR color:#FFFFFF, stroke:#A41e11, fill:#A41e11

    %% Not implemented Style
    %% style NA color:#FF0000, fill:#303a4b, stroke:#FF0000, stroke-width:4px, stroke-dasharray: 5, 5

    %% Mistral Style
    style LM color:#000000, stroke:#ff4900, fill:#ff7000
    style B3 color:#000000, stroke:#ff4900, fill:#ff7000
    style C1 color:#000000, stroke:#ff4900, fill:#ff7000
    style D2 color:#000000, stroke:#ff4900, fill:#ff7000
    style D4 color:#000000, stroke:#ff4900, fill:#ff7000
    style L color:#000000, stroke:#ff4900, fill:#ff7000

    %% MSSQL Style
    style LS color:#537F18, fill:#BDD352, stroke:#537F18
    style D3 color:#537F18, fill:#BDD352, stroke:#537F18
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

This application is run in Kubernetes and uses FluxCD as CD pipeline. To create secret in the k8s use this command to transfer your .env file as secret to the application

    kubectl create secret generic env --from-env-file=.env

## License

MIT
