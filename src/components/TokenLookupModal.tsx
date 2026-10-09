import React, { useState } from 'react';
import { X, Search, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { DamageReport } from '../types';

interface TokenLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: DamageReport[];
  onOpenReportDetail: (report: DamageReport) => void;
}

export const TokenLookupModal: React.FC<TokenLookupModalProps> = ({
  isOpen,
  onClose,
  reports,
  onOpenReportDetail,
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundReport, setFoundReport] = useState<DamageReport | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tokenInput.trim().toUpperCase();
    const report = reports.find(
      (r) => r.trackingToken.toUpperCase() === clean || r.id.toUpperCase() === clean
    );
    setFoundReport(report || null);
    setSearched(true);
  };

  const handleQuickFill = (sampleToken: string) => {
    setTokenInput(sampleToken);
    const report = reports.find((r) => r.trackingToken === sampleToken);
    setFoundReport(report || null);
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Anonymous Ticket Lookup
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Enter your private anonymous tracking token received during submission to check municipal dispatch and inspection logs without revealing identity.
          </p>

          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. ANON-8842-1A"
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  setSearched(false);
                }}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 uppercase"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lookup Ticket Status</span>
            </button>
          </form>

          {/* Sample quick tokens from active reports */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] text-slate-400 font-medium mb-1.5">
              Try existing sample tokens:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {reports.slice(0, 3).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleQuickFill(r.trackingToken)}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  {r.trackingToken}
                </button>
              ))}
            </div>
          </div>

          {/* Search Result */}
          {searched && (
            <div className="pt-2">
              {foundReport ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">{foundReport.id}</span>
                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {foundReport.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-800 font-medium">
                    {foundReport.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Jurisdiction: {foundReport.location.wardName} · {foundReport.assignedLeader.name}
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenReportDetail(foundReport);
                    }}
                    className="w-full mt-2 py-1.5 text-xs font-semibold text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Open Full Inspection Log</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>No report found for token "{tokenInput}". Please verify format.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
