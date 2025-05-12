import { configureStore } from '@reduxjs/toolkit';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { dogsSlice, useGetDogImageQuery } from '../src/features/dogsSlice';

// --- Mocking import.meta.env ---
// We need to control the value of import.meta.env.VITE_THE_DOG_API_KEY
// This mock needs to be in place before dogsSlice is imported by the test.
// If dogsSlice is already imported, its THE_DOG_API_KEY constant will be set.
// Using vi.mock or jest.mock for the module itself can also work.

// Initial mock value for most tests
vi.stubGlobal('importMeta', {
  env: {
    VITE_THE_DOG_API_KEY: 'test_api_key_from_jest',
  },
});

// Helper to create a store with the API slice
const createTestStore = () => {
  return configureStore({
    reducer: {
      [dogsSlice.reducerPath]: dogsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(dogsSlice.middleware),
  });
};

// Wrapper component for testing hooks
const TestProvider: React.FC<{ children: React.ReactNode; store: ReturnType<typeof createTestStore> }> = ({ children, store }) => (
  <ApiProvider api={dogsSlice} store={store}>
    {children}
  </ApiProvider>
);

describe('dogsSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    // Reset fetch mock before each test
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restores all mocks, including global.fetch and importMeta
  });

  describe('getDogImage endpoint', () => {
    it('should make a GET request to /images/search with the API key from env', async () => {
      // Re-stub global for this specific test case if needed, or rely on the top-level stub
      vi.stubGlobal('importMeta', {
        env: { VITE_THE_DOG_API_KEY: 'specific_test_key' },
      });
      // We need to re-import the slice if THE_DOG_API_KEY is captured at module load
      // and we changed the env var mock after the initial import.
      // For simplicity, let's assume the top-level mock is sufficient or the test runner handles it.
      // If not, vi.resetModules() and dynamic import would be needed here.

      const mockDogImageResponse = [{ id: '1', url: 'http://example.com/dog.jpg', width: 500, height: 500 }];
      (global.fetch as vi.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockDogImageResponse,
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      const { result } = renderHook(() => useGetDogImageQuery({}), {
        wrapper: ({ children }) => <TestProvider store={store}>{children}</TestProvider>,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const fetchCall = (global.fetch as vi.Mock).mock.calls[0];
      const requestUrl = new URL(fetchCall[0] as string); // fetchCall[0] is the URL

      expect(requestUrl.origin + requestUrl.pathname).toBe('https://api.thedogapi.com/v1/images/search');
      expect(requestUrl.searchParams.get('api_key')).toBe('specific_test_key');
      expect(result.current.data).toEqual(mockDogImageResponse);
    });

    it('should use an empty string for API key if VITE_THE_DOG_API_KEY is not set', async () => {
      // Reset modules to ensure dogsSlice re-evaluates THE_DOG_API_KEY
      vi.resetModules();
      // Mock import.meta.env to be empty for this test
      vi.stubGlobal('importMeta', {
        env: {}, // VITE_THE_DOG_API_KEY will be undefined
      });
      // Dynamically import the slice again so it picks up the new mock
      const { dogsSlice: dogsSliceDynamic, useGetDogImageQuery: useGetDogImageQueryDynamic } = await import('./dogsSlice');

      // Create a new store with the dynamically imported slice
      const dynamicStore = configureStore({
        reducer: { [dogsSliceDynamic.reducerPath]: dogsSliceDynamic.reducer },
        middleware: (gDM) => gDM().concat(dogsSliceDynamic.middleware),
      });
      const DynamicTestProvider: React.FC<{ children: React.ReactNode; store: any }> = ({ children, store: currentStore }) => (
        <ApiProvider api={dogsSliceDynamic} store={currentStore}>{children}</ApiProvider>
      );


      const mockDogImageResponse = [{ id: '2', url: 'http://example.com/anotherdog.jpg' }];
      (global.fetch as vi.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockDogImageResponse,
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      const { result } = renderHook(() => useGetDogImageQueryDynamic({}), {
        wrapper: ({ children }) => <DynamicTestProvider store={dynamicStore}>{children}</DynamicTestProvider>,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const fetchCall = (global.fetch as vi.Mock).mock.calls[0];
      const requestUrl = new URL(fetchCall[0] as string);

      expect(requestUrl.origin + requestUrl.pathname).toBe('https://api.thedogapi.com/v1/images/search');
      expect(requestUrl.searchParams.get('api_key')).toBe(''); // Fallback to empty string
      expect(result.current.data).toEqual(mockDogImageResponse);
    });

    it('should handle API error for getDogImage', async () => {
       vi.stubGlobal('importMeta', { // Ensure API key is set for consistency
        env: { VITE_THE_DOG_API_KEY: 'error_test_key' },
      });

      (global.fetch as vi.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Server Error' }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      const { result } = renderHook(() => useGetDogImageQuery({}), {
        wrapper: ({ children }) => <TestProvider store={store}>{children}</TestProvider>,
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toBeDefined();
      // You can assert specific error properties if RTK Query structures them predictably
      // For example: expect((result.current.error as any).status).toBe(500);
    });
  });
});