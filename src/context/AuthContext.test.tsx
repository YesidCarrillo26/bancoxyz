import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/auth/authService';

jest.mock('../services/auth/authService');
const mockAuthService = authService as jest.Mocked<typeof authService>;

const mockUser = { id: 1, email: 'test@test.com', name: 'Test User' };
const mockToken = 'mock-token-123';

const TestConsumer = () => {
  const { user, token, isAuthenticated, isLoading, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user?.name ?? 'null'}</span>
      <span data-testid="token">{token ?? 'null'}</span>
      <span data-testid="isAuthenticated">{String(isAuthenticated)}</span>
      <span data-testid="isLoading">{String(isLoading)}</span>
      <button onClick={logout}>logout</button>
    </div>
  );
};

const LoginConsumer = () => {
  const { login } = useAuth();
  return <button onClick={() => login('a@a.com', '123')}>login</button>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('useAuth throws if used outside AuthProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useAuth must be used inside AuthProvider');
    spy.mockRestore();
  });

  it('initial state is null when localStorage empty', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('token').textContent).toBe('null');
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
  });

  it('hydrates from localStorage on mount', () => {
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    expect(screen.getByTestId('user').textContent).toBe('Test User');
    expect(screen.getByTestId('token').textContent).toBe(mockToken);
    expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
  });

  it('login saves token and user to state and localStorage', async () => {
    mockAuthService.login.mockResolvedValue({ token: mockToken, user: mockUser });
    render(<AuthProvider><TestConsumer /><LoginConsumer /></AuthProvider>);

    await act(async () => {
      screen.getByText('login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('Test User');
      expect(screen.getByTestId('token').textContent).toBe(mockToken);
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('true');
    });

    expect(localStorage.getItem('authToken')).toBe(mockToken);
    expect(JSON.parse(localStorage.getItem('authUser')!)).toEqual(mockUser);
  });

  it('logout clears state and localStorage', () => {
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    render(<AuthProvider><TestConsumer /></AuthProvider>);

    act(() => {
      screen.getByText('logout').click();
    });

    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(screen.getByTestId('token').textContent).toBe('null');
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('authUser')).toBeNull();
  });

  it('login propagates error from authService', async () => {
    mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));
    const { login } = (() => {
      let ctx: any;
      const Capture = () => { ctx = useAuth(); return null; };
      render(<AuthProvider><Capture /></AuthProvider>);
      return ctx;
    })();
    await act(async () => {
      await expect(login('bad@bad.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });
});
