
import { useMemo, useState } from 'react'

import {
  ShieldAlert,
  Search,
  Filter,
  Columns3,
  Copy,
  ExternalLink,
  Package,
  ShieldCheck,
  Activity,
  GitBranch,
  CheckCircle2,
} from 'lucide-react'

// Convert scanner results into a consistent format
function normalizeVulnerability(item, index) {
  const packageName =
    typeof item.package === 'string'
      ? item.package
      : item.package?.name || item.name || 'Unknown package'

  const severityValue = String(
    item.severity || item.database_specific?.severity || 'Unknown'
  ).toUpperCase()

  const severity = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(
    severityValue
  )
    ? severityValue.charAt(0) + severityValue.slice(1).toLowerCase()
    : 'Unknown'

  return {
    id: item.id || item.cve || `Finding-${index + 1}`,
    package: packageName,
    version: item.version || item.package?.version || 'Unknown',
    ecosystem: item.ecosystem || 'npm',
    severity,
    description:
      item.summary ||
      item.description ||
      item.details ||
      'No vulnerability description was provided by the scanner.',
    url:
      item.url ||
      item.references?.[0]?.url ||
      null,
  }
}

function severityStyle(severity) {
  const styles = {
    Critical: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
    High: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    Low: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    Unknown: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  }

  return styles[severity] || styles.Unknown
}

function Vulnerabilities({ latestScan }) {
  const [activeTab, setActiveTab] = useState('All Findings')
  const [severity, setSeverity] = useState('All')
  const [ecosystem, setEcosystem] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState('')

  // Get vulnerability results from the latest scan
  const vulnerabilities = useMemo(() => {
    const findings =
      latestScan?.vulnerabilityDetails ||
      (Array.isArray(latestScan?.vulnerabilities)
        ? latestScan.vulnerabilities
        : [])

    return findings.map(normalizeVulnerability)
  }, [latestScan])

  const severityFilters = [
    'All',
    'Critical',
    'High',
    'Medium',
    'Low',
    'Unknown',
  ]

  const ecosystems = [
    'All',
    ...new Set(vulnerabilities.map((item) => item.ecosystem)),
  ]

  const criticalCount = vulnerabilities.filter(
    (item) => item.severity === 'Critical'
  ).length

  const highCount = vulnerabilities.filter(
    (item) => item.severity === 'High'
  ).length

  const mediumCount = vulnerabilities.filter(
    (item) => item.severity === 'Medium'
  ).length

  const lowCount = vulnerabilities.filter(
    (item) => item.severity === 'Low'
  ).length

  const filteredVulnerabilities = useMemo(() => {
    return vulnerabilities.filter((item) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        item.id.toLowerCase().includes(searchText) ||
        item.package.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)

      const matchesSeverity =
        severity === 'All' || item.severity === severity

      const matchesEcosystem =
        ecosystem === 'All' || item.ecosystem === ecosystem

      let matchesTab = true

      if (activeTab === 'Critical / High') {
        matchesTab =
          item.severity === 'Critical' ||
          item.severity === 'High'
      }

      if (activeTab === 'Medium / Low') {
        matchesTab =
          item.severity === 'Medium' ||
          item.severity === 'Low'
      }

      if (activeTab === 'Unknown Severity') {
        matchesTab = item.severity === 'Unknown'
      }

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesEcosystem &&
        matchesTab
      )
    })
  }, [vulnerabilities, activeTab, severity, ecosystem, search])

  const selectedVulnerability =
    filteredVulnerabilities.find((item) => item.id === selectedId) ||
    filteredVulnerabilities[0] ||
    null

  const stats = [
    {
      title: 'Target Repository',
      value: latestScan?.repository || 'No scan yet',
      detail: latestScan
        ? `Branch: ${latestScan.branch || 'Unknown'}`
        : 'Run a repository scan',
      icon: Package,
      color: 'text-cyan-400',
    },
    {
      title: 'Packages Scanned',
      value: latestScan?.packages ?? 0,
      detail: 'Total dependencies',
      icon: GitBranch,
      color: 'text-blue-400',
    },
    {
      title: 'Vulnerabilities Found',
      value: vulnerabilities.length,
      detail: 'Scanner findings',
      icon: ShieldAlert,
      color:
        vulnerabilities.length > 0
          ? 'text-rose-400'
          : 'text-emerald-400',
    },
    {
      title: 'Scan Status',
      value: latestScan?.status || 'Not started',
      detail: latestScan?.scanner || 'Waiting for scan',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
  ]

  const tabs = [
    { name: 'All Findings', count: vulnerabilities.length },
    {
      name: 'Critical / High',
      count: criticalCount + highCount,
    },
    {
      name: 'Medium / Low',
      count: mediumCount + lowCount,
    },
    {
      name: 'Unknown Severity',
      count: vulnerabilities.filter(
        (item) => item.severity === 'Unknown'
      ).length,
    },
  ]

  const copyId = async () => {
    if (!selectedVulnerability) return

    try {
      await navigator.clipboard.writeText(selectedVulnerability.id)
    } catch {
      window.alert('Unable to copy vulnerability ID.')
    }
  }

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
            View security findings detected in your scanned dependencies.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
          <Activity size={15} className="text-emerald-400" />

          <span className="text-xs font-semibold text-emerald-400">
            {latestScan ? 'Scanner Active' : 'Waiting for Scan'}
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
              className="flex min-h-[110px] items-center justify-between gap-3 rounded-md border border-[#303640] bg-[#1C2028] p-4"
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

      {/* Severity summary */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Critical', count: criticalCount, color: 'text-rose-400' },
          { label: 'High', count: highCount, color: 'text-orange-400' },
          { label: 'Medium', count: mediumCount, color: 'text-amber-400' },
          { label: 'Low', count: lowCount, color: 'text-cyan-400' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-md border border-[#303640] bg-[#1C2028] p-3"
          >
            <p className="text-xs text-slate-500">
              {item.label} Severity
            </p>

            <p className={`mt-2 text-2xl font-bold ${item.color}`}>
              {item.count}
            </p>
          </div>
        ))}
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
              placeholder="Search CVE ID, package or description..."
              className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition ${
                activeTab === tab.name
                  ? 'border-cyan-500/30 bg-[#303640] text-cyan-400'
                  : 'border-transparent text-slate-300 hover:bg-[#262A33]'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  activeTab === tab.name
                    ? 'bg-cyan-400'
                    : 'bg-slate-500'
                }`}
              />

              {tab.name}

              <span className="rounded bg-[#303640] px-2 py-0.5 font-mono text-[10px]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Ecosystem filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Ecosystem:
          </span>

          {ecosystems.map((item) => (
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
                {filteredVulnerabilities.length} Findings
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <Filter size={17} />
              <Columns3 size={17} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-[#0F141B]">
                <tr className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-4">Vulnerability / Package</th>
                  <th className="px-3 py-4">Severity</th>
                  <th className="px-3 py-4">Ecosystem</th>
                  <th className="px-3 py-4">Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredVulnerabilities.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`cursor-pointer border-t border-[#303640] transition ${
                      selectedVulnerability?.id === item.id
                        ? 'bg-[#262A33]'
                        : 'hover:bg-[#222832]'
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${
                            item.severity === 'Critical'
                              ? 'bg-rose-400'
                              : item.severity === 'High'
                                ? 'bg-orange-400'
                                : item.severity === 'Medium'
                                  ? 'bg-amber-400'
                                  : item.severity === 'Low'
                                    ? 'bg-cyan-400'
                                    : 'bg-slate-500'
                          }`}
                        />

                        <div>
                          <p className="break-all font-mono text-sm font-semibold text-cyan-400">
                            {item.id}
                          </p>

                          <p className="mt-2 text-xs font-semibold text-slate-200">
                            {item.package}
                            <span className="font-mono text-slate-500">
                              {' '}@{item.version}
                            </span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-4">
                      <span className={`rounded border px-2 py-1 text-xs font-bold ${severityStyle(item.severity)}`}>
                        {item.severity}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-xs text-slate-300">
                      {item.ecosystem}
                    </td>

                    <td className="px-3 py-4">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                        >
                          View advisory
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">
                          No advisory link
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredVulnerabilities.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-12 text-center">
                      {latestScan ? (
                        <>
                          <ShieldCheck
                            size={30}
                            className="mx-auto text-emerald-400"
                          />

                          <p className="mt-3 text-sm font-semibold text-emerald-400">
                            {vulnerabilities.length === 0
                              ? 'No known vulnerabilities found'
                              : 'No matching vulnerabilities'}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {vulnerabilities.length === 0
                              ? 'The latest scan did not find matching OSV.dev advisories.'
                              : 'Try changing your search or filters.'}
                          </p>
                        </>
                      ) : (
                        <>
                          <ShieldAlert
                            size={30}
                            className="mx-auto text-slate-500"
                          />

                          <p className="mt-3 text-sm text-slate-300">
                            No scan results available
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Go to Scan History and scan a repository first.
                          </p>
                        </>
                      )}
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
                  <span className={`rounded border px-2.5 py-1 font-mono text-[10px] font-bold ${severityStyle(selectedVulnerability.severity)}`}>
                    {selectedVulnerability.severity.toUpperCase()} SEVERITY
                  </span>

                  <button
                    title="Copy vulnerability ID"
                    onClick={copyId}
                    className="text-slate-400 hover:text-cyan-400"
                  >
                    <Copy size={17} />
                  </button>
                </div>

                <h3 className="mt-5 break-all text-2xl font-bold text-slate-100">
                  {selectedVulnerability.id}
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-3">
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

                    <p className="mt-1 font-mono text-xs text-cyan-400">
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

                  <div>
                    <p className="font-mono text-[10px] text-slate-500">
                      Severity
                    </p>

                    <p className="mt-1 text-xs text-slate-200">
                      {selectedVulnerability.severity}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">

                {/* Description */}
                <div>
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
                      Vulnerability ID
                    </span>

                    <span className="break-all font-mono text-xs text-cyan-400">
                      {selectedVulnerability.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Severity
                    </span>

                    <span className="text-xs font-semibold text-slate-200">
                      {selectedVulnerability.severity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      CVSS Score
                    </span>

                    <span className="text-xs text-slate-400">
                      Not provided by current scanner
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      EPSS
                    </span>

                    <span className="text-xs text-slate-400">
                      Not assessed
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Call-Graph Reachability
                    </span>

                    <span className="text-xs text-slate-400">
                      Not assessed
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      CISA KEV
                    </span>

                    <span className="text-xs text-slate-400">
                      Not assessed
                    </span>
                  </div>
                </div>

                {/* Scanner information */}
                <div className="mt-5 rounded-md border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={17} className="text-cyan-400" />

                    <h4 className="text-sm font-semibold text-cyan-400">
                      Scanner Information
                    </h4>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    This finding was returned by the DepShield scanner using
                    OSV.dev advisory data. Check the original advisory before
                    deciding on a package upgrade.
                  </p>

                  {selectedVulnerability.url && (
                    <a
                      href={selectedVulnerability.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      Open original advisory
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500">
                  <Package size={13} />
                  Live scan vulnerability data
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
              <ShieldAlert size={35} className="text-slate-500" />

              <h3 className="mt-3 font-semibold text-slate-200">
                {latestScan
                  ? 'No vulnerabilities to display'
                  : 'Waiting for scan results'}
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {latestScan
                  ? 'Your latest scan has no findings matching the selected filters.'
                  : 'Run a repository scan from Scan History to view vulnerability details here.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#303640] py-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Activity size={14} className="text-emerald-400" />
          DepShield Vulnerability Scanner
        </div>

        <div className="font-mono text-[10px] text-slate-500">
          OSV.dev · Live Scan Results
        </div>
      </div>

    </div>
  )
}

export default Vulnerabilities