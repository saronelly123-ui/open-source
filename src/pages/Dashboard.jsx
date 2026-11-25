
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

const recentScans = [
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

      <h2 className="mt-5 text-4xl font-bold tracking-tight text-white">
        {value}
      </h2>

      <p className="mt-4 flex items-center gap-2 text-sm text-[#8CAAC8]">
        <TrendingUp size={16} className="text-emerald-400" />
        {description}
      </p>
    </div>
  )
}

function Dashboard() {
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
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <StatCard
          title="Total Scans"
          value="1,420"
          description="12% increase this month"
          icon={Scan}
          color="bg-blue-500/20 text-blue-400"
        />

        <StatCard
          title="Total Packages"
          value="8,540"
          description="Across all repositories"
          icon={Package}
          color="bg-purple-500/20 text-purple-400"
        />

        <StatCard
          title="Vulnerabilities"
          value="47"
          description="8 new findings detected"
          icon={ShieldAlert}
          color="bg-red-500/20 text-red-400"
        />

        <StatCard
          title="License Issues"
          value="12"
          description="Require review"
          icon={Scale}
          color="bg-orange-500/20 text-orange-400"
        />

      </div>

      {/* Repository and security summary */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5 xl:col-span-2">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-white">
                Active Repository
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Current security monitoring target
              </p>
            </div>

            <span className="flex w-fit items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Monitoring Active
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-[#303640] bg-[#181C24] p-4">
            <div className="rounded-lg bg-cyan-500/10 p-3">
              <Package size={23} className="text-cyan-400" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="break-all font-semibold text-slate-100">
                org/payments-core-api
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <GitBranch size={13} />
                main branch
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
              <p className="text-xs text-slate-500">Dependencies</p>
              <p className="mt-2 text-2xl font-bold text-white">245</p>
            </div>

            <div className="rounded-lg bg-[#181C24] p-4">
              <p className="text-xs text-slate-500">Vulnerabilities</p>
              <p className="mt-2 text-2xl font-bold text-red-400">15</p>
            </div>

            <div className="rounded-lg bg-[#181C24] p-4">
              <p className="text-xs text-slate-500">License Issues</p>
              <p className="mt-2 text-2xl font-bold text-orange-400">4</p>
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
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 size={23} className="text-emerald-400" />
            </div>

            <div>
              <p className="font-semibold text-emerald-400">Operational</p>
              <p className="text-xs text-slate-500">All systems running</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 border-t border-[#303640] pt-5">
            <div className="flex justify-between gap-2 text-sm">
              <span className="text-slate-500">Engine</span>
              <span className="text-slate-200">DepShield v2.4</span>
            </div>

            <div className="flex justify-between gap-2 text-sm">
              <span className="text-slate-500">Last Sync</span>
              <span className="text-slate-200">5 min ago</span>
            </div>

            <div className="flex justify-between gap-2 text-sm">
              <span className="text-slate-500">Scan Mode</span>
              <span className="text-cyan-400">Automated</span>
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
              Latest repository security scan records
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
                <tr key={scan.repository} className="transition hover:bg-[#262A33]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-200">
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

      {/* Policy Gate */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <div className="rounded-xl border border-[#303640] bg-[#1C2028] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <ShieldCheck size={22} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Policy Gate</h2>
              <p className="mt-1 text-xs text-slate-500">
                Repository security policy
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm text-slate-400">Policy Status</span>
            <span className="text-sm font-semibold text-amber-400">
              Review Required
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#303640]">
            <div className="h-full w-[76%] rounded-full bg-cyan-500" />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Sample compliance score: 76%
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
                Continuous package monitoring
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Monitoring</span>
              <span className="text-emerald-400">Active</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Last update</span>
              <span className="text-slate-300">5 minutes ago</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Next scheduled scan</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock3 size={14} />
                In 55 minutes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sample data note */}
      <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-5 text-amber-200/80">
        <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-400" />
        <p>
          Dashboard figures and scan records are sample frontend data.
          They will be replaced with live repository and scan information
          when the backend API is connected.
        </p>
      </div>

    </div>
  )
}

export default Dashboard
