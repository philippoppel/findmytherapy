'use client';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { RegistrationForm } from './RegistrationForm';

jest.mock('../../../lib/analytics', () => ({
  track: jest.fn(),
}));

describe('RegistrationForm', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    (globalThis as typeof globalThis & { fetch?: typeof fetch }).fetch =
      fetchMock as unknown as typeof fetch;
  });

  afterAll(() => {
    // @ts-expect-error cleanup test override
    delete globalThis.fetch;
  });

  const mockFetchResponse = (payload: unknown, status = 200) =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: async () => payload,
    } as unknown as Response);

  it('registers a therapist and shows review confirmation', async () => {
    fetchMock.mockResolvedValueOnce(mockFetchResponse({ success: true }, 201));

    render(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Lena' } });
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'Huber' } });
    fireEvent.change(screen.getByLabelText(/^E-Mail$/i), { target: { value: 'lena@example.com' } });
    fireEvent.change(screen.getByLabelText(/Passwort$/i), { target: { value: 'Therapie123!' } });
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), {
      target: { value: 'Therapie123!' },
    });
    fireEvent.change(screen.getByLabelText(/Praxisstandort/i), { target: { value: 'Wien' } });

    fireEvent.click(screen.getByRole('button', { name: /Depression & Burnout/i }));
    fireEvent.click(screen.getByRole('button', { name: /Online/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Ich stimme den/i }));
    fireEvent.click(screen.getByRole('button', { name: /Registrierung abschließen/i }));

    expect(await screen.findByText(/Danke für deine Registrierung/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/register',
      expect.objectContaining({
        method: 'POST',
      }),
    );

    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.specialties).toEqual(['Depression & Burnout']);
    expect(body.modalities).toEqual(['ONLINE']);
    expect(screen.getByLabelText(/Vorname/i)).toHaveValue('');
  });

  it('submits organisation demo request', async () => {
    fetchMock.mockResolvedValueOnce(mockFetchResponse({ success: true }, 201));

    render(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/Ich interessiere mich als/i), {
      target: { value: 'ORGANISATION' },
    });
    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Alex' } });
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'Muster' } });
    fireEvent.change(screen.getByLabelText(/^E-Mail$/i), { target: { value: 'alex@example.com' } });
    fireEvent.change(screen.getByLabelText(/Unternehmen \/ Organisation/i), {
      target: { value: 'FindMyTherapy Health GmbH' },
    });
    fireEvent.change(screen.getByLabelText(/Worauf sollen wir uns vorbereiten/i), {
      target: { value: 'Bitte Fokus auf BGM.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Zugang anfragen/i }));

    expect(
      await screen.findByText(/Vielen Dank! Deine Anfrage ist bei uns angekommen./i),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/access-request',
      expect.objectContaining({
        method: 'POST',
      }),
    );
  });

  it('should render all required form fields for therapist registration', () => {
    render(<RegistrationForm />);

    expect(screen.getByLabelText(/Vorname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nachname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^E-Mail$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Passwort$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Passwort bestätigen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Praxisstandort/i)).toBeInTheDocument();
  });

  it('should show error message when passwords do not match', async () => {
    render(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/^E-Mail$/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Passwort$/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), {
      target: { value: 'DifferentPassword123!' },
    });
    fireEvent.change(screen.getByLabelText(/Praxisstandort/i), { target: { value: 'Wien' } });

    fireEvent.click(screen.getByRole('button', { name: /Depression & Burnout/i }));
    fireEvent.click(screen.getByRole('button', { name: /Online/i }));
    fireEvent.click(screen.getByRole('button', { name: /Registrierung abschließen/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwörter stimmen nicht überein/i)).toBeInTheDocument();
    });
  });

  it('should show error message when password is too short', async () => {
    render(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/^E-Mail$/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Passwort$/i), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText(/Praxisstandort/i), { target: { value: 'Wien' } });

    fireEvent.click(screen.getByRole('button', { name: /Depression & Burnout/i }));
    fireEvent.click(screen.getByRole('button', { name: /Online/i }));
    fireEvent.click(screen.getByRole('button', { name: /Registrierung abschließen/i }));

    await waitFor(() => {
      expect(screen.getByText(/mindestens 8 Zeichen/i)).toBeInTheDocument();
    });
  });

  it('should show error message when email is invalid', async () => {
    render(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/^E-Mail$/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/Passwort$/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText(/Praxisstandort/i), { target: { value: 'Wien' } });

    fireEvent.click(screen.getByRole('button', { name: /Depression & Burnout/i }));
    fireEvent.click(screen.getByRole('button', { name: /Online/i }));
    fireEvent.click(screen.getByRole('button', { name: /Registrierung abschließen/i }));

    await waitFor(() => {
      expect(screen.getByText(/gültige E-Mail/i)).toBeInTheDocument();
    });
  });

  it('should show error message when required fields are missing', async () => {
    render(<RegistrationForm />);

    const submitButton = screen.getByRole('button', { name: /Registrierung abschließen/i });
    fireEvent.click(submitButton);

    // Check that form doesn't submit successfully when required fields are empty
    await waitFor(() => {
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  it('should disable submit button while submitting', async () => {
    fetchMock.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/^E-Mail$/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Passwort$/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText(/Praxisstandort/i), { target: { value: 'Wien' } });

    fireEvent.click(screen.getByRole('button', { name: /Depression & Burnout/i }));
    fireEvent.click(screen.getByRole('button', { name: /Online/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Ich stimme den/i }));

    const submitButton = screen.getByRole('button', { name: /Registrierung abschließen/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should handle API error responses', async () => {
    fetchMock.mockResolvedValueOnce(mockFetchResponse({ error: 'Email already exists' }, 400));

    render(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/Vorname/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Nachname/i), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/^E-Mail$/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Passwort$/i), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText(/Passwort bestätigen/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText(/Praxisstandort/i), { target: { value: 'Wien' } });

    fireEvent.click(screen.getByRole('button', { name: /Depression & Burnout/i }));
    fireEvent.click(screen.getByRole('button', { name: /Online/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Ich stimme den/i }));
    fireEvent.click(screen.getByRole('button', { name: /Registrierung abschließen/i }));

    await waitFor(
      () => {
        expect(
          screen.getByText(/Ein Fehler ist aufgetreten|Email already exists/i),
        ).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('should allow selecting multiple specialties', () => {
    render(<RegistrationForm />);

    const depressionButton = screen.getByRole('button', { name: /Depression & Burnout/i });
    const anxietyButton = screen.getByRole('button', { name: /Angst & Panik/i });

    fireEvent.click(depressionButton);
    fireEvent.click(anxietyButton);

    expect(depressionButton.className).toContain('bg-primary');
    expect(anxietyButton.className).toContain('bg-primary');
  });

  it('should allow selecting modality format', () => {
    render(<RegistrationForm />);

    const onlineButton = screen.getByRole('button', { name: /Online/i });
    fireEvent.click(onlineButton);

    expect(onlineButton.className).toMatch(/bg-(primary|secondary)/);
  });

  it('should switch between different roles', () => {
    render(<RegistrationForm />);

    const roleSelect = screen.getByLabelText(/Ich interessiere mich als/i);

    fireEvent.change(roleSelect, { target: { value: 'ORGANISATION' } });
    expect(screen.getByLabelText(/Unternehmen \/ Organisation/i)).toBeInTheDocument();

    fireEvent.change(roleSelect, { target: { value: 'PRIVATE' } });
    expect(screen.queryByLabelText(/Praxisstandort/i)).not.toBeInTheDocument();
  });
});
