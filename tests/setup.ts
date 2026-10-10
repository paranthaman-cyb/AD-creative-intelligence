import '@testing-library/jest-dom';

// Polyfills or mocks for browser environment in tests if needed
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = () => 'blob:mock-url';
  window.URL.revokeObjectURL = () => {};
}
