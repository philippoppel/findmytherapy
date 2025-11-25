import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { ChatWidget } from '../../components/support/ChatWidget';
import { FeatureGate } from '@/components/FeatureGate';
import { MatchingWizardProvider } from '../components/matching/MatchingWizardContext';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <MatchingWizardProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-surface pt-20 sm:pt-24">{children}</main>
        <Footer />
        <FeatureGate feature="CHATBOT">
          <ChatWidget />
        </FeatureGate>
      </div>
    </MatchingWizardProvider>
  );
}
