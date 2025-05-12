import { login, signup, logout } from '../src/services/auth/login';
import {


// filepath: c:\Users\ross9\GitHub\attendance-tracker\Frontend\jest.config.test.cjs
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth as mockAuthObjectFromConfig } from '../src/config/firebaseConfig';

// Mock firebase/auth module
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

// Mock the config module that exports 'auth'
// This path is relative to the file being tested (login.ts) or rather, it's the module path used in login.ts
jest.mock('../src/config/firebaseConfig', () => ({
  auth: {
    // Mock auth object, can be empty if its properties are not accessed
  },
}));

describe('Auth Service', () => {
  const mockEmail = 'test@example.com';
  const mockPassword = 'password123';
  const mockUser = { uid: '123', email: mockEmail, name: 'Test User' };
  const mockUserCredential = { user: mockUser };
  const mockError = new Error('Firebase operation failed');

  let consoleLogSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]], any>;
  let consoleErrorSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]], any>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Spy on console methods to verify calls and suppress output during tests
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console spies
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('login', () => {
    it('should log in a user successfully and return user data', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      const user = await login(mockEmail, mockPassword);

      expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuthObjectFromConfig, mockEmail, mockPassword);
      expect(user).toEqual(mockUserCredential.user);
      expect(consoleLogSpy).toHaveBeenCalledWith('User logged in:', mockUserCredential.user);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should throw an error and log it if login fails', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

      await expect(login(mockEmail, mockPassword)).rejects.toThrow(mockError);

      expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuthObjectFromConfig, mockEmail, mockPassword);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error logging in:', mockError);
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('signup', () => {
    it('should sign up a user successfully and return user data', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      const user = await signup(mockEmail, mockPassword);

      expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuthObjectFromConfig, mockEmail, mockPassword);
      expect(user).toEqual(mockUserCredential.user);
      expect(consoleLogSpy).toHaveBeenCalledWith('User signed up:', mockUserCredential.user);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should throw an error and log it if signup fails', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

      await expect(signup(mockEmail, mockPassword)).rejects.toThrow(mockError);

      expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuthObjectFromConfig, mockEmail, mockPassword);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error signing up:', mockError);
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should log out a user successfully', async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);

      await logout();

      expect(signOut).toHaveBeenCalledTimes(1);
      expect(signOut).toHaveBeenCalledWith(mockAuthObjectFromConfig);
      expect(consoleLogSpy).toHaveBeenCalledWith('User logged out');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should throw an error and log it if logout fails', async () => {
      (signOut as jest.Mock).mockRejectedValue(mockError);

      await expect(logout()).rejects.toThrow(mockError);

      expect(signOut).toHaveBeenCalledTimes(1);
      expect(signOut).toHaveBeenCalledWith(mockAuthObjectFromConfig);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error logging out:', mockError);
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });
});