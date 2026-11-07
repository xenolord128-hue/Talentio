import React, { useState } from 'react';
import { 
  Briefcase, 
  ExternalLink, 
  Filter, 
  ChevronRight, 
  Layers, 
  DollarSign, 
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { ProjectOrderItem } from './types';
import { DEFAULT_PROJECT_ORDERS } from './mockWidgetData';

interface ProjectsWidgetProps {
  title?: string;
  subtitle?: string;
  projects?: ProjectOrderItem[];
  className?: string;
  onViewAll?: () => void;
  onProjectClick?: (project: ProjectOrderItem) => void;
}

export const ProjectsWidget: React.FC<ProjectsWidgetProps> = ({
  title = 'Recent Projects & Escrow Orders',
  subtitle = 'Active contracts and milestone fulfillment queue',
  projects = DEFAULT_PROJECT_ORDERS,
  className = '',
  onViewAll,
  onProjectClick,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'in_progress' | 'completed'>('all');

  const filteredProjects = projects.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  const getStatusBadge = (status: ProjectOrderItem['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-3 h-3 text-sky-600" />
            In Progress
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            In Review
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <CheckCircle2 className="w-3 h-3 text-purple-600" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Pending
          </span>
        );
    }
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm flex flex-col justify-between ${className}`}>
      <div>
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#1A1633] font-display">
                {title}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#F2F0FF] text-[#3D2FD1] text-xs font-bold">
                {filteredProjects.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1 rounded-xl bg-[#F2F0FF] border border-[#A38BFF]/25 text-xs font-semibold self-start sm:self-auto">
            {(['all', 'active', 'in_progress', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize cursor-pointer transition-all ${
                  statusFilter === st
                    ? 'bg-[#3D2FD1] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-[#3D2FD1]'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 1. DESKTOP VIEW: Clean responsive table (hidden on small mobile screens) */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-[#A38BFF]/20 bg-white/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#A38BFF]/20 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Project / Scope</th>
                <th className="py-3 px-4">Client / Organization</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Escrow Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A38BFF]/10">
              {filteredProjects.map((item) => (
                <tr
                  key={item.id}
                  onClick={onProjectClick ? () => onProjectClick(item) : undefined}
                  className="hover:bg-[#F2F0FF]/50 transition-colors group cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-bold text-[#1A1633] group-hover:text-[#3D2FD1] transition-colors">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {item.avatar && (
                        <img
                          src={item.avatar}
                          alt={item.clientOrFreelancer}
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="text-slate-700 font-medium truncate max-w-[140px]">
                        {item.clientOrFreelancer}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {item.category || 'General'}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-extrabold text-[#3D2FD1]">
                    ${item.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-xs font-bold text-[#3D2FD1] hover:text-[#6E5BFF] flex items-center gap-1 justify-end ml-auto cursor-pointer">
                      <span>{item.actionLabel || 'Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. MOBILE VIEW: Automatically stacked cards to avoid horizontal scrollbar blowout */}
        <div className="md:hidden space-y-3">
          {filteredProjects.map((item) => (
            <div
              key={item.id}
              onClick={onProjectClick ? () => onProjectClick(item) : undefined}
              className="p-4 rounded-2xl bg-white/80 border border-[#A38BFF]/25 space-y-3 cursor-pointer hover:border-[#3D2FD1] transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {item.category || 'Project'}
                  </span>
                  <h4 className="font-extrabold text-sm text-[#1A1633] leading-snug">
                    {item.name}
                  </h4>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#A38BFF]/15">
                <div className="flex items-center gap-2">
                  {item.avatar && (
                    <img
                      src={item.avatar}
                      alt={item.clientOrFreelancer}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span className="text-slate-600 font-medium text-xs truncate max-w-[130px]">
                    {item.clientOrFreelancer}
                  </span>
                </div>

                <span className="font-mono font-black text-sm text-[#3D2FD1]">
                  ${item.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {onViewAll && (
        <div className="mt-5 pt-4 border-t border-[#A38BFF]/20 flex items-center justify-end">
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-[#3D2FD1] hover:text-[#6E5BFF] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All Projects in Workstation</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
