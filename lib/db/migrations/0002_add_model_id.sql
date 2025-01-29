-- Add modelId column to Chat table
ALTER TABLE "Chat" ADD COLUMN IF NOT EXISTS "modelId" varchar(64) NOT NULL DEFAULT 'gpt-4o';

-- Update existing rows to have a default value
UPDATE "Chat" SET "modelId" = 'gpt-4o' WHERE "modelId" IS NULL;
