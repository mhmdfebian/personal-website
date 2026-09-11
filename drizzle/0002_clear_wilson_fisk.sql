ALTER TABLE "experiences" ADD COLUMN "technologies" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "display_order" integer DEFAULT 0 NOT NULL;