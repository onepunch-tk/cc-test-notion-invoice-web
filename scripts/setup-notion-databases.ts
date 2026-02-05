/**
 * Notion Database Setup Script
 *
 * Task 003-A: Invoice, Line Item 데이터베이스를 Notion API로 생성합니다.
 *
 * 사전 요구사항:
 * 1. Notion Integration 생성 (https://www.notion.so/my-integrations)
 * 2. Invoice System 페이지에 Integration 연결 (Share → Invite)
 * 3. .env 파일에 NOTION_API_KEY 및 NOTION_PARENT_PAGE_ID 설정
 *
 * 실행:
 * bun run scripts/setup-notion-databases.ts
 */

import { Client } from "@notionhq/client";
import type { CreateDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

// Type alias for database properties
type DatabaseProperties = CreateDatabaseParameters["properties"];

// ============================================================================
// Configuration
// ============================================================================

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const PARENT_PAGE_ID = process.env.NOTION_PARENT_PAGE_ID;
const EXISTING_COMPANY_DB_ID = process.env.NOTION_COMPANY_DATABASE_ID;

if (!NOTION_API_KEY) {
	console.error("Error: NOTION_API_KEY is not set in .env file");
	process.exit(1);
}

if (!PARENT_PAGE_ID) {
	console.error("Error: NOTION_PARENT_PAGE_ID is not set in .env file");
	console.error("This should be the ID of your Invoice System page in Notion");
	process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

// ============================================================================
// Database Schemas (PRD 기반)
// ============================================================================

/**
 * Invoice Database Properties
 * PRD Data Model의 Invoice 스키마를 Notion API 형식으로 변환
 */
const invoiceProperties: DatabaseProperties = {
	// Title (필수) - invoice_id를 Title로 사용
	invoice_id: {
		title: {},
	},
	// Text properties
	invoice_number: {
		rich_text: {},
	},
	client_name: {
		rich_text: {},
	},
	client_address: {
		rich_text: {},
	},
	notes: {
		rich_text: {},
	},
	// Email property
	client_email: {
		email: {},
	},
	// Date properties
	issue_date: {
		date: {},
	},
	due_date: {
		date: {},
	},
	created_at: {
		date: {},
	},
	// Select property
	status: {
		select: {
			options: [
				{ name: "Draft", color: "gray" as const },
				{ name: "Sent", color: "blue" as const },
				{ name: "Paid", color: "green" as const },
				{ name: "Overdue", color: "red" as const },
			],
		},
	},
	currency: {
		select: {
			options: [
				{ name: "KRW", color: "yellow" as const },
				{ name: "USD", color: "green" as const },
				{ name: "EUR", color: "blue" as const },
			],
		},
	},
	// Number properties
	subtotal: {
		number: {
			format: "number" as const,
		},
	},
	tax_rate: {
		number: {
			format: "percent" as const,
		},
	},
	tax_amount: {
		number: {
			format: "number" as const,
		},
	},
	total_amount: {
		number: {
			format: "number" as const,
		},
	},
};

/**
 * Line Item Database Properties
 * PRD Data Model의 InvoiceLineItem 스키마를 Notion API 형식으로 변환
 * Note: invoice relation은 Invoice DB 생성 후 추가
 */
const lineItemPropertiesBase: DatabaseProperties = {
	// Title (필수) - description을 Title로 사용
	description: {
		title: {},
	},
	// Number properties
	quantity: {
		number: {
			format: "number" as const,
		},
	},
	unit_price: {
		number: {
			format: "number" as const,
		},
	},
	sort_order: {
		number: {
			format: "number" as const,
		},
	},
	// Formula property - quantity * unit_price
	line_total: {
		formula: {
			expression: 'prop("quantity") * prop("unit_price")',
		},
	},
};

// ============================================================================
// Database Creation Functions
// ============================================================================

/**
 * Invoice 데이터베이스 생성
 */
const createInvoiceDatabase = async (parentPageId: string): Promise<string> => {
	console.log("\n📦 Creating Invoice Database...");

	const response = await notion.databases.create({
		parent: {
			type: "page_id",
			page_id: parentPageId,
		},
		title: [
			{
				type: "text",
				text: {
					content: "Invoice",
				},
			},
		],
		properties: invoiceProperties,
	});

	console.log("✅ Invoice Database created successfully");
	console.log(`   ID: ${response.id}`);

	return response.id;
};

/**
 * Line Item 데이터베이스 생성 (Invoice와 Relation 연결)
 */
const createLineItemDatabase = async (
	parentPageId: string,
	invoiceDatabaseId: string,
): Promise<string> => {
	console.log("\n📦 Creating Line Item Database...");

	// Relation property 추가
	const lineItemProperties: DatabaseProperties = {
		...lineItemPropertiesBase,
		invoice: {
			relation: {
				database_id: invoiceDatabaseId,
				single_property: {},
			},
		},
	};

	const response = await notion.databases.create({
		parent: {
			type: "page_id",
			page_id: parentPageId,
		},
		title: [
			{
				type: "text",
				text: {
					content: "Line Item",
				},
			},
		],
		properties: lineItemProperties,
	});

	console.log("✅ Line Item Database created successfully");
	console.log(`   ID: ${response.id}`);

	return response.id;
};

/**
 * Company 데이터베이스 검증
 */
const verifyCompanyDatabase = async (
	databaseId: string,
): Promise<{ valid: boolean; missing: string[] }> => {
	console.log("\n🔍 Verifying Company Database...");

	const requiredProperties = [
		"company_name",
		"company_address",
		"company_email",
		"company_phone",
		"logo_url",
		"tax_id",
	];

	const database = await notion.databases.retrieve({
		database_id: databaseId,
	});

	const existingProperties = Object.keys(database.properties);
	const missingProperties = requiredProperties.filter(
		(prop) => !existingProperties.includes(prop),
	);

	if (missingProperties.length === 0) {
		console.log("✅ Company Database verification passed");
		console.log(`   All ${requiredProperties.length} properties exist`);
		return { valid: true, missing: [] };
	}

	console.log("⚠️ Company Database verification failed");
	console.log(`   Missing properties: ${missingProperties.join(", ")}`);
	return { valid: false, missing: missingProperties };
};

// ============================================================================
// Main Execution
// ============================================================================

const main = async (): Promise<void> => {
	console.log("====================================================");
	console.log("  Notion Database Setup Script");
	console.log("  Task 003-A: Invoice, Line Item 데이터베이스 생성");
	console.log("====================================================");

	console.log(`\nParent Page ID: ${PARENT_PAGE_ID}`);

	// 1. Company 데이터베이스 검증 (있는 경우)
	if (EXISTING_COMPANY_DB_ID) {
		const { valid, missing } = await verifyCompanyDatabase(
			EXISTING_COMPANY_DB_ID,
		);
		if (!valid) {
			console.log("\n⚠️ Warning: Company Database is missing properties.");
			console.log("   Please add the following properties manually:");
			for (const prop of missing) {
				console.log(`   - ${prop}`);
			}
		}
	} else {
		console.log(
			"\n⚠️ NOTION_COMPANY_DATABASE_ID not set. Skipping Company DB verification.",
		);
	}

	// 2. Invoice 데이터베이스 생성
	const invoiceDatabaseId = await createInvoiceDatabase(PARENT_PAGE_ID);

	// 3. Line Item 데이터베이스 생성 (Invoice와 Relation 연결)
	const lineItemDatabaseId = await createLineItemDatabase(
		PARENT_PAGE_ID,
		invoiceDatabaseId,
	);

	// 4. 결과 출력
	console.log("\n====================================================");
	console.log("  Setup Complete!");
	console.log("====================================================");
	console.log("\n📋 Copy the following to your .env file:\n");
	console.log(`NOTION_INVOICE_DATABASE_ID=${invoiceDatabaseId}`);
	console.log(`NOTION_LINE_ITEM_DATABASE_ID=${lineItemDatabaseId}`);
	if (EXISTING_COMPANY_DB_ID) {
		console.log(`NOTION_COMPANY_DATABASE_ID=${EXISTING_COMPANY_DB_ID}`);
	}

	console.log("\n📌 Next Steps:");
	console.log("   1. Copy the Database IDs above to your .env file");
	console.log("   2. Verify databases in Notion");
	console.log("   3. Add sample data for testing");
	console.log("   4. Run the app with `bun run dev`");
};

// Execute
main().catch((error: unknown) => {
	console.error("\n❌ Error occurred:");
	if (error instanceof Error) {
		console.error(`   ${error.message}`);

		// Notion API 에러 처리
		if ("code" in error) {
			const notionError = error as { code: string };
			if (notionError.code === "object_not_found") {
				console.error("\n💡 Possible solutions:");
				console.error("   - Check if NOTION_PARENT_PAGE_ID is correct");
				console.error(
					"   - Make sure Integration is connected to the parent page",
				);
				console.error(
					"   - Go to Notion → Share → Invite → Select Integration",
				);
			}
		}
	} else {
		console.error(error);
	}
	process.exit(1);
});
