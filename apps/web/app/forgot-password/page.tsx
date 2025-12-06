import type { Metadata } from 'next';
import { ForgotPasswordContent } from './ForgotPasswordContent';

export const metadata: Metadata = {
  title: 'Passwort zurücksetzen – FindMyTherapy',
  description:
    'Setze dein Passwort zurück und erhalte wieder Zugriff auf dein FindMyTherapy-Konto.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}
