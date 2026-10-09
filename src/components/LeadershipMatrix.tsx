import React from 'react';
import { WardLeader } from '../types';
import { Award, Clock, CheckCircle2, AlertTriangle, ArrowRight, ThumbsUp } from 'lucide-react';

interface LeadershipMatrixProps {
  leaders: WardLeader[];
  onSelectLeaderFilter: (wardId: string) => void;
}

export const LeadershipMatrix: React.FC<LeadershipMatrixProps> = ({
  leaders,
  onSelectLeaderFilter,
}) => {
  const totalReportsCitywide = leaders.reduce((acc, l) => acc + l.totalReports, 0);
  const totalResolvedCitywide = leaders.reduce((acc, l) => acc + l.resolvedReports, 0);
  const overallResolutionRate = totalReportsCitywide > 0 ? Math.round((totalResolvedCitywide / totalReportsCitywide) * 100) : 0;
  const avgCityDays = leaders.length > 0
    ? (leaders.reduce((acc, l) => acc + l.avgResolutionDays, 0) / leaders.length).toFixed(1)
    : '3.5';

  const bestLeader = [...leaders].sort((a, b) => b.accountabilityScore - a.accountabilityScore)[0];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Democracy & Civic Oversight
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
          Ward Leadership Accountability Index
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
          Public property maintenance directly reflects elected leadership competence. Compare your local ward councillors on concrete repair turnaround, unresolved citizen complaints, and public safety responsiveness so you can choose wisely in upcoming municipal elections.
        </p>
      </div>

      {/* Citywide Benchmark Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">Total Citizen Reports</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {totalReportsCitywide}
          </div>
          <div className="text-xs text-slate-500 mt-1">Verified anonymous claims</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">Citywide Resolution Rate</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {overallResolutionRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1">{totalResolvedCitywide} hazards repaired</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">Avg Fix Turnaround</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono tabular-nums">
            {avgCityDays} <span className="text-sm font-normal text-slate-500">days</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">From report to inspection</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs text-slate-500 font-medium">Top Performing Leader</div>
          <div className="text-base font-bold text-slate-900 mt-1 truncate">
            {bestLeader?.name}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            {bestLeader?.accountabilityScore}% Accountability Score
          </div>
        </div>
      </div>

      {/* Leadership Scorecards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Elected Representatives by Ward
          </h2>
          <span className="text-xs text-slate-500">
            Sorted by Accountability Score
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...leaders]
            .sort((a, b) => b.accountabilityScore - a.accountabilityScore)
            .map((leader, index) => {
              const isHighPerformance = leader.accountabilityScore >= 80;
              const isModeratePerformance = leader.accountabilityScore >= 60 && leader.accountabilityScore < 80;

              return (
                <div
                  key={leader.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    {/* Header: Name, Rank, Party */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400 font-mono">
                            #{index + 1}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900">
                            {leader.name}
                          </h3>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {leader.role} · <span className="text-slate-700 font-medium">{leader.party}</span>
                        </div>
                        <div className="text-xs font-medium text-slate-600 mt-0.5">
                          {leader.wardName} · Term {leader.term}
                        </div>
                      </div>

                      {/* Accountability Score Circular Badge */}
                      <div className="text-right shrink-0">
                        <div
                          className={`text-2xl font-bold font-mono tabular-nums ${
                            isHighPerformance
                              ? 'text-emerald-600'
                              : isModeratePerformance
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {leader.accountabilityScore}%
                        </div>
                        <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                          Accountability
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar of Resolution */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Resolution Rate</span>
                        <span className="font-mono tabular-nums font-semibold">
                          {leader.totalReports > 0
                            ? Math.round((leader.resolvedReports / leader.totalReports) * 100)
                            : 0}
                          % ({leader.resolvedReports}/{leader.totalReports})
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                        <div
                          className="bg-emerald-600 h-full"
                          style={{
                            width: `${(leader.resolvedReports / (leader.totalReports || 1)) * 100}%`,
                          }}
                        />
                        <div
                          className="bg-amber-500 h-full"
                          style={{
                            width: `${(leader.inProgressReports / (leader.totalReports || 1)) * 100}%`,
                          }}
                        />
                        <div
                          className="bg-rose-500 h-full"
                          style={{
                            width: `${(leader.pendingReports / (leader.totalReports || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Compact Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <div className="text-slate-500 text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Turnaround</span>
                        </div>
                        <div className="font-bold text-slate-900 mt-1 font-mono tabular-nums">
                          {leader.avgResolutionDays} days
                        </div>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg">
                        <div className="text-slate-500 text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Fixed</span>
                        </div>
                        <div className="font-bold text-slate-900 mt-1 font-mono tabular-nums">
                          {leader.resolvedReports} items
                        </div>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg">
                        <div className="text-slate-500 text-[11px] flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-indigo-500" />
                          <span>Citizen Rating</span>
                        </div>
                        <div className="font-bold text-slate-900 mt-1 font-mono tabular-nums">
                          {leader.citizenApproval}%
                        </div>
                      </div>
                    </div>

                    {/* Official Statement & Voter Assessment */}
                    <div className="text-xs text-slate-600 border-t border-slate-100 pt-3 space-y-1.5">
                      <div className="text-slate-900 font-semibold text-[11px] uppercase tracking-wider">
                        Voter Civic Assessment
                      </div>
                      <p className="italic text-slate-600 text-xs leading-relaxed">
                        "{leader.statement}"
                      </p>
                      <div className="text-slate-500 text-[11px]">
                        Priority Focus: <span className="text-slate-700 font-medium">{leader.topFocusArea}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Filter by this leader */}
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      {leader.pendingReports > 0 ? (
                        <span className="text-amber-700 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {leader.pendingReports} pending reports unattended
                        </span>
                      ) : (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          All reports addressed
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onSelectLeaderFilter(leader.wardId)}
                      className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>View Ward Reports</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Pre-election voter guide banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 space-y-4">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Electoral Transparency Notice
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            How Fixora Helps Citizens Vote Wisely
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            During elections, political promises often contrast with local ground reality. Fixora aggregates verifiable anonymous citizen reports to provide tamper-proof accountability data: which councillor actively fixes hazardous potholes and broken lighting, and who leaves public infrastructure to deteriorate.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-300">
          <div>
            <strong className="text-white block mb-0.5">1. Zero Tampering</strong>
            Reports are logged with immutable timestamps and automated municipal routing.
          </div>
          <div>
            <strong className="text-white block mb-0.5">2. Protected Whistleblowers</strong>
            Citizens report dangerous neglect without fear of political backlash or intimidation.
          </div>
          <div>
            <strong className="text-white block mb-0.5">3. Metric-Driven Democracy</strong>
            Vote based on tangible infrastructure results rather than promotional campaign speeches.
          </div>
        </div>
      </div>
    </div>
  );
};
