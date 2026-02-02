import type { AppEnv } from "adapters/shared/env";
import type { IContainer } from "~/application/shared/container.types";

/**
 * DI Container 생성
 *
 * Composition Root에서 호출되어 모든 의존성을 생성하고 주입합니다.
 * Cloudflare Workers 환경에서 사용됩니다.
 *
 * @param env - 애플리케이션 환경 변수
 * @returns IContainer 인터페이스를 구현하는 컨테이너
 */
export const createContainer = (_env: AppEnv): IContainer => {
	// Invoice-Web MVP: Notion 클라이언트 및 서비스 초기화 예정
	// const notionClient = new Client({ auth: _env.NOTION_API_KEY });
	// const invoiceService = createInvoiceService(notionClient, _env);

	return {
		// Invoice-Web MVP services will be injected here
	};
};
