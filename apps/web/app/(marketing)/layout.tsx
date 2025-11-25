import Image from 'next/image';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { ChatWidget } from '../../components/support/ChatWidget';
import { FeatureGate } from '@/components/FeatureGate';
import { MatchingWizardProvider } from '../components/matching/MatchingWizardContext';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <MatchingWizardProvider>
      <div className="relative min-h-screen flex flex-col">
        {/* Global background image */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/85" />
        </div>

        <Header />
        <main className="flex-1 pt-20 sm:pt-24">{children}</main>
        <Footer />
        <FeatureGate feature="CHATBOT">
          <ChatWidget />
        </FeatureGate>
      </div>
    </MatchingWizardProvider>
  );
}
