/**
 * PDF 스타일시트 단위 테스트
 */

import { pdfStyles } from "~/presentation/components/pdf/pdf-styles";

describe("pdfStyles", () => {
	it("page 스타일이 A4 사이즈에 맞는 여백을 가진다", () => {
		expect(pdfStyles.page).toBeDefined();
		expect(pdfStyles.page.padding).toBeDefined();
		expect(pdfStyles.page.fontFamily).toBeDefined();
	});

	it("header 섹션 스타일이 row 방향이다", () => {
		expect(pdfStyles.header).toBeDefined();
		expect(pdfStyles.header.flexDirection).toBe("row");
		expect(pdfStyles.header.justifyContent).toBe("space-between");
	});

	it("companyInfo 스타일이 존재한다", () => {
		expect(pdfStyles.companyInfo).toBeDefined();
	});

	it("invoiceMeta 스타일이 우측 정렬이다", () => {
		expect(pdfStyles.invoiceMeta).toBeDefined();
		expect(pdfStyles.invoiceMeta.alignItems).toBe("flex-end");
	});

	it("billTo 섹션 스타일이 존재한다", () => {
		expect(pdfStyles.billTo).toBeDefined();
	});

	it("table 관련 스타일이 존재한다", () => {
		expect(pdfStyles.tableHeader).toBeDefined();
		expect(pdfStyles.tableRow).toBeDefined();
		expect(pdfStyles.tableCell).toBeDefined();
	});

	it("tableHeader는 배경색을 가진다", () => {
		expect(pdfStyles.tableHeader.backgroundColor).toBeDefined();
	});

	it("summary 섹션 스타일이 우측 정렬이다", () => {
		expect(pdfStyles.summarySection).toBeDefined();
		expect(pdfStyles.summarySection.alignItems).toBe("flex-end");
	});

	it("summaryRow 스타일이 row 방향이다", () => {
		expect(pdfStyles.summaryRow).toBeDefined();
		expect(pdfStyles.summaryRow.flexDirection).toBe("row");
	});

	it("totalRow 스타일이 상단 border를 가진다", () => {
		expect(pdfStyles.totalRow).toBeDefined();
		expect(pdfStyles.totalRow.borderTopWidth).toBeDefined();
	});

	it("열 너비 비율 스타일이 존재한다", () => {
		expect(pdfStyles.colDescription).toBeDefined();
		expect(pdfStyles.colQuantity).toBeDefined();
		expect(pdfStyles.colUnitPrice).toBeDefined();
		expect(pdfStyles.colTotal).toBeDefined();
	});

	it("notes 섹션 스타일이 존재한다", () => {
		expect(pdfStyles.notesSection).toBeDefined();
	});

	it("logo 스타일이 존재한다", () => {
		expect(pdfStyles.logo).toBeDefined();
		expect(pdfStyles.logo.maxHeight).toBeDefined();
	});

	it("INVOICE 제목 스타일이 충분한 크기를 가진다", () => {
		expect(pdfStyles.invoiceTitle).toBeDefined();
		expect(pdfStyles.invoiceTitle.fontSize).toBeGreaterThanOrEqual(20);
	});
});
