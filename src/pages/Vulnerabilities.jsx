
import { useMemo, useState } from 'react'

import {
  Box,
  GitBranch,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Search,
  Download,
  WandSparkles,
  Filter,
  Columns3,
  Copy,
  Share2,
  ArrowUpRight,
  Clock3,
  Package,
  ExternalLink,
  ShieldCheck,
  Activity,
} from 'lucide-react'

const vulnerabilities = [
  {
    id: 'CVE-2024-38063',
    package: 'express-fileupload',
    version: '1.4.0',
    ecosystem: 'npm',
    severity: 'Critical',
    cvss: '9.8',
    epss: '84.2%',
    reachability: 'Reachable',
    description: 'Prototype pollution vulnerability in express-fileupload allows remote unauthenticated attackers to execute arbitrary code or trigger denial of service.',
    fix: '1.5.0',
    path: 'direct dependency: billing-service',
    cisa: true,
    category: 'RCE',
    status: 'Active',
  },
  {
    id: 'CVE-2023-45853',
    package: 'zlib',
    version: '1.2.11',
    ecosystem: 'npm',
    severity: 'Critical',
    cvss: '9.8',
    epss: '4.1%',
    reachability: 'Unreachable',
    description: 'A buffer overflow vulnerability in the zlib package may allow an attacker to cause unexpected application behavior.',
    fix: '1.3.1',
    path: 'transitive via image-processor',
    cisa: false,
    category: 'Buffer Overflow',
    status: 'Active',
  },
  {
    id: 'CVE-2024-29041',
    package: 'axios',
    version: '1.6.0',
    ecosystem: 'npm',
    severity: 'High',
    cvss: '7.5',
    epss: '12.5%',
    reachability: 'Reachable',
    description: 'A security issue affecting HTTP request handling in the installed package version.',
    fix: '1.7.4',
    path: 'direct dependency: api-client',
    cisa: false,
    category: 'SSRF',
    status: 'Active',
  },
  {
    id: 'CVE-2024-12345',
    package: 'requests',
    version: '2.28.0',
    ecosystem: 'PyPI',
    severity: 'Medium',
    cvss: '5.3',
    epss: '2.3%',
    reachability: 'Unreachable',
    description: 'A security weakness in request processing could expose applications to unexpected behavior.',
    fix: '2.32.0',
    path: 'transitive via data-service',
    cisa: false,
    category: 'Security Misconfiguration',
    status: 'Active',
  },
  {
    id: 'CVE-2024-55555',
    package: 'golang.org/x/net',
    version: '0.17.0',
    ecosystem: 'Go',
    severity: 'Low',
    cvss: '3.1',
    epss: '0.8%',
    reachability: 'Unreachable',
    description: 'A low severity issue affecting a network dependency.',
    fix: '0.25.0',
    path: 'transitive via gateway',
    cisa: false,
    category: 'Information Disclosure',
    status: 'Resolved',
  },
]

const tabs = [
  'Active & Reachable',
  'Unreachable in Call-Graph',
  'Ignored/Snoozed',
  'Resolved',
]

const severityFilters = [
  'All',
  'Critical',
  'High',
  'Medium',
  'Low',
]

function severityStyle(severity) {
  const styles = {
    Critical: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    High: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    Medium: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    Low: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  }

  return styles[severity] || styles.Low
}

function Vulnerabilities() {
  const [activeTab, setActiveTab] = useState('Active & Reachable')
  const [severity, setSeverity] = useState('All')
  const [ecosystem, setEcosystem] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState('CVE-2024-38063')

  const selectedVulnerability = vulnerabilities.find(
    (item) => item.id === selectedId
  )

  const filteredVulnerabilities = useMemo(() => {
    return vulnerabilities.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.package.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())

      const matchesSeverity =
        severity === 'All' || item.severity === severity

      const matchesEcosystem =
        ecosystem === 'All' || item.ecosystem === ecosystem

      let matchesTab = true

      if (activeTab === 'Active & Reachable') {
        matchesTab = item.status === 'Active' && item.reachability === 'Reachable'
      } else if (activeTab === 'Unreachable in Call-Graph') {
        matchesTab = item.status === 'Active' && item.reachability === 'Unreachable'
      } else if (activeTab === 'Resolved') {
        matchesTab = item.status === 'Resolved'
      } else if (activeTab === 'Ignored/Snoozed') {
        matchesTab = item.status === 'Ignored'
      }

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesEcosystem &&
        matchesTab
      )
    })
  }, [activeTab, severity, ecosystem, search])

  const stats = [
    {
      title: 'Target Repository',
      value: 'org/payments-core-api',
      detail: 'direct: 48',
      icon: Box,
      color: 'text-cyan-400',
    },
    {
      title: 'Call-Graph Reachability',
      value: '58.3%',
      detail: '14 of 24 reachable',
      icon: GitBranch,
      color: 'text-rose-400',
    },
    {
      title: 'CISA KEV Matched',
      value: '2 Exploited',
      detail: 'URGENT',
      icon: AlertTriangle,
      color: 'text-red-400',
    },
    {
      title: 'Automated Fix Coverage',
      value: '87.5%',
      detail: '21 fixes verified',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
  ]

  return (
    <div className="space-y-5">

      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-slate-500">
            Security Workspace / Vulnerabilities
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-100">
            CVE Vulnerabilities
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Identify, investigate and remediate dependency security risks.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
          <Activity size={15} className="text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">
            Scanner Active
          </span>
        </div>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="flex min-h-[100px] items-center justify-between gap-3 rounded-md border border-[#303640] bg-[#1C2028] p-4"
            >
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  {stat.title}
                </p>

                <h3 className={`mt-2 break-words text-lg font-bold ${stat.color}`}>
                  {stat.value}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {stat.detail}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#303640]">
                <Icon size={21} className={stat.color} />
              </div>
            </div>
          )
        })}
      </section>

      {/* Search and filters */}
      <section className="space-y-4 rounded-lg border border-[#303640] bg-[#1C2028] p-4">

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[220px] flex-1 items-center gap-3 rounded-md border border-[#303640] bg-[#0F141B] px-4 py-3">
            <Search size={18} className="shrink-0 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by CVE ID, package name, CWE, or ecosystem..."
              className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
            />

            <span className="hidden rounded bg-[#303640] px-2 py-1 font-mono text-[10px] text-slate-400 sm:block">
              ESC
            </span>
          </div>

          <button
            onClick={() => window.alert('VEX / CSAF export will be connected to the backend.')}
            className="flex items-center gap-2 rounded-md border border-[#303640] px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            <Download size={16} />
            Export VEX / CSAF
          </button>

          <button
            onClick={() => window.alert('Batch remediation will be connected to the backend.')}
            className="flex items-center gap-2 rounded-md bg-cyan-500 px-4 py-3 text-sm font-semibold text-[#07131B] transition hover:bg-cyan-400"
          >
            <WandSparkles size={17} />
            Batch Remediate (4)
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition ${
                activeTab === tab
                  ? 'border-cyan-500/30 bg-[#303640] text-cyan-400'
                  : 'border-transparent text-slate-300 hover:bg-[#262A33]'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${
                activeTab === tab ? 'bg-cyan-400' : 'bg-slate-500'
              }`} />
              {tab}
              <span className="rounded bg-[#303640] px-2 py-0.5 font-mono text-[10px]">
                {tab === 'Active & Reachable' ? 14 :
                 tab === 'Unreachable in Call-Graph' ? 7 :
                 tab === 'Ignored/Snoozed' ? 2 : 48}
              </span>
            </button>
          ))}
        </div>

        {/* Ecosystem filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Ecosystem:
          </span>

          {['All', 'npm', 'Go', 'PyPI'].map((item) => (
            <button
              key={item}
              onClick={() => setEcosystem(item)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                ecosystem === item
                  ? 'bg-[#303640] text-cyan-400'
                  : 'bg-[#0F141B] text-slate-300 hover:text-cyan-400'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Severity filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Severity:
          </span>

          {severityFilters.map((item) => (
            <button
              key={item}
              onClick={() => setSeverity(item)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                severity === item
                  ? 'border-cyan-500/30 bg-[#303640] text-cyan-400'
                  : 'border-transparent bg-[#0F141B] text-slate-300 hover:border-[#475569]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* Inventory and inspector */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.85fr]">

        {/* Vulnerability Inventory */}
        <div className="min-w-0 overflow-hidden rounded-lg border border-[#303640] bg-[#1C2028]">

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#303640] p-4">
            <div className="flex items-center gap-3">
              <ShieldAlert size={19} className="text-cyan-400" />

              <h3 className="font-semibold text-slate-100">
                Vulnerability Inventory
              </h3>

              <span className="rounded bg-[#303640] px-2 py-1 font-mono text-[10px] text-slate-300">
                {filteredVulnerabilities.length} Selected Scope
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <Filter size={17} />
              <Columns3 size={17} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[690px] text-left">
              <thead className="bg-[#0F141B]">
                <tr className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-4">Vulnerability / Package</th>
                  <th className="px-3 py-4">CVSS / EPSS</th>
                  <th className="px-3 py-4">Reachability</th>
                  <th className="px-3 py-4">Fix Path & Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredVulnerabilities.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`cursor-pointer border-t border-[#303640] transition ${
                      selectedId === item.id
                        ? 'bg-[#262A33]'
                        : 'hover:bg-[#222832]'
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${
                          item.severity === 'Critical' ? 'bg-rose-400' :
                          item.severity === 'High' ? 'bg-cyan-400' :
                          item.severity === 'Medium' ? 'bg-emerald-400' :
                          'bg-slate-500'
                        }`} />

                        <div>
                          <p className="font-mono text-sm font-semibold text-cyan-400">
                            {item.id}
                          </p>

                          <span className={`mt-1 inline-block rounded px-2 py-0.5 text-[9px] font-bold ${severityStyle(item.severity)}`}>
                            {item.category}
                          </span>

                          <p className="mt-2 text-xs font-semibold text-slate-200">
                            {item.package}
                            <span className="font-mono text-slate-500">
                              {' '}@{item.version}
                            </span>
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            {item.path}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4">
                      <span className={`rounded px-2 py-1 text-xs font-bold ${severityStyle(item.severity)}`}>
                        {item.cvss} {item.severity.toUpperCase()}
                      </span>

                      <p className="mt-2 font-mono text-[10px] text-slate-400">
                        ⚡ {item.epss} EPSS
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <p className={`text-xs font-semibold ${
                        item.reachability === 'Reachable'
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}>
                        {item.reachability}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        {item.cisa ? 'Public PoC Active' : 'Dependency analysis'}
                      </p>
                    </td>

                    <td className="px-3 py-4">
                      <p className="font-mono text-[10px] text-slate-400">
                        Upgrade to
                      </p>

                      <p className="mt-1 font-mono text-xs font-semibold text-emerald-400">
                        {item.fix}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.alert('Fix PR creation will be connected to the backend.')
                        }}
                        className="mt-2 whitespace-nowrap rounded bg-cyan-500 px-2.5 py-2 text-[10px] font-bold text-[#07131B] hover:bg-cyan-400"
                      >
                        <WandSparkles size={12} className="mr-1 inline" />
                        Create Fix PR
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredVulnerabilities.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-12 text-center">
                      <Search size={25} className="mx-auto text-slate-500" />
                      <p className="mt-3 text-sm text-slate-300">
                        No vulnerabilities found
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vulnerability Details Inspector */}
        <div className="min-w-0 rounded-lg border border-[#303640] bg-[#1C2028]">

          {selectedVulnerability ? (
            <>
              <div className="border-b border-[#303640] p-4">

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded bg-rose-600 px-2.5 py-1 font-mono text-[10px] font-bold text-white">
                      CRITICAL CVSS {selectedVulnerability.cvss}
                    </span>

                    {selectedVulnerability.cisa && (
                      <span className="rounded bg-red-700 px-2.5 py-1 font-mono text-[10px] font-bold text-white">
                        CISA KEV LISTED
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 text-slate-400">
                    <button
                      title="Copy CVE ID"
                      onClick={() => navigator.clipboard.writeText(selectedVulnerability.id)}
                      className="hover:text-cyan-400"
                    >
                      <Copy size={17} />
                    </button>

                    <button
                      title="Share vulnerability"
                      onClick={() => window.alert('Sharing will be connected later.')}
                      className="hover:text-cyan-400"
                    >
                      <Share2 size={17} />
                    </button>
                  </div>
                </div>

                <h3 className="mt-5 break-all text-2xl font-bold text-slate-100">
                  {selectedVulnerability.id}
                </h3>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div>
                    <p className="font-mono text-[10px] text-slate-500">
                      Package
                    </p>
                    <p className="mt-1 break-words text-xs font-semibold text-slate-200">
                      {selectedVulnerability.package}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] text-slate-500">
                      Version
                    </p>
                    <p className="mt-1 font-mono text-xs text-rose-400">
                      {selectedVulnerability.version}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] text-slate-500">
                      Ecosystem
                    </p>
                    <p className="mt-1 text-xs text-slate-200">
                      {selectedVulnerability.ecosystem}
                    </p>
                  </div>
                </div>
              </div>

              {/* EPSS */}
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                      EPSS Probability (30-day window)
                    </p>

                    <p className="mt-2 text-2xl font-bold text-rose-400">
                      {selectedVulnerability.epss}
                    </p>

                    <span className="mt-1 inline-block rounded bg-rose-500/10 px-2 py-1 font-mono text-[10px] text-rose-300">
                      Exploitation Probability
                    </span>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-[5px] border-rose-400/30">
                    <AlertTriangle size={25} className="text-rose-400" />
                  </div>
                </div>

                {/* Description */}
                <div className="mt-5 border-t border-[#303640] pt-4">
                  <h4 className="text-sm font-semibold text-slate-200">
                    Vulnerability Description
                  </h4>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {selectedVulnerability.description}
                  </p>
                </div>

                {/* Technical details */}
                <div className="mt-5 space-y-3 border-t border-[#303640] pt-4">
                  <h4 className="text-sm font-semibold text-slate-200">
                    Technical Details
                  </h4>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      CVSS Score
                    </span>
                    <span className="font-mono text-xs font-bold text-rose-400">
                      {selectedVulnerability.cvss}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Reachability
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      {selectedVulnerability.reachability}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Dependency Type
                    </span>
                    <span className="text-xs text-slate-200">
                      {selectedVulnerability.path.startsWith('direct')
                        ? 'Direct'
                        : 'Transitive'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      CISA KEV
                    </span>
                    <span className={`text-xs font-semibold ${
                      selectedVulnerability.cisa
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}>
                      {selectedVulnerability.cisa ? 'Listed' : 'Not listed'}
                    </span>
                  </div>
                </div>

                {/* Fix recommendation */}
                <div className="mt-5 rounded-md border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={17} className="text-emerald-400" />
                    <h4 className="text-sm font-semibold text-emerald-400">
                      Recommended Fix
                    </h4>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Upgrade the affected package to the recommended version.
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-slate-300">
                      {selectedVulnerability.package}
                    </span>

                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {selectedVulnerability.fix}
                      <ArrowUpRight size={13} className="ml-1 inline" />
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => window.alert('Fix PR will be connected to the backend.')}
                    className="flex items-center justify-center gap-2 rounded-md bg-cyan-500 px-3 py-3 text-xs font-bold text-[#07131B] hover:bg-cyan-400"
                  >
                    <WandSparkles size={15} />
                    Create Fix PR
                  </button>

                  <button
                    onClick={() => window.alert('Remediation status will be connected to the backend.')}
                    className="flex items-center justify-center gap-2 rounded-md border border-[#3B4552] px-3 py-3 text-xs font-semibold text-slate-300 hover:border-cyan-400 hover:text-cyan-400"
                  >
                    <Clock3 size={15} />
                    Mark for Review
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500">
                  <Package size={13} />
                  Sample vulnerability data
                  <ExternalLink size={12} className="ml-auto" />
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
              <ShieldAlert size={35} className="text-slate-500" />
              <h3 className="mt-3 font-semibold text-slate-200">
                Select a vulnerability
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                Select an item from the inventory to view its details.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer information */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#303640] py-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Activity size={14} className="text-emerald-400" />
          DepShield Vulnerability Scanner
        </div>

        <div className="font-mono text-[10px] text-slate-500">
          V2.4 CORE · Security Monitoring
        </div>
      </div>

    </div>
  )
}

export default Vulnerabilities
