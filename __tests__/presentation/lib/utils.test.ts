import { describe, it, expect } from "vitest";
import { cn } from "~/presentation/lib/utils";

describe("cn (클래스 병합 유틸리티)", () => {
	describe("기본 클래스 병합", () => {
		it("단일 클래스를 그대로 반환한다", () => {
			// Arrange
			const className = "text-red-500";

			// Act
			const result = cn(className);

			// Assert
			expect(result).toBe("text-red-500");
		});

		it("여러 클래스를 공백으로 병합한다", () => {
			// Arrange
			const class1 = "px-4";
			const class2 = "py-2";
			const class3 = "bg-blue-500";

			// Act
			const result = cn(class1, class2, class3);

			// Assert
			expect(result).toBe("px-4 py-2 bg-blue-500");
		});

		it("빈 문자열을 제외하고 병합한다", () => {
			// Arrange
			const class1 = "px-4";
			const emptyClass = "";
			const class2 = "py-2";

			// Act
			const result = cn(class1, emptyClass, class2);

			// Assert
			expect(result).toBe("px-4 py-2");
		});
	});

	describe("조건부 클래스 처리", () => {
		it("true 조건일 때 클래스를 포함한다", () => {
			// Arrange
			const isActive = true;

			// Act
			const result = cn("base-class", isActive && "active-class");

			// Assert
			expect(result).toBe("base-class active-class");
		});

		it("false 조건일 때 클래스를 제외한다", () => {
			// Arrange
			const isActive = false;

			// Act
			const result = cn("base-class", isActive && "active-class");

			// Assert
			expect(result).toBe("base-class");
		});

		it("객체 형태의 조건부 클래스를 처리한다", () => {
			// Arrange
			const isActive = true;
			const isDisabled = false;

			// Act
			const result = cn("base-class", {
				"active-class": isActive,
				"disabled-class": isDisabled,
			});

			// Assert
			expect(result).toBe("base-class active-class");
		});

		it("undefined와 null을 무시한다", () => {
			// Arrange
			const undefinedValue = undefined;
			const nullValue = null;

			// Act
			const result = cn("base-class", undefinedValue, nullValue, "end-class");

			// Assert
			expect(result).toBe("base-class end-class");
		});
	});

	describe("Tailwind 클래스 충돌 해결", () => {
		it("동일 속성의 클래스 충돌 시 마지막 값을 우선한다", () => {
			// Arrange
			const baseClass = "bg-red-500";
			const overrideClass = "bg-blue-500";

			// Act
			const result = cn(baseClass, overrideClass);

			// Assert
			expect(result).toBe("bg-blue-500");
		});

		it("padding 충돌을 해결한다", () => {
			// Arrange
			const baseClass = "p-4";
			const overrideClass = "p-2";

			// Act
			const result = cn(baseClass, overrideClass);

			// Assert
			expect(result).toBe("p-2");
		});

		it("px/py 개별 방향 padding이 전체 padding을 오버라이드한다", () => {
			// Arrange
			const baseClass = "p-4";
			const overrideClass = "px-2";

			// Act
			const result = cn(baseClass, overrideClass);

			// Assert
			expect(result).toContain("px-2");
		});

		it("텍스트 크기 충돌을 해결한다", () => {
			// Arrange
			const baseClass = "text-sm";
			const overrideClass = "text-lg";

			// Act
			const result = cn(baseClass, overrideClass);

			// Assert
			expect(result).toBe("text-lg");
		});

		it("서로 다른 속성은 모두 유지한다", () => {
			// Arrange
			const classes = "px-4 py-2 bg-blue-500 text-white";

			// Act
			const result = cn(classes);

			// Assert
			expect(result).toContain("px-4");
			expect(result).toContain("py-2");
			expect(result).toContain("bg-blue-500");
			expect(result).toContain("text-white");
		});
	});

	describe("배열 입력 처리", () => {
		it("배열 형태의 클래스를 처리한다", () => {
			// Arrange
			const classes = ["px-4", "py-2", "bg-blue-500"];

			// Act
			const result = cn(classes);

			// Assert
			expect(result).toBe("px-4 py-2 bg-blue-500");
		});

		it("중첩 배열을 평탄화하여 처리한다", () => {
			// Arrange
			const classes = [["px-4", "py-2"], "bg-blue-500"];

			// Act
			const result = cn(classes);

			// Assert
			expect(result).toBe("px-4 py-2 bg-blue-500");
		});
	});

	describe("실제 사용 케이스", () => {
		it("버튼 variant 스타일을 병합한다", () => {
			// Arrange
			const baseStyles = "inline-flex items-center justify-center rounded-md";
			const variant = "primary";
			const variantStyles = {
				primary: "bg-primary text-primary-foreground",
				secondary: "bg-secondary text-secondary-foreground",
			};

			// Act
			const result = cn(baseStyles, variantStyles[variant]);

			// Assert
			expect(result).toContain("inline-flex");
			expect(result).toContain("bg-primary");
			expect(result).toContain("text-primary-foreground");
		});

		it("컴포넌트 props로 전달된 className을 병합한다", () => {
			// Arrange
			const defaultStyles = "px-4 py-2 bg-blue-500";
			const propsClassName = "bg-red-500 mt-4";

			// Act
			const result = cn(defaultStyles, propsClassName);

			// Assert
			expect(result).toContain("px-4");
			expect(result).toContain("py-2");
			expect(result).toContain("bg-red-500"); // props가 우선
			expect(result).toContain("mt-4");
			expect(result).not.toContain("bg-blue-500"); // 오버라이드됨
		});
	});
});
