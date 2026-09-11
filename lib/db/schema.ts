import {
  boolean,
  date,
  integer,
  jsonb,
  index,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const media = pgTable(
  "media",
  {
    id: serial("id").primaryKey(),
    filename: text("filename").notNull(),
    originalFilename: text("original_filename").notNull(),
    mimeType: text("mime_type").notNull(),
    size: integer("size").notNull(),
    storageKey: text("storage_key").notNull(),
    url: text("url").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    alt: text("alt").notNull().default(""),
    caption: text("caption").notNull().default(""),
    ...timestamps,
  },
  (table) => [uniqueIndex("media_storage_key_idx").on(table.storageKey)],
);

export const seoMetadata = pgTable(
  "seo_metadata",
  {
    id: serial("id").primaryKey(),
    globalKey: text("global_key"),
    siteTitle: text("site_title"),
    siteDescription: text("site_description"),
    siteUrl: text("site_url"),
    twitterCard: text("twitter_card"),
    defaultRobots: text("default_robots"),
    defaultOgImageMediaId: integer("default_og_image_media_id").references(() => media.id, { onDelete: "set null" }),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    ogTitle: text("og_title"),
    ogDescription: text("og_description"),
    ogImage: text("og_image"),
    canonicalUrl: text("canonical_url"),
    robotsIndex: boolean("robots_index").default(true).notNull(),
    robotsFollow: boolean("robots_follow").default(true).notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("seo_global_key_idx").on(table.globalKey)],
);

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    summary: text("summary").notNull(),
    content: text("content").notNull(),
    imageUrl: text("image_url"),
    mediaId: integer("media_id").references(() => media.id, { onDelete: "set null" }),
    projectUrl: text("project_url"),
    repositoryUrl: text("repository_url"),
    technologies: jsonb("technologies").$type<string[]>().default([]).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoMetadataId: integer("seo_metadata_id").references(() => seoMetadata.id),
    ...timestamps,
  },
  (table) => [uniqueIndex("projects_slug_idx").on(table.slug)],
);

export const experiences = pgTable(
  "experiences",
  {
    id: serial("id").primaryKey(),
    company: text("company").notNull(),
    role: text("role").notNull(),
    summary: text("summary").notNull(),
    content: text("content").notNull(),
    location: text("location"),
    technologies: jsonb("technologies").$type<string[]>().default([]).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    isCurrent: boolean("is_current").default(false).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    ...timestamps,
  },
);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description").notNull().default(""),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("categories_name_idx").on(table.name),
    uniqueIndex("categories_slug_idx").on(table.slug),
  ],
);

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    coverImageUrl: text("cover_image_url"),
    mediaId: integer("media_id").references(() => media.id, { onDelete: "set null" }),
    status: text("status").notNull().default("draft"),
    isPublished: boolean("is_published").default(false).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    seoMetadataId: integer("seo_metadata_id").references(() => seoMetadata.id),
    ...timestamps,
  },
  (table) => [uniqueIndex("posts_slug_idx").on(table.slug)],
);

export const postCategories = pgTable(
  "post_categories",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.postId, table.categoryId] })],
);

export const tags = pgTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("tags_name_idx").on(table.name),
    uniqueIndex("tags_slug_idx").on(table.slug),
  ],
);

export const postTags = pgTable(
  "post_tags",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.postId, table.tagId] })],
);

export const adminUsers = pgTable(
  "admin_users",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("admin_users_email_idx").on(table.email)],
);

export const adminSessions = pgTable(
  "admin_sessions",
  {
    tokenHash: text("token_hash").primaryKey(),
    adminUserId: integer("admin_user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("admin_sessions_token_hash_idx").on(table.tokenHash)],
);

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("unread"),
    ...timestamps,
  },
  (table) => [
    index("contact_messages_status_idx").on(table.status),
    index("contact_messages_created_at_idx").on(table.createdAt),
  ],
);