import { type RenderOptions, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, type MemoryRouterProps } from "react-router";

type RenderWithRouterOptions = {
	routerProps?: MemoryRouterProps;
	renderOptions?: Omit<RenderOptions, "wrapper">;
};

/**
 * React Router 컨텍스트를 포함한 컴포넌트 렌더링 유틸리티
 *
 * @param ui - 렌더링할 React 컴포넌트
 * @param options - 라우터 및 렌더링 옵션
 * @returns render 결과 객체
 */
export const renderWithRouter = (
	ui: ReactNode,
	options: RenderWithRouterOptions = {},
) => {
	const { routerProps = {}, renderOptions = {} } = options;

	const Wrapper = ({ children }: { children: ReactNode }) => (
		<MemoryRouter {...routerProps}>{children}</MemoryRouter>
	);

	return render(ui, { wrapper: Wrapper, ...renderOptions });
};
