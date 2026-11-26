
import {
  Scan,
  Package,
  ShieldAlert,
  Scale,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ArrowUpRight,
  GitBranch,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'

const sampleScans = [
  {
    repository: 'payments-core-api',
    branch: 'main',
    date: 'Nov 25, 2026 · 09:42 AM',
    packages: 245,
    findings: 3,
    status: 'Completed',
  },
  {
    repository: 'customer-portal',
    branch: 'develop',
    date: 'Nov 25, 2026 · 08:15 AM',
    packages: 186,
    findings: 0,
    status: 'Completed',
  },
  {
    repository: 'inventory-service',
    branch: 'main',
    date: 'Nov 24, 2026 · 04:30 PM',
    packages: 312,
    findings: 8,
    status: 'Blocked',
  },
  {
    repository: 'mobile-app',
    branch: 'main',
    date: 'Nov 24, 2026 · 11:20 AM',
    packages: 128,
    findings: 2,
    status: 'Completed',
  },
]

function StatCard({ title, value, description, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-[#1E344D] bg-[#10243B] p-6 transition hover:border-cyan-500/40">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#9AB6D2]">
          {title}
        </p>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>

      <h2 className="mt-5 break-words text-4xl font-bold tracking-tight text-white">
        {value}
      </h2>

      <p className="mt-4 flex items-center gap-2 text-sm text-[#8CAAC8]">
        <TrendingUp size={16} className="text-emerald-400" />
        {description}
      </p>
    </div>
  )
}

function Dashboard({ latestScan }) {
  const hasScan = Boolean(latestScan)

  const vulnerabilityCount =
    typeof latestScan?.vulnerabilities === 'number'
      ? latestScan.vulnerabilities
      : Array.isArray(latestScan?.vulnerabilities)
        ? latestScan.vulnerabilities.length
        : Array.isArray(latestScan?.vulnerabilityDetails)
          ? latestScan.vulnerabilityDetails.length
          : 0

  const packageCount = latestScan?.packages ?? 0

  const repository =
    latestScan?.repository || 'payments-core-api'

  const branch = latestScan?.branch || 'main'

  const scanDate =
    latestScan?.date ||
    latestScan?.timestamp ||
    latestScan?.createdAt ||
    'Not available'

  const scanStatus = latestScan?.status || 'Not started'

  const severityCounts = {
    critical: latestScan?.critical ?? 0,
    high: latestScan?.high ?? 0,
    medium: latestScan?.medium ?? 0,
    low: latestScan?.low ?? 0,
  }

  const stats = [
    {
      title: 'Total Scans',
      value: hasScan ? '1' : '1,420',
      description: hasScan
        ? 'Latest scan completed'
        : 'Sample dashboard data',
      icon: Scan,
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      title: 'Total Packages',
      value: hasScan ? packageCount.toLocaleString() : '8,540',
      description: hasScan
        ? 'Packages in latest repository scan'
        : 'Sample package count',
      icon: Package,
      color: 'bg-purple-500/20 text-purple-400',
    },
    {
      title: 'Vulnerabilities',
      value: hasScan ? vulnerabilityCount.toLocaleString() : '47',
      description: hasScan
        ? 'Findings returned by the scanner'
        : 'Sample vulnerability count',
      icon: ShieldAlert,
      color: 'bg-red-500/20 text-red-400',
    },
    {
      title: 'License Issues',
      value: 'Not assessed',
      description: 'License scanning is not connected',
      icon: Scale,
      color: 'bg-orange-500/20 text-orange-400',
    },
  ]

  const recentScans = hasScan
    ? [
        {
          repository,
          branch,
          date: scanDate,
          packages: packageCount,
          findings: vulnerabilityCount,
          status: scanStatus,
        },
      ]
    : sampleScans

  return (
    <div className="space-y-8 text-slate-200">

      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Security Overview
        </h1>

        <p className="mt-2 text-base text-[#91AFCB]">
          Monitor your dependencies and software security.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
          />
        ))}
      </div>

      {/* Severity summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            title: 'Critical',
            value: severityCounts.critical,
            color: 'text-rose-400',
          },
          {
            title: 'High',
            value: severityCounts.high,
            color: 'text-orange-400',
          },
          {
            title: 'Medium',
            value: severityCounts.medium,
            color: 'text-amber-400',
          },
          {
            title: 'Low',
            value: severityCounts.low,
            color: 'text-cyan-400',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-[#303640] bg-[#1C2028] p-4"
          >
            <p className="text-xs text-slate-500">
              {item.title} Vulnerabilities
            </p>

            <p className={`mt-2 text-2xl font-bold ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Repository and security summary */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* Active Repository */}
        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5 xl:col-span-2">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-white">
                Active Repository
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest security monitoring target
              </p>
            </div>

            <span className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              hasScan
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
            }`}>
              <span className={`h-2 w-2 rounded-full ${
                hasScan ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />

              {hasScan ? 'Scan Available' : 'Sample Repository'}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-[#303640] bg-[#181C24] p-4">
            <div className="rounded-lg bg-cyan-500/10 p-3">
              <Package size={23} className="text-cyan-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="break-all font-semibold text-slate-100">
                {repository}
              </p>

              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <GitBranch size={13} />
                {branch}
              </p>
            </div>

            <button
              onClick={() => alert('Repository details will be connected to the backend.')}
              className="flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Details <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-[#181C24] p-4">
              <p className="text-xs text-slate-500">
                Total Packages
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {hasScan ? packageCount.toLocaleString() : '245'}
              </p>
            </div>

            <div className="rounded-lg bg-[#181C24] p-4">
              <p className="text-xs text-slate-500">
                Vulnerabilities
              </p>

              <p className="mt-2 text-2xl font-bold text-red-400">
                {hasScan ? vulnerabilityCount : '15'}
              </p>
            </div>

            <div className="rounded-lg bg-[#181C24] p-4">
              <p className="text-xs text-slate-500">
                License Issues
              </p>

              <p className="mt-2 text-lg font-bold text-orange-400">
                Not assessed
              </p>
            </div>
          </div>
        </div>

        {/* Scanner Engine */}
        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">
              Scanner Engine
            </h2>

            <Activity size={20} className="text-cyan-400" />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-full ${
              hasScan ? 'bg-emerald-500/10' : 'bg-amber-500/10'
            }`}>
              {hasScan ? (
                <CheckCircle2 size={23} className="text-emerald-400" />
              ) : (
                <Clock3 size={23} className="text-amber-400" />
              )}
            </div>

            <div>
              <p className={`font-semibold ${
                hasScan ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {hasScan ? 'Operational' : 'Waiting'}
              </p>

              <p className="text-xs text-slate-500">
                {hasScan ? 'Latest scan finished' : 'Run a repository scan'}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4 border-t border-[#303640] pt-5">
            <div className="flex justify-between gap-2 text-sm">
              <span className="text-slate-500">Engine</span>
              <span className="text-slate-200">
                {latestScan?.scanner || 'DepShield'}
              </span>
            </div>

            <div className="flex justify-between gap-2 text-sm">
              <span className="text-slate-500">Last Scan</span>
              <span className="text-slate-200">
                {scanDate}
              </span>
            </div>

            <div className="flex justify-between gap-2 text-sm">
              <span className="text-slate-500">Scan Status</span>
              <span className="text-cyan-400">
                {scanStatus}
              </span>
            </div>

            <div className="flex justify-between gap-2 text-sm">
              <span className="text-slate-500">Duration</span>
              <span className="text-slate-200">
                {latestScan?.duration != null
                  ? `${latestScan.duration} sec`
                  : 'Not available'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent scans */}
      <div className="overflow-hidden rounded-xl border border-[#303640] bg-[#1C2028]">

        <div className="flex flex-col justify-between gap-3 border-b border-[#303640] p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-white">
              Recent Scan Activity
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {hasScan
                ? 'Latest repository security scan record'
                : 'Sample repository security scan records'}
            </p>
          </div>

          <button
            onClick={() => alert('Scan history can be opened from the sidebar.')}
            className="flex w-fit items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            View All <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-[#181C24] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">Repository</th>
                <th className="px-4 py-4">Scan Date</th>
                <th className="px-4 py-4">Packages</th>
                <th className="px-4 py-4">Findings</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#303640]">
              {recentScans.map((scan) => (
                <tr
                  key={`${scan.repository}-${scan.date}`}
                  className="transition hover:bg-[#262A33]"
                >
                  <td className="px-5 py-4">
                    <p className="break-all font-semibold text-slate-200">
                      {scan.repository}
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <GitBranch size={12} />
                      {scan.branch}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-slate-400">
                    {scan.date}
                  </td>

                  <td className="px-4 py-4 font-mono text-slate-300">
                    {scan.packages}
                  </td>

                  <td className="px-4 py-4 font-mono text-slate-300">
                    {scan.findings}
                  </td>

                  <td className="px-4 py-4">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      scan.status === 'Completed'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    }`}>
                      {scan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Policy Gate and Dependency Monitoring */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <ShieldCheck size={22} className="text-emerald-400" />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Policy Gate
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Repository security policy
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Policy Status
            </span>

            <span className="text-sm font-semibold text-slate-400">
              Not assessed
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#303640]" />

          <p className="mt-3 text-xs text-slate-500">
            Policy compliance scoring is not connected to the current scanner.
          </p>
        </div>

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-3">
              <RefreshCw size={22} className="text-cyan-400" />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Dependency Monitoring
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Repository scan monitoring
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Monitoring</span>

              <span className={hasScan ? 'text-emerald-400' : 'text-amber-400'}>
                {hasScan ? 'Scan completed' : 'Not started'}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Last update</span>

              <span className="text-slate-300">
                {scanDate}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Next scheduled scan</span>

              <span className="text-slate-300">
                Not configured
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Information note */}
      <div className="flex items-start gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs leading-5 text-cyan-200/80">
        <AlertTriangle size={15} className="mt-0.5 shrink-0 text-cyan-400" />

        <p>
          {hasScan
            ? 'Dashboard information is based on the latest scan performed in this session. License analysis, policy compliance and scheduled monitoring are not yet connected.'
            : 'Some dashboard figures and scan records are sample frontend data. They will be replaced with live scan information when available.'}
        </p>
      </div>

    </div>
  )
}

export default Dashboard
