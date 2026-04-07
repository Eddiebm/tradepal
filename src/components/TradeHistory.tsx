// Trade History Component

import React from 'react';
import { Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useTrading } from '../hooks/useTrading';

export function TradeHistory() {
  const { tradeHistory } = useTrading();

  // Group trades by date
  const tradesByDate = tradeHistory.reduce((acc, trade) => {
    const date = new Date(trade.timestamp).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(trade);
    return acc;
  }, {} as Record<string, typeof tradeHistory>);

  const sortedDates = Object.keys(tradesByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Trade History
        </h2>
        <span className="text-sm text-gray-400">
          {tradeHistory.length} trades
        </span>
      </div>

      {/* Trades List */}
      {tradeHistory.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 italic">No trades yet</p>
          <p className="text-xs text-gray-600 mt-2">Start the bot to begin trading</p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto space-y-4">
          {sortedDates.map((date) => (
            <div key={date}>
              <p className="text-xs text-gray-500 mb-2">{date}</p>
              <div className="space-y-2">
                {tradesByDate[date].map((trade) => (
                  <div
                    key={trade.id}
                    className={`flex items-center justify-between bg-slate-700/30 rounded-lg p-3 ${
                      trade.status === 'pending' ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        trade.side === 'buy'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {trade.side === 'buy' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">
                            {trade.side === 'buy' ? 'Bought' : 'Sold'}
                          </span>
                          <span className="text-gray-400">{trade.symbol}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {trade.quantity} shares @ ${trade.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        trade.side === 'buy' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {trade.side === 'buy' ? '-' : '+'}${trade.total.toFixed(2)}
                      </p>
                      <p className={`text-xs ${
                        trade.status === 'filled' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {trade.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
