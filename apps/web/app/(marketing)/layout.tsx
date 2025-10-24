import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { ChatWidget } from '../../components/support/ChatWidget'

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
      <ChatWidget />
    </div>
  )
}
