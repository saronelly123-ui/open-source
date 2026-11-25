
import { useState } from 'react'
import {
  Download,
  FileBarChart,
  ShieldCheck,
  AlertTriangle,
  Package,
  FileCheck,
  CalendarDays,
  FileSpreadsheet,
  Activity,
  CheckCircle2,
} from 'lucide-react'

const reportData = [
  {
    repository: 'payments-core-api',
    package: 'express-fileupload',
    version: '1.4.0',
    vulnerability: 'CVE-2024-38063',
    severity: 'Critical',
    license: 'MIT',
    status: 'Open',
  },
  {
    repository: 'payments-core-api',
    package: 'axios',
    version: '1.6.0',
    vulnerability: 'CVE-2024-29041',
    severity: 'Medium',
    license: 'MIT',
    status: 'Resolved',
  },
  {
    repository: 'inventory-service',
    package: 'requests',
    version: '2.28.0',
    vulnerability: 'CVE-2024-12345',
    severity: 'High',
    license: 'Apache-2.0',
    status: 'Accepted Risk',
  },
  {
    repository: 'inventory-service',
    package: 'golang.org/x/net',
    version: '0.17.0',
    vulnerability: 'CVE-2024-55555',
    severity: 'Critical',
    license: 'BSD-3-Clause',
    status: 'Open',
  },
  {
    repository: 'customer-portal',
    package: 'zlib',
    version: '1.2.11',
    vulnerability: 'CVE-2023-45853',
    severity: 'High',
    license: 'Zlib',
    status: 'In Progress',
  },
]

function Reports() {
  const [reportType, setReportType] = useState('Security Summary')
  const [dateRange, setDateRange] = useState('Last 30 days')
  const [exported, setExported] = useState(false)

  const exportCSV = () => {
    const headers = [
      'Repository',
      'Package',
      'Version',
      'Vulnerability',
      'Severity',
      'License',
      'Remediation Status',
    ]

    const rows = reportData.map((item) => [
      item.repository,
      item.package,
      item.version,
      item.vulnerability,
      item.severity,
      item.license,
      item.status,
    ])

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(',')
      )
      .join('\n')

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'depshield-security-report.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
    setExported(true)
  }

  const criticalCount = reportData.filter(
    (item) => item.severity === 'Critical'
  ).length

  const highCount = reportData.filter(
    (item) => item.severity === 'High'
  ).length

  const resolvedCount = reportData.filter(
    (item) => item.status === 'Resolved'
  ).length

  return (
    <div className="space-y-6 text-slate-200">

      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Security Center</span>
            <span>/</span>
            <span className="text-cyan-400">Reports & Export</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-100">
            Reports & Export
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Generate security reports and export dependency findings.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-bold text-[#0A0E16] transition hover:bg-cyan-400"
        >
          <Download size={17} />
          Export Report
        </button>
      </div>

      {/* Report summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Total Packages</p>
            <Package size={19} className="text-cyan-400" />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-slate-100">245</h2>
          <p className="mt-2 text-xs text-slate-500">
            Sample repository inventory
          </p>
        </div>

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Critical Findings</p>
            <AlertTriangle size={19} className="text-red-400" />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-slate-100">
            {criticalCount}
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Sample critical vulnerabilities
          </p>
        </div>

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">High Findings</p>
            <ShieldCheck size={19} className="text-orange-400" />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-slate-100">
            {highCount}
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Sample high vulnerabilities
          </p>
        </div>

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Resolved Issues</p>
            <CheckCircle2 size={19} className="text-emerald-400" />
          </div>
          <h2 className="mt-3 text-3xl font-bold text-slate-100">
            {resolvedCount}
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Sample resolved findings
          </p>
        </div>

      </div>

      {/* Report configuration */}
      <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-cyan-500/10 p-2.5">
            <FileBarChart size={21} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-100">
              Generate Security Report
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Configure the report you want to export.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-lg border border-[#303640] bg-[#181C24] px-3 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500"
            >
              <option>Security Summary</option>
              <option>Vulnerability Report</option>
              <option>License Compliance Report</option>
              <option>Dependency Inventory</option>
              <option>Remediation Report</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full rounded-lg border border-[#303640] bg-[#181C24] px-3 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-col justify-between gap-4 border-t border-[#303640] pt-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays size={15} />
            <span>Selected period: {dateRange}</span>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center justify-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-400 transition hover:bg-cyan-500/20"
          >
            <FileSpreadsheet size={16} />
            Download CSV
          </button>
        </div>
      </div>

      {/* Report preview */}
      <div className="overflow-hidden rounded-xl border border-[#303640] bg-[#1C2028]">
        <div className="flex flex-col justify-between gap-3 border-b border-[#303640] p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-100">
              Report Preview
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {reportType} · {dateRange}
            </p>
          </div>

          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            Preview
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-[#181C24] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">Repository</th>
                <th className="px-4 py-4">Package</th>
                <th className="px-4 py-4">Version</th>
                <th className="px-4 py-4">Finding</th>
                <th className="px-4 py-4">Severity</th>
                <th className="px-4 py-4">License</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#303640]">
              {reportData.map((item, index) => (
                <tr key={index} className="hover:bg-[#262A33]">
                  <td className="px-5 py-4 text-slate-300">
                    {item.repository}
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-200">
                    {item.package}
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-400">
                    {item.version}
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-cyan-400">
                    {item.vulnerability}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`font-semibold ${
                      item.severity === 'Critical'
                        ? 'text-red-400'
                        : item.severity === 'High'
                          ? 'text-orange-400'
                          : 'text-amber-400'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-400">
                    {item.license}
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-[#303640] px-5 py-4 text-xs text-slate-500 sm:flex-row">
          <span>{reportData.length} sample findings displayed</span>
          <span>CSV format · UTF-8</span>
        </div>
      </div>

      {/* Export confirmation */}
      {exported && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle2 size={18} />
          CSV report downloaded successfully.
        </div>
      )}

      {/* Additional information */}
      <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
        <div className="mb-4 flex items-center gap-3">
          <Activity size={19} className="text-cyan-400" />
          <h2 className="font-semibold text-slate-100">
            Report Contents
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            'Dependency inventory',
            'Vulnerability findings',
            'License information',
            'Remediation statuses',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-slate-400">
              <FileCheck size={16} className="text-emerald-400" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-amber-200/80">
        This page uses sample frontend data. The report configuration is
        currently for preview, and the CSV export downloads the displayed
        sample findings. Real reports will use data from the backend API.
      </div>

    </div>
  )
}

export default Reports
