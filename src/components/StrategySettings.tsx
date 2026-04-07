// Strategy Settings Component

import React, { useState } from 'react';
import { Sliders, Zap, Shield, TrendingUp } from 'lucide-react';
import { useTrading } from '../hooks/useTrading';
import { StrategyParams } from '../lib/types';

export function StrategySettings() {
  const { config, updateStrategy } = useTrading();
  const [localParams, setLocalParams] = useState<StrategyParams>(config.strategy);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (key: keyof StrategyParams, value: number) => {
    setLocalParams(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    updateStrategy(localParams);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          Strategy Settings
        </h2>
        {isSaved && (
          <span className="text-sm text-green-400 animate-pulse">Saved!</span>
        )}
      </div>

      {/* Strategy Description */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="font-medium text-white">Aggressive Momentum Strategy</span>
        </div>
        <p className="text-xs text-gray-400">
          Buys stocks with strong upward momentum and high volume. Sells when RSI reaches overbought levels or profit targets are hit. Tight stop-losses protect against sudden drops.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="space-y-6">
        {/* Profit Target */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Profit Target
            </label>
            <span className="text-sm font-medium text-green-400">{localParams.profitTarget}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={localParams.profitTarget}
            onChange={(e) => handleChange('profitTarget', Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">Sell when profit reaches this %</p>
        </div>

        {/* Stop Loss */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              Stop Loss
            </label>
            <span className="text-sm font-medium text-red-400">{localParams.stopLoss}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={localParams.stopLoss}
            onChange={(e) => handleChange('stopLoss', Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <p className="text-xs text-gray-500 mt-1">Sell to prevent losses beyond this %</p>
        </div>

        {/* Max Position Size */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-300">Max Position Size</label>
            <span className="text-sm font-medium text-blue-400">{localParams.maxPositionSize}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            value={localParams.maxPositionSize}
            onChange={(e) => handleChange('maxPositionSize', Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Maximum % of portfolio per stock</p>
        </div>

        {/* RSI Overbought */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-300">RSI Overbought</label>
            <span className="text-sm font-medium text-yellow-400">{localParams.rsiOverbought}</span>
          </div>
          <input
            type="range"
            min="60"
            max="90"
            value={localParams.rsiOverbought}
            onChange={(e) => handleChange('rsiOverbought', Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <p className="text-xs text-gray-500 mt-1">Sell signal when RSI above this</p>
        </div>

        {/* RSI Oversold */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-300">RSI Oversold</label>
            <span className="text-sm font-medium text-cyan-400">{localParams.rsiOversold}</span>
          </div>
          <input
            type="range"
            min="10"
            max="40"
            value={localParams.rsiOversold}
            onChange={(e) => handleChange('rsiOversold', Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <p className="text-xs text-gray-500 mt-1">Buy signal when RSI below this</p>
        </div>

        {/* Volume Threshold */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-300">Volume Threshold</label>
            <span className="text-sm font-medium text-purple-400">{localParams.volumeThreshold}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={localParams.volumeThreshold}
            onChange={(e) => handleChange('volumeThreshold', Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">Minimum volume increase for buy signal</p>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full mt-6 py-3 px-4 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-all"
      >
        Save Settings
      </button>

      {/* Reset to Defaults */}
      <button
        onClick={() => {
          setLocalParams({
            momentumLookback: 20,
            volumeThreshold: 1.5,
            rsiOverbought: 70,
            rsiOversold: 30,
            profitTarget: 5,
            stopLoss: 2,
            maxPositionSize: 40,
            maxTradesPerDay: 3,
            holdDaysMin: 3,
            holdDaysMax: 14,
            trailingStopPercent: 3,
          });
          setIsSaved(false);
        }}
        className="w-full mt-3 py-2 px-4 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 text-gray-400 transition-all text-sm"
      >
        Reset to Defaults
      </button>
    </div>
  );
}
