import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import FormField from "~/presentation/components/forms/form-field";

describe("FormField 컴포넌트", () => {
	beforeEach(() => {
		// 각 테스트 전 초기화
	});

	describe("기본 렌더링", () => {
		it("라벨과 입력 필드가 렌더링된다", () => {
			// Arrange & Act
			render(<FormField name="email" label="이메일" />);

			// Assert
			expect(screen.getByLabelText("이메일")).toBeInTheDocument();
			expect(screen.getByRole("textbox")).toBeInTheDocument();
		});

		it("입력 필드의 name 속성이 올바르게 설정된다", () => {
			// Arrange & Act
			render(<FormField name="username" label="사용자명" />);

			// Assert
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("name", "username");
		});

		it("입력 필드의 id가 name과 동일하게 설정된다", () => {
			// Arrange & Act
			render(<FormField name="password" label="비밀번호" type="password" />);

			// Assert
			const input = screen.getByLabelText("비밀번호");
			expect(input).toHaveAttribute("id", "password");
		});
	});

	describe("필수 필드 표시", () => {
		it("required가 true일 때 별표(*)가 표시된다", () => {
			// Arrange & Act
			render(<FormField name="email" label="이메일" required />);

			// Assert
			expect(screen.getByText("*")).toBeInTheDocument();
		});

		it("required가 false일 때 별표가 표시되지 않는다", () => {
			// Arrange & Act
			render(<FormField name="email" label="이메일" required={false} />);

			// Assert
			expect(screen.queryByText("*")).not.toBeInTheDocument();
		});

		it("required 속성이 입력 필드에 전달된다", () => {
			// Arrange & Act
			render(<FormField name="email" label="이메일" required />);

			// Assert
			const input = screen.getByRole("textbox");
			expect(input).toBeRequired();
		});
	});

	describe("설명(description) 표시", () => {
		it("description이 있을 때 설명 텍스트가 표시된다", () => {
			// Arrange
			const description = "올바른 이메일 형식을 입력하세요";

			// Act
			render(
				<FormField name="email" label="이메일" description={description} />,
			);

			// Assert
			expect(screen.getByText(description)).toBeInTheDocument();
		});

		it("description이 있을 때 aria-describedby가 설정된다", () => {
			// Arrange & Act
			render(
				<FormField
					name="email"
					label="이메일"
					description="이메일 형식으로 입력하세요"
				/>,
			);

			// Assert
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("aria-describedby", "email-description");
		});

		it("에러가 있으면 description 대신 에러가 표시된다", () => {
			// Arrange
			const description = "올바른 이메일 형식을 입력하세요";
			const errors = ["이메일 형식이 올바르지 않습니다"];

			// Act
			render(
				<FormField
					name="email"
					label="이메일"
					description={description}
					errors={errors}
				/>,
			);

			// Assert
			expect(screen.queryByText(description)).not.toBeInTheDocument();
			expect(screen.getByText(errors[0])).toBeInTheDocument();
		});
	});

	describe("에러 상태", () => {
		it("에러가 있을 때 에러 메시지가 표시된다", () => {
			// Arrange
			const errors = ["필수 입력 항목입니다"];

			// Act
			render(<FormField name="email" label="이메일" errors={errors} />);

			// Assert
			expect(screen.getByText(errors[0])).toBeInTheDocument();
		});

		it("여러 에러가 있을 때 첫 번째 에러만 표시된다", () => {
			// Arrange
			const errors = ["첫 번째 에러", "두 번째 에러"];

			// Act
			render(<FormField name="email" label="이메일" errors={errors} />);

			// Assert
			expect(screen.getByText("첫 번째 에러")).toBeInTheDocument();
			expect(screen.queryByText("두 번째 에러")).not.toBeInTheDocument();
		});

		it("에러가 있을 때 aria-invalid가 true로 설정된다", () => {
			// Arrange & Act
			render(
				<FormField
					name="email"
					label="이메일"
					errors={["올바르지 않은 이메일"]}
				/>,
			);

			// Assert
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("aria-invalid", "true");
		});

		it("에러가 있을 때 aria-describedby가 에러 ID로 설정된다", () => {
			// Arrange & Act
			render(
				<FormField
					name="email"
					label="이메일"
					errors={["올바르지 않은 이메일"]}
				/>,
			);

			// Assert
			const input = screen.getByRole("textbox");
			expect(input).toHaveAttribute("aria-describedby", "email-error");
		});

		it("빈 에러 배열일 때 에러 상태가 아니다", () => {
			// Arrange & Act
			render(<FormField name="email" label="이메일" errors={[]} />);

			// Assert
			const input = screen.getByRole("textbox");
			expect(input).not.toHaveAttribute("aria-invalid", "true");
		});
	});

	describe("추가 Props 전달", () => {
		it("type 속성이 올바르게 전달된다", () => {
			// Arrange & Act
			render(<FormField name="password" label="비밀번호" type="password" />);

			// Assert
			const input = screen.getByLabelText("비밀번호");
			expect(input).toHaveAttribute("type", "password");
		});

		it("placeholder 속성이 올바르게 전달된다", () => {
			// Arrange
			const placeholder = "example@email.com";

			// Act
			render(
				<FormField name="email" label="이메일" placeholder={placeholder} />,
			);

			// Assert
			expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
		});

		it("defaultValue 속성이 올바르게 전달된다", () => {
			// Arrange
			const defaultValue = "test@test.com";

			// Act
			render(
				<FormField name="email" label="이메일" defaultValue={defaultValue} />,
			);

			// Assert
			const input = screen.getByRole("textbox");
			expect(input).toHaveValue(defaultValue);
		});

		it("className이 컨테이너에 적용된다", () => {
			// Arrange & Act
			const { container } = render(
				<FormField name="email" label="이메일" className="custom-class" />,
			);

			// Assert
			const formFieldContainer = container.firstChild;
			expect(formFieldContainer).toHaveClass("custom-class");
		});
	});
});
