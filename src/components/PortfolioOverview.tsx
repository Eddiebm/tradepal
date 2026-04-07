// Portfolio Overview Component

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Wallet } from 'lucide-react';
import { useTrading } from '../hooks/useTrading';

export function PortfolioOverview() {
  const { portfolio, isBotRunning } = useTrading();

  if (!portfolio) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-slate-700 rounded"></div>
      </div>
    );
  }

  const isPositive = portfolio.dayChange >= 0;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-400" />
          Portfolio
        </h2>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isBotRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></span>
          <span className="text-sm text-gray-400">
            {isBotRunning ? 'Bot Running' : 'Bot Stopped'}
          </span>
        </div>
      </div>

      {/* Total Value */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">Total Value</p>
        <p className="text-4xl font-bold text-white">
          ${portfolio.totalValue.toFixed(2)}
        </p>
        <div className={`flex items-center gap-2 mt-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {isPositive ? '+' : ''}{portfolio.dayChange.toFixed(2)} ({portfolio.dayChangePercent.toFixed(2)}%)
          </span>
          <span className="text-xs text-gray-500">today</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">Cash</span>
          </div>
          <p className="text-lg font-semibold text-white">${portfolio.cash.toFixed(2)}</p>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">Invested</span>
          </div>
          <p className="text-lg font-semibold text-white">${portfolio.equity.toFixed(2)}</p>
        </div>
      </div>

      {/* Positions Summary */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Positions ({portfolio.positions.length})</h3>
        {portfolio.positions.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No open positions</p>
        ) : (
          <div className="space-y-2">
            {portfolio.positions.slice(0, 3).map((pos) => (
              <div key={pos.symbol} className="flex justify-between items-center bg-slate-700/30 rounded-lg p-3">
                <div>
                  <span className="font-medium text-white">{pos.symbol}</span>
                  <span className="text-xs text-gray-400 ml-2">{pos.quantity} shares</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">${pos.marketValue.toFixed(2)}</p>
                  <p className={`text-xs ${pos.unrealizedPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {pos.unrealizedPL >= 0 ? '+' : ''}{pos.unrealizedPLPercent.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
            {portfolio.positions.length > 3 && (
              <p className="text-xs text-gray-500 text-center">+{portfolio.positions.length - 3} more</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
