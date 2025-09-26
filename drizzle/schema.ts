// drizzle/schema.ts
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  varchar,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";

// Users table (for Auth.js)
export const users = pgTable("user", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
});

// Accounts table (for Auth.js)
export const accounts = pgTable("account", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).$type<"oauth" | "email">().notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
});

// Sessions table (for Auth.js)
export const sessions = pgTable("session", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().unique(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Verification tokens table (for Auth.js)
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Watched content table
export const watchedContent = pgTable("watched_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  mediaId: integer("mediaId").notNull(), // TMDB ID
  title: varchar("title", { length: 500 }).notNull(),
  posterPath: varchar("poster_path", { length: 500 }),
  backdropPath: varchar("backdrop_path", { length: 500 }),
  overview: text("overview"),
  voteAverage: integer("vote_average"),
  mediaType: varchar("media_type", { length: 10 })
    .$type<"movie" | "tv">()
    .notNull(),
  watchedDate: timestamp("watched_date", { mode: "date" }).notNull(),
  rating: integer("rating"), // 1-10 scale
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// Watchlist table
export const watchlist = pgTable("watchlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("userId", { length: 255 }).references(() => users.id, {
    onDelete: "cascade",
  }),
  mediaId: integer("mediaId").notNull(), // TMDB ID
  title: varchar("title", { length: 500 }).notNull(),
  posterPath: varchar("poster_path", { length: 500 }),
  backdropPath: varchar("backdrop_path", { length: 500 }),
  overview: text("overview"),
  voteAverage: integer("vote_average"),
  mediaType: varchar("media_type", { length: 10 })
    .$type<"movie" | "tv">()
    .notNull(),
  addedAt: timestamp("added_at", { mode: "date" }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
