import type {
	IAuthProvider,
	OAuthSignInResult,
	SignInResult,
	SignUpResult,
} from "~/application/auth/auth.port";
import type { IUser } from "~/domain/user";
import type { BetterAuthInstance } from "./auth.config";

/**
 * Better-auth Provider 구현체
 *
 * IAuthProvider 인터페이스를 Better-auth로 구현합니다.
 */
export const createAuthProviderImpl = (
	auth: BetterAuthInstance,
): IAuthProvider => ({
	async getSession(headers: Headers): Promise<{ user: IUser } | null> {
		const session = await auth.api.getSession({ headers });

		if (!session?.user) {
			return null;
		}

		return {
			user: session.user as IUser,
		};
	},

	async signInWithCredentials(
		email: string,
		password: string,
		headers: Headers,
	): Promise<SignInResult> {
		const { headers: responseHeaders } = await auth.api.signInEmail({
			body: { email, password },
			headers,
			returnHeaders: true,
		});

		const setCookie = responseHeaders?.get("set-cookie");

		return { setCookie };
	},

	async signUpWithCredentials(
		email: string,
		password: string,
		name: string,
		headers: Headers,
	): Promise<SignUpResult> {
		await auth.api.signUpEmail({
			body: { email, password, name },
			headers,
		});

		// Better-auth는 사용자 정보를 바로 반환하지 않으므로 세션에서 가져옵니다
		// 이 시점에서는 이메일 인증이 필요하므로 세션이 없을 수 있습니다
		return {
			user: {
				id: "", // 회원가입 시점에서는 ID를 알 수 없음
				email,
				name,
				emailVerified: false,
				image: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		};
	},

	async signInWithOAuth(
		provider: "github" | "google" | "kakao",
		callbackURL: string,
		headers: Headers,
	): Promise<OAuthSignInResult> {
		const {
			headers: responseHeaders,
			response: { url },
		} = await auth.api.signInSocial({
			body: {
				provider,
				callbackURL,
			},
			headers,
			returnHeaders: true,
		});

		const setCookies: string[] = [];
		for (const cookie of responseHeaders.getSetCookie()) {
			setCookies.push(cookie);
		}

		return {
			redirectUrl: url ?? "",
			setCookies,
		};
	},

	async signOut(headers: Headers): Promise<void> {
		await auth.api.signOut({ headers });
	},

	async changePassword(
		currentPassword: string,
		newPassword: string,
		revokeOtherSessions: boolean,
		headers: Headers,
	): Promise<void> {
		await auth.api.changePassword({
			body: { currentPassword, newPassword, revokeOtherSessions },
			headers,
		});
	},

	async requestPasswordReset(email: string, headers: Headers): Promise<void> {
		await auth.api.requestPasswordReset({
			body: { email },
			headers,
		});
	},

	async resetPassword(
		newPassword: string,
		token: string,
		headers: Headers,
	): Promise<void> {
		await auth.api.resetPassword({
			body: { newPassword, token },
			headers,
		});
	},
});
