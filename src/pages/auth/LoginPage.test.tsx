import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { useAuth } from '../../context/AuthContext';

jest.mock('../../context/AuthContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockNavigate = jest.fn();
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockLogin = jest.fn();

const renderLogin = (overrides = {}) => {
  mockUseAuth.mockReturnValue({
    user: null,
    token: null,
    login: mockLogin,
    logout: jest.fn(),
    isAuthenticated: false,
    isLoading: false,
    ...overrides,
  });
  return render(<MemoryRouter><LoginPage /></MemoryRouter>);
};

describe('LoginPage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows error when email is empty on submit', async () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findByText('Email is required.')).toBeInTheDocument();
  });

  it('shows error when email format is invalid', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'notanemail' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findByText('Enter a valid email.')).toBeInTheDocument();
  });

  it('shows error when password is empty on submit', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'valid@email.com' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findByText('Password is required.')).toBeInTheDocument();
  });

  it('calls login and navigates to /home on success', async () => {
    mockLogin.mockResolvedValue(undefined);
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'valid@email.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('valid@email.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('shows API error when login fails', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'valid@email.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument();
  });

  it('disables button and shows Signing in... when isLoading', () => {
    renderLogin({ isLoading: true });
    const btn = screen.getByRole('button', { name: /signing in/i });
    expect(btn).toBeDisabled();
    expect(btn.textContent).toBe('Signing in...');
  });

});
