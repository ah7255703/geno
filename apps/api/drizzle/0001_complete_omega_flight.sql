ALTER TABLE "articles" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb NOT NULL;