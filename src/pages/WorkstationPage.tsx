import React, { useState } from 'react';
import { useGuide } from '../context/GuideContext';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Upload, 
  Download, 
  AlertCircle, 
  RefreshCw, 
  Lock, 
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  MessageSquare,
  Check
} from 'lucide-react';

export const WorkstationPage: React.FC = () => {
  const { 
    contract, 
    submitDeliverable, 
    releaseMilestoneEscrow, 
    requestContractRevision, 
    resetContract,
    currency,
    setActivePage,
    showToast
  } = useGuide();

  const [uploadFileName, setUploadFileName] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const formatCurrency = (amt: number) => {
    if (currency === 'EUR') return `€${Math.round(amt * 0.92)}`;
    if (currency === 'GBP') return `£${Math.round(amt * 0.79)}`;
    return `$${amt}`;
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;
    setIsUploading(true);
    setTimeout(() => {
      submitDeliverable(uploadFileName, '18.4 MB');
      setUploadFileName('');
      setIsUploading(false);
    }, 600);
  };

  const completedCount = contract.milestones.filter(m => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / contract.milestones.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Contract Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#1A1633]/90 backdrop-blur-md text-white border border-[#A38BFF]/40 shadow-xl space-y-6">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#3D2FD1] text-white border border-[#6E5BFF]/30 font-mono">
                {contract.orderNumber}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Escrow Funded (${contract.totalAmount})</span>
              </span>
              <span className="text-xs text-slate-300">
                Status: <strong className="text-white uppercase font-mono">{contract.status.replace('_', ' ')}</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
              {contract.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-300 pt-1">
              <span>Client: <strong>{contract.clientName}</strong></span>
              <span>•</span>
              <span>Talent: <strong>{contract.freelancerName}</strong></span>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-[#A38BFF]/30 flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-[#3D2FD1] flex items-center justify-center text-white">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Delivery Deadline</span>
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
                02d : 14h : 22m
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>On Track for Early Delivery</span>
              </span>
            </div>
          </div>

        </div>

        {/* Milestone Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-[#A38BFF]/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Contract Completion Status</span>
            <span className="font-bold text-[#A38BFF]">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#3D2FD1] via-[#6E5BFF] to-[#A38BFF] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* Main Grid: Milestones Left, Deliverables & Actions Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Milestone Escrow Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1A1633]">Contract Milestones & Escrow Release</h2>
                <p className="text-xs text-slate-500 mt-0.5">Funds are released per approved milestone</p>
              </div>
              <span className="text-xs font-extrabold text-[#3D2FD1] font-mono">
                Total: {formatCurrency(contract.totalAmount)}
              </span>
            </div>

            {/* Milestones List */}
            <div className="space-y-3">
              {contract.milestones.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    m.status === 'completed'
                      ? 'bg-emerald-50/70 backdrop-blur-md border-emerald-300/80'
                      : m.status === 'in_progress'
                      ? 'bg-[#F2F0FF]/90 backdrop-blur-md border-[#3D2FD1]/40 shadow-sm'
                      : 'bg-white/60 backdrop-blur-md border-[#A38BFF]/20 opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      m.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : m.status === 'in_progress'
                        ? 'bg-[#3D2FD1] text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {m.status === 'completed' ? '✓' : `0${idx + 1}`}
                    </div>

                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#1A1633]">{m.name}</h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="font-extrabold text-[#3D2FD1]">{formatCurrency(m.amount)}</span>
                        <span>•</span>
                        <span>{m.dueDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="self-end sm:self-center">
                    {m.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Escrow Released</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => releaseMilestoneEscrow(m.id)}
                        className="px-4 py-2 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-md shadow-[#3D2FD1]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#A38BFF]" />
                        <span>Approve & Release (${m.amount})</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Deliverables Explorer */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#1A1633]">Submitted Deliverables & Assets</h3>
            
            <div className="space-y-2">
              {contract.deliverables.map(file => (
                <div
                  key={file.id}
                  className="p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-[#A38BFF]/20 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#F2F0FF] text-[#3D2FD1] flex items-center justify-center font-mono font-bold text-xs">
                      ZIP
                    </div>
                    <div>
                      <span className="font-bold text-[#1A1633] block">{file.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{file.size} • Submitted {file.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`Downloaded ${file.name}`, 'info')}
                    className="p-2 rounded-xl bg-white/80 border border-[#A38BFF]/30 hover:border-[#3D2FD1] text-slate-600 hover:text-[#3D2FD1] transition-colors cursor-pointer"
                    title="Download Asset"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Simulated Upload Deliverable Form */}
            <form onSubmit={handleSimulateUpload} className="pt-3 border-t border-[#A38BFF]/20 flex items-center gap-2">
              <input
                type="text"
                value={uploadFileName}
                onChange={e => setUploadFileName(e.target.value)}
                placeholder="Submit additional deliverable (e.g., figma_tokens_v2.fig)..."
                className="flex-1 bg-white text-[#1A1633] placeholder:text-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#6E5BFF] focus:outline-none text-xs"
              />
              <button
                type="submit"
                disabled={isUploading}
                className="px-4 py-2.5 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Uploading...' : 'Submit File'}</span>
              </button>
            </form>

          </div>

        </div>

        {/* Right 1 Col: Revision Request & IP Certificate */}
        <div className="space-y-6">
          
          {/* Quick Actions Card */}
          <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-[#A38BFF]/30 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1A1633]">Contract Workstation Actions</h3>

            <button
              onClick={() => setActivePage('chat')}
              className="w-full py-3 rounded-xl bg-[#3D2FD1] hover:bg-[#6E5BFF] text-white text-xs font-bold shadow-md shadow-[#3D2FD1]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#A38BFF]" />
              <span>Open Direct Chat with Talent</span>
            </button>

            <button
              onClick={requestContractRevision}
              className="w-full py-3 rounded-xl border border-amber-300 bg-amber-50/80 backdrop-blur-md hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Request Formal Revision</span>
            </button>

            <button
              onClick={resetContract}
              className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold text-center cursor-pointer"
            >
              Reset Workstation Simulator
            </button>
          </div>

          {/* Legal IP Ownership Card */}
          <div className="p-6 rounded-3xl bg-[#1A1633]/90 backdrop-blur-md text-white border border-[#A38BFF]/40 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-[#A38BFF]">
              <Lock className="w-5 h-5" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Automated IP Transfer</h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Upon final milestone release, all source code, Figma design files, and intellectual property rights are automatically assigned to <strong>Alexander Vance</strong> under Talentio Standard Enterprise Terms.
            </p>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-[#A38BFF]/30 text-[11px] font-mono text-slate-300">
              SHA256: 8f9b2a...3c990a (Verified)
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
