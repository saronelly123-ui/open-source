import { useState } from 'react'
import { ChevronDown, ChevronRight, Package, ShieldAlert, ShieldCheck } from 'lucide-react'

function DependencyItem({ dependency, level = 0 }) {
  const [expanded, setExpanded] = useState(level < 1)
  const hasChildren = dependency.children?.length > 0
  const vulnerable = dependency.vulnerabilities?.length > 0

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#303640] bg-[#181C24] px-3 py-3" style={{ marginLeft: `${Math.min(level, 4) * 12}px` }}>
        <div className="flex min-w-0 items-center gap-2">
          {hasChildren ? (
            <button type="button" onClick={() => setExpanded((value) => !value)} className="rounded p-1 text-slate-400 hover:bg-[#303640] hover:text-cyan-400" aria-label={expanded ? 'Collapse dependencies' : 'Expand dependencies'}>
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : <span className="w-6" />}
          <Package size={17} className="shrink-0 text-cyan-400" />
          <span className="truncate text-sm font-semibold text-slate-200">{dependency.name}</span>
          <span className="font-mono text-xs text-slate-500">v{dependency.version}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[#3B4654] px-2 py-1 text-[10px] text-slate-400">{dependency.type}</span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${vulnerable ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            {vulnerable ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
            {vulnerable ? `${dependency.vulnerabilities.length} issue(s)` : 'No known issues'}
          </span>
        </div>
      </div>
      {vulnerable && (
        <div className="mt-2 space-y-2" style={{ marginLeft: `${Math.min(level, 4) * 12 + 36}px` }}>
          {dependency.vulnerabilities.map((item) => (
            <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs hover:border-red-400/50">
              <span className="font-semibold text-red-300">{item.id}</span>
              <span className="ml-2 rounded bg-red-500/10 px-2 py-0.5 text-red-300">{item.severity}</span>
              <p className="mt-1 text-slate-400">{item.summary}</p>
            </a>
          ))}
        </div>
      )}
      {hasChildren && expanded && (
        <div className="mt-2 space-y-2 border-l border-[#3B4654] pl-2">
          {dependency.children.map((child) => <DependencyItem key={child.id} dependency={child} level={level + 1} />)}
        </div>
      )}
    </div>
  )
}

export default DependencyItem
