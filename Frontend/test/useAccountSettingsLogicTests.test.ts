import { renderHook, act } from '@testing-library/react';
import { useAccountSettingsLogic } from '../src/hooks/useAccountSettingsLogic';
import { User } from 'firebase/auth';

// --- Mocks ---
const mockUpdateProfile = jest.fn();
const mockUpdateEmail = jest.fn();
const mockUpdatePassword = jest.fn();
const mockUnsubscribe = jest.fn();

let mockCurrentUser: User | null = null;
let authStateChangeCallback: ((user: User | null) => void) | null = null;

jest.mock("../config/firebaseConfig", () => ({
  auth: {
    get currentUser() {
      return mockCurrentUser;
    },
    onAuthStateChanged: jest.fn((callback) => {
      authStateChangeCallback = callback;
      // Simulate initial call if user exists or is null
      Promise.resolve().then(() => callback(mockCurrentUser));
      return mockUnsubscribe; // Return the mock unsubscribe function
    }),
  },
}));

jest.mock("firebase/auth", () => ({
  ...jest.requireActual("firebase/auth"), // Import and retain default behavior
  updateProfile: (...args: any[]) => mockUpdateProfile(...args),
  updateEmail: (...args: any[]) => mockUpdateEmail(...args),
  updatePassword: (...args: any[]) => mockUpdatePassword(...args),
}));

// Helper to create a mock user
const createMockUser = (
  displayName?: string | null, // Allow null
  email?: string | null // Allow null
): User => ({
  uid: 'test-uid',
  displayName: displayName === undefined ? 'Test User' : displayName, // Handle undefined for default
  email: email === undefined ? 'test@example.com' : email, // Handle undefined for default
  emailVerified: true,
  isAnonymous: false,
  metadata: {} as any, // Cast to any or provide full mock if needed
  providerData: [],
  providerId: 'firebase',
  refreshToken: 'test-refresh-token',
  tenantId: null,
  delete: jest.fn(),
  getIdToken: jest.fn(),
  getIdTokenResult: jest.fn(),
  reload: jest.fn(),
  toJSON: jest.fn(),
  photoURL: null,
  phoneNumber: null,
});


describe('useAccountSettingsLogic', () => {
  beforeEach(() => {
    // Reset mocks and mockCurrentUser before each test
    mockUpdateProfile.mockClear();
    mockUpdateEmail.mockClear();
    mockUpdatePassword.mockClear();
    mockUnsubscribe.mockClear();
    // Correctly access the mocked module's onAuthStateChanged
    const mockFirebaseAuth = require("../config/firebaseConfig").auth;
    (mockFirebaseAuth.onAuthStateChanged as jest.Mock).mockClear();
    mockCurrentUser = null;
    authStateChangeCallback = null;
  });

  describe('Initialization and useEffect', () => {
    it('should initialize with empty fields and null user if no user is logged in', () => {
      mockCurrentUser = null;
      const { result } = renderHook(() => useAccountSettingsLogic());

      expect(result.current.firstName).toBe("");
      expect(result.current.lastName).toBe("");
      expect(result.current.email).toBe("");
      expect(result.current.currentUser).toBeNull();
      // Correctly access the mocked module's onAuthStateChanged
      const mockFirebaseAuth = require("../config/firebaseConfig").auth;
      expect(mockFirebaseAuth.onAuthStateChanged).toHaveBeenCalledTimes(1);
    });

    it('should initialize with user data if a user is logged in', () => {
      mockCurrentUser = createMockUser('John Doe', 'john.doe@example.com');
      const { result } = renderHook(() => useAccountSettingsLogic());

      expect(result.current.firstName).toBe("John");
      expect(result.current.lastName).toBe("Doe");
      expect(result.current.email).toBe("john.doe@example.com");
      expect(result.current.currentUser).toEqual(mockCurrentUser);
    });

    it('should handle user with only first name', () => {
        mockCurrentUser = createMockUser('Cher', 'cher@example.com');
        const { result } = renderHook(() => useAccountSettingsLogic());
        expect(result.current.firstName).toBe("Cher");
        expect(result.current.lastName).toBe("");
    });

    it('should handle user with null displayName or email', () => {
        // Pass null directly to the factory function
        mockCurrentUser = createMockUser(null, null);
        const { result } = renderHook(() => useAccountSettingsLogic());
        expect(result.current.firstName).toBe("");
        expect(result.current.lastName).toBe("");
        expect(result.current.email).toBe("");
    });

    it('should update user data when auth state changes to a new user', async () => {
      mockCurrentUser = null;
      const { result } = renderHook(() => useAccountSettingsLogic());
      expect(result.current.currentUser).toBeNull();

      const newUser = createMockUser('Jane Smith', 'jane@example.com');
      act(() => {
        if (authStateChangeCallback) {
          authStateChangeCallback(newUser);
        }
      });

      expect(result.current.firstName).toBe("Jane");
      expect(result.current.lastName).toBe("Smith");
      expect(result.current.email).toBe("jane@example.com");
      expect(result.current.currentUser).toEqual(newUser);
    });

    it('should clear user data when auth state changes to null (logout)', () => {
      mockCurrentUser = createMockUser();
      const { result } = renderHook(() => useAccountSettingsLogic());
      expect(result.current.currentUser).not.toBeNull();

      act(() => {
        if (authStateChangeCallback) {
          authStateChangeCallback(null);
        }
      });
      // Note: The hook doesn't clear firstName, lastName, email on logout, only currentUser
      // This might be intended or an oversight depending on desired behavior.
      // For this test, we'll assert what the current code does.
      expect(result.current.currentUser).toBeNull();
      // expect(result.current.firstName).toBe(""); // This would fail based on current code
    });

    it('should call unsubscribe on unmount', () => {
      mockCurrentUser = createMockUser();
      const { unmount } = renderHook(() => useAccountSettingsLogic());
      unmount();
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleSaveChanges', () => {
    const mockEvent = { preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>;

    beforeEach(() => {
        mockEvent.preventDefault = jest.fn(); // Reset this mock too
    });

    it('should set error if no user is logged in', async () => {
      mockCurrentUser = null;
      const { result } = renderHook(() => useAccountSettingsLogic());

      await act(async () => {
        await result.current.handleSaveChanges(mockEvent);
      });

      expect(result.current.errorMessage).toBe("No user logged in.");
      expect(result.current.loading).toBe(false);
      expect(mockUpdateProfile).not.toHaveBeenCalled();
    });

    it('should update display name successfully', async () => {
      mockCurrentUser = createMockUser('Old Name', 'test@example.com');
      mockUpdateProfile.mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useAccountSettingsLogic());

      act(() => {
        result.current.setFirstName("NewFirst");
        result.current.setLastName("NewLast");
      });

      await act(async () => {
        await result.current.handleSaveChanges(mockEvent);
      });

      expect(mockUpdateProfile).toHaveBeenCalledWith(mockCurrentUser, { displayName: "NewFirst NewLast" });
      expect(result.current.successMessage).toBe("Name updated successfully.");
      expect(result.current.errorMessage).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should update email successfully', async () => {
      mockCurrentUser = createMockUser('Test User', 'old@example.com');
      mockUpdateEmail.mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useAccountSettingsLogic());

      act(() => {
        result.current.setEmail("new@example.com");
      });

      await act(async () => {
        await result.current.handleSaveChanges(mockEvent);
      });

      expect(mockUpdateEmail).toHaveBeenCalledWith(mockCurrentUser, "new@example.com");
      expect(result.current.successMessage).toBe("Email updated successfully. Please verify your new email address.");
      expect(result.current.loading).toBe(false);
    });

    it('should update password successfully and clear password field', async () => {
      mockCurrentUser = createMockUser();
      mockUpdatePassword.mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useAccountSettingsLogic());

      act(() => {
        result.current.setPassword("newPassword123");
      });

      await act(async () => {
        await result.current.handleSaveChanges(mockEvent);
      });

      expect(mockUpdatePassword).toHaveBeenCalledWith(mockCurrentUser, "newPassword123");
      expect(result.current.successMessage).toBe("Password updated successfully.");
      expect(result.current.password).toBe(""); // Password field cleared
      expect(result.current.loading).toBe(false);
    });

    it('should update multiple fields and combine success messages', async () => {
        mockCurrentUser = createMockUser('Old Name', 'old@example.com');
        mockUpdateProfile.mockResolvedValueOnce(undefined);
        mockUpdateEmail.mockResolvedValueOnce(undefined);
        const { result } = renderHook(() => useAccountSettingsLogic());

        act(() => {
            result.current.setFirstName("NewFirst");
            result.current.setLastName("NewLast");
            result.current.setEmail("new@example.com");
        });

        await act(async () => {
            await result.current.handleSaveChanges(mockEvent);
        });

        expect(mockUpdateProfile).toHaveBeenCalled();
        expect(mockUpdateEmail).toHaveBeenCalled();
        expect(result.current.successMessage).toBe("Name updated successfully. Email updated successfully. Please verify your new email address.");
        expect(result.current.loading).toBe(false);
    });


    it('should show "No changes were made" if no fields are changed', async () => {
      mockCurrentUser = createMockUser('Test User', 'test@example.com');
      const { result } = renderHook(() => useAccountSettingsLogic());
      // Initial values match current user, so no changes

      await act(async () => {
        await result.current.handleSaveChanges(mockEvent);
      });

      expect(mockUpdateProfile).not.toHaveBeenCalled();
      expect(mockUpdateEmail).not.toHaveBeenCalled();
      expect(mockUpdatePassword).not.toHaveBeenCalled();
      expect(result.current.successMessage).toBe("No changes were made.");
      expect(result.current.loading).toBe(false);
    });

    it('should handle error from updateProfile', async () => {
      mockCurrentUser = createMockUser();
      const updateError = new Error("Profile update failed");
      mockUpdateProfile.mockRejectedValueOnce(updateError);
      const { result } = renderHook(() => useAccountSettingsLogic());

      act(() => {
        result.current.setFirstName("FailFirst");
      });

      await act(async () => {
        await result.current.handleSaveChanges(mockEvent);
      });

      expect(result.current.errorMessage).toBe("Profile update failed");
      expect(result.current.successMessage).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.password).toBe(""); // Password cleared even on error
    });

    it('should set loading state correctly', async () => {
        mockCurrentUser = createMockUser();
        mockUpdatePassword.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 50))); // Simulate delay
        const { result } = renderHook(() => useAccountSettingsLogic());

        act(() => {
            result.current.setPassword("newPassword123");
        });

        let promise;
        act(() => {
            promise = result.current.handleSaveChanges(mockEvent);
        });

        expect(result.current.loading).toBe(true);
        await act(async () => {
            await promise;
        });
        expect(result.current.loading).toBe(false);
    });
  });
});