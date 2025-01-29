# Adding Local LM Studio Model Support to Vercel AI Chatbot

This guide explains how to add local LM Studio model support to the Vercel AI Chatbot template.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Adding Local Model Support](#adding-local-model-support)
- [Database Migration](#database-migration)
- [Testing](#testing)

## Prerequisites

- Node.js 18+ and npm
- Docker for PostgreSQL
- LM Studio installed and running locally
- Git

## Initial Setup

1. Clone the repository and install dependencies:
```bash
# Clone the repository
git clone https://github.com/vercel/ai-chatbot.git
cd ai-chatbot

# Install dependencies
npm install

# Add required packages for local model support
npm install @ai-sdk/openai-compatible
```

## Environment Configuration

1. Create a `.env.local` file in the root directory:
```env
# OpenAI API Key (still needed for DALL-E image generation)
OPENAI_API_KEY=your_openai_key

# Auth Secret (generate using: openssl rand -base64 32)
AUTH_SECRET=your_auth_secret

# PostgreSQL URL
POSTGRES_URL=postgresql://postgres:postgres123@localhost:5432/chatbotDB
```

## Database Setup

1. Start PostgreSQL using Docker:
```bash
docker run -d \
  --name Postgres_server \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=chatbotDB \
  -p 5432:5432 \
  postgres:16
```

2. Update the chat table schema in `lib/db/schema.ts`:
```typescript
export const chat = pgTable('Chat', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title: text('title').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private'),
  modelId: varchar('modelId', { length: 64 }).notNull()  // Add this line
});
```

## Adding Local Model Support

1. Configure Local Models in `lib/ai/models.ts`:
```typescript
export const models: Array<Model> = [
  {
    id: 'qwen2.5-7b-instruct',
    label: 'Qwen 2.5 7B Instruct',
    apiIdentifier: 'qwen2.5-7b-instruct',
    description: 'Local Qwen 2.5 7B model running on LM Studio',
  },
  {
    id: 'gpt-4o',
    label: 'GPT 4o',
    apiIdentifier: 'gpt-4o',
    description: 'OpenAI GPT-4 model',
  }
];

export const LOCAL_MODEL_IDS = ['qwen2.5-7b-instruct'];
```

2. Update `lib/ai/index.ts` to support local models:
```typescript
import { openai } from '@ai-sdk/openai';
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

// Initialize LM Studio client
const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: 'http://localhost:1234/v1',
});

export const customModel = (apiIdentifier: string) => {
  const isLocalModel = LOCAL_MODEL_IDS.includes(apiIdentifier);
  const model = isLocalModel ? lmstudio(apiIdentifier) : openai(apiIdentifier);

  return wrapLanguageModel({
    model,
    middleware: customMiddleware,
  });
};
```

## Database Migration

1. Generate the migration:
```bash
npm run db:generate
```

2. Edit the generated migration file (e.g., `lib/db/migrations/0005_old_meltdown.sql`):
```sql
-- Add modelId column with default value
ALTER TABLE "Chat" ADD COLUMN "modelId" varchar(64) DEFAULT 'gpt-4o';

-- Update existing rows
UPDATE "Chat" SET "modelId" = 'gpt-4o' WHERE "modelId" IS NULL;

-- Make the column NOT NULL after setting defaults
ALTER TABLE "Chat" ALTER COLUMN "modelId" SET NOT NULL;
```

3. Run the migrations:
```bash
npm run db:migrate
npm run db:push
```

## Testing

1. Start LM Studio:
   - Open LM Studio
   - Load your preferred model
   - Start the local server (default port: 1234)

2. Start the development server:
```bash
npm run dev
```

3. Test the integration:
   - Open http://localhost:3000
   - Create a new chat
   - Select a local model from the dropdown
   - Send a message to verify it's using the local model

## Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Verify PostgreSQL is running: `docker ps`
   - Check connection string in `.env.local`
   - Ensure database exists: `chatbotDB`

2. **LM Studio Connection Error**:
   - Verify LM Studio is running and serving on port 1234
   - Check if model is properly loaded in LM Studio
   - Test connection: `curl http://localhost:1234/v1/models`

3. **Migration Issues**:
   - If column already exists: Drop the column and rerun migration
   - If data issues: Backup data before migration
   ```sql
   ALTER TABLE "Chat" DROP COLUMN IF EXISTS "modelId";
   ```

## Additional Notes

- Local models run entirely on your machine, providing privacy and offline capability
- Response times depend on your hardware and the model size
- Memory usage varies based on the model; ensure sufficient RAM
- Consider adding error handling for when LM Studio is not available
- Monitor system resources when running large models

## Next Steps

- Add more local models to the model list
- Implement model switching UI
- Add model-specific prompts
- Implement fallback to OpenAI when local model fails
- Add model performance monitoring
