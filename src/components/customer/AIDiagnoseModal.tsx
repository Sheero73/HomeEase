import React, { useState } from 'react';
import { Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { SAMPLE_AI_ISSUES } from '../../data/mockData';
import { AIDiagnosisResult, ServiceCategory } from '../../types';
import { diagnoseHouseholdIssue } from '../../services/geminiService';

interface AIDiagnoseModalProps {
  categories: ServiceCategory[];
  onBookCategory: (category: ServiceCategory, issueNote?: string) => void;
}

export const AIDiagnoseModal: React.FC<AIDiagnoseModalProps> = ({
  categories,
  onBookCategory,
}) => {
  const [selectedSample, setSelectedSample] = useState(SAMPLE_AI_ISSUES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<AIDiagnosisResult | null>(null);

  const handleRun = async () => {
    setIsAnalyzing(true);
    const res = await diagnoseHouseholdIssue(selectedSample.title, selectedSample.description);
    setDiagnosis(res);
    setIsAnalyzing(false);
  };

  const matchedCat = categories.find((c) => c.id === diagnosis?.categoryId) || categories[0];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 shadow-md">
        <h1 className="text-2xl font-extrabold">HomeEase Vision AI Diagnostics</h1>
        <p className="text-xs text-blue-200 mt-1">Select an issue photo to analyze root cause, estimated cost, and required parts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sample Issue Photo</h3>
          <img src={selectedSample.imageUrl} alt={selectedSample.title} className="w-full h-48 object-cover rounded-xl" />
          <div className="grid grid-cols-2 gap-2">
            {SAMPLE_AI_ISSUES.map((s) => (
              <button
                key={s.title}
                onClick={() => { setSelectedSample(s); setDiagnosis(null); }}
                className={`p-2 rounded-xl text-left border text-xs ${selectedSample.title === s.title ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 font-semibold' : 'border-slate-200 dark:border-slate-700'}`}
              >
                {s.title}
              </button>
            ))}
          </div>
          <button
            onClick={handleRun}
            disabled={isAnalyzing}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
          >
            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Run Gemini Vision Diagnostics</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Diagnostic Report</h3>
          {diagnosis ? (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-red-500 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
                  {diagnosis.severity}
                </span>
                <h4 className="font-bold text-base mt-1 text-slate-900 dark:text-white">{diagnosis.problemTitle}</h4>
                <p className="text-slate-500 mt-1">{diagnosis.rootCause}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[11px]">Est. Cost:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{diagnosis.estimatedCostRange}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Time:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{diagnosis.estimatedTime}</span>
                </div>
              </div>

              <button
                onClick={() => onBookCategory(matchedCat, diagnosis.problemTitle)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5"
              >
                <span>Book {diagnosis.recommendedCategory} Specialist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-slate-400 text-xs py-12 text-center">
              Click 'Run Gemini Vision Diagnostics' to view technical assessment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
