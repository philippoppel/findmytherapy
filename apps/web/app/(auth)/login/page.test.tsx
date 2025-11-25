/**
 * Login Page Tests
 * Tests login functionality including successful login, error handling, and validation
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

describe('LoginPage', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch;
    // Mock window.location.href
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render login form with all elements', () => {
    render(<LoginPage />);

    expect(screen.getByRole('heading', { name: /anmelden/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passwort/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /anmelden/i })).toBeInTheDocument();
    expect(screen.getByText(/test-zugangsdaten/i)).toBeInTheDocument();
  });

  it('should have pre-filled test credentials', () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/passwort/i) as HTMLInputElement;

    expect(emailInput.value).toBe('dr.mueller@example.com');
    expect(passwordInput.value).toBe('Therapist123!');
  });

  it('should successfully login with valid credentials', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/passwort/i);
    const submitButton = screen.getByRole('button', { name: /anmelden/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'TestPassword123!' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/auth-custom/login',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'TestPassword123!',
            totp: '',
          }),
        }),
      );
    });
  });

  it('should show loading state during login', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /anmelden/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /lädt/i })).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it('should display error message for invalid credentials', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'INVALID_CREDENTIALS' }),
    });

    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /anmelden/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/ungültige e-mail oder passwort/i)).toBeInTheDocument();
    });
  });

  it('should display error message for 2FA required', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'TOTP_REQUIRED' }),
    });

    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /anmelden/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/2fa-code erforderlich/i)).toBeInTheDocument();
    });
  });

  it('should display error message for invalid 2FA code', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'TOTP_INVALID' }),
    });

    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /anmelden/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/ungültiger 2fa-code/i)).toBeInTheDocument();
    });
  });

  it('should display generic error message for unknown errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'SOME_UNKNOWN_ERROR' }),
    });

    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /anmelden/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/some_unknown_error/i)).toBeInTheDocument();
    });
  });

  it('should display error message for network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /anmelden/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/ein unerwarteter fehler ist aufgetreten/i)).toBeInTheDocument();
    });
  });

  it('should trim and lowercase email before submission', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /anmelden/i });

    fireEvent.change(emailInput, { target: { value: '  Test@Example.COM  ' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/auth-custom/login',
        expect.objectContaining({
          body: expect.stringContaining('test@example.com'),
        }),
      );
    });
  });

  it('should disable form inputs during login', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/passwort/i);
    const submitButton = screen.getByRole('button', { name: /anmelden/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });

  it('should have link to homepage', () => {
    render(<LoginPage />);

    const homepageLink = screen.getByRole('link', { name: /zur startseite/i });
    expect(homepageLink).toBeInTheDocument();
    expect(homepageLink).toHaveAttribute('href', '/');
  });

  it('should require email and password fields', () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/passwort/i);

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it('should have correct input types', () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/passwort/i);

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should redirect to dashboard on successful login', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /anmelden/i });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect((window as any).location.href).toBe('/dashboard');
      },
      { timeout: 3000 },
    );
  });

  it('should not submit if already loading', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<LoginPage />);

    const submitButton = screen.getByRole('button', { name: /anmelden/i });

    fireEvent.click(submitButton);
    fireEvent.click(submitButton); // Second click should be ignored

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
