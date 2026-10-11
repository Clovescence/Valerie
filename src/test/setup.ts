import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => undefined,
});

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: MockResizeObserver,
});
