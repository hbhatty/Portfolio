'use client';

import { useState } from 'react';

export default function InfoIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('releases');

  const releases = [
    {
      version: "v1.1.0",
      date: "Nov 14, 2025",
      highlights: [
        "Added full mobile support across all sections"
      ],
      isCurrent: true
    },
    {
      version: "v1.0.3",
      date: "Oct 29, 2025",
      highlights: [
        "Change img tag to next Image component"
      ],
      isCurrent: false
    },
    {
      version: "v1.0.2",
      date: "Oct 20, 2025",
      highlights: [
        "Changed meta data and updated resume link"
      ],
      isCurrent: false
    },
    {
      version: "v1.0.1",
      date: "Oct 07, 2025",
      highlights: [
        "Added release notes modal"
      ],
      isCurrent: false
    }
  ];

  const upcomingFeatures = [
    "Update visuals (fonts, colours, etc.)",
    "Add a dynamic version tracker",
    "Add newer projects"
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-gray-800 hover:bg-gray-700 active:bg-gray-700 text-gray-300 hover:text-white active:text-white w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl hover:shadow-2xl active:shadow-2xl transition-all duration-300 z-40 flex items-center justify-center group border border-gray-600 hover:border-gray-500 active:border-gray-500 min-h-[44px] min-w-[44px]"
        aria-label="View release notes"
      >
        <div className="text-lg md:text-xl group-hover:scale-110 group-active:scale-110 transition-transform duration-200">
          📋
        </div>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-[#1e1b4b] rounded-lg shadow-2xl max-w-lg w-full max-h-[85vh] md:max-h-[80vh] overflow-hidden m-4 md:m-0"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-600">
              <h2 className="text-xl md:text-2xl font-bold text-white">Release Notes</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white active:text-white transition-colors duration-200 text-xl md:text-2xl p-2 -m-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex border-b border-gray-600">
              <button
                onClick={() => setActiveTab('releases')}
                className={`flex-1 px-4 md:px-6 py-3 text-xs md:text-sm font-medium transition-colors duration-200 min-h-[44px] ${
                  activeTab === 'releases'
                    ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-900/20'
                    : 'text-gray-400 hover:text-white active:text-white hover:bg-gray-800/20 active:bg-gray-800/20'
                }`}
              >
                📋 Releases
              </button>
              <button
                onClick={() => setActiveTab('todos')}
                className={`flex-1 px-4 md:px-6 py-3 text-xs md:text-sm font-medium transition-colors duration-200 min-h-[44px] ${
                  activeTab === 'todos'
                    ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-900/20'
                    : 'text-gray-400 hover:text-white active:text-white hover:bg-gray-800/20 active:bg-gray-800/20'
                }`}
              >
                🎯 To-dos
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh]">
              {activeTab === 'releases' && (
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center">
                    📋 Release History
                  </h3>
                  <div className="space-y-4">
                    {releases.map((release, index) => (
                      <div 
                        key={index}
                        className={`rounded-xl p-4 md:p-5 border ${
                          release.isCurrent 
                            ? 'bg-gradient-to-r from-purple-800/40 to-purple-900/40 border-purple-700/30' 
                            : 'bg-gradient-to-r from-gray-800/40 to-gray-900/40 border-gray-600/30'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                          <div className="flex items-center gap-2 md:gap-3">
                            <span className={`font-bold text-base md:text-lg ${
                              release.isCurrent ? 'text-purple-300' : 'text-gray-300'
                            }`}>
                              {release.version}
                            </span>
                            {release.isCurrent && (
                              <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <span className="text-xs md:text-sm text-gray-400 bg-gray-700 px-2 md:px-3 py-1 rounded-full self-start sm:self-auto">
                            {release.date}
                          </span>
                        </div>
                        <ul className="space-y-2 md:space-y-3">
                          {release.highlights.map((highlight, highlightIndex) => (
                            <li key={highlightIndex} className="text-gray-100 text-xs md:text-sm flex items-center">
                              <span className="text-green-400 mr-2 md:mr-3 text-base md:text-lg">✓</span>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'todos' && (
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center">
                    🎯 To-dos
                  </h3>
                  <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 rounded-xl p-4 md:p-5 border border-gray-600/30">
                    <ul className="space-y-2 md:space-y-3">
                      {upcomingFeatures.map((feature, index) => (
                        <li key={index} className="text-gray-200 text-xs md:text-sm flex items-center">
                          <span className="text-yellow-400 mr-2 md:mr-3 text-base md:text-lg">○</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
