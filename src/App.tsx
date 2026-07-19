import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ConsolePage from '@/pages/ConsolePage'
import CompliancePage from '@/pages/CompliancePage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-sans)' }}>
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ConsolePage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="*" element={<ConsolePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
