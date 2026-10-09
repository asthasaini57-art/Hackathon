import React from 'react';
import { ShieldCheck, Plus, Search, Building2, LogOut, User } from 'lucide-react';
import { AuthUser } from '../types';

interface NavbarProps {
  currentUser: AuthUser;
  activeTab: 'feed' | 'leadership' | 'console';
  setActiveTab: (tab: 'feed' | 'leadership' | 'console') => void;
  onOpenReportModal: () => void;
  onOpenLookupModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenLookupModal,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Nav Links) - Zone 3 (Primary Action) */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
              FX
            </div>
            <button
              onClick={() => setActiveTab('feed')}
              className="text-lg font-bold tracking-tight text-slate-900 hover:text-slate-700 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
            >
              Fixora
            </button>
          </div>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('feed')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'feed' ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
              }`}
            >
              Public Property Feed
            </button>
            <button
              onClick={() => setActiveTab('leadership')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'leadership' ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
              }`}
            >
              Leadership Accountability
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'console' ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              Municipal Works
            </button>
            <button
              onClick={onOpenLookupModal}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 text-slate-500"
            >
              <Search className="w-3.5 h-3.5" />
              Track by Token
            </button>
          </nav>

          {/* Zone 3: Primary Action + User Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* User identifier chip */}
            <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700">
              {currentUser.isAnonymous ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium truncate max-w-[110px]">{currentUser.name}</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="font-medium truncate max-w-[110px]">{currentUser.name}</span>
                </>
              )}
            </div>

            <button
              onClick={onOpenReportModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Damage</span>
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              title="Sign out / switch persona"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

