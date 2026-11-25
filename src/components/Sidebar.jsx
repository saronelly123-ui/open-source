
import {
  LayoutDashboard,
  Network,
  ShieldAlert,
  History,
  FileCheck,
  Boxes,
  Wrench,
  FileBarChart,
  Settings,
  ShieldCheck,
  Activity,
  RefreshCw,
  X,
} from 'lucide-react'

const menuItems = [
  { name: 'Overview', label: 'Overview Dashboard', icon: LayoutDashboard },
  { name: 'Dependency Tree', label: 'Dependency Tree & Graph', icon: Network },
  { name: 'Vulnerabilities', label: 'CVE Vulnerabilities', icon: ShieldAlert },
  { name: 'Scan History', label: 'Scan History', icon: History },
  { name: 'License Compliance', label: 'License & Compliance', icon: FileCheck },
  { name: 'SBOM Inspection', label: 'SBOM Inspection', icon: Boxes },
  { name: 'Remediation', label: 'Auto Remediation / PRs', icon: Wrench },
  { name: 'Reports', label: 'Reports & Export', icon: FileBarChart },
]

function Sidebar({ activePage, onNavigate, mobileOpen, onClose }) {
  const navigate = (page) => {
    onNavigate(page)
    onClose?.()
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex min-h-screen w-72 shrink-0 flex-col border-r border-[#303640] bg-[#0A0E16] transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:w-64 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >

        {/* Logo */}
        <div className="flex items-center justify-between border-b border-[#303640] px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
              <ShieldCheck size={25} className="text-cyan-400" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-200">
                DepShield
              </h1>
              <p className="font-mono text-[11px] font-bold tracking-[2px] text-cyan-400">
                V2.4 CORE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-400 hover:bg-[#262A33] hover:text-white lg:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* Target Engine */}
        <div className="border-b border-[#303640] p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Target Engine
            </p>

            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              SECURE
            </span>
          </div>

          <div className="flex items-center justify-between rounded-md border border-[#303640] bg-[#181C24] px-3 py-3">
            <span className="font-mono text-xs text-slate-300">
              vulnerability-scanner.daemon
            </span>
            <Activity size={16} className="shrink-0 text-cyan-400" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.name

            return (
              <button
                key={item.name}
                onClick={() => navigate(item.name)}
                className={`flex w-full items-center gap-3 rounded-md border-l-[3px] px-3 py-3 text-left text-sm transition ${
                  isActive
                    ? 'border-cyan-400 bg-[#262A33] text-cyan-400'
                    : 'border-transparent text-slate-300 hover:bg-[#1C2028] hover:text-white'
                }`}
              >
                <Icon size={19} className="shrink-0" />
                <span className="font-medium">{item.label}</span>

                {item.name === 'Vulnerabilities' && (
                  <span className="ml-auto rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-300">
                    15
                  </span>
                )}

                {item.name === 'Remediation' && (
                  <span className="ml-auto rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                    4
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#303640] p-4">
          <div className="rounded-md border border-[#303640] bg-[#181C24] p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Sync Cycle
              </span>
              <RefreshCw size={15} className="text-emerald-400" />
            </div>

            <p className="mt-2 font-mono text-xs font-semibold text-slate-300">
              5m ago (Auto)
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Cluster Health
            </span>
            <span className="font-mono text-xs font-bold text-cyan-400">
              99.98%
            </span>
          </div>

          <button
            onClick={() => navigate('Settings')}
            className="mt-4 flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400"
          >
            <Settings size={15} />
            Settings
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
