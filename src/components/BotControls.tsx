// Trading Controls Component

import React, { useState } from 'react';
import { Play, Square, RotateCcw, Settings, AlertTriangle, Shield } from 'lucide-react';
import { useTrading } from '../hooks/useTrading';

export function BotControls() {
  const { isBotRunning, startBot, stopBot, resetPortfolio, portfolio } = useTrading();
  const [showSettings, setShowSettings] = useState(false);

  const handleToggle = () => {
    if (isBotRunning) {
      stopBot();
    } else {
      startBot();
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          TradePal Controls
        </h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isBotRunning
            ? 'bg-green-500/20 text-green-400'
            : 'bg-gray-500/20 text-gray-400'
        }`}>
          {isBotRunning ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </div>

      {/* Safety Warning */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-400">Paper Trading Mode</p>
            <p className="text-xs text-gray-400 mt-1">
              This is simulating trades with fake money. No real stocks are being bought or sold.
              Use this to test your strategy before going live.
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">Portfolio Value</p>
            <p className="text-xl font-bold text-white">${portfolio?.totalValue.toFixed(2) || '0.00'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Cash Available</p>
            <p className="text-xl font-bold text-green-400">${portfolio?.cash.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleToggle}
          className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
            isBotRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isBotRunning ? (
            <>
              <Square className="w-5 h-5" />
              Stop TradePal
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start TradePal
            </>
          )}
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full py-3 px-4 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center gap-2 transition-all"
        >
          <Settings className="w-5 h-5" />
          Strategy Settings
        </button>

        <button
          onClick={resetPortfolio}
          className="w-full py-3 px-4 rounded-lg font-medium bg-slate-700/50 hover:bg-slate-700 text-gray-300 flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Reset Portfolio ($1000)
        </button>
      </div>

      {/* Bot Status */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Trading Mode</span>
          <span className="text-blue-400 font-medium">Paper (Simulated)</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-400">Strategy</span>
          <span className="text-white font-medium">Aggressive Momentum</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-400">Max Daily Trades</span>
          <span className="text-white font-medium">3</span>
        </div>
      </div>
    </div>
  );
}
