import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { ChatWidget } from '../../components/support/ChatWidget'
import { FeatureGate } from '@/components/FeatureGate'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-surface">
        {children}
      </main>
      <Footer />
      <FeatureGate feature="CHATBOT">
        <ChatWidget />
      </FeatureGate>
    </div>
  )
}
