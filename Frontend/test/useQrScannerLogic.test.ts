import { renderHook, act } from '@testing-library/react';
import { useQrScannerPageLogic } from '../src/hooks/useQrScannerLogic'; 
import { useNavigate, useParams } from 'react-router-dom';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe('useQrScannerPageLogic', () => {
  const mockNavigate = jest.fn();
  const mockUseParams = useParams as jest.Mock;
  const mockUseNavigate = useNavigate as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  test('initial state is correct and params are used', () => {
    const mockRoomId = 'room123';
    const mockUserId = 'user456';
    mockUseParams.mockReturnValue({ roomId: mockRoomId, userId: mockUserId });

    const { result } = renderHook(() => useQrScannerPageLogic());

    expect(result.current.firstName).toBe('');
    expect(result.current.lastName).toBe('');
    expect(result.current.csiEmail).toBe('');
    expect(result.current.roomId).toBe(mockRoomId);
    expect(result.current.userId).toBe(mockUserId);
    expect(useParams).toHaveBeenCalledTimes(1);
  });

  test('handleExit navigates to "/"', () => {
    mockUseParams.mockReturnValue({ roomId: 'testRoom', userId: 'testUser' });
    const { result } = renderHook(() => useQrScannerPageLogic());

    act(() => {
      result.current.handleExit();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  describe('handleGenerateQrCode', () => {
    const mockPreventDefault = jest.fn();
    const mockEvent = {
      preventDefault: mockPreventDefault,
    } as unknown as React.FormEvent<HTMLFormElement>;

    beforeEach(() => {
      mockPreventDefault.mockClear();
      // Mock window.alert
      global.alert = jest.fn();
      // Mock console.log
      console.log = jest.fn();
    });

    test('calls preventDefault, logs, and alerts with correct data', async () => {
      const testFirstName = 'John';
      const testLastName = 'Doe';
      const testCsiEmail = 'john.doe@csi.cuny.edu';
      const testRoomId = 'roomA';
      const testUserId = 'userB';

      mockUseParams.mockReturnValue({ roomId: testRoomId, userId: testUserId });
      const { result } = renderHook(() => useQrScannerPageLogic());

      act(() => {
        result.current.setFirstName(testFirstName);
        result.current.setLastName(testLastName);
        result.current.setCsiEmail(testCsiEmail);
      });

      await act(async () => {
        await result.current.handleGenerateQrCode(mockEvent);
      });

      expect(mockPreventDefault).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith('Attempting to generate QR Code for:', {
        firstName: testFirstName,
        lastName: testLastName,
        csiEmail: testCsiEmail,
        roomId: testRoomId, // This comes from useParams, not state in the callback
        userId: testUserId, // This comes from useParams, not state in the callback
      });
      expect(global.alert).toHaveBeenCalledWith(
        `A new QR code would be sent to ${testCsiEmail} (Implementation needed for actual QR generation and email service).`
      );
    });

    test('uses current state values for firstName, lastName, csiEmail in callback', async () => {
        mockUseParams.mockReturnValue({ roomId: 'anyRoom', userId: 'anyUser' });
        const { result } = renderHook(() => useQrScannerPageLogic());

        const initialFirstName = 'Initial';
        const updatedFirstName = 'UpdatedFirst';
        const initialLastName = 'User';
        const updatedLastName = 'UserLastName';
        const initialEmail = 'initial@example.com';
        const updatedEmail = 'updated@example.com';


        act(() => {
            result.current.setFirstName(initialFirstName);
            result.current.setLastName(initialLastName);
            result.current.setCsiEmail(initialEmail);
        });

        // Simulate user typing and changing values before submitting
        act(() => {
            result.current.setFirstName(updatedFirstName);
            result.current.setLastName(updatedLastName);
            result.current.setCsiEmail(updatedEmail);
        });

        await act(async () => {
            await result.current.handleGenerateQrCode(mockEvent);
        });

        expect(console.log).toHaveBeenCalledWith('Attempting to generate QR Code for:', {
            firstName: updatedFirstName,
            lastName: updatedLastName,
            csiEmail: updatedEmail,
            roomId: 'anyRoom',
            userId: 'anyUser',
        });
        expect(global.alert).toHaveBeenCalledWith(
            `A new QR code would be sent to ${updatedEmail} (Implementation needed for actual QR generation and email service).`
        );
    });
  });

  test('setters update state correctly', () => {
    mockUseParams.mockReturnValue({ roomId: 'testRoom', userId: 'testUser' });
    const { result } = renderHook(() => useQrScannerPageLogic());

    const newFirstName = 'Jane';
    const newLastName = 'Doe';
    const newCsiEmail = 'jane.doe@csi.cuny.edu';

    act(() => {
      result.current.setFirstName(newFirstName);
    });
    expect(result.current.firstName).toBe(newFirstName);

    act(() => {
      result.current.setLastName(newLastName);
    });
    expect(result.current.lastName).toBe(newLastName);

    act(() => {
      result.current.setCsiEmail(newCsiEmail);
    });
    expect(result.current.csiEmail).toBe(newCsiEmail);
  });
});