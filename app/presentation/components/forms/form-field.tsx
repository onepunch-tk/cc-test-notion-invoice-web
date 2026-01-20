import type { ComponentProps } from "react";
import { Input } from "~/presentation/components/ui/input";
import { Label } from "~/presentation/components/ui/label";
import { cn } from "~/lib/utils";

/**
 * React Router Form을 위한 재사용 가능한 FormField 컴포넌트
 * shadcn의 Input과 Label을 사용하며 필드 레벨 에러 메시지 표시
 */
interface FormFieldProps extends Omit<ComponentProps<typeof Input>, "id"> {
	name: string;
	label: string;
	errors?: string[]; // Zod error.format()에서 온 _errors 배열
	description?: string;
}

export default function FormField({
	name,
	label,
	errors,
	required = false,
	description,
	className,
	...inputProps
}: FormFieldProps) {
	const hasError = errors && errors.length > 0;

	return (
		<div className={cn("space-y-2", className)}>
			<Label htmlFor={name} className={hasError ? "text-destructive" : ""}>
				{label}
				{required && <span className="text-destructive">*</span>}
			</Label>

			<Input
				id={name}
				name={name}
				required={required}
				aria-invalid={hasError}
				aria-describedby={
					hasError
						? `${name}-error`
						: description
							? `${name}-description`
							: undefined
				}
				{...inputProps}
			/>

			{description && !hasError && (
				<p id={`${name}-description`} className="text-sm text-muted-foreground">
					{description}
				</p>
			)}

			{hasError && (
				<p id={`${name}-error`} className="text-sm text-destructive">
					{errors[0]}
				</p>
			)}
		</div>
	);
}
