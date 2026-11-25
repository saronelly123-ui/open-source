
import { useState } from 'react'
import { Menu } from 'lucide-react'

import Sidebar from './components/Sidebar'
import Header from './components/Header'

import Dashboard from './pages/Dashboard'
import ScanHistory from './pages/ScanHistory'
import Vulnerabilities from './pages/Vulnerabilities'
import Remediation from './pages/Remediation'
import Reports from './pages/Reports'

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')

  const closeMobileMenu = () => setMobileOpen(false)

  // Global search navigation
  const handleSearch = (value) => {
    setSearch(value)

    const query = value.toLowerCase().trim()

    if (!query) return

    if (
      query.includes('cve') ||
      query.includes('vulnerability') ||
      query.includes('vulnerabilities') ||
      query.includes('package') ||
      query.includes('dependency')
    ) {
      setActivePage('Vulnerabilities')
    } else if (
      query.includes('scan') ||
      query.includes('history') ||
      query.includes('payments-core-api')
    ) {
      setActivePage('Scan History')
    } else if (
      query.includes('resolved') ||
      query.includes('remediation') ||
      query.includes('accepted risk') ||
      query.includes('in progress')
    ) {
      setActivePage('Remediation')
    } else if (
      query.includes('report') ||
      query.includes('export') ||
      query.includes('csv')
    ) {
      setActivePage('Reports')
    } else if (
      query.includes('dashboard') ||
      query.includes('overview')
    ) {
      setActivePage('Overview')
    }
  }

  const renderPage = () => {
    switch (activePage) {
      case 'Overview':
        return <Dashboard />

      case 'Scan History':
        return <ScanHistory />

      case 'Vulnerabilities':
        return <Vulnerabilities />

      case 'Remediation':
        return <Remediation />

      case 'Reports':
        return <Reports />

      default:
        return (
          <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-8">
            <h2 className="text-xl font-bold text-slate-100">
              {activePage}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              This page is under development.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-[#181C24]">
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page)
          setSearch('')
        }}
        mobileOpen={mobileOpen}
        onClose={closeMobileMenu}
      />

      <div className="min-w-0 flex-1">

        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#303640] bg-[#0A0E16] px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#303640] text-slate-200 transition hover:bg-[#1C2028]"
          >
            <Menu size={23} />
          </button>

          <div>
            <h1 className="font-bold text-slate-100">DepShield</h1>
            <p className="font-mono text-[10px] tracking-wider text-cyan-400">
              V2.4 CORE
            </p>
          </div>
        </div>

        {/* Header with shared global search */}
        <Header
          search={search}
          onSearchChange={handleSearch}
        />

        <main className="min-h-screen p-4 sm:p-5 md:p-7">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
