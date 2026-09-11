ALTER TABLE "seo_metadata" ADD COLUMN "global_key" text;--> statement-breakpoint
ALTER TABLE "seo_metadata" ADD COLUMN "site_title" text;--> statement-breakpoint
ALTER TABLE "seo_metadata" ADD COLUMN "site_description" text;--> statement-breakpoint
ALTER TABLE "seo_metadata" ADD COLUMN "site_url" text;--> statement-breakpoint
ALTER TABLE "seo_metadata" ADD COLUMN "twitter_card" text;--> statement-breakpoint
ALTER TABLE "seo_metadata" ADD COLUMN "default_robots" text;--> statement-breakpoint
ALTER TABLE "seo_metadata" ADD COLUMN "default_og_image_media_id" integer;--> statement-breakpoint
ALTER TABLE "seo_metadata" ADD COLUMN "og_title" text;--> statement-breakpoint
ALTER TABLE "seo_metadata" ADD COLUMN "og_description" text;--> statement-breakpoint
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_default_og_image_media_id_media_id_fk" FOREIGN KEY ("default_og_image_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "seo_global_key_idx" ON "seo_metadata" USING btree ("global_key");--> statement-breakpoint
ALTER TABLE "seo_metadata" ADD CONSTRAINT "seo_metadata_global_key_unique" UNIQUE("global_key");