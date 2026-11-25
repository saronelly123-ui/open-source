
import { TrendingUp } from 'lucide-react'

function StatCard({ title, value, description, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#10243c] p-5 transition hover:border-blue-500">

      {/* Card header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">
          {title}
        </p>

        <div className={`rounded-lg p-2 ${color}`}>
          {Icon && <Icon size={21} />}
        </div>
      </div>

      {/* Card value */}
      <h3 className="mt-4 text-3xl font-bold text-white">
        {value}
      </h3>

      {/* Description */}
      <div className="mt-3 flex items-center gap-2">
        <TrendingUp size={15} className="text-green-400" />

        <p className="text-xs text-slate-400">
          {description}
        </p>
      </div>

    </div>
  )
}

export default StatCard
