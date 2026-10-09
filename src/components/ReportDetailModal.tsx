import React, { useState } from 'react';
import { DamageReport, WardLeader, ReportStatus } from '../types';
import {
  X,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Building2,
  ThumbsUp,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
} from 'lucide-react';

interface ReportDetailModalProps {
  report: DamageReport | null;
  leaders: WardLeader[];
  onClose: () => void;
  onUpvote: (reportId: string) => void;
  onStatusUpdate: (reportId: string, newStatus: ReportStatus, note: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  leaders,
  onClose,
  onUpvote,
  onStatusUpdate,
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [newStatus, setNewStatus] = useState<ReportStatus>(report?.status || 'Under Review');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!report) return null;

  const leader = leaders.find((l) => l.wardId === report.location.wardId) || leaders[0];

  const handleCopyToken = () => {
    navigator.clipboard.writeText(report.trackingToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatus === report.status && !statusNote) return;
    setIsUpdating(true);
    try {
      await onStatusUpdate(report.id, newStatus, statusNote || `Status updated to ${newStatus}`);
      setStatusNote('');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-200 rounded text-slate-800">
              {report.id}
            </span>
            <div className="text-xs text-slate-500">
              Anonymous Tracking: <strong className="font-mono text-slate-800">{report.trackingToken}</strong>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Visual & Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Photo preview */}
            <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-slate-200 bg-slate-900">
              <img
                src={report.imageUrl}
                alt={report.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Anonymity Scrub Verified</span>
              </div>
            </div>

            {/* Core Details */}
            <div className="space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{report.category}</span>
                  <span>·</span>
                  <span>{report.severity}</span>
                </div>
                <h1 className="text-lg font-bold text-slate-900 mt-1 leading-snug">
                  {report.title}
                </h1>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {report.description}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{report.location.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Reported {new Date(report.reportedAt).toLocaleDateString()} · {report.daysOpen} days open</span>
                  </div>
                </div>
              </div>

              {/* Citizen confirmation and token copy */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onUpvote(report.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    report.hasUpvoted
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Confirm Issue ({report.upvotes})</span>
                </button>

                <button
                  onClick={handleCopyToken}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Token Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Tracking Token</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Leadership & Political Accountability Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-700" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Responsible Leadership & Municipal Ward
                </h2>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Score: {leader.accountabilityScore}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Elected Ward Representative</span>
                <span className="font-semibold text-slate-900 text-sm">{report.assignedLeader.name}</span>
                <span className="text-slate-600 block">{report.assignedLeader.party}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Ward Jurisdiction & Agency</span>
                <span className="font-medium text-slate-900">{report.location.wardName}</span>
                <span className="text-slate-600 block">{report.department}</span>
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Ward Fix Record: {leader.resolvedReports} of {leader.totalReports} resolved</span>
              <span className="font-mono tabular-nums">Avg Turnaround: {leader.avgResolutionDays} days</span>
            </div>
          </div>

          {/* AI Damage Assessment */}
          {report.aiAnalysis && (
            <div className="border border-indigo-100 bg-indigo-50/40 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Structural & Hazard Inspection (Gemini)</span>
                </div>
                <span className="font-mono text-xs font-bold text-indigo-950 bg-indigo-100 px-2 py-0.5 rounded">
                  Hazard: {report.aiAnalysis.hazardScore}/100
                </span>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Safety Risk:</strong> {report.aiAnalysis.safetyRisk}
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900">Action Plan:</strong> {report.aiAnalysis.actionRequired}
              </div>
              <div className="text-[11px] text-slate-500">
                Recommended Timeline: {report.aiAnalysis.urgencyText}
              </div>
            </div>
          )}

          {/* Chronological Municipal Dispatch Timeline */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Municipal Dispatch & Action Timeline
            </h2>
            <div className="border-l-2 border-slate-200 ml-2 pl-4 space-y-4">
              {report.timeline.map((item) => (
                <div key={item.id} className="relative space-y-1">
                  <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{item.status}</span>
                    <span className="text-[11px] font-mono text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-xs text-slate-600">{item.note}</p>
                  <div className="text-[10px] text-slate-400">Actor: {item.actor}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Municipal Work Action Console (for Hackathon Demo) */}
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Municipal Authority Dispatch Control
              </span>
              <span className="text-[11px] text-slate-400">Official Municipal Console</span>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Update Pipeline Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Dispatched to Crew">Dispatched to Crew</option>
                    <option value="Work In Progress">Work In Progress</option>
                    <option value="Resolved">Resolved & Verified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Inspection / Dispatch Note
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Repair crew Alpha deployed with hot-mix asphalt."
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>{isUpdating ? 'Saving...' : 'Update Municipal Status'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
