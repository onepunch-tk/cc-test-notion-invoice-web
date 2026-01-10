import { pgTable, text, timestamp, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ============================================================================
// Better-auth 필수 테이블
// ============================================================================

/**
 * 사용자 테이블 (Better-auth 필수)
 * 사용자 기본 정보 및 이메일 인증 상태 관리
 */
export const userTable = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	image: text("image"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

/**
 * 세션 테이블 (Better-auth 필수)
 * 사용자 세션 토큰 및 만료 시간 관리
 */
export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id, { onDelete: "cascade" }),
	token: text("token").notNull().unique(),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

/**
 * 계정 테이블 (Better-auth 필수)
 * OAuth 제공자 정보 및 비밀번호 해시 저장
 */
export const accountTable = pgTable("account", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id, { onDelete: "cascade" }),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	expiresAt: timestamp("expires_at", { withTimezone: true }),
	password: text("password"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

/**
 * 인증 토큰 테이블 (Better-auth 필수)
 * 이메일 인증, 비밀번호 재설정 토큰 관리
 */
export const verificationTable = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

/**
 * 2FA 테이블 (Better-auth TOTP 플러그인)
 * TOTP 시크릿 및 백업 코드 저장
 */
export const twoFactorTable = pgTable("two_factor", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => userTable.id, { onDelete: "cascade" }),
	secret: text("secret").notNull(),
	backupCodes: text("backup_codes").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

// ============================================================================
// 애플리케이션 테이블
// ============================================================================

/**
 * 프로필 테이블
 * Better-auth의 user 테이블과 연동하여 추가 정보 저장
 */
export const profilesTable = pgTable("profiles", {
	id: uuid("id")
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => userTable.id, { onDelete: "cascade" }),
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	bio: text("bio"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

// ============================================================================
// 타입 추론
// ============================================================================

export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;

export type Session = typeof sessionTable.$inferSelect;
export type NewSession = typeof sessionTable.$inferInsert;

export type Account = typeof accountTable.$inferSelect;
export type NewAccount = typeof accountTable.$inferInsert;

export type Verification = typeof verificationTable.$inferSelect;
export type NewVerification = typeof verificationTable.$inferInsert;

export type TwoFactor = typeof twoFactorTable.$inferSelect;
export type NewTwoFactor = typeof twoFactorTable.$inferInsert;

export type Profile = typeof profilesTable.$inferSelect;
export type NewProfile = typeof profilesTable.$inferInsert;
