import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

/**
 * window.matchMedia 모킹
 * usehooks-ts의 useMediaQuery가 내부적으로 사용하는 API
 */
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

/**
 * window.ResizeObserver 모킹
 * Radix UI 컴포넌트들이 사용
 */
class ResizeObserverMock {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
}

Object.defineProperty(window, "ResizeObserver", {
	writable: true,
	value: ResizeObserverMock,
});

/**
 * IntersectionObserver 모킹
 * 일부 UI 컴포넌트에서 사용
 */
class IntersectionObserverMock {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
	root = null;
	rootMargin = "";
	thresholds = [];
	takeRecords = vi.fn();
}

Object.defineProperty(window, "IntersectionObserver", {
	writable: true,
	value: IntersectionObserverMock,
});

/**
 * window.scrollTo 모킹
 */
Object.defineProperty(window, "scrollTo", {
	writable: true,
	value: vi.fn(),
});

/**
 * Element.prototype.scrollIntoView 모킹
 */
Element.prototype.scrollIntoView = vi.fn();

/**
 * HTMLElement.prototype.hasPointerCapture 모킹
 * Radix UI에서 사용
 */
if (!HTMLElement.prototype.hasPointerCapture) {
	HTMLElement.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
}

/**
 * HTMLElement.prototype.setPointerCapture 모킹
 */
if (!HTMLElement.prototype.setPointerCapture) {
	HTMLElement.prototype.setPointerCapture = vi.fn();
}

/**
 * HTMLElement.prototype.releasePointerCapture 모킹
 */
if (!HTMLElement.prototype.releasePointerCapture) {
	HTMLElement.prototype.releasePointerCapture = vi.fn();
}
