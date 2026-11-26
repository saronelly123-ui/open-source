import { GitBranch, Package, ShieldAlert } from 'lucide-react'
import DependencyItem from './DependencyItem'

function DependencyTree({ dependencies = [], packageCount = 0, directCount = 0, transitiveCount = 0, vulnerabilities = [] }) {
  if (!dependencies.length) return null

  return (
    <section className="space-y-4 border-t border-[#303640] pt-5">
      <div className="flex items-center gap-2">
        <GitBranch size={18} className="text-cyan-400" />
        <div>
          <h4 className="font-semibold text-slate-100">Dependency Tree</h4>
          <p className="text-xs text-slate-500">Actual packages found in the repository lock file</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ['Total packages', packageCount, Package],
          ['Direct', directCount, GitBranch],
          ['Transitive', transitiveCount, Package],
          ['Vulnerabilities', vulnerabilities.length, ShieldAlert],
        ].map(([label, value, Icon]) => (
          <div key={label} className="rounded-lg border border-[#303640] bg-[#1C2028] p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500"><Icon size={13} />{label}</div>
            <p className="mt-1 text-xl font-bold text-slate-100">{value}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {dependencies.map((dependency) => <DependencyItem key={dependency.id} dependency={dependency} />)}
      </div>
      <p className="text-[11px] text-slate-500">Vulnerability information is checked against OSV.dev. A clean result means no matching advisory was returned for the scanned package versions; it is not a guarantee of absolute safety.</p>
    </section>
  )
}

export default DependencyTree
