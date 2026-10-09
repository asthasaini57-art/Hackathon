import React, { useState } from 'react';
import { AuthUser } from '../types';
import {
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: AuthUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'anonymous' | 'official'>('anonymous');
  
  // Form states for official login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [trackingTokenInput, setTrackingTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. One-click anonymous citizen entry
  const handleContinueAnonymous = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const user: AuthUser = {
      id: `anon-${randomId}`,
      name: `Citizen #${randomId}`,
      role: 'anonymous_citizen',
      isAnonymous: true,
      avatarInitials: 'AC',
    };
    onLogin(user);
  };

  // 2. Token-based entry
  const handleTokenEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingTokenInput.trim()) {
      setErrorMsg('Please enter a valid tracking token.');
      return;
    }
    const user: AuthUser = {
      id: `token-${trackingTokenInput.trim().toUpperCase()}`,
      name: `Ticket Holder (${trackingTokenInput.trim().toUpperCase()})`,
      role: 'anonymous_citizen',
      isAnonymous: true,
      avatarInitials: 'TH',
    };
    onLogin(user);
  };

  // 3. Official submit
  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please provide an official email address.');
      return;
    }

    const user: AuthUser = {
      id: 'official-custom',
      name: email.split('@')[0].replace('.', ' '),
      role: 'municipal_official',
      isAnonymous: false,
      avatarInitials: 'MO',
      officialTitle: 'Municipal Works Officer',
      wardJurisdiction: 'Citywide Operations',
      email,
    };
    onLogin(user);
  };

  // 4. Quick Demo Presets
  const handleQuickPreset = (role: 'ward-04' | 'ward-12' | 'inspector') => {
    if (role === 'ward-04') {
      onLogin({
        id: 'leader-ward-04',
        name: 'Elena Rostova',
        role: 'municipal_official',
        isAnonymous: false,
        avatarInitials: 'ER',
        officialTitle: 'Ward 4 City Councillor',
        wardJurisdiction: 'Ward 4 - Riverside & Metro Core',
        email: 'elena.rostova@metro.gov',
      });
    } else if (role === 'ward-12') {
      onLogin({
        id: 'leader-ward-12',
        name: 'Sarah Chen',
        role: 'municipal_official',
        isAnonymous: false,
        avatarInitials: 'SC',
        officialTitle: 'Ward 12 City Councillor',
        wardJurisdiction: 'Ward 12 - Greenwood & South Hills',
        email: 'sarah.chen@metro.gov',
      });
    } else {
      onLogin({
        id: 'inspector-dpw',
        name: 'Marcus Brody',
        role: 'municipal_official',
        isAnonymous: false,
        avatarInitials: 'MB',
        officialTitle: 'DPW Chief Dispatch Officer',
        wardJurisdiction: 'Metropolitan Infrastructure Division',
        email: 'm.brody@publicworks.gov',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Civic Mission & Whistleblower Context */}
        <div className="lg:col-span-5 bg-slate-950 text-white rounded-2xl p-8 border border-slate-800 flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-slate-950 font-bold flex items-center justify-center text-sm">
                FX
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Fixora</span>
            </div>

            <div className="mt-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Protected Citizen Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Report damaged public property without revealing your identity.
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                Public property belongs to everyone. When infrastructure collapses, citizens can report hazardous neglect directly to municipalities with guaranteed anonymity, holding elected ward councillors accountable.
              </p>
            </div>
          </div>

          {/* Value Proof Badges */}
          <div className="space-y-4 pt-6 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">100% Anonymity Guaranteed</strong>
                <span>Zero device fingerprints, camera EXIF stripped, and no name required.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Leadership Accountability Matrix</strong>
                <span>See which ward councillor repairs hazards and who lets public streets decay.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">AI Damage Hazard Assessor</strong>
                <span>Instant automated severity and departmental routing powered by Gemini.</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Fixora Civic Governance Framework · Hackathon Edition 2026
          </div>
        </div>

        {/* Right Column: Interactive Login Container */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Access Gateway
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose how you want to interact with the municipal reporting network.
              </p>
            </div>

            {/* Segmented Mode Selector */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('anonymous');
                  setErrorMsg('');
                }}
                className={`py-2 px-3 rounded-md transition-all cursor-pointer text-center ${
                  activeTab === 'anonymous'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Anonymous Citizen
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('official');
                  setErrorMsg('');
                }}
                className={`py-2 px-3 rounded-md transition-all cursor-pointer text-center ${
                  activeTab === 'official'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Municipal Official
              </button>
            </div>

            {/* Tab 1: Anonymous Citizen (The Core Use-Case) */}
            {activeTab === 'anonymous' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900">
                  <div className="flex items-center gap-2 font-semibold text-xs text-emerald-950">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>No Credentials Required for Citizen Safety</span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Under city whistleblower statutes, your safety is paramount. You do not need an email, phone number, or password. Enter directly with zero traceable footprint.
                  </p>
                </div>

                {/* Primary CTA */}
                <button
                  type="button"
                  onClick={handleContinueAnonymous}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Enter Anonymously as Citizen</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>

                {/* Returning with token divider */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                    Or Resume with Tracking Receipt
                  </span>
                </div>

                <form onSubmit={handleTokenEntry} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Private Tracking Token
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ANON-8842-1A"
                      value={trackingTokenInput}
                      onChange={(e) => setTrackingTokenInput(e.target.value)}
                      className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900 uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Load Private Token Session
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Municipal Official Login */}
            {activeTab === 'official' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-700" />
                    <span>Municipal Works & Ward Council Authentication</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Access repair crew dispatch tools, upload before/after maintenance verification photos, and update resolution timelines.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleCredentialLogin} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Official Metro Government Email
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. elena.rostova@metro.gov"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Municipal Passkey / Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 pr-9 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Sign In to Municipal Console</span>
                  </button>
                </form>
              </div>
            )}

            {errorMsg && (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Quick Hackathon Demo Logins (Convenient 1-Click access for judges) */}
          <div className="mt-8 pt-5 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Hackathon Evaluator Quick Presets
              </span>
              <span className="text-[10px] text-slate-400 font-mono">1-Click Fast Pass</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={handleContinueAnonymous}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-slate-900 truncate">Anonymous</div>
                <div className="text-[10px] text-slate-500 truncate">Whistleblower</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('ward-04')}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-slate-900 truncate">Elena Rostova</div>
                <div className="text-[10px] text-slate-500 truncate">Ward 4 Councillor</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('ward-12')}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-slate-900 truncate">Sarah Chen</div>
                <div className="text-[10px] text-slate-500 truncate">Ward 12 Councillor</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('inspector')}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-slate-900 truncate">DPW Inspector</div>
                <div className="text-[10px] text-slate-500 truncate">Municipal Crew</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
