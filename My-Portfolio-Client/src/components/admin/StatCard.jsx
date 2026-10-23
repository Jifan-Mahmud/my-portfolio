"use client";

export default function StatCard({ title, value, icon: Icon, color = "text-amber-400", change }) {
  return (
    <div className="glass-card p-6 rounded-3xl relative overflow-hidden group hover:border-amber-400/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {title}
        </span>
        <div className={`p-3 rounded-2xl bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
        {change && <span className="text-xs font-medium text-amber-400">{change}</span>}
      </div>
    </div>
  );
}
