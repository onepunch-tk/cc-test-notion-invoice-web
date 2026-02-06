/**
 * PDF 스타일시트 정의
 *
 * @react-pdf/renderer StyleSheet를 사용하여 A4 사이즈 PDF 스타일 정의
 * 웹 뷰(invoice-header, invoice-table, invoice-summary)와 일관된 레이아웃
 */

import { StyleSheet } from "@react-pdf/renderer";

const COLORS = {
	primary: "#1a1a1a",
	secondary: "#6b7280",
	border: "#e5e7eb",
	headerBg: "#f9fafb",
	white: "#ffffff",
};

export const pdfStyles = StyleSheet.create({
	// Page
	page: {
		padding: 40,
		fontSize: 10,
		fontFamily: "Helvetica",
		color: COLORS.primary,
		backgroundColor: COLORS.white,
	},

	// Header Section
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 24,
	},
	companyInfo: {
		flexDirection: "column",
		gap: 4,
	},
	logo: {
		maxHeight: 48,
		maxWidth: 120,
		objectFit: "contain",
		marginBottom: 8,
	},
	companyName: {
		fontSize: 14,
		fontFamily: "Helvetica-Bold",
		marginBottom: 2,
	},
	companyDetail: {
		fontSize: 9,
		color: COLORS.secondary,
	},
	invoiceMeta: {
		alignItems: "flex-end",
		gap: 2,
	},
	invoiceTitle: {
		fontSize: 24,
		fontFamily: "Helvetica-Bold",
		marginBottom: 4,
	},
	invoiceNumber: {
		fontSize: 11,
		fontFamily: "Helvetica-Bold",
	},
	metaLabel: {
		fontSize: 9,
		color: COLORS.secondary,
	},
	metaValue: {
		fontSize: 9,
		color: COLORS.primary,
	},

	// Bill To Section
	billTo: {
		borderTopWidth: 1,
		borderTopColor: COLORS.border,
		paddingTop: 16,
		marginBottom: 24,
	},
	billToLabel: {
		fontSize: 9,
		fontFamily: "Helvetica-Bold",
		color: COLORS.secondary,
		marginBottom: 8,
	},
	clientName: {
		fontSize: 11,
		fontFamily: "Helvetica-Bold",
		marginBottom: 2,
	},
	clientDetail: {
		fontSize: 9,
		color: COLORS.secondary,
	},

	// Table Section
	tableHeader: {
		flexDirection: "row",
		backgroundColor: COLORS.headerBg,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
		paddingVertical: 8,
		paddingHorizontal: 8,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
		paddingVertical: 8,
		paddingHorizontal: 8,
	},
	tableCell: {
		fontSize: 9,
	},
	tableHeaderText: {
		fontSize: 9,
		fontFamily: "Helvetica-Bold",
		color: COLORS.secondary,
	},
	tableCellRight: {
		fontSize: 9,
		textAlign: "right",
	},
	tableHeaderRight: {
		fontSize: 9,
		fontFamily: "Helvetica-Bold",
		color: COLORS.secondary,
		textAlign: "right",
	},
	emptyRow: {
		flexDirection: "row",
		paddingVertical: 12,
		justifyContent: "center",
	},
	emptyText: {
		fontSize: 9,
		color: COLORS.secondary,
		textAlign: "center",
	},

	// Column widths
	colDescription: {
		width: "45%",
	},
	colQuantity: {
		width: "15%",
		textAlign: "right",
	},
	colUnitPrice: {
		width: "20%",
		textAlign: "right",
	},
	colTotal: {
		width: "20%",
		textAlign: "right",
	},

	// Summary Section
	summarySection: {
		marginTop: 24,
		alignItems: "flex-end",
	},
	summaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: 200,
		marginBottom: 4,
	},
	summaryLabel: {
		fontSize: 9,
		color: COLORS.secondary,
	},
	summaryValue: {
		fontSize: 9,
		textAlign: "right",
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: 200,
		borderTopWidth: 1,
		borderTopColor: COLORS.border,
		paddingTop: 8,
		marginTop: 4,
	},
	totalLabel: {
		fontSize: 11,
		fontFamily: "Helvetica-Bold",
	},
	totalValue: {
		fontSize: 11,
		fontFamily: "Helvetica-Bold",
		textAlign: "right",
	},

	// Notes Section
	notesSection: {
		marginTop: 32,
		paddingTop: 16,
		borderTopWidth: 1,
		borderTopColor: COLORS.border,
	},
	notesLabel: {
		fontSize: 9,
		fontFamily: "Helvetica-Bold",
		color: COLORS.secondary,
		marginBottom: 4,
	},
	notesText: {
		fontSize: 9,
		color: COLORS.secondary,
		lineHeight: 1.5,
	},

	// Footer
	footer: {
		position: "absolute",
		bottom: 30,
		left: 40,
		right: 40,
		textAlign: "center",
		fontSize: 8,
		color: COLORS.secondary,
	},
});
