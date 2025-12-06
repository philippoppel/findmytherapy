import type { Metadata } from 'next';
import { RegisterPageClient } from './RegisterPageClient';

export const metadata: Metadata = {
  title: 'Registrierung – FindMyTherapy',
  description:
    'Registriere dich für den FindMyTherapy-Zugang. Wähle dein Profil aus und wir melden uns mit dem passenden Onboarding.',
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
