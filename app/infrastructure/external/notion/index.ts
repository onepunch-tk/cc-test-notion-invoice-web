/**
 * Notion Infrastructure Layer Barrel Export
 */

export { createCachedCompanyRepository } from "./cached-company.repository";
export { createCachedInvoiceRepository } from "./cached-invoice.repository";
export {
	createNotionCompanyRepository,
	type NotionCompanyRepositoryConfig,
} from "./company.repository.impl";
export {
	createNotionInvoiceRepository,
	type NotionInvoiceRepositoryConfig,
} from "./invoice.repository.impl";
export { createNotionClient, type NotionClientConfig } from "./notion-client";
export {
	getDate,
	getEmail,
	getNumber,
	getPhoneNumber,
	getRichText,
	getSelect,
	getTitleText,
	getUrl,
	mapNotionPageToCompanyInfo,
	mapNotionPageToInvoice,
	mapNotionPageToLineItem,
} from "./notion.mapper";
export {
	isDateProperty,
	isEmailProperty,
	isNumberProperty,
	isPageObjectResponse,
	isPhoneNumberProperty,
	isRichTextProperty,
	isSelectProperty,
	isTitleProperty,
	isUrlProperty,
	type NotionDatabaseIds,
} from "./notion.types";
