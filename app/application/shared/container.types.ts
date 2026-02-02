/**
 * DI Container 인터페이스
 *
 * Presentation 레이어에서 Infrastructure 의존성을 제거하기 위한 추상화
 * Application과 Domain 레이어만 노출합니다.
 *
 * Invoice-Web MVP: Notion API 기반 서비스가 추가될 예정
 */
export interface IContainer {
	// Invoice-Web MVP services will be added here:
	// invoiceService: InvoiceService;
	// notionClient: NotionClient;
}
