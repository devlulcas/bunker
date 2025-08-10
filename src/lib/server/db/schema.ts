import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export type User = typeof user.$inferSelect;
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: text('role').$type<'admin'>()
});

export type Session = typeof session.$inferSelect;
export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export type GuestLink = typeof guestLink.$inferSelect;
export const guestLink = sqliteTable('guest_link', {
	id: text('id').primaryKey(),
	username: text('username').notNull(),
	allowedPages: text('allowed_pages').notNull(), // JSON array of allowed page paths
	durationHours: integer('duration_hours').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow(),
	createdBy: text('created_by')
		.notNull()
		.references(() => user.id)
});

export type GuestSession = typeof guestSession.$inferSelect;
export const guestSession = sqliteTable('guest_session', {
	id: text('id').primaryKey(),
	guestLinkId: text('guest_link_id')
		.notNull()
		.references(() => guestLink.id),
	token: text('token').notNull().unique(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().defaultNow()
});
