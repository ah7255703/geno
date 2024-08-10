DO $$ BEGIN
 CREATE TYPE "public"."creation_method" AS ENUM('email-password', 'social', 'email-only');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."theme" AS ENUM('light', 'dark', 'system');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."supported_providers" AS ENUM('linkedin', 'github', 'twitter', 'facebook', 'telegraph');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_token" (
	"id" serial NOT NULL,
	"token" varchar(256) NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "verification_token_token_id_pk" PRIMARY KEY("token","id"),
	CONSTRAINT "verification_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"password" varchar(256),
	"creation_method" "creation_method" DEFAULT 'email-password' NOT NULL,
	"verified_email_at" timestamp,
	"verified_email" boolean DEFAULT false NOT NULL,
	"image_file_id" varchar,
	"theme" "theme" DEFAULT 'system' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "social_accounts" (
	"id" serial NOT NULL,
	"user_id" uuid NOT NULL,
	"provider_account_id" text NOT NULL,
	"token_expiry" timestamp,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"provider" "supported_providers" NOT NULL,
	"account_data" jsonb DEFAULT 'null'::jsonb,
	CONSTRAINT "social_accounts_id_provider_provider_account_id_pk" PRIMARY KEY("id","provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "black_listed_refresh_tokens" (
	"id" serial NOT NULL,
	"token" varchar(256) NOT NULL,
	CONSTRAINT "black_listed_refresh_tokens_token_id_pk" PRIMARY KEY("token","id"),
	CONSTRAINT "black_listed_refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"key" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"size" varchar NOT NULL,
	"bucket" varchar NOT NULL,
	"user_id" uuid,
	CONSTRAINT "files_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "article_files" (
	"article_id" uuid NOT NULL,
	"file_id" varchar NOT NULL,
	"show_order" serial NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	CONSTRAINT "article_files_article_id_file_id_pk" PRIMARY KEY("article_id","file_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "article_publish" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_url" varchar NOT NULL,
	"published_provider" "supported_providers" NOT NULL,
	"published_provider_id" varchar NOT NULL,
	"published_provider_data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"content" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"user_id" uuid,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verification_token" ADD CONSTRAINT "verification_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_image_file_id_files_key_fk" FOREIGN KEY ("image_file_id") REFERENCES "public"."files"("key") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "article_files" ADD CONSTRAINT "article_files_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "article_files" ADD CONSTRAINT "article_files_file_id_files_key_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("key") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "article_publish" ADD CONSTRAINT "article_publish_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articles" ADD CONSTRAINT "articles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
