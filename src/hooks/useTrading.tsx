// Trading Context and Hooks

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { PaperTradingEngine, createPaperTradingEngine } from '../lib/tradingEngine';
import { TradingBot, createTradingBot } from '../lib/strategyEngine';
import {
  TradingConfig,
  Portfolio,
  StockQuote,
  Trade,
  StrategyParams,
  TradingStyle
} from '../lib/types';
import {
  DEFAULT_CONFIG,
  DEFAULT_STRATEGY_PARAMS,
  DAY_TRADING_CONFIG,
  SWING_TRADING_CONFIG,
  LONGTERM_TRADING_CONFIG,
} from '../lib/constants';

interface TradingContextType {
  // State
  config: TradingConfig;
  portfolio: Portfolio | null;
  quotes: StockQuote[];
  tradeHistory: Trade[];
  isBotRunning: boolean;
  isConnected: boolean;
  tradingStyle: TradingStyle;

  // Actions
  updateConfig: (config: Partial<TradingConfig>) => void;
  updateStrategy: (params: Partial<StrategyParams>) => void;
  setTradingStyle: (style: TradingStyle) => void;
  startBot: () => void;
  stopBot: () => void;
  executeTrade: (symbol: string, quantity: number, side: 'buy' | 'sell') => Promise<Trade>;
  refreshData: () => void;
  resetPortfolio: () => void;
}

const TradingContext = createContext<TradingContextType | null>(null);

export function TradingProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<TradingConfig>(DEFAULT_CONFIG);
  const [engine] = useState<PaperTradingEngine>(() =>
    createPaperTradingEngine(config.initialCapital)
  );
  const [bot, setBot] = useState<TradingBot | null>(null);
  const [tradingStyle, setTradingStyle] = useState<TradingStyle>('day');

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [isConnected] = useState(true);

  // Get scan interval based on trading style
  const getScanInterval = useCallback((style: TradingStyle): number => {
    switch (style) {
      case 'day':
        return DAY_TRADING_CONFIG.scanIntervalMs;
      case 'swing':
        return SWING_TRADING_CONFIG.scanIntervalMs;
      case 'longterm':
        return LONGTERM_TRADING_CONFIG.scanIntervalMs;
      case 'hybrid':
        return 300000; // 5 minutes for hybrid
      default:
        return 5000;
    }
  }, []);

  // Initialize engine with market data
  const refreshData = useCallback(() => {
    engine.updateMarketData();
    setQuotes(engine.getAllQuotes());
    setPortfolio(engine.getPortfolio());
    setTradeHistory(engine.getTradeHistory());
  }, [engine]);

  // Initial data load and interval update
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, getScanInterval(tradingStyle));
    return () => clearInterval(interval);
  }, [refreshData, tradingStyle, getScanInterval]);

  // Create bot when strategy changes
  useEffect(() => {
    if (bot) {
      bot.updateParams(config.strategy);
    }
  }, [config.strategy, bot]);

  // Update config
  const updateConfig = useCallback((newConfig: Partial<TradingConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // Update strategy params
  const updateStrategy = useCallback((params: Partial<StrategyParams>) => {
    setConfig(prev => ({
      ...prev,
      strategy: { ...prev.strategy, ...params },
    }));
  }, []);

  // Handle trading style change
  const handleSetTradingStyle = useCallback((style: TradingStyle) => {
    setTradingStyle(style);

    // Update strategy based on new style
    let newParams: Partial<StrategyParams>;
    switch (style) {
      case 'day':
        newParams = {
          profitTarget: DAY_TRADING_CONFIG.profitTarget,
          stopLoss: DAY_TRADING_CONFIG.stopLoss,
          maxPositionSize: DAY_TRADING_CONFIG.maxPositionSize,
          maxTradesPerDay: DAY_TRADING_CONFIG.maxTradesPerDay,
        };
        break;
      case 'swing':
        newParams = {
          profitTarget: SWING_TRADING_CONFIG.profitTarget,
          stopLoss: SWING_TRADING_CONFIG.stopLoss,
          maxPositionSize: SWING_TRADING_CONFIG.maxPositionSize,
          trailingStopPercent: SWING_TRADING_CONFIG.trailingStop,
          holdDaysMin: SWING_TRADING_CONFIG.holdDaysMin,
          holdDaysMax: SWING_TRADING_CONFIG.holdDaysMax,
          maxTradesPerDay: SWING_TRADING_CONFIG.maxTradesPerWeek * 0.5, // approximate
        };
        break;
      case 'longterm':
        newParams = {
          profitTarget: LONGTERM_TRADING_CONFIG.profitTarget,
          stopLoss: LONGTERM_TRADING_CONFIG.stopLoss,
          maxPositionSize: LONGTERM_TRADING_CONFIG.maxPositionSize,
          trailingStopPercent: LONGTERM_TRADING_CONFIG.trailingStop,
          holdDaysMin: 30,
          holdDaysMax: 365,
          maxTradesPerDay: 0.033, // ~1 per month
        };
        break;
      default:
        newParams = {};
    }

    setConfig(prev => ({
      ...prev,
      strategy: { ...prev.strategy, ...newParams },
    }));

    // Stop bot when changing styles
    if (isBotRunning) {
      if (bot) {
        bot.stop();
      }
      setIsBotRunning(false);
    }
  }, [bot, isBotRunning]);

  // Start bot
  const startBot = useCallback(() => {
    if (!bot) {
      const newBot = createTradingBot(engine, config.strategy);
      setBot(newBot);
      newBot.start(getScanInterval(tradingStyle));
    } else {
      bot.start(getScanInterval(tradingStyle));
    }
    setIsBotRunning(true);
  }, [bot, engine, config.strategy, tradingStyle, getScanInterval]);

  // Stop bot
  const stopBot = useCallback(() => {
    if (bot) {
      bot.stop();
    }
    setIsBotRunning(false);
  }, [bot]);

  // Execute manual trade
  const executeTrade = useCallback(async (
    symbol: string,
    quantity: number,
    side: 'buy' | 'sell'
  ): Promise<Trade> => {
    let trade: Trade;

    if (side === 'buy') {
      trade = engine.buy(symbol, quantity);
    } else {
      trade = engine.sell(symbol, quantity);
    }

    refreshData();

    return trade;
  }, [engine, refreshData]);

  // Reset portfolio
  const resetPortfolio = useCallback(() => {
    engine.reset(config.initialCapital);
    refreshData();
  }, [engine, config.initialCapital, refreshData]);

  const value: TradingContextType = {
    config,
    portfolio,
    quotes,
    tradeHistory,
    isBotRunning,
    isConnected,
    tradingStyle,
    updateConfig,
    updateStrategy,
    setTradingStyle: handleSetTradingStyle,
    startBot,
    stopBot,
    executeTrade,
    refreshData,
    resetPortfolio,
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within TradingProvider');
  }
  return context;
}
