import React, { useState } from 'react';
import { useGuide } from '../../context/GuideContext';
import { KycRecord, KycStatus } from '../../types';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Eye, 
  X, 
  Sparkles, 
  FileText, 
  User, 
  Check, 
  AlertTriangle,
  Sliders,
  Settings,
  RefreshCw,
  Lock,
  ExternalLink,
  PenTool
} from 'lucide-react';

export const KycManagementView: React.FC = () => {
  const { 
    kycRecords, 
    approveKycVerification, 
    rejectKycVerification, 
    requestKycResubmission,
    showToast 
  } = useGuide();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | KycStatus>('all');
  const [selectedRecord, setSelectedRecord] = useState<KycRecord | null>(null);

  // Review & Decision state
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject' | 'resubmit';
    record: KycRecord;
  } | null>(null);

  // Auto-verification policy settings state
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [autoApproveEnabled, setAutoApproveEnabled] = useState(false);
  const [minConfidenceScore, setMinConfidenceScore] = useState(85);
  const [strictFaceMatch, setStrictFaceMatch] = useState(true);

  // Filter records
  const filteredRecords = kycRecords.filter(rec => {
    const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
    const matchesSearch = 
      rec.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.legalFullName && rec.legalFullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rec.documentNumber && rec.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rec.documentCountry && rec.documentCountry.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const pendingCount = kycRecords.filter(r => r.status === 'pending' || r.status === 'submitted' || r.status === 'under_review').length;
  const verifiedCount = kycRecords.filter(r => r.status === 'verified').length;
  const rejectedCount = kycRecords.filter(r => r.status === 'rejected' || r.status === 'resubmission_required' || r.status === 'action_required').length;

  const promptAction = (type: 'approve' | 'reject' | 'resubmit', record: KycRecord) => {
    if (type !== 'approve' && !decisionNotes.trim()) {
      showToast(`Please enter an explanation or note before choosing ${type}.`, 'warning');
      return;
    }
    setConfirmAction({ type, record });
  };

  const executeConfirmedAction = async () => {
    if (!confirmAction) return;
    const { type, record } = confirmAction;
    setIsProcessing(true);

    if (type === 'approve') {
      await approveKycVerification(record.id, record.userId, decisionNotes || 'Identity verified and approved by compliance administrator.');
    } else if (type === 'reject') {
      await rejectKycVerification(record.id, record.userId, decisionNotes);
    } else if (type === 'resubmit') {
      await requestKycResubmission(record.id, record.userId, decisionNotes);
    }

    setIsProcessing(false);
    setConfirmAction(null);
    setSelectedRecord(null);
    setDecisionNotes('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>KYC Compliance & Identity Verification Desk</span>
          </h2>
          <p className="text-xs text-[#ccdcee] mt-0.5">
            Inspect national identity documents, passports, and facial snapshots with AI-assisted verification.
          </p>
        </div>

        <button
          onClick={() => setPolicyModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-[#23324A] hover:bg-[#3A5A86] border border-[#3A5A86]/40 text-xs font-bold text-[#E3EDF9] flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>Auto-Verification Policy</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#23324A]/70 border border-[#3A5A86]/40 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#ccdcee]">Pending Verification</div>
            <div className="text-2xl font-black text-white mt-1">{pendingCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#23324A]/70 border border-[#3A5A86]/40 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#ccdcee]">Verified Accounts</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{verifiedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#23324A]/70 border border-[#3A5A86]/40 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#ccdcee]">Rejected / Resubmit</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{rejectedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-[#23324A]/70 border border-[#3A5A86]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9ab0cb] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by user, email, document #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#172233] border border-[#3A5A86]/30 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#E3EDF9]"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'pending', 'verified', 'rejected', 'resubmission_required'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer shrink-0 ${
                statusFilter === st
                  ? 'bg-[#3A5A86] text-white shadow-sm'
                  : 'bg-[#172233] text-[#ccdcee] hover:bg-[#2a3b54]'
              }`}
            >
              {st === 'all' ? 'All Records' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* KYC Submissions Table */}
      <div className="overflow-hidden rounded-2xl bg-[#23324A]/70 border border-[#3A5A86]/40 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#172233] text-[#9ab0cb] font-bold uppercase tracking-wider text-[10px] border-b border-[#3A5A86]/30">
              <tr>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Document Type & ID</th>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">AI Score</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A5A86]/20">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#9ab0cb]">
                    No KYC verification submissions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-[#3A5A86]/10 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#3A5A86]/40 flex items-center justify-center font-bold text-white uppercase text-xs shrink-0">
                          {record.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white">{record.userName}</div>
                          <div className="text-[11px] text-[#9ab0cb]">{record.userEmail}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-white capitalize">{record.documentType.replace('_', ' ')}</div>
                      <div className="text-[11px] font-mono text-[#9ab0cb]">{record.documentNumber || 'Auto-Extracted'}</div>
                    </td>

                    <td className="py-3 px-4 text-[#ccdcee] font-medium">
                      {record.documentCountry || 'Not Specified'}
                    </td>

                    <td className="py-3 px-4">
                      {record.aiConfidenceScore !== undefined ? (
                        <span className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                          record.aiConfidenceScore >= 80 
                            ? 'bg-emerald-500/20 text-emerald-300' 
                            : record.aiConfidenceScore >= 50
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          <Sparkles className="w-3 h-3" />
                          {record.aiConfidenceScore}%
                        </span>
                      ) : (
                        <span className="text-[#9ab0cb] font-mono text-[11px]">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-[#9ab0cb] font-mono text-[11px]">
                      {new Date(record.submittedAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        record.status === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : record.status === 'pending'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : record.status === 'resubmission_required'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}>
                        {record.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setDecisionNotes(record.adminNotes || record.rejectionReason || '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#3A5A86] hover:bg-[#23324A] text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Inspection & Decision Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-[#1A1633] text-white rounded-3xl border border-[#3D2FD1] p-6 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#3D2FD1]/40 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">{selectedRecord.userName}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    selectedRecord.status === 'verified' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
                <p className="text-xs text-[#A38BFF] mt-0.5">
                  {selectedRecord.userEmail} • User ID: <span className="font-mono">{selectedRecord.userId}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-white/5 border border-[#3D2FD1]/40 text-xs">
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Legal Full Name</div>
                <div className="font-bold text-white mt-0.5">{selectedRecord.legalFullName || selectedRecord.userName}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Date of Birth</div>
                <div className="font-bold text-white mt-0.5">{selectedRecord.dateOfBirth || 'N/A'}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Residence Country</div>
                <div className="font-bold text-white mt-0.5">{selectedRecord.countryOfResidence || 'N/A'}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Issuing Country</div>
                <div className="font-bold text-white mt-0.5">{selectedRecord.documentIssuingCountry || selectedRecord.documentCountry || 'Bangladesh'}</div>
              </div>

              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Document Type</div>
                <div className="font-bold text-white capitalize mt-0.5">{selectedRecord.documentType.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Document Number</div>
                <div className="font-bold text-white font-mono mt-0.5">{selectedRecord.documentNumber || 'Auto-OCR Pending'}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Face Match Score</div>
                <div className="font-bold text-emerald-400 font-mono mt-0.5">
                  {selectedRecord.faceMatchConfidence != null ? `${selectedRecord.faceMatchConfidence}%` : (selectedRecord.aiConfidenceScore ? `${selectedRecord.aiConfidenceScore}%` : 'N/A')}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-bold">Liveness Score</div>
                <div className="font-bold text-cyan-400 font-mono mt-0.5">
                  {selectedRecord.livenessConfidence != null ? `${selectedRecord.livenessConfidence}%` : '85% (High)'}
                </div>
              </div>
            </div>

            {/* AI Analysis Summary if available */}
            {selectedRecord.aiAnalysisNotes && (
              <div className="p-3.5 rounded-2xl bg-[#3D2FD1]/20 border border-[#6E5BFF]/30 text-xs space-y-1">
                <div className="font-bold text-[#A38BFF] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Multimodal Document & Biometric Analysis:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{selectedRecord.aiAnalysisNotes}</p>
              </div>
            )}

            {/* Document Evidence Scans (4-item grid) */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Submitted Identity Evidence Packet (4-Point Verification)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Front */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-300">1. Document Front:</div>
                  <div className="rounded-xl overflow-hidden border border-[#3D2FD1] aspect-[4/3] bg-black/50">
                    <img 
                      src={selectedRecord.documentFrontImage} 
                      alt="Front Document" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* 2. Back */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-300">2. Document Back:</div>
                  {selectedRecord.documentBackImage ? (
                    <div className="rounded-xl overflow-hidden border border-[#3D2FD1] aspect-[4/3] bg-black/50">
                      <img 
                        src={selectedRecord.documentBackImage} 
                        alt="Back Document" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#3D2FD1]/60 aspect-[4/3] flex flex-col items-center justify-center p-3 text-center text-xs text-slate-500">
                      <span>{selectedRecord.documentType === 'passport' ? 'Passport (No back side needed)' : 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* 3. Signature */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-300">3. Handwritten Signature:</div>
                  {selectedRecord.signatureImage ? (
                    <div className="rounded-xl overflow-hidden border border-[#3D2FD1] aspect-[4/3] bg-white p-2">
                      <img 
                        src={selectedRecord.signatureImage} 
                        alt="Signature" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#3D2FD1]/60 aspect-[4/3] flex items-center justify-center text-xs text-slate-500">
                      No signature uploaded
                    </div>
                  )}
                </div>

                {/* 4. Live Face Snapshot */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-300">4. Live Face / Liveness:</div>
                  {selectedRecord.selfieImage ? (
                    <div className="rounded-xl overflow-hidden border border-[#3D2FD1] aspect-[4/3] bg-black/50">
                      <img 
                        src={selectedRecord.selfieImage} 
                        alt="Face Portrait" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#3D2FD1]/60 aspect-[4/3] flex items-center justify-center text-xs text-slate-500">
                      No live photo uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Compliance Decision Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Administrator Compliance Notes / Rejection Reason
              </label>
              <textarea
                rows={2}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder="Add comments, verification reference codes, or specify missing items if requesting resubmission..."
                className="w-full p-3 rounded-xl bg-white/5 border border-[#3D2FD1]/40 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#6E5BFF]"
              />
            </div>

            {/* Decision Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-[#3D2FD1]/40">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => promptAction('resubmit', selectedRecord)}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Request Resubmission</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => promptAction('reject', selectedRecord)}
                className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Document</span>
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={() => promptAction('approve', selectedRecord)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Verify Account</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Confirmation Dialog Modal for Sensitive Admin Decisions */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#191432] text-white rounded-3xl border border-white/20 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                confirmAction.type === 'approve'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : confirmAction.type === 'reject'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {confirmAction.type === 'approve' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : confirmAction.type === 'reject' ? (
                  <XCircle className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h4 className="text-base font-black text-white capitalize">
                  Confirm {confirmAction.type === 'approve' ? 'KYC Approval' : confirmAction.type === 'reject' ? 'KYC Rejection' : 'Resubmission Request'}
                </h4>
                <p className="text-xs text-slate-300">
                  User: <span className="font-bold text-white">{confirmAction.record.userName}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/10">
              {confirmAction.type === 'approve'
                ? 'Approving this document will grant the user verified seller privileges, activate their verified badge, and allow them to publish gigs and submit bids.'
                : confirmAction.type === 'reject'
                ? `Rejecting will block seller privileges and notify the user with your note: "${decisionNotes}".`
                : `Requesting resubmission will ask the user to provide updated files with your instructions: "${decisionNotes}".`}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={executeConfirmedAction}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-colors cursor-pointer shadow-lg ${
                  confirmAction.type === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : confirmAction.type === 'reject'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Confirm & Execute'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Verification Policy Modal */}
      {policyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#23324A] text-white rounded-3xl border border-[#3A5A86] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#3A5A86]/40 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Automated KYC Verification Policy</h3>
              </div>
              <button
                onClick={() => setPolicyModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#ccdcee]">
              Configure Gemini automated multimodal inspection rules. Submissions meeting or exceeding your confidence threshold can be auto-approved without manual admin intervention.
            </p>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-[#3A5A86]/30 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Enable Auto-Verification Engine</div>
                  <div className="text-[11px] text-[#9ab0cb]">Automatically verify accounts that pass AI confidence threshold</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoApproveEnabled}
                  onChange={(e) => setAutoApproveEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                />
              </label>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-[#3A5A86]/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Minimum AI Confidence Threshold</span>
                  <span className="font-mono text-emerald-400">{minConfidenceScore}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={minConfidenceScore}
                  onChange={(e) => setMinConfidenceScore(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>60% (Lenient)</span>
                  <span>85% (Balanced)</span>
                  <span>98% (Strict)</span>
                </div>
              </div>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-[#3A5A86]/30 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Enforce Live Face Match</div>
                  <div className="text-[11px] text-[#9ab0cb]">Require portrait facial similarity check against ID photo</div>
                </div>
                <input
                  type="checkbox"
                  checked={strictFaceMatch}
                  onChange={(e) => setStrictFaceMatch(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#3A5A86]/40">
              <button
                onClick={() => setPolicyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showToast('KYC auto-verification policy updated successfully!', 'success');
                  setPolicyModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                Save Policy
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
