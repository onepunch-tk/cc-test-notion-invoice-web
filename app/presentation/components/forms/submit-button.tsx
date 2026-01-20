import type { ComponentProps } from "react";
import { useNavigation } from "react-router";
import { Button } from "~/presentation/components/ui/button";

/**
 * 로딩 상태를 자동으로 처리하는 Submit 버튼
 * useNavigation을 사용하여 폼 제출 중 상태 자동 감지
 */
interface SubmitButtonProps
	extends Omit<ComponentProps<typeof Button>, "type" | "disabled"> {
	loadingText?: string;
}

export default function SubmitButton({
	children,
	loadingText = "처리 중...",
	...props
}: SubmitButtonProps) {
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	return (
		<Button type="submit" disabled={isSubmitting} {...props}>
			{isSubmitting ? loadingText : children}
		</Button>
	);
}
