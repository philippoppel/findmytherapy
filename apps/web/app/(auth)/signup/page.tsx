import type { Metadata } from 'next';
import { SignupPageContent } from './SignupPageContent';

export const metadata: Metadata = {
  title: 'Konto erstellen – FindMyTherapy',
  description:
    'Registriere dich als Kund:in für FindMyTherapy. Behalte deine Kurse, Empfehlungen und Support-Kontakte im Blick.',
};

export default function ClientSignupPage() {
  return <SignupPageContent />;
}
