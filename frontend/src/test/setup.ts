import '@testing-library/jest-dom/vitest'

// Mock global de ResizeObserver para componentes baseados em cmdk e radix
if (typeof window !== 'undefined') {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// Mock de scrollIntoView para jsdom
window.HTMLElement.prototype.scrollIntoView = function () {}
