// Trading Bot Types

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

export interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  total: number;
  timestamp: Date;
  status: 'pending' | 'filled' | 'cancelled';
}

export interface Portfolio {
  cash: number;
  equity: number;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  positions: Position[];
}

export interface StrategyParams {
  // Momentum settings
  momentumLookback: number; // candles to check for momentum
  volumeThreshold: number; // minimum volume multiplier
  rsiOverbought: number; // RSI threshold for sell
  rsiOversold: number; // RSI threshold for buy
  profitTarget: number; // target % gain per trade
  stopLoss: number; // max % loss per trade
  maxPositionSize: number; // max % of portfolio per position
  maxTradesPerDay: number; // limit trades
  // Swing trading specific
  holdDaysMin: number; // minimum days to hold (swing)
  holdDaysMax: number; // maximum days to hold (swing)
  trailingStopPercent: number; // trailing stop for swing trading
}

// Day trading specific parameters
export interface DayTradingParams extends StrategyParams {
  scanIntervalMs: number; // how often to scan (e.g., 5000 = 5 seconds)
  quickProfitTarget: number; // 5% typical
  quickStopLoss: number; // 2% typical
}

// Swing trading specific parameters
export interface SwingTradingParams extends StrategyParams {
  scanIntervalMs: number; // how often to scan (e.g., 3600000 = 1 hour)
  weeklyProfitTarget: number; // 8-10% typical
  weeklyStopLoss: number; // 5% typical
  trailingStopPercent: number; // lock in profits
}

export interface TradingConfig {
  paperTrading: boolean;
  alpacaApiKey: string;
  alpacaSecretKey: string;
  alpacaBaseUrl: string;
  initialCapital: number;
  strategy: StrategyParams;
}

export interface BacktestResult {
  trades: Trade[];
  finalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
}

export type TradingMode = 'paper' | 'live';
export type StrategyType = 'momentum' | 'mean_reversion' | 'dividend' | 'custom';
export type TradingStyle = 'day' | 'swing' | 'longterm' | 'hybrid';

// All trading mode configurations
export interface DayTradingConfig {
  style: 'day';
  scanIntervalMs: number; // 5000 = 5 seconds
  profitTarget: number; // 5%
  stopLoss: number; // 2%
  maxTradesPerDay: number; // 3
  maxPositionSize: number; // 40%
}

export interface SwingTradingConfig {
  style: 'swing';
  scanIntervalMs: number; // 3600000 = 1 hour
  profitTarget: number; // 8%
  stopLoss: number; // 5%
  trailingStop: number; // 3%
  maxTradesPerWeek: number; // 2
  maxPositionSize: number; // 30%
  holdDaysMin: number; // 3
  holdDaysMax: number; // 14
}

export interface LongTermConfig {
  style: 'longterm';
  scanIntervalMs: number; // 86400000 = 1 day
  profitTarget: number; // 20%
  stopLoss: number; // 10%
  trailingStop: number; // 8%
  maxTradesPerMonth: number; // 1
  maxPositionSize: number; // 20%
  dividendYield: boolean; // prefer dividend stocks
}

export interface HybridConfig {
  style: 'hybrid';
  // Combines day + swing
  dayAllocation: number; // % for day trading
  swingAllocation: number; // % for swing trading
  scanIntervalMs: number; // 300000 = 5 minutes
}

export type TradingModeConfig = DayTradingConfig | SwingTradingConfig | LongTermConfig | HybridConfig;
