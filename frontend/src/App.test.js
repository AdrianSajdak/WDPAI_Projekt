import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

const renderApp = () =>
  render(
    <AuthProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </AuthProvider>
  );

test('renders hero headline on home page', () => {
  renderApp();
  expect(
    screen.getByText(/Manage your gym life with clarity and confidence/i)
  ).toBeInTheDocument();
});
