import { renderHook, act } from '@testing-library/react';
import { useLoginLogic } from '../src/hooks/useLoginLogic';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../src/services/auth/login';
import { setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth as firebaseAuth } from '../src/config/firebaseConfig';

// Mock dependencies using jest.mock
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Import and retain other exports
  useNavigate: jest.fn(),
}));

jest.mock('../src/services/auth/login', () => ({
  login: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'), // Import and retain other exports
  setPersistence: jest.fn(),
  browserSessionPersistence: 'SESSION', // Mocked value
  browserLocalPersistence: 'LOCAL',     // Mocked value
}));

jest.mock('../src/config/firebaseConfig', () => ({
  auth: {}, // Mocked Firebase auth object
}));

describe('useLoginLogic', () => {
  const mockNavigate = jest.fn();
  const mockLoginService = loginService as jest.Mock;
  const mockSetPersistence = setPersistence as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks(); 
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test('initial state is correct', () => {
    const { result } = renderHook(() => useLoginLogic());
    expect(result.current.showPassword).toBe(false);
    expect(result.current.username).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.stayLoggedIn).toBe(false);
    expect(result.current.loginError).toBeNull();
  });

  test('handleTogglePasswordVisibility toggles showPassword', () => {
    const { result } = renderHook(() => useLoginLogic());
    act(() => {
      result.current.handleTogglePasswordVisibility();
    });
    expect(result.current.showPassword).toBe(true);
    act(() => {
      result.current.handleTogglePasswordVisibility();
    });
    expect(result.current.showPassword).toBe(false);
  });

  test('handleMouseDownPassword calls event.preventDefault', () => {
    const { result } = renderHook(() => useLoginLogic());
    const mockEvent = { preventDefault: jest.fn() } as unknown as React.MouseEvent<HTMLButtonElement>;
    act(() => {
      result.current.handleMouseDownPassword(mockEvent);
    });
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
  });

  test('handleForgotLinkClick calls event.preventDefault and navigates', () => {
    const { result } = renderHook(() => useLoginLogic());
    const mockEvent = { preventDefault: jest.fn() } as unknown as React.MouseEvent<HTMLAnchorElement>;
    act(() => {
      result.current.handleForgotLinkClick(mockEvent);
    });
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });

  test('handleCreateAccountClick calls event.preventDefault and navigates', () => {
    const { result } = renderHook(() => useLoginLogic());
    const mockEvent = { preventDefault: jest.fn() } as unknown as React.MouseEvent<HTMLAnchorElement>;
    act(() => {
      result.current.handleCreateAccountClick(mockEvent);
    });
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  test('handleStayLoggedInChange updates stayLoggedIn state', () => {
    const { result } = renderHook(() => useLoginLogic());
    const mockEvent = { target: { checked: true } } as React.ChangeEvent<HTMLInputElement>;
    act(() => {
      result.current.handleStayLoggedInChange(mockEvent);
    });
    expect(result.current.stayLoggedIn).toBe(true);

    const mockEventFalse = { target: { checked: false } } as React.ChangeEvent<HTMLInputElement>;
    act(() => {
      result.current.handleStayLoggedInChange(mockEventFalse);
    });
    expect(result.current.stayLoggedIn).toBe(false);
  });

  describe('handleLogin', () => {
    test('successful login with stayLoggedIn false (session persistence)', async () => {
      const { result } = renderHook(() => useLoginLogic());
      const mockUser = { uid: '123', email: 'test@example.com' };
      mockLoginService.mockResolvedValue(mockUser);
      mockSetPersistence.mockResolvedValue(undefined);

      act(() => {
        result.current.setUsername('test@example.com');
        result.current.setPassword('password123');
        result.current.handleStayLoggedInChange({ target: { checked: false } } as React.ChangeEvent<HTMLInputElement>);
      });
      
      await act(async () => {
        await result.current.handleLogin();
      });

      expect(mockSetPersistence).toHaveBeenCalledWith(firebaseAuth, browserSessionPersistence);
      expect(mockLoginService).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(result.current.loginError).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    test('successful login with stayLoggedIn true (local persistence)', async () => {
      const { result } = renderHook(() => useLoginLogic());
      const mockUser = { uid: '123', email: 'test@example.com' };
      mockLoginService.mockResolvedValue(mockUser);
      mockSetPersistence.mockResolvedValue(undefined);
      
      act(() => {
        result.current.setUsername('test@example.com');
        result.current.setPassword('password123');
        result.current.handleStayLoggedInChange({ target: { checked: true } } as React.ChangeEvent<HTMLInputElement>);
      });

      await act(async () => {
        await result.current.handleLogin();
      });

      expect(mockSetPersistence).toHaveBeenCalledWith(firebaseAuth, browserLocalPersistence);
      expect(mockLoginService).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(result.current.loginError).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });

    test('failed login sets loginError', async () => {
      const { result } = renderHook(() => useLoginLogic());
      const errorMessage = 'Invalid credentials';
      mockLoginService.mockRejectedValue(new Error(errorMessage));
      mockSetPersistence.mockResolvedValue(undefined); // setPersistence might still be called

      act(() => {
        result.current.setUsername('wrong@example.com');
        result.current.setPassword('wrongpassword');
      });

      await act(async () => {
        await result.current.handleLogin();
      });
      
      expect(mockSetPersistence).toHaveBeenCalled(); // It's called before login attempt
      expect(mockLoginService).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
      expect(result.current.loginError).toBe(errorMessage);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

     test('failed login sets generic error message if no error.message', async () => {
      const { result } = renderHook(() => useLoginLogic());
      mockLoginService.mockRejectedValue({}); // Error without a message property
      mockSetPersistence.mockResolvedValue(undefined);

      act(() => {
        result.current.setUsername('test@example.com');
        result.current.setPassword('password');
      });

      await act(async () => {
        await result.current.handleLogin();
      });

      expect(result.current.loginError).toBe('Login failed. Please check your credentials and try again.');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});