import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginScreen } from './components/LoginScreen';
import { CityMapFeed } from './components/CityMapFeed';
import { LeadershipMatrix } from './components/LeadershipMatrix';
import { MunicipalConsole } from './components/MunicipalConsole';
import { ReportModal } from './components/ReportModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { TokenLookupModal } from './components/TokenLookupModal';
import { DamageReport, WardLeader, ReportStatus, AuthUser } from './types';
import { INITIAL_REPORTS, INITIAL_LEADERS } from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'leadership' | 'console'>('feed');
  const [reports, setReports] = useState<DamageReport[]>(INITIAL_REPORTS);
  const [leaders, setLeaders] = useState<WardLeader[]>(INITIAL_LEADERS);
  const [selectedWardFilter, setSelectedWardFilter] = useState<string>('all');
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [selectedReportDetail, setSelectedReportDetail] = useState<DamageReport | null>(null);

  // Load initial data from API
  const loadData = async () => {
    try {
      const [reportsRes, leadersRes] = await Promise.all([
        fetch('/api/reports'),
        fetch('/api/leaders')
      ]);
      if (reportsRes.ok) {
        const rData = await reportsRes.json();
        if (rData.reports) setReports(rData.reports);
      }
      if (leadersRes.ok) {
        const lData = await leadersRes.json();
        if (lData.leaders) setLeaders(lData.leaders);
      }
    } catch (err) {
      console.warn('API fetch fallback to local seed data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'municipal_official') {
      setActiveTab('console');
    } else {
      setActiveTab('feed');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleReportCreated = (newReport: DamageReport) => {
    setReports((prev) => [newReport, ...prev]);
    loadData();
  };

  const handleStatusUpdate = async (reportId: string, newStatus: ReportStatus, note: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setReports((prev) =>
            prev.map((r) => (r.id === reportId ? data.report : r))
          );
          if (selectedReportDetail?.id === reportId) {
            setSelectedReportDetail(data.report);
          }
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      loadData();
    }
  };

  const handleUpvoteReport = async (reportId: string) => {
    try {
      const res = await fetch(`/api/reports/${reportId}/upvote`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, upvotes: data.upvotes, hasUpvoted: true } : r))
        );
        if (selectedReportDetail?.id === reportId) {
          setSelectedReportDetail((prev) =>
            prev ? { ...prev, upvotes: data.upvotes, hasUpvoted: true } : null
          );
        }
      }
    } catch (err) {
      console.error('Error upvoting report:', err);
    }
  };

  const handleSelectLeaderFilter = (wardId: string) => {
    setSelectedWardFilter(wardId);
    setActiveTab('feed');
  };

  // If user is not yet logged in, present the Login Gateway
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenLookupModal={() => setIsLookupModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'feed' && (
          <CityMapFeed
            reports={reports}
            leaders={leaders}
            selectedWardFilter={selectedWardFilter}
            onSelectWardFilter={setSelectedWardFilter}
            onOpenReportDetail={(report) => setSelectedReportDetail(report)}
            onUpvoteReport={handleUpvoteReport}
          />
        )}

        {activeTab === 'leadership' && (
          <LeadershipMatrix
            leaders={leaders}
            onSelectLeaderFilter={handleSelectLeaderFilter}
          />
        )}

        {activeTab === 'console' && (
          <MunicipalConsole
            reports={reports}
            leaders={leaders}
            onStatusUpdate={handleStatusUpdate}
            onOpenReportDetail={(report) => setSelectedReportDetail(report)}
          />
        )}
      </main>

      {/* Modals */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        leaders={leaders}
        onReportCreated={handleReportCreated}
      />

      <ReportDetailModal
        report={selectedReportDetail}
        leaders={leaders}
        onClose={() => setSelectedReportDetail(null)}
        onUpvote={handleUpvoteReport}
        onStatusUpdate={handleStatusUpdate}
      />

      <TokenLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
        reports={reports}
        onOpenReportDetail={(report) => setSelectedReportDetail(report)}
      />

      {/* Minimal Anti-Slop Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Fixora</span>
            <span aria-hidden="true">·</span>
            <span>Anonymous Public Damage & Leadership Accountability</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Whistleblower Protection Active</span>
            <span aria-hidden="true">·</span>
            <span>Municipal Dispatch API</span>
            <span aria-hidden="true">·</span>
            <span>Civic Hackathon 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
