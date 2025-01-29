-- Add modelId column with default value
ALTER TABLE "Chat" ADD COLUMN "modelId" varchar(64) DEFAULT 'gpt-4o';

-- Update existing rows
UPDATE "Chat" SET "modelId" = 'gpt-4o' WHERE "modelId" IS NULL;

-- Make the column NOT NULL after setting defaults
ALTER TABLE "Chat" ALTER COLUMN "modelId" SET NOT NULL;