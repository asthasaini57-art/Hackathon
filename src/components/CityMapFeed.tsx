import React, { useState } from 'react';
import { DamageReport, WardLeader } from '../types';
import {
  MapPin,
  ThumbsUp,
  Clock,
  Building,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

interface CityMapFeedProps {
  reports: DamageReport[];
  leaders: WardLeader[];
  selectedWardFilter: string;
  onSelectWardFilter: (wardId: string) => void;
  onOpenReportDetail: (report: DamageReport) => void;
  onUpvoteReport: (reportId: string) => void;
}

export const CityMapFeed: React.FC<CityMapFeedProps> = ({
  reports,
  leaders,
  selectedWardFilter,
  onSelectWardFilter,
  onOpenReportDetail,
  onUpvoteReport,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'feed' | 'map'>('feed');

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (selectedWardFilter !== 'all' && r.location.wardId !== selectedWardFilter) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchAddr = r.location.address.toLowerCase().includes(q);
      const matchLeader = r.assignedLeader.name.toLowerCase().includes(q);
      const matchToken = r.trackingToken.toLowerCase().includes(q);
      if (!matchTitle && !matchAddr && !matchLeader && !matchToken) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Municipal Damage & Public Property Feed
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real-time verified reports submitted anonymously by local citizens and routed to municipal wards.
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-center shrink-0">
          <button
            onClick={() => setViewMode('feed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              viewMode === 'feed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            List & Photo Feed ({filteredReports.length})
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>District Ward Map</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span>Filters & Governance Segments</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Ward filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Municipal Ward / Leadership
            </label>
            <select
              value={selectedWardFilter}
              onChange={(e) => onSelectWardFilter(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Wards (Citywide)</option>
              {leaders.map((l) => (
                <option key={l.wardId} value={l.wardId}>
                  {l.wardName} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Dispatch Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Statuses</option>
              <option value="Under Review">Under Review</option>
              <option value="Dispatched to Crew">Dispatched to Crew</option>
              <option value="Work In Progress">Work In Progress</option>
              <option value="Resolved">Resolved & Verified</option>
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Property Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Infrastructure</option>
              <option value="Roads & Pavement">Roads & Pavement</option>
              <option value="Street Lighting">Street Lighting</option>
              <option value="Water & Drainage">Water & Drainage</option>
              <option value="Parks & Recreation">Parks & Recreation</option>
              <option value="Public Transit & Signage">Public Transit & Signage</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Keyword or Anonymous Token
            </label>
            <input
              type="text"
              placeholder="Search street, token, leader..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Map View Mode */}
      {viewMode === 'map' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Interactive Ward Municipal Grid
              </h3>
              <p className="text-xs text-slate-500">
                Click any district zone or damage pin to view the responsible leadership and inspection timeline.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                Critical Hazard
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                In Progress
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Resolved
              </span>
            </div>
          </div>

          {/* SVG Schematic District Map */}
          <div className="relative w-full aspect-21/9 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center p-6 text-slate-300">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            {/* Ward Zones Overlay */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-6 gap-4 pointer-events-none">
              <div className="border border-slate-800/80 rounded-lg p-3 bg-slate-900/40">
                <span className="text-[11px] font-mono font-semibold text-slate-400 block">
                  ZONE NW: WARD 4
                </span>
                <span className="text-xs text-slate-300">Elena Rostova (Civic Renewal)</span>
              </div>
              <div className="border border-slate-800/80 rounded-lg p-3 bg-slate-900/40">
                <span className="text-[11px] font-mono font-semibold text-slate-400 block">
                  ZONE NE: WARD 7
                </span>
                <span className="text-xs text-slate-300">Marcus Vance (Progressive Forum)</span>
              </div>
              <div className="border border-slate-800/80 rounded-lg p-3 bg-slate-900/40">
                <span className="text-[11px] font-mono font-semibold text-slate-400 block">
                  ZONE SW: WARD 12
                </span>
                <span className="text-xs text-slate-300">Sarah Chen (Green Caucus)</span>
              </div>
              <div className="border border-slate-800/80 rounded-lg p-3 bg-slate-900/40">
                <span className="text-[11px] font-mono font-semibold text-slate-400 block">
                  ZONE SE: WARD 18
                </span>
                <span className="text-xs text-slate-300">Donald Sterling (Independent)</span>
              </div>
            </div>

            {/* Pins on map */}
            <div className="relative z-10 w-full h-full flex flex-wrap items-center justify-around">
              {filteredReports.map((report) => {
                const isResolved = report.status === 'Resolved';
                const isCritical = report.severity === 'Critical Hazard';
                const pinColor = isResolved
                  ? 'bg-emerald-500 border-emerald-300'
                  : isCritical
                  ? 'bg-rose-500 border-rose-300'
                  : 'bg-amber-500 border-amber-300';

                return (
                  <button
                    key={report.id}
                    onClick={() => onOpenReportDetail(report)}
                    className="group relative flex flex-col items-center cursor-pointer p-2 transition-transform hover:scale-110"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 ${pinColor} shadow-lg`} />
                    <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded shadow-md whitespace-nowrap pointer-events-none z-20 border border-slate-700">
                      <div className="font-semibold">{report.title}</div>
                      <div className="text-[10px] text-slate-400">
                        {report.location.wardName} · {report.status}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reports Feed Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            No Damage Reports Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or ward filter to view public property reports.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReports.map((report) => {
            const isResolved = report.status === 'Resolved';
            const isCritical = report.severity === 'Critical Hazard';

            return (
              <div
                key={report.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image with overlay indicators */}
                  <div className="relative aspect-16/9 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Overlay Tag Information: unboxed, clean readability */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                        {report.id}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded backdrop-blur-xs ${
                          isResolved
                            ? 'bg-emerald-600/90 text-white'
                            : isCritical
                            ? 'bg-rose-600/90 text-white'
                            : 'bg-amber-600/90 text-white'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>

                    {/* Bottom overlay: Location and Hazard score */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[11px] text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
                        <span className="truncate">{report.location.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    {/* Unboxed Metadata with typographic separators */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                      <span className="font-medium text-slate-700">{report.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{report.location.wardName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{report.daysOpen} days open</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                      {report.title}
                    </h2>

                    {/* Description preview */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>

                    {/* Elected Leadership & Department accountability box */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-[11px] text-slate-500">Under Leadership of:</span>
                        <span className="font-semibold text-slate-900">
                          {report.assignedLeader.name} ({report.assignedLeader.party})
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-[11px] text-slate-500">Action Agency:</span>
                        <span className="truncate max-w-[200px] text-right text-slate-800">
                          {report.department}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Confirm Button & Details */}
                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between gap-3">
                  {/* Citizen confirmation upvote */}
                  <button
                    onClick={() => onUpvoteReport(report.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                      report.hasUpvoted
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Affects Me Too</span>
                    <span className="font-mono tabular-nums text-slate-500 ml-1">
                      ({report.upvotes})
                    </span>
                  </button>

                  {/* View Details modal */}
                  <button
                    onClick={() => onOpenReportDetail(report)}
                    className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Inspection Log</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
