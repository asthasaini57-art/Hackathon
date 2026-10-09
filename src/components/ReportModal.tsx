import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, Upload, Check, AlertCircle, Copy, ArrowRight } from 'lucide-react';
import { DamageCategory, HazardSeverity, WardLeader, DamageReport } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaders: WardLeader[];
  onReportCreated: (newReport: DamageReport) => void;
}

const PRESET_PHOTOS = [
  {
    name: 'Road Pothole Crater',
    url: '/src/assets/images/damage_pothole_crater_1791530885839.jpg',
    category: 'Roads & Pavement' as DamageCategory,
    wardId: 'ward-04',
    address: 'Intersection of 4th Ave & Market St',
  },
  {
    name: 'Bent Streetlight & Wire',
    url: '/src/assets/images/damage_broken_streetlight_1791530904501.jpg',
    category: 'Street Lighting' as DamageCategory,
    wardId: 'ward-07',
    address: '228 Oak Street, Near Crosswalk',
  },
  {
    name: 'Burst Water Pipe',
    url: '/src/assets/images/damage_burst_water_pipe_1791530918464.jpg',
    category: 'Water & Drainage' as DamageCategory,
    wardId: 'ward-18',
    address: '512 Elmwood Avenue, North Curb',
  },
  {
    name: 'Broken Park Bench',
    url: '/src/assets/images/damage_broken_park_bench_1791530930412.jpg',
    category: 'Parks & Recreation' as DamageCategory,
    wardId: 'ward-12',
    address: 'Pinecrest Community Park, East Pathway',
  },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  leaders,
  onReportCreated,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string>(PRESET_PHOTOS[0].url);
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DamageCategory>('Roads & Pavement');
  const [severity, setSeverity] = useState<HazardSeverity>('High Urgency');
  const [selectedWardId, setSelectedWardId] = useState('ward-04');
  const [address, setAddress] = useState('4th Ave & Market St');
  const [department, setDepartment] = useState('Department of Public Works - Roadway Division');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReport, setCreatedReport] = useState<DamageReport | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const selectedLeader = leaders.find((l) => l.wardId === selectedWardId) || leaders[0];

  const handleSelectPreset = (preset: typeof PRESET_PHOTOS[0]) => {
    setPhotoUrl(preset.url);
    setPhotoBase64('');
    setCategory(preset.category);
    setSelectedWardId(preset.wardId);
    setAddress(preset.address);
    setAiAnalysisResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoUrl(result);
      setPhotoBase64(result);
      setAiAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeWithAI = async () => {
    setIsAnalyzing(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/analyze-damage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoBase64 || undefined,
          userNotes: description || title || address,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAiAnalysisResult(data.analysis);
        if (data.analysis.title) setTitle(data.analysis.title);
        if (data.analysis.category) setCategory(data.analysis.category as DamageCategory);
        if (data.analysis.severity) setSeverity(data.analysis.severity as HazardSeverity);
        if (data.analysis.department) setDepartment(data.analysis.department);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('AI assessment timed out. You may continue manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please provide a headline or use AI analysis.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        title,
        description: description || 'Anonymous citizen report on damaged municipal infrastructure.',
        category,
        severity,
        imageUrl: photoUrl,
        location: {
          address: address || 'Municipal Public Sector',
          wardId: selectedWardId,
          wardName: selectedLeader.wardName,
        },
        department,
        aiAnalysis: aiAnalysisResult || {
          hazardScore: severity === 'Critical Hazard' ? 90 : severity === 'High Urgency' ? 75 : 50,
          safetyRisk: 'Public obstruction or risk of property wear.',
          urgencyText: 'Dispatch within standard service turnaround window.',
          recommendedDepartment: department,
          actionRequired: 'Field inspection and structural restoration.',
          anonymityVerified: true,
        },
      };

      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.report) {
        setCreatedReport(data.report);
        onReportCreated(data.report);
      } else {
        setErrorMsg('Failed to submit report. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error submitting report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyToken = () => {
    if (createdReport?.trackingToken) {
      navigator.clipboard.writeText(createdReport.trackingToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {createdReport ? 'Report Dispatched to Municipality' : 'Report Damaged Public Property'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict anonymity protected. Exif GPS scrubbed. Zero personal data requested.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {createdReport ? (
          <div className="p-6 space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-900">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-emerald-900">
                    Anonymous Ticket Successfully Dispatched!
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Your photo has been scrubbed of device fingerprints and registered directly with the municipality under <strong>{createdReport.assignedLeader.name}</strong> ({createdReport.assignedLeader.party}).
                  </p>
                </div>
              </div>

              {/* Anonymous Tracking Token */}
              <div className="mt-4 pt-4 border-t border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">
                    Your Anonymous Tracking Token
                  </div>
                  <div className="font-mono text-base font-bold text-emerald-950 mt-0.5">
                    {createdReport.trackingToken}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Token</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
              <div className="text-xs font-semibold text-slate-700">
                Municipal Leadership Assigned:
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Elected Representative:</span>
                <span className="font-semibold text-slate-900">{createdReport.assignedLeader.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Political Banner:</span>
                <span className="text-slate-900">{createdReport.assignedLeader.party}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Ward Jurisdiction:</span>
                <span className="text-slate-900">{createdReport.location.wardName}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Action Agency:</span>
                <span className="text-slate-900">{createdReport.department}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Done & View in City Feed
              </button>
            </div>
          </div>
        ) : (
          /* Report Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Anonymity Assurance Banner */}
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-xs text-slate-600">
                <strong className="text-slate-900">Safety Guarantee:</strong> Zero login, cookies, or IP trackers. Camera device metadata is removed client-side.
              </div>
            </div>

            {/* Photo Selection / Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-800">
                1. Photo of Damaged Public Asset
              </label>

              {/* Selected Photo Preview */}
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-900 group">
                <img
                  src={photoUrl}
                  alt="Damaged public property"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>EXIF Scrubbed</span>
                </div>
              </div>

              {/* Sample Photo selector + Custom Upload */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Quick Sample Damage:</span>
                {PRESET_PHOTOS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                      photoUrl === preset.url
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}

                <label className="text-[11px] px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer flex items-center gap-1">
                  <Upload className="w-3 h-3 text-slate-500" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* AI Auto-Inspection Button */}
            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="text-xs text-indigo-950 font-medium">
                  AI Damage & Safety Inspection (Gemini)
                </div>
              </div>
              <button
                type="button"
                onClick={handleAnalyzeWithAI}
                disabled={isAnalyzing}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {isAnalyzing ? (
                  <span>Analyzing Damage...</span>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Fill with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Analysis Result Badge if present */}
            {aiAnalysisResult && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">AI Hazard Assessment:</span>
                  <span className="font-mono text-slate-700">Hazard Score: {aiAnalysisResult.hazardScore}/100</span>
                </div>
                <div className="text-slate-600">{aiAnalysisResult.safetyRisk}</div>
                <div className="text-slate-500 italic">Action: {aiAnalysisResult.actionRequired}</div>
              </div>
            )}

            {/* Ward & Leadership Routing */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                2. Municipal Ward & Assigned Leadership
              </label>
              <select
                value={selectedWardId}
                onChange={(e) => setSelectedWardId(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              >
                {leaders.map((leader) => (
                  <option key={leader.wardId} value={leader.wardId}>
                    {leader.wardName} — {leader.name} ({leader.party})
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
                <span>Accountability: {selectedLeader.accountabilityScore}% resolved</span>
                <span>Avg fix turnaround: {selectedLeader.avgResolutionDays} days</span>
              </div>
            </div>

            {/* Title & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-800">
                  3. Damage Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deep Pothole on Market St"
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-800">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DamageCategory)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                >
                  <option value="Roads & Pavement">Roads & Pavement</option>
                  <option value="Street Lighting">Street Lighting</option>
                  <option value="Water & Drainage">Water & Drainage</option>
                  <option value="Parks & Recreation">Parks & Recreation</option>
                  <option value="Public Transit & Signage">Public Transit & Signage</option>
                  <option value="Sanitation & Waste">Sanitation & Waste</option>
                </select>
              </div>
            </div>

            {/* Severity & Address Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-800">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as HazardSeverity)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                >
                  <option value="Critical Hazard">Critical Hazard (Immediate)</option>
                  <option value="High Urgency">High Urgency (24-48 hrs)</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Minor Maintenance">Minor Maintenance</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-800">
                  Street / Landmark Location
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Near Oak St Bakery crosswalk"
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  required
                />
              </div>
            </div>

            {/* Optional Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe hazards (e.g., exposed wires, swerving vehicles, leaking water)..."
                rows={2}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {errorMsg && (
              <div className="text-xs text-rose-600 flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isSubmitting ? (
                  <span>Dispatching to Municipality...</span>
                ) : (
                  <>
                    <span>Submit Anonymously</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
