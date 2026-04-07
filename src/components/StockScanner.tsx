// Stock Scanner Dashboard Component

import React, { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Filter, Zap, BarChart3 } from 'lucide-react';
import { useTrading } from '../hooks/useTrading';
import { STOCK_COUNTS, SECTORS } from '../lib/constants';
import { StockQuote } from '../lib/types';

type SortBy = 'momentum' | 'volume' | 'rsi_oversold' | 'rsi_overbought' | 'price';
type Sector = 'all' | 'tech' | 'finance' | 'healthcare' | 'energy' | 'consumer' | 'industrial' | 'automotive' | 'crypto';

export function StockScanner() {
  const { quotes } = useTrading();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('momentum');
  const [sector, setSector] = useState<Sector>('all');
  const [showOnlySignals, setShowOnlySignals] = useState(true);

  // Calculate simulated RSI for each stock
  const quotesWithRSI = useMemo(() => {
    return quotes.map(quote => {
      // Simulated RSI based on price change
      const rsi = 50 + (quote.changePercent * 5);
      const clampedRSI = Math.max(0, Math.min(100, rsi));

      // Calculate momentum score (higher = better buy signal)
      const momentum = quote.changePercent * 2 + (Math.random() * 10);

      // Volume score (normalized)
      const volumeScore = Math.min(100, quote.volume / 1000000);

      return {
        ...quote,
        rsi: clampedRSI,
        momentum,
        volumeScore,
        signal: clampedRSI < 30 ? 'buy_oversold' :
                clampedRSI > 70 ? 'sell_overbought' :
                momentum > 15 ? 'buy_momentum' : 'none'
      };
    });
  }, [quotes]);

  // Filter stocks
  const filteredStocks = useMemo(() => {
    let filtered = [...quotesWithRSI];

    // Filter by sector
    if (sector !== 'all' && SECTORS[sector]) {
      const sectorStocks = SECTORS[sector];
      filtered = filtered.filter(q => sectorStocks.includes(q.symbol));
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(q =>
        q.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter signals only
    if (showOnlySignals) {
      filtered = filtered.filter(q => q.signal !== 'none');
    }

    // Sort
    switch (sortBy) {
      case 'momentum':
        filtered.sort((a, b) => b.momentum - a.momentum);
        break;
      case 'volume':
        filtered.sort((a, b) => b.volume - a.volume);
        break;
      case 'rsi_oversold':
        filtered.sort((a, b) => a.rsi - b.rsi);
        break;
      case 'rsi_overbought':
        filtered.sort((a, b) => b.rsi - a.rsi);
        break;
      case 'price':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }, [quotesWithRSI, searchQuery, sortBy, sector, showOnlySignals]);

  // Get signal badge style
  const getSignalBadge = (signal: string) => {
    switch (signal) {
      case 'buy_oversold':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'buy_momentum':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'sell_overbought':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-600/20 text-gray-400 border-slate-600/30';
    }
  };

  // Get signal label
  const getSignalLabel = (signal: string) => {
    switch (signal) {
      case 'buy_oversold':
        return 'BUY';
      case 'buy_momentum':
        return 'MOMENTUM';
      case 'sell_overbought':
        return 'SELL';
      default:
        return 'HOLD';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          Stock Scanner
        </h2>
        <div className="text-sm text-gray-400">
          {filteredStocks.length} / {quotes.length} stocks
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-2">
          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="momentum">Sort: Momentum</option>
            <option value="volume">Sort: Volume</option>
            <option value="rsi_oversold">Sort: RSI (Oversold)</option>
            <option value="rsi_overbought">Sort: RSI (Overbought)</option>
            <option value="price">Sort: Price</option>
          </select>

          {/* Sector Filter */}
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value as Sector)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Sectors</option>
            <option value="tech">Tech</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
            <option value="energy">Energy</option>
            <option value="consumer">Consumer</option>
            <option value="industrial">Industrial</option>
            <option value="automotive">Automotive</option>
            <option value="crypto">Crypto</option>
          </select>

          {/* Signal Filter Toggle */}
          <button
            onClick={() => setShowOnlySignals(!showOnlySignals)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              showOnlySignals
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-slate-700 text-gray-400 border border-slate-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            Signals Only
          </button>
        </div>
      </div>

      {/* Top Signals Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-400">
            {filteredStocks.filter(s => s.signal === 'buy_oversold').length}
          </p>
          <p className="text-xs text-gray-400">Oversold</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">
            {filteredStocks.filter(s => s.signal === 'buy_momentum').length}
          </p>
          <p className="text-xs text-gray-400">Momentum</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-400">
            {filteredStocks.filter(s => s.signal === 'sell_overbought').length}
          </p>
          <p className="text-xs text-gray-400">Overbought</p>
        </div>
      </div>

      {/* Stock List */}
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-800 text-gray-400 border-b border-slate-700">
            <tr>
              <th className="text-left py-2 px-2">Symbol</th>
              <th className="text-right py-2 px-2">Price</th>
              <th className="text-right py-2 px-2">Change</th>
              <th className="text-right py-2 px-2">RSI</th>
              <th className="text-right py-2 px-2">Signal</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.slice(0, 50).map((stock) => (
              <tr
                key={stock.symbol}
                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
              >
                <td className="py-2 px-2">
                  <span className="font-medium text-white">{stock.symbol}</span>
                </td>
                <td className="py-2 px-2 text-right text-gray-300">
                  ${stock.price.toFixed(2)}
                </td>
                <td className={`py-2 px-2 text-right ${
                  stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  <div className="flex items-center justify-end gap-1">
                    {stock.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                  </div>
                </td>
                <td className={`py-2 px-2 text-right ${
                  stock.rsi < 30 ? 'text-green-400' :
                  stock.rsi > 70 ? 'text-red-400' : 'text-gray-300'
                }`}>
                  {stock.rsi.toFixed(0)}
                </td>
                <td className="py-2 px-2 text-right">
                  <span className={`text-xs px-2 py-0.5 rounded border ${getSignalBadge(stock.signal)}`}>
                    {getSignalLabel(stock.signal)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStocks.length > 50 && (
          <p className="text-center text-xs text-gray-500 py-2">
            Showing top 50 of {filteredStocks.length} stocks
          </p>
        )}
      </div>
    </div>
  );
}
