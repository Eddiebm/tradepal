// Trading Mode Selector Component

import React from 'react';
import { Zap, Waves, TrendingUp, GitMerge } from 'lucide-react';
import { TradingStyle } from '../lib/types';
import { TRADING_STYLE_INFO } from '../lib/constants';

interface TradingModeSelectorProps {
  currentMode: TradingStyle;
  onModeChange: (mode: TradingStyle) => void;
}

export function TradingModeSelector({ currentMode, onModeChange }: TradingModeSelectorProps) {
  const modes: { key: TradingStyle; icon: React.ReactNode }[] = [
    { key: 'day', icon: <Zap className="w-5 h-5" /> },
    { key: 'swing', icon: <Waves className="w-5 h-5" /> },
    { key: 'longterm', icon: <TrendingUp className="w-5 h-5" /> },
    { key: 'hybrid', icon: <GitMerge className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-lg font-semibold text-white mb-4">Trading Mode</h2>

      {/* Mode Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {modes.map(({ key, icon }) => {
          const info = TRADING_STYLE_INFO[key];
          const isActive = currentMode === key;

          return (
            <button
              key={key}
              onClick={() => onModeChange(key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={isActive ? 'text-blue-400' : 'text-gray-400'}>
                  {icon}
                </span>
                <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                  {info.name}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{info.description}</p>
              <div className="flex flex-wrap gap-1">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  info.risk === 'High' ? 'bg-red-500/20 text-red-400' :
                  info.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {info.risk}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-600 text-gray-300">
                  {info.expectedReturn}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Mode Details */}
      <div className="bg-slate-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Current Mode</span>
          <span className="text-white font-medium">{TRADING_STYLE_INFO[currentMode].name}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Risk Level</span>
          <span className={`font-medium ${
            TRADING_STYLE_INFO[currentMode].risk === 'High' ? 'text-red-400' :
            TRADING_STYLE_INFO[currentMode].risk === 'Medium' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            {TRADING_STYLE_INFO[currentMode].risk}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Stress Level</span>
          <span className={`font-medium ${
            TRADING_STYLE_INFO[currentMode].stress === 'High' ? 'text-red-400' :
            TRADING_STYLE_INFO[currentMode].stress === 'Medium' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            {TRADING_STYLE_INFO[currentMode].stress}
          </span>
        </div>
      </div>
    </div>
  );
}
