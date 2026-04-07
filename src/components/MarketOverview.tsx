// Market Overview Component

import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useTrading } from '../hooks/useTrading';

export function MarketOverview() {
  const { quotes, isConnected } = useTrading();

  // Sort by change percent
  const sortedQuotes = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
  const topGainers = sortedQuotes.slice(0, 5);
  const topLosers = sortedQuotes.slice(-5).reverse();

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Market Overview
        </h2>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
          <span className="text-xs text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div>
          <h3 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Top Gainers
          </h3>
          <div className="space-y-2">
            {topGainers.map((quote) => (
              <div key={quote.symbol} className="flex justify-between items-center bg-slate-700/30 rounded-lg p-2 px-3">
                <div>
                  <span className="font-medium text-white">{quote.symbol}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-white">${quote.price.toFixed(2)}</span>
                  <span className="text-xs text-green-400 ml-2">+{quote.changePercent.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div>
          <h3 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            Top Losers
          </h3>
          <div className="space-y-2">
            {topLosers.map((quote) => (
              <div key={quote.symbol} className="flex justify-between items-center bg-slate-700/30 rounded-lg p-2 px-3">
                <div>
                  <span className="font-medium text-white">{quote.symbol}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-white">${quote.price.toFixed(2)}</span>
                  <span className="text-xs text-red-400 ml-2">{quote.changePercent.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Stocks Mini Table */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-400 mb-3">All Stocks</h3>
        <div className="max-h-48 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-slate-700">
              <tr>
                <th className="text-left py-2">Symbol</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {sortedQuotes.map((quote) => (
                <tr key={quote.symbol} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-2 text-white font-medium">{quote.symbol}</td>
                  <td className="py-2 text-right text-gray-300">${quote.price.toFixed(2)}</td>
                  <td className={`py-2 text-right ${quote.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {quote.change >= 0 ? '+' : ''}{quote.changePercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
