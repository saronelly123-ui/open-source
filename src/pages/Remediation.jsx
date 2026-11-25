
import { useMemo, useState } from 'react'
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  CircleDot,
  ShieldAlert,
  ArrowUpRight,
  GitPullRequest,
  Filter,
} from 'lucide-react'

const initialIssues = [
  {
    id: 1,
    cve: 'CVE-2024-38063',
    package: 'express-fileupload',
    version: '1.4.0',
    fixedVersion: '1.5.1',
    severity: 'Critical',
    repository: 'payments-core-api',
    status: 'Open',
    description: 'A security vulnerability was detected in this dependency.',
  },
  {
    id: 2,
    cve: 'CVE-2023-45853',
    package: 'zlib',
    version: '1.2.11',
    fixedVersion: '1.3.1',
    severity: 'High',
    repository: 'customer-portal',
    status: 'In Progress',
    description: 'A vulnerable package version requires an update.',
  },
  {
    id: 3,
    cve: 'CVE-2024-29041',
    package: 'axios',
    version: '1.6.0',
    fixedVersion: '1.6.8',
    severity: 'Medium',
    repository: 'payments-core-api',
    status: 'Resolved',
    description: 'The affected dependency has been updated.',
  },
  {
    id: 4,
    cve: 'CVE-2024-12345',
    package: 'requests',
    version: '2.28.0',
    fixedVersion: '2.32.0',
    severity: 'High',
    repository: 'inventory-service',
    status: 'Accepted Risk',
    description: 'The team has accepted the risk temporarily.',
  },
  {
    id: 5,
    cve: 'CVE-2024-55555',
    package: 'golang.org/x/net',
    version: '0.17.0',
    fixedVersion: '0.23.0',
    severity: 'Critical',
    repository: 'inventory-service',
    status: 'Open',
    description: 'An affected dependency needs remediation.',
  },
]

function Remediation() {
  const [issues, setIssues] = useState(initialIssues)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedIssue, setSelectedIssue] = useState(initialIssues[0])

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        issue.cve.toLowerCase().includes(searchText) ||
        issue.package.toLowerCase().includes(searchText) ||
        issue.repository.toLowerCase().includes(searchText)

      const matchesStatus =
        statusFilter === 'All' || issue.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [issues, search, statusFilter])

  const updateStatus = (id, newStatus) => {
    setIssues((currentIssues) =>
      currentIssues.map((issue) =>
        issue.id === id ? { ...issue, status: newStatus } : issue
      )
    )

    setSelectedIssue((current) =>
      current?.id === id ? { ...current, status: newStatus } : current
    )
  }

  const statusClass = (status) => {
    const styles = {
      Open: 'border-red-500/30 bg-red-500/10 text-red-400',
      'In Progress': 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      Resolved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      'Accepted Risk': 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    }

    return styles[status] || 'border-[#303640] text-slate-400'
  }

  const severityClass = (severity) => {
    const styles = {
      Critical: 'text-red-400',
      High: 'text-orange-400',
      Medium: 'text-amber-400',
      Low: 'text-cyan-400',
    }

    return styles[severity] || 'text-slate-400'
  }

  const countStatus = (status) =>
    issues.filter((issue) => issue.status === status).length

  return (
    <div className="space-y-6 text-slate-200">

      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Security Center</span>
            <span>/</span>
            <span className="text-cyan-400">Remediation</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-100">
            Remediation Center
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Track vulnerabilities and manage their remediation status.
          </p>
        </div>

        <button
          onClick={() =>
            alert('Pull request automation will be connected to the backend.')
          }
          className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-bold text-[#0A0E16] transition hover:bg-cyan-400"
        >
          <GitPullRequest size={17} />
          Create Remediation PR
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex justify-between">
            <p className="text-sm text-slate-400">Open Issues</p>
            <ShieldAlert size={19} className="text-red-400" />
          </div>
          <h2 className="mt-3 text-3xl font-bold">{countStatus('Open')}</h2>
          <p className="mt-2 text-xs text-slate-500">Awaiting action</p>
        </div>

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex justify-between">
            <p className="text-sm text-slate-400">In Progress</p>
            <Clock3 size={19} className="text-amber-400" />
          </div>
          <h2 className="mt-3 text-3xl font-bold">{countStatus('In Progress')}</h2>
          <p className="mt-2 text-xs text-slate-500">Currently being fixed</p>
        </div>

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex justify-between">
            <p className="text-sm text-slate-400">Resolved</p>
            <CheckCircle2 size={19} className="text-emerald-400" />
          </div>
          <h2 className="mt-3 text-3xl font-bold">{countStatus('Resolved')}</h2>
          <p className="mt-2 text-xs text-slate-500">Successfully addressed</p>
        </div>

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex justify-between">
            <p className="text-sm text-slate-400">Accepted Risk</p>
            <ShieldCheck size={19} className="text-purple-400" />
          </div>
          <h2 className="mt-3 text-3xl font-bold">{countStatus('Accepted Risk')}</h2>
          <p className="mt-2 text-xs text-slate-500">Risk accepted by team</p>
        </div>
      </div>

      {/* Main content */}
      <div className="overflow-hidden rounded-xl border border-[#303640] bg-[#1C2028]">

        <div className="flex flex-col justify-between gap-4 border-b border-[#303640] p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-semibold text-slate-100">
              Vulnerability Remediation
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Select an issue to manage its remediation status.
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
                placeholder="Search CVE or package..."
                className="w-full rounded-lg border border-[#303640] bg-[#181C24] py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-500 sm:w-64"
              />
            </div>

            <div className="relative">
              <Filter
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-[#303640] bg-[#181C24] py-2.5 pl-9 pr-8 text-sm outline-none focus:border-cyan-500"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Accepted Risk">Accepted Risk</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px]">

          {/* Issue list */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-[#181C24] text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4">Vulnerability</th>
                  <th className="px-4 py-4">Package</th>
                  <th className="px-4 py-4">Severity</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#303640]">
                {filteredIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className={`cursor-pointer transition hover:bg-[#262A33] ${
                      selectedIssue?.id === issue.id ? 'bg-[#262A33]' : ''
                    }`}
                  >
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-semibold text-cyan-400">
                        {issue.cve}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {issue.repository}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-200">
                        {issue.package}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        v{issue.version}
                      </p>
                    </td>

                    <td className={`px-4 py-4 font-semibold ${severityClass(issue.severity)}`}>
                      {issue.severity}
                    </td>

                    <td className="px-4 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(issue.status)}`}>
                        {issue.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedIssue(issue)
                        }}
                        className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                      >
                        Manage <ArrowUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredIssues.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center text-slate-500">
                      No vulnerabilities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Inspector */}
          <aside className="border-t border-[#303640] bg-[#181C24] p-5 xl:border-l xl:border-t-0">
            {selectedIssue ? (
              <div className="space-y-5">

                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Issue Inspector
                  </p>
                  <CircleDot size={18} className="text-cyan-400" />
                </div>

                <div>
                  <p className="font-mono text-sm font-bold text-cyan-400">
                    {selectedIssue.cve}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slate-100">
                    {selectedIssue.package}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {selectedIssue.description}
                  </p>
                </div>

                <div className="rounded-lg border border-[#303640] bg-[#1C2028] p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Severity</span>
                    <span className={severityClass(selectedIssue.severity)}>
                      {selectedIssue.severity}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-slate-500">Current version</span>
                    <span className="font-mono text-slate-200">
                      {selectedIssue.version}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-slate-500">Fixed version</span>
                    <span className="font-mono text-emerald-400">
                      {selectedIssue.fixedVersion}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Remediation Status
                  </p>

                  <div className="space-y-2">
                    {['Open', 'In Progress', 'Resolved', 'Accepted Risk'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selectedIssue.id, status)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-3 text-sm transition ${
                          selectedIssue.status === status
                            ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                            : 'border-[#303640] bg-[#1C2028] text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        {status}
                        {selectedIssue.status === status && (
                          <CheckCircle2 size={16} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    alert('The remediation action will be connected to the backend.')
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 text-sm font-bold text-[#0A0E16] transition hover:bg-cyan-400"
                >
                  <GitPullRequest size={16} />
                  Create Fix Pull Request
                </button>

              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Select a vulnerability to manage it.
              </p>
            )}
          </aside>
        </div>

        <div className="border-t border-[#303640] px-5 py-4 text-xs text-slate-500">
          Showing {filteredIssues.length} of {issues.length} sample vulnerabilities
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-amber-200/80">
        <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-400" />
        <p>
          These are sample frontend records. Status changes currently happen
          in the browser only. Backend persistence and pull request creation
          will be connected with the backend developer.
        </p>
      </div>

    </div>
  )
}

export default Remediation
