import { useState, useEffect } from 'react';

const DQA_COLUMNS = [
  'SerialNumber',
  'TechnicianEmail',
  'DurationHours',
  'Charging',
  'NetworkAdapters',
  'Camera',
  'FinalStatus'
];

const SAMPLE_RESULTS = [
  {
    TechnicianEmail: 'Sandeep.Pokharel@trojans.dsu.edu',
    SerialNumber: 'PF2K8XYZ',
    DurationHours: '0.0412',
    Charging: 'Operational',
    NetworkAdapters: 'Operational',
    Camera: 'Operational',
    FinalStatus: 'PASSED'
  },
  {
    TechnicianEmail: 'Tyler.Steele@trojans.dsu.edu',
    SerialNumber: '5CG01234AB',
    DurationHours: '0.0825',
    Charging: 'Defective',
    NetworkAdapters: 'Operational',
    Camera: 'Operational',
    FinalStatus: 'FAILED'
  }
];

const LOADING_STEPS = [
  'Detecting Serial Number via Win32_BIOS...',
  'Checking Charging Status via Win32_Battery...',
  'Analyzing Network Adapters...',
  'Compiling Inspection Report...'
];

export default function DQASimulator() {
  const [isInspecting, setIsInspecting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const runInspection = () => {
    setIsInspecting(true);
    setShowResults(false);
    setStepIndex(0);
  };

  useEffect(() => {
    if (isInspecting) {
      if (stepIndex < LOADING_STEPS.length) {
        const timer = setTimeout(() => {
          setStepIndex(prev => prev + 1);
        }, 800); // 800ms per step
        return () => clearTimeout(timer);
      } else {
        setIsInspecting(false);
        setShowResults(true);
      }
    }
  }, [isInspecting, stepIndex]);

  return (
    <div className="mt-8 border border-white/10 rounded-xl bg-[#081525]/80 overflow-hidden shadow-2xl font-inter relative z-10">
      {/* Header Area */}
      <div className="p-5 border-b border-white/5 flex flex-wrap justify-between items-center gap-4 bg-white/[0.02]">
        <div>
          <h4 className="text-white font-bold text-lg flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-dsuGold animate-pulse"></span>
            Automated DQA Terminal
          </h4>
          <p className="text-sm text-white/50 mt-1 font-medium">Interactive Auto-Detection Simulation</p>
        </div>
        <button 
          onClick={runInspection}
          disabled={isInspecting}
          className="bg-dsuGold text-[#002D62] font-bold text-sm px-5 py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,199,44,0.3)] hover:shadow-[0_0_20px_rgba(255,199,44,0.5)]"
        >
          {isInspecting ? 'Inspecting...' : 'Run Inspection'}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 min-h-[220px] flex flex-col justify-center">
        {!isInspecting && !showResults && (
          <div className="text-center text-white/40 text-sm py-8 font-medium">
            Ready to initiate automated hardware inspection. <br/> Click the button above to start.
          </div>
        )}

        {isInspecting && (
          <div className="space-y-4 font-mono text-sm max-w-lg mx-auto w-full py-4">
            {LOADING_STEPS.slice(0, stepIndex + 1).map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                {i === stepIndex ? (
                  <span className="text-dsuGold animate-spin inline-block">⟳</span>
                ) : (
                  <span className="text-green-400">✓</span>
                )}
                <span className={i === stepIndex ? "text-white font-medium" : "text-white/50"}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        )}

        {showResults && (
          <div className="animate-fade-in" style={{ animation: 'fadeIn 0.6s ease-out forwards' }}>
            <div className="overflow-x-auto rounded-lg border border-white/5 bg-[#050e1f]/50">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white/5">
                  <tr className="text-white/60">
                    {DQA_COLUMNS.map(col => (
                      <th key={col} className="px-5 py-3.5 font-semibold tracking-wide">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {SAMPLE_RESULTS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors text-white/80">
                      {DQA_COLUMNS.map(col => (
                        <td key={col} className="px-5 py-3">
                          {col === 'FinalStatus' ? (
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                              row[col] === 'PASSED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {row[col]}
                            </span>
                          ) : col === 'Charging' || col === 'NetworkAdapters' || col === 'Camera' ? (
                             <span className={`font-medium ${row[col] === 'Operational' ? 'text-green-400/90' : 'text-red-400/90'}`}>
                               {row[col]}
                             </span>
                          ) : (
                            row[col]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-between items-center text-xs text-white/40 px-2 gap-4">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                'ID', 'start date', and 'Status' explicitly excluded to match CSV export logic.
              </span>
              <span className="font-mono bg-white/5 px-2 py-1 rounded">2 records processed</span>
            </div>
          </div>
        )}
      </div>

      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
