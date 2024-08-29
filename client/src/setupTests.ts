import { PropsWithChildren, ReactNode } from 'react';

import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, expect, vi } from 'vitest';

beforeAll(() => {
  expect.extend(matchers);

  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();

  vi.mock('@auth0/auth0-react', () => {
    return {
      useAuth0: vi.fn().mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: undefined,
      }),
      Auth0Provider: ({ children }: PropsWithChildren) => children,
      withAuthenticationRequired: (component: ReactNode) => component,
    };
  });

  // mocking methods which are not implemented in JSDOM
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
