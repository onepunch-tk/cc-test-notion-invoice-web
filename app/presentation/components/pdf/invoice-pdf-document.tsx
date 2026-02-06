/**
 * InvoicePdfDocument 컴포넌트
 *
 * @react-pdf/renderer를 사용하여 인보이스를 A4 PDF로 렌더링
 * 웹 뷰(invoice-header, invoice-table, invoice-summary)와 동일한 레이아웃
 *
 * 클라이언트 사이드 전용 (Cloudflare Workers Edge Runtime 제한)
 */

import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import type { CompanyInfo } from "~/domain/company/company.types";
import type { Invoice, InvoiceLineItem } from "~/domain/invoice/invoice.types";
import { formatCurrency, formatDate } from "~/presentation/lib/format";
import { pdfStyles } from "./pdf-styles";

interface InvoicePdfDocumentProps {
	invoice: Invoice;
	lineItems: InvoiceLineItem[];
	companyInfo: CompanyInfo;
}

export default function InvoicePdfDocument({
	invoice,
	lineItems,
	companyInfo,
}: InvoicePdfDocumentProps) {
	const sortedItems = [...lineItems].sort(
		(a, b) => a.sort_order - b.sort_order,
	);

	return (
		<Document>
			<Page size="A4" style={pdfStyles.page}>
				{/* Header: Company Info + Invoice Meta */}
				<View style={pdfStyles.header}>
					{/* Company Info (Left) */}
					<View style={pdfStyles.companyInfo}>
						{companyInfo.logo_url && (
							<Image src={companyInfo.logo_url} style={pdfStyles.logo} />
						)}
						<Text style={pdfStyles.companyName}>
							{companyInfo.company_name}
						</Text>
						<Text style={pdfStyles.companyDetail}>
							{companyInfo.company_address}
						</Text>
						<Text style={pdfStyles.companyDetail}>
							{companyInfo.company_email}
						</Text>
						<Text style={pdfStyles.companyDetail}>
							{companyInfo.company_phone}
						</Text>
					</View>

					{/* Invoice Meta (Right) */}
					<View style={pdfStyles.invoiceMeta}>
						<Text style={pdfStyles.invoiceTitle}>INVOICE</Text>
						<Text style={pdfStyles.invoiceNumber}>
							{invoice.invoice_number}
						</Text>
						<View style={{ flexDirection: "row", gap: 4 }}>
							<Text style={pdfStyles.metaLabel}>Issue Date:</Text>
							<Text style={pdfStyles.metaValue}>
								{formatDate(invoice.issue_date)}
							</Text>
						</View>
						<View style={{ flexDirection: "row", gap: 4 }}>
							<Text style={pdfStyles.metaLabel}>Due Date:</Text>
							<Text style={pdfStyles.metaValue}>
								{formatDate(invoice.due_date)}
							</Text>
						</View>
					</View>
				</View>

				{/* Bill To Section */}
				<View style={pdfStyles.billTo}>
					<Text style={pdfStyles.billToLabel}>Bill To</Text>
					<Text style={pdfStyles.clientName}>{invoice.client_name}</Text>
					<Text style={pdfStyles.clientDetail}>{invoice.client_address}</Text>
					<Text style={pdfStyles.clientDetail}>{invoice.client_email}</Text>
				</View>

				{/* Table Section */}
				<View>
					{/* Table Header */}
					<View style={pdfStyles.tableHeader}>
						<View style={pdfStyles.colDescription}>
							<Text style={pdfStyles.tableHeaderText}>Description</Text>
						</View>
						<View style={pdfStyles.colQuantity}>
							<Text style={pdfStyles.tableHeaderRight}>Qty</Text>
						</View>
						<View style={pdfStyles.colUnitPrice}>
							<Text style={pdfStyles.tableHeaderRight}>Unit Price</Text>
						</View>
						<View style={pdfStyles.colTotal}>
							<Text style={pdfStyles.tableHeaderRight}>Total</Text>
						</View>
					</View>

					{/* Table Body */}
					{sortedItems.length === 0 ? (
						<View style={pdfStyles.emptyRow}>
							<Text style={pdfStyles.emptyText}>No items</Text>
						</View>
					) : (
						sortedItems.map((item) => (
							<View key={item.id} style={pdfStyles.tableRow}>
								<View style={pdfStyles.colDescription}>
									<Text style={pdfStyles.tableCell}>{item.description}</Text>
								</View>
								<View style={pdfStyles.colQuantity}>
									<Text style={pdfStyles.tableCellRight}>{item.quantity}</Text>
								</View>
								<View style={pdfStyles.colUnitPrice}>
									<Text style={pdfStyles.tableCellRight}>
										{formatCurrency(item.unit_price, invoice.currency)}
									</Text>
								</View>
								<View style={pdfStyles.colTotal}>
									<Text style={pdfStyles.tableCellRight}>
										{formatCurrency(item.line_total, invoice.currency)}
									</Text>
								</View>
							</View>
						))
					)}
				</View>

				{/* Summary Section */}
				<View style={pdfStyles.summarySection}>
					<View style={pdfStyles.summaryRow}>
						<Text style={pdfStyles.summaryLabel}>Subtotal</Text>
						<Text style={pdfStyles.summaryValue}>
							{formatCurrency(invoice.subtotal, invoice.currency)}
						</Text>
					</View>
					<View style={pdfStyles.summaryRow}>
						<Text style={pdfStyles.summaryLabel}>
							Tax ({invoice.tax_rate}%)
						</Text>
						<Text style={pdfStyles.summaryValue}>
							{formatCurrency(invoice.tax_amount, invoice.currency)}
						</Text>
					</View>
					<View style={pdfStyles.totalRow}>
						<Text style={pdfStyles.totalLabel}>Total</Text>
						<Text style={pdfStyles.totalValue}>
							{formatCurrency(invoice.total_amount, invoice.currency)}
						</Text>
					</View>
				</View>

				{/* Notes Section */}
				{invoice.notes && (
					<View style={pdfStyles.notesSection}>
						<Text style={pdfStyles.notesLabel}>Notes</Text>
						<Text style={pdfStyles.notesText}>{invoice.notes}</Text>
					</View>
				)}
			</Page>
		</Document>
	);
}
