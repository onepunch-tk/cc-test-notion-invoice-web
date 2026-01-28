import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import EmailLayout, {
	emailStyles,
} from "~/presentation/components/email/email-layout";

describe("EmailLayout 컴포넌트", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("기본 렌더링", () => {
		it("제목이 렌더링된다", () => {
			// Arrange & Act
			render(
				<EmailLayout preview="미리보기" title="테스트 제목">
					<p>컨텐츠</p>
				</EmailLayout>,
			);

			// Assert
			expect(screen.getByText("테스트 제목")).toBeInTheDocument();
		});

		it("children이 렌더링된다", () => {
			// Arrange & Act
			render(
				<EmailLayout preview="미리보기" title="제목">
					<p data-testid="content">이메일 본문</p>
				</EmailLayout>,
			);

			// Assert
			expect(screen.getByTestId("content")).toBeInTheDocument();
			expect(screen.getByText("이메일 본문")).toBeInTheDocument();
		});

		it("기본 footer 텍스트가 렌더링된다", () => {
			// Arrange & Act
			render(
				<EmailLayout preview="미리보기" title="제목">
					<p>컨텐츠</p>
				</EmailLayout>,
			);

			// Assert
			expect(
				screen.getByText("이 이메일은 자동으로 발송되었습니다."),
			).toBeInTheDocument();
		});
	});

	describe("Props 전달", () => {
		it("preview 텍스트가 설정된다", () => {
			// Arrange & Act
			const { container } = render(
				<EmailLayout preview="이메일 미리보기 텍스트" title="제목">
					<p>컨텐츠</p>
				</EmailLayout>,
			);

			// Assert - @react-email/components의 Preview 컴포넌트가 렌더링되는지 확인
			// Preview는 화면에 보이지 않는 요소이므로 컨테이너에서 확인
			expect(container.innerHTML).toContain("이메일 미리보기 텍스트");
		});

		it("커스텀 footer가 렌더링된다", () => {
			// Arrange & Act
			render(
				<EmailLayout
					preview="미리보기"
					title="제목"
					footer="커스텀 푸터 메시지"
				>
					<p>컨텐츠</p>
				</EmailLayout>,
			);

			// Assert
			expect(screen.getByText("커스텀 푸터 메시지")).toBeInTheDocument();
		});

		it("커스텀 footer가 있을 때 기본 footer는 표시되지 않는다", () => {
			// Arrange & Act
			render(
				<EmailLayout
					preview="미리보기"
					title="제목"
					footer="커스텀 푸터 메시지"
				>
					<p>컨텐츠</p>
				</EmailLayout>,
			);

			// Assert
			expect(
				screen.queryByText("이 이메일은 자동으로 발송되었습니다."),
			).not.toBeInTheDocument();
		});
	});

	describe("다양한 children 타입", () => {
		it("단일 텍스트 노드가 렌더링된다", () => {
			// Arrange & Act
			render(
				<EmailLayout preview="미리보기" title="제목">
					단순 텍스트
				</EmailLayout>,
			);

			// Assert
			expect(screen.getByText("단순 텍스트")).toBeInTheDocument();
		});

		it("여러 자식 요소가 렌더링된다", () => {
			// Arrange & Act
			render(
				<EmailLayout preview="미리보기" title="제목">
					<p data-testid="first">첫 번째 문단</p>
					<p data-testid="second">두 번째 문단</p>
				</EmailLayout>,
			);

			// Assert
			expect(screen.getByTestId("first")).toBeInTheDocument();
			expect(screen.getByTestId("second")).toBeInTheDocument();
		});

		it("중첩된 요소가 렌더링된다", () => {
			// Arrange & Act
			render(
				<EmailLayout preview="미리보기" title="제목">
					<div>
						<span data-testid="nested">중첩된 요소</span>
					</div>
				</EmailLayout>,
			);

			// Assert
			expect(screen.getByTestId("nested")).toBeInTheDocument();
		});
	});
});

describe("emailStyles 객체", () => {
	describe("text 스타일", () => {
		it("color가 정의되어 있다", () => {
			// Assert
			expect(emailStyles.text.color).toBe("#4a5568");
		});

		it("fontSize가 정의되어 있다", () => {
			// Assert
			expect(emailStyles.text.fontSize).toBe("16px");
		});

		it("lineHeight가 정의되어 있다", () => {
			// Assert
			expect(emailStyles.text.lineHeight).toBe("1.6");
		});
	});

	describe("linkText 스타일", () => {
		it("color가 정의되어 있다", () => {
			// Assert
			expect(emailStyles.linkText.color).toBe("#718096");
		});

		it("fontSize가 14px이다", () => {
			// Assert
			expect(emailStyles.linkText.fontSize).toBe("14px");
		});
	});

	describe("code 스타일", () => {
		it("wordBreak이 break-all이다", () => {
			// Assert
			expect(emailStyles.code.wordBreak).toBe("break-all");
		});

		it("backgroundColor가 정의되어 있다", () => {
			// Assert
			expect(emailStyles.code.backgroundColor).toBe("#f7fafc");
		});
	});

	describe("button 스타일", () => {
		it("display가 inline-block이다", () => {
			// Assert
			expect(emailStyles.button.display).toBe("inline-block");
		});

		it("backgroundColor가 정의되어 있다", () => {
			// Assert
			expect(emailStyles.button.backgroundColor).toBe("#0070f3");
		});

		it("color가 흰색이다", () => {
			// Assert
			expect(emailStyles.button.color).toBe("#ffffff");
		});

		it("textDecoration이 none이다", () => {
			// Assert
			expect(emailStyles.button.textDecoration).toBe("none");
		});
	});

	describe("buttonContainer 스타일", () => {
		it("textAlign이 center이다", () => {
			// Assert
			expect(emailStyles.buttonContainer.textAlign).toBe("center");
		});
	});

	describe("warningBox 스타일", () => {
		it("backgroundColor가 정의되어 있다", () => {
			// Assert
			expect(emailStyles.warningBox.backgroundColor).toBe("#fff5f5");
		});

		it("borderLeft가 정의되어 있다", () => {
			// Assert
			expect(emailStyles.warningBox.borderLeft).toBe("4px solid #fc8181");
		});
	});

	describe("warningText 스타일", () => {
		it("color가 정의되어 있다", () => {
			// Assert
			expect(emailStyles.warningText.color).toBe("#c53030");
		});
	});
});
