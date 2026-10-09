import React, { useState } from 'react';
import { DamageReport, WardLeader, ReportStatus } from '../types';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';

interface MunicipalConsoleProps {
  reports: DamageReport[];
  leaders: WardLeader[];
  onStatusUpdate: (reportId: string, status: ReportStatus, note: string) => void;
  onOpenReportDetail: (report: DamageReport) => void;
}

export const MunicipalConsole: React.FC<MunicipalConsoleProps> = ({
  reports,
  leaders,
  onStatusUpdate,
  onOpenReportDetail,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [quickActionLoading, setQuickActionLoading] = useState<string | null>(null);

  const departments = Array.from(new Set(reports.map((r) => r.department)));

  const filtered = reports.filter((r) => {
    if (selectedDept !== 'all' && r.department !== selectedDept) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    return true;
  });

  const handleQuickAdvance = async (report: DamageReport) => {
    setQuickActionLoading(report.id);
    try {
      let nextStatus: ReportStatus = 'Dispatched to Crew';
      let note = 'Municipal dispatch issued work order.';

      if (report.status === 'Under Review') {
        nextStatus = 'Dispatched to Crew';
        note = `Dispatched field inspection crew to ${report.location.address}.`;
      } else if (report.status === 'Dispatched to Crew') {
        nextStatus = 'Work In Progress';
        note = 'Maintenance repair crew active on site with materials.';
      } else if (report.status === 'Work In Progress') {
        nextStatus = 'Resolved';
        note = 'Infrastructure damage fully repaired, tested, and cleared by municipal inspector.';
      }

      await onStatusUpdate(report.id, nextStatus, note);
    } finally {
      setQuickActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <Building2 className="w-4 h-4 text-slate-700" />
          <span>Municipal Works & Dispatch Operations</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
          Municipal Field Dispatch Console
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Simulate the municipal agency response. Review citizen reports, advance repair crews through the resolution pipeline, and observe how leadership accountability scores update in real time.
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Filter by Action Agency
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
            >
              <option value="all">All Municipal Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Filter by Pipeline Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
            >
              <option value="all">All Statuses</option>
              <option value="Under Review">Under Review</option>
              <option value="Dispatched to Crew">Dispatched to Crew</option>
              <option value="Work In Progress">Work In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono tabular-nums self-end sm:self-center">
          Showing {filtered.length} Work Orders
        </div>
      </div>

      {/* High Density Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Ticket & Title</th>
                <th className="py-3 px-4">Category & Hazard</th>
                <th className="py-3 px-4">Ward Leadership</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Pipeline Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((r) => {
                const isResolved = r.status === 'Resolved';
                const isUnderReview = r.status === 'Under Review';
                const isDispatched = r.status === 'Dispatched to Crew';
                const isProgress = r.status === 'Work In Progress';

                return (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Ticket & Title */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-slate-900">{r.id}</div>
                      <div className="font-medium text-slate-900 truncate max-w-[200px] mt-0.5">
                        {r.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {r.location.address}
                      </div>
                    </td>

                    {/* Category & Hazard */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{r.category}</div>
                      <div
                        className={`text-[11px] font-semibold mt-0.5 ${
                          r.severity === 'Critical Hazard'
                            ? 'text-rose-600'
                            : r.severity === 'High Urgency'
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {r.severity}
                      </div>
                    </td>

                    {/* Ward Leadership */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{r.assignedLeader.name}</div>
                      <div className="text-[11px] text-slate-500">{r.location.wardName}</div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4">
                      <div className="truncate max-w-[180px] text-slate-800">{r.department}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {r.daysOpen} days active
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block font-semibold px-2 py-0.5 rounded text-[11px] ${
                          isResolved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isProgress
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : isDispatched
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    {/* Quick pipeline action */}
                    <td className="py-3 px-4 text-right">
                      {isResolved ? (
                        <div className="text-emerald-700 font-semibold text-xs flex items-center justify-end gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Repaired</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onOpenReportDetail(r)}
                            className="text-[11px] text-slate-600 hover:text-slate-900 px-2 py-1 rounded border border-slate-200 bg-white"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleQuickAdvance(r)}
                            disabled={quickActionLoading === r.id}
                            className="text-[11px] font-semibold text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded transition-colors cursor-pointer"
                          >
                            {quickActionLoading === r.id
                              ? 'Saving...'
                              : isUnderReview
                              ? 'Dispatch Crew'
                              : isDispatched
                              ? 'Start Work'
                              : 'Mark Resolved'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
