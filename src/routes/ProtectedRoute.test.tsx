import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockAuthBase = {
  user: null,
  token: null,
  login: jest.fn(),
  logout: jest.fn(),
  isLoading: false,
  isAuthenticated: false,
};

const renderWithRouter = (isAuthenticated: boolean, RouteComponent: React.ComponentType) => {
  mockUseAuth.mockReturnValue({ ...mockAuthBase, isAuthenticated });
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route element={<RouteComponent />}>
          <Route path="/protected" element={<div>Protected Content</div>} />
        </Route>
        <Route path="/" element={<div>Login Page</div>} />
        <Route path="/home" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProtectedRoute', () => {
  it('renders Outlet when authenticated', () => {
    renderWithRouter(true, ProtectedRoute);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to / when not authenticated', () => {
    renderWithRouter(false, ProtectedRoute);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

describe('GuestRoute', () => {
  it('renders Outlet when not authenticated', () => {
    renderWithRouter(false, GuestRoute);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /home when authenticated', () => {
    renderWithRouter(true, GuestRoute);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
