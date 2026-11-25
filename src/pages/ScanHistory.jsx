
import { useMemo, useState } from 'react'
import {
  Search,
  Download,
  Play,
  Clock3,
  ShieldCheck,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  GitBranch,
  Package,
  Activity,
} from 'lucide-react'

const initialScans = [
  {
    id: 'SCN-1420',
    repository: 'payments-core-api',
    branch: 'main',
    date: 'Nov 24, 2026',
    time: '09:42 AM',
    duration: '42 sec',
    packages: 245,
    vulnerabilities: 3,
    critical: 1,
    high: 1,
    medium: 1,
    status: 'Completed',
    commit: 'a83f92c',
    scanner: 'DepShield Engine v2.4',
  },
  {
    id: 'SCN-1419',
    repository: 'customer-portal',
    branch: 'develop',
    date: 'Nov 23, 2026',
    time: '04:18 PM',
    duration: '38 sec',
    packages: 186,
    vulnerabilities: 0,
    critical: 0,
    high: 0,
    medium: 0,
    status: 'Completed',
    commit: 'b72d10e',
    scanner: 'DepShield Engine v2.4',
  },
  {
    id: 'SCN-1418',
    repository: 'inventory-service',
    branch: 'main',
    date: 'Nov 23, 2026',
    time: '11:05 AM',
    duration: '1 min 12 sec',
    packages: 312,
    vulnerabilities: 8,
    critical: 2,
    high: 3,
    medium: 3,
    status: 'Blocked',
    commit: 'c91e45a',
    scanner: 'DepShield Engine v2.4',
  },
  {
    id: 'SCN-1417',
    repository: 'payments-core-api',
    branch: 'feature/auth',
    date: 'Nov 22, 2026',
    time: '02:30 PM',
    duration: '45 sec',
    packages: 241,
    vulnerabilities: 2,
    critical: 0,
    high: 1,
    medium: 1,
    status: 'Completed',
    commit: 'd34a81b',
    scanner: 'DepShield Engine v2.4',
  },
  {
    id: 'SCN-1416',
    repository: 'mobile-app',
    branch: 'main',
    date: 'Nov 21, 2026',
    time: '10:12 AM',
    duration: '—',
    packages: 0,
    vulnerabilities: 0,
    critical: 0,
    high: 0,
    medium: 0,
    status: 'Failed',
    commit: 'e21c90d',
    scanner: 'DepShield Engine v2.4',
  },
]

function ScanHistory() {
  const [scans, setScans] = useState(initialScans)
  const [selectedScan, setSelectedScan] = useState(initialScans[0])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [activeTab, setActiveTab] = useState('All Scans')

  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      const matchesSearch =
        scan.repository.toLowerCase().includes(search.toLowerCase()) ||
        scan.id.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'All' || scan.status === statusFilter

      const matchesTab =
        activeTab === 'All Scans' ||
        (activeTab === 'Successful' && scan.status === 'Completed') ||
        (activeTab === 'Failed / Blocked' &&
          ['Failed', 'Blocked'].includes(scan.status))

      return matchesSearch && matchesStatus && matchesTab
    })
  }, [scans, search, statusFilter, activeTab])

  const completedScans = scans.filter(
    (scan) => scan.status === 'Completed'
  ).length

  const failedScans = scans.filter(
    (scan) => ['Failed', 'Blocked'].includes(scan.status)
  ).length

  const exportCSV = () => {
    const headers = [
      'Scan ID',
      'Repository',
      'Branch',
      'Date',
      'Duration',
      'Packages',
      'Vulnerabilities',
      'Status',
    ]

    const rows = filteredScans.map((scan) => [
      scan.id,
      scan.repository,
      scan.branch,
      scan.date,
      scan.duration,
      scan.packages,
      scan.vulnerabilities,
      scan.status,
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'depshield-scan-history.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const triggerScan = () => {
    alert(
      'Scan request is ready. It will be connected to the backend scan API.'
    )
  }

  const statusStyle = (status) => {
    if (status === 'Completed') {
      return 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
    }

    if (status === 'Blocked') {
      return 'border border-amber-500/30 bg-amber-500/10 text-amber-400'
    }

    return 'border border-red-500/30 bg-red-500/10 text-red-400'
  }

  return (
    <div className="space-y-6 text-slate-200">

      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Security Center</span>
            <span>/</span>
            <span className="text-cyan-400">Scan History</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-100">
            Scan History
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Review previous repository scans and their security results.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-lg border border-[#303640] bg-[#1C2028] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            onClick={triggerScan}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-bold text-[#0A0E16] transition hover:bg-cyan-400"
          >
            <Play size={16} />
            Trigger New Scan
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Scans</p>
            <Activity size={19} className="text-cyan-400" />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-slate-100">
            1,420
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            All recorded repository scans
          </p>
        </div>

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Avg Scan Duration</p>
            <Clock3 size={19} className="text-cyan-400" />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-slate-100">
            42s
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Average execution time
          </p>
        </div>

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Failed / Blocked</p>
            <AlertTriangle size={19} className="text-amber-400" />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-slate-100">
            {failedScans}
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            In the displayed sample
          </p>
        </div>

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Last Full Scan</p>
            <CalendarDays size={19} className="text-cyan-400" />
          </div>
          <h2 className="mt-3 text-2xl font-bold text-slate-100">
            5m ago
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Latest scan activity
          </p>
        </div>

      </div>

      {/* Scan history table and inspector */}
      <div className="overflow-hidden rounded-xl border border-[#303640] bg-[#1C2028]">

        {/* Toolbar */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#303640] p-5 xl:flex-row xl:items-center">

          <div>
            <h2 className="font-semibold text-slate-100">
              Scan Records
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Browse and inspect previous security scans
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search repository or scan ID..."
                className="w-full rounded-lg border border-[#303640] bg-[#181C24] py-2.5 pl-9 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-500 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-[#303640] bg-[#181C24] px-3 py-2.5 text-sm text-slate-300 outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-6 border-b border-[#303640] px-5">
          {['All Scans', 'Successful', 'Failed / Blocked'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 py-3 text-sm font-medium transition ${
                activeTab === tab
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-500 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px]">

          {/* Table */}
          <div className="min-w-0 overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">

              <thead className="bg-[#181C24] text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Repository</th>
                  <th className="px-4 py-4 font-semibold">Scan Date</th>
                  <th className="px-4 py-4 font-semibold">Packages</th>
                  <th className="px-4 py-4 font-semibold">Findings</th>
                  <th className="px-4 py-4 font-semibold">Duration</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#303640]">
                {filteredScans.map((scan) => (
                  <tr
                    key={scan.id}
                    onClick={() => setSelectedScan(scan)}
                    className={`cursor-pointer transition hover:bg-[#262A33] ${
                      selectedScan?.id === scan.id ? 'bg-[#262A33]' : ''
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg border border-[#303640] bg-[#181C24] p-2">
                          <Package size={17} className="text-cyan-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">
                            {scan.repository}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <GitBranch size={12} />
                            {scan.branch}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-slate-300">{scan.date}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {scan.time}
                      </p>
                    </td>

                    <td className="px-4 py-4 font-mono text-slate-300">
                      {scan.packages}
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono font-semibold text-slate-200">
                        {scan.vulnerabilities}
                      </span>
                      <p className="mt-1 text-xs text-slate-500">
                        {scan.critical} critical · {scan.high} high
                      </p>
                    </td>

                    <td className="px-4 py-4 font-mono text-slate-400">
                      {scan.duration}
                    </td>

                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(scan.status)}`}>
                        {scan.status === 'Completed' ? (
                          <CheckCircle2 size={13} />
                        ) : scan.status === 'Blocked' ? (
                          <AlertTriangle size={13} />
                        ) : (
                          <XCircle size={13} />
                        )}
                        {scan.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredScans.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-sm text-slate-500">
                      No scan records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Scan inspector */}
          <aside className="border-t border-[#303640] bg-[#181C24] p-5 xl:border-l xl:border-t-0">

            {selectedScan ? (
              <div className="space-y-5">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Scan Inspector
                    </p>
                    <h3 className="mt-1 font-mono text-lg font-bold text-cyan-400">
                      {selectedScan.id}
                    </h3>
                  </div>
                  <Eye size={19} className="text-slate-500" />
                </div>

                <div className="rounded-lg border border-[#303640] bg-[#1C2028] p-4">
                  <p className="text-xs text-slate-500">Repository</p>
                  <p className="mt-2 font-semibold text-slate-200">
                    {selectedScan.repository}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <GitBranch size={12} />
                    {selectedScan.branch}
                  </p>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Execution Summary
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Status</span>
                      <span className="text-slate-200">
                        {selectedScan.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Scan Date</span>
                      <span className="text-slate-300">
                        {selectedScan.date}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Duration</span>
                      <span className="font-mono text-slate-300">
                        {selectedScan.duration}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Packages</span>
                      <span className="font-mono text-slate-300">
                        {selectedScan.packages}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Commit</span>
                      <span className="font-mono text-cyan-400">
                        {selectedScan.commit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#303640] pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Vulnerability Breakdown
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Critical</span>
                      <span className="font-mono text-red-400">
                        {selectedScan.critical}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">High</span>
                      <span className="font-mono text-orange-400">
                        {selectedScan.high}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Medium</span>
                      <span className="font-mono text-amber-400">
                        {selectedScan.medium}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-[#303640] bg-[#1C2028] p-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck size={15} className="text-cyan-400" />
                    Scanner Engine
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-200">
                    {selectedScan.scanner}
                  </p>
                </div>

                <button
                  onClick={() => alert(`Details for ${selectedScan.id} will be connected to the backend.`)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#303640] bg-[#1C2028] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-500 hover:text-cyan-400"
                >
                  <Eye size={16} />
                  View Full Scan Details
                </button>

              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Select a scan record to inspect its details.
              </p>
            )}

          </aside>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-[#303640] px-5 py-4 text-xs text-slate-500 sm:flex-row">
          <span>
            Showing {filteredScans.length} of {scans.length} sample records
          </span>
          <span>
            {completedScans} completed scans in this sample
          </span>
        </div>

      </div>

      <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-amber-200/80">
        <RefreshCw size={15} className="mt-0.5 shrink-0 text-amber-400" />
        <p>
          These are sample frontend records for the design. The real scan
          history, scan trigger and backend CSV export will be connected
          when the backend API is ready.
        </p>
      </div>

    </div>
  )
}

export default ScanHistory
