import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

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
