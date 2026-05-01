import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page correctly', () => {
  render(<App />);
  const titleElement = screen.getByText(/BancoXYZ/i);
  expect(titleElement).toBeInTheDocument();
});
