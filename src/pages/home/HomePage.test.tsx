import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from './HomePage';
import { useAuth } from '../../context/AuthContext';

jest.mock('../../context/AuthContext');
jest.mock('../../components/BalanceCard', () => ({ BalanceCard: () => <div data-testid="balance-card" /> }));
jest.mock('../../components/ActionCards', () => ({ ActionCards: () => <div data-testid="action-cards" /> }));
jest.mock('../../components/Navbar', () => ({
  Navbar: ({ onLogout }: { onLogout: () => void }) => (
    <button onClick={onLogout} data-testid="logout-btn">Logout</button>
  ),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockNavigate = jest.fn();
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockLogout = jest.fn();

const renderHome = () => {
  mockUseAuth.mockReturnValue({
    user: { id: 1, email: 'a@a.com', name: 'Test' },
    token: 'tok',
    login: jest.fn(),
    logout: mockLogout,
    isAuthenticated: true,
    isLoading: false,
  });
  return render(<MemoryRouter><HomePage /></MemoryRouter>);
};

describe('HomePage', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls logout and navigates to / on logout click', () => {
    renderHome();
    fireEvent.click(screen.getByTestId('logout-btn'));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
