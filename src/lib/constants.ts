// Trading Constants and Default Values

import {
  StrategyParams,
  TradingConfig,
  DayTradingConfig,
  SwingTradingConfig,
  LongTermConfig,
  HybridConfig
} from './types';

// Default Day Trading Configuration
export const DAY_TRADING_CONFIG: DayTradingConfig = {
  style: 'day',
  scanIntervalMs: 5000, // 5 seconds
  profitTarget: 5, // 5%
  stopLoss: 2, // 2%
  maxTradesPerDay: 3,
  maxPositionSize: 40,
};

// Default Swing Trading Configuration
export const SWING_TRADING_CONFIG: SwingTradingConfig = {
  style: 'swing',
  scanIntervalMs: 3600000, // 1 hour
  profitTarget: 8, // 8%
  stopLoss: 5, // 5%
  trailingStop: 3, // 3%
  maxTradesPerWeek: 2,
  maxPositionSize: 30,
  holdDaysMin: 3,
  holdDaysMax: 14,
};

// Default Long-Term Configuration
export const LONGTERM_TRADING_CONFIG: LongTermConfig = {
  style: 'longterm',
  scanIntervalMs: 86400000, // 1 day
  profitTarget: 20, // 20%
  stopLoss: 10, // 10%
  trailingStop: 8, // 8%
  maxTradesPerMonth: 1,
  maxPositionSize: 20,
  dividendYield: true,
};

// Default Hybrid Configuration
export const HYBRID_TRADING_CONFIG: HybridConfig = {
  style: 'hybrid',
  dayAllocation: 30,
  swingAllocation: 70,
  scanIntervalMs: 300000, // 5 minutes
};

// Strategy parameters for momentum
export const DEFAULT_STRATEGY_PARAMS: StrategyParams = {
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
};

export const DEFAULT_CONFIG: TradingConfig = {
  paperTrading: true,
  alpacaApiKey: '',
  alpacaSecretKey: '',
  alpacaBaseUrl: 'https://paper-api.alpaca.markets',
  initialCapital: 1000,
  strategy: DEFAULT_STRATEGY_PARAMS,
};

// Stock universes for different strategies
// Tech/Growth Stocks (for momentum/day trading)
export const TECH_STOCKS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'AMD', 'INTC', 'QCOM',
  'AVGO', 'TXN', 'MU', 'LRCX', 'KLAC', 'AMAT', 'ASML', 'ADI', 'SNPS', 'CDNS',
  'PLTR', 'SMCI', 'SNAP', 'ROKU', 'SQ', 'COIN', 'SOFI', 'UPST', 'HOOD', 'MSTR',
  'RIVN', 'LCID', 'FFIE', 'LCID', 'NIO', 'XPEV', 'LI', 'RDDT', 'DIDI', 'GRAB'
];

// Blue Chip/Stable Stocks (for swing/long-term)
export const BLUE_CHIP_STOCKS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'JPM', 'BAC', 'GS', 'WFC',
  'JNJ', 'UNH', 'PFE', 'ABBV', 'LLY', 'MRK', 'BMY', 'KO', 'PEP', 'PG',
  'V', 'MA', 'JCI', 'FDX', 'UPS', 'CAT', 'DE', 'HON', 'BA', 'GE',
  'HD', 'MCD', 'SBUX', 'NKE', 'DIS', 'NFLX', 'TSM', 'ASML', 'SAP', 'ORCL'
];

// High Momentum/Volatile Stocks (for aggressive day trading)
export const HIGH_MOMENTUM_STOCKS = [
  'TSLA', 'NVDA', 'AMD', 'COIN', 'SMCI', 'MSTR', 'RIVN', 'LCID', 'PLTR', 'SMCI',
  'SOFI', 'UPST', 'SNAP', 'HOOD', 'GME', 'AMC', 'BB', 'NAKD', 'SPCE', 'PLUG',
  'FCEL', 'NIO', 'XPEV', 'FUBO', 'KOSS', 'NAKD', 'UVXY', 'SQQQ', 'TQQQ', 'SOXL',
  'SOXS', 'LABD', 'LABU', 'DRIP', 'GUSH', 'EPV', 'SMHB', 'DUSL', 'DTUL', 'ULE'
];

// Dividend/Value Stocks (for long-term)
export const DIVIDEND_STOCKS = [
  'JNJ', 'PG', 'KO', 'PEP', 'VZ', 'T', 'XOM', 'CVX', 'PFE', 'MRK',
  'IBM', 'MCD', 'WMT', 'HD', 'DIS', 'PM', 'MO', 'KO', 'GIS', 'K',
  'MMM', 'CAT', 'DE', 'EMR', 'ITW', 'GWW', 'BAX', 'ABT', 'MDT', 'SYK',
  'BSX', 'ZMH', 'EW', 'DXCM', 'ISRG', 'BDX', 'BKR', 'SLB', 'HAL', 'EOG'
];

// Penny Stocks (under $5 - high risk, high volatility)
export const PENNY_STOCKS = [
  // Sub $1
  'KOSS', 'NAKD', 'FCEL', 'SPCE', 'BB', 'SNDL', 'ACOR', 'ENZC', 'OGZ', 'ZG',
  'INVE', 'AIM', 'NAVB', 'CNBX', 'RXMD', 'PMME', 'LTBR', 'ATOS', 'REED', 'SRNA',
  // $1-$3
  'LCID', 'FUBO', 'PLUG', 'GPRO', 'NOK', 'BABA', 'RIVN', 'FFIE', 'NKLA', 'WORK',
  'XPEV', 'NIO', 'SIEB', 'AMD', 'INTC', 'SMSNY', 'BRAG', 'OPGN', 'SNES', 'VTVA',
  // $3-$5
  'AMC', 'GME', 'BBBY', 'RBLX', 'SOFI', 'UPST', 'HOOD', 'ABNB', 'LCID', 'RIVN',
  'PLTR', 'SNAP', 'FUBO', 'DOCU', 'U', 'PATH', 'SKLZ', 'DM', 'ROOT', 'OPEN',
  'APLS', 'BILI', 'TAL', 'EDU', 'GOTU', 'CETX', 'AI', 'NCTY', 'BRQS', 'CETX',
];

// IPO Tracker (recent and upcoming IPOs)
export const IPO_STOCKS = [
  'RDDT', // Reddit
  'DASH', // DoorDash
  'SNOW', // Snowflake
  'PLTR', // Palantir
  'U', // Unity
  'PATH', // UiPath
  'RIVN', // Rivian
  'LCID', // Lucid
  'HOOD', // Robinhood
  'COIN', // Coinbase
  'SOFI', // SoFi
  'ABNB', // Airbnb
  'DOCU', // DocuSign
  'ZM', // Zoom
  'DKNG', // DraftKings
  'PENN', // PENN Entertainment
  'TWO', // Two Harbors
  'RVTY', // Revvity
  'SMAR', // Smartsheet
  'TWLO', // Twilio
  'UBER', // Uber
  'LYFT', // Lyft
  'PINS', // Pinterest
  'SPOT', // Spotify
  'SQSP', // Squarespace
  'MRNA', // Moderna
  'BNTX', // BioNTech
  'XOM', // ExxonMobil
  'CVX', // Chevron
  'BRK.B' // Berkshire
];

// All stocks combined (for maximum scanning)
export const ALL_STOCKS = [
  ...new Set([
    ...TECH_STOCKS,
    ...BLUE_CHIP_STOCKS,
    ...HIGH_MOMENTUM_STOCKS,
    ...DIVIDEND_STOCKS,
    ...IPO_STOCKS,
    ...PENNY_STOCKS,
  ])
].sort();

// Sector-based stock lists
export const SECTORS = {
  tech: TECH_STOCKS,
  finance: ['JPM', 'BAC', 'GS', 'WFC', 'V', 'MA', 'PYPL', 'SQ', 'COIN', 'SOFI'],
  healthcare: ['JNJ', 'UNH', 'PFE', 'ABBV', 'LLY', 'MRK', 'BMY', 'ABT', 'MDT', 'SYK'],
  energy: ['XOM', 'CVX', 'EOG', 'SLB', 'HAL', 'NEE', 'DUK', 'SO', 'D', 'AEP'],
  consumer: ['PG', 'KO', 'PEP', 'MCD', 'SBUX', 'NKE', 'HD', 'WMT', 'TGT', 'COST'],
  industrial: ['CAT', 'DE', 'BA', 'GE', 'HON', 'UPS', 'FDX', 'RTX', 'LMT', 'GD'],
  automotive: ['TSLA', 'RIVN', 'LCID', 'GM', 'F', 'TM', 'HMC', 'STLA', 'RIVN', 'NIO'],
  crypto: ['COIN', 'MSTR', 'SQ', 'HOOD', 'SOFI', 'PYPL', 'NVDA', 'RIOT', 'MARA', 'Hut8']
};

// Stock count info
export const STOCK_COUNTS = {
  tech: TECH_STOCKS.length,
  blueChip: BLUE_CHIP_STOCKS.length,
  highMomentum: HIGH_MOMENTUM_STOCKS.length,
  dividend: DIVIDEND_STOCKS.length,
  ipo: IPO_STOCKS.length,
  penny: PENNY_STOCKS.length,
  all: ALL_STOCKS.length
};

// Risk limits
export const RISK_LIMITS = {
  maxPortfolioRisk: 20,
  maxSingleTradeRisk: 5,
  maxDrawdownAlert: 10,
  emergencyStopLoss: 15,
};

// Technical indicator periods
export const INDICATOR_PERIODS = {
  SMA_SHORT: 9,
  SMA_MEDIUM: 20,
  SMA_LONG: 50,
  EMA_SHORT: 12,
  EMA_LONG: 26,
  RSI_PERIOD: 14,
  VOLUME_SMA: 20,
};

// Trading style descriptions
export const TRADING_STYLE_INFO = {
  day: {
    name: 'Day Trading',
    icon: '⚡',
    description: 'High frequency, minutes to hours',
    risk: 'High',
    expectedReturn: '5-15% monthly',
    stress: 'High',
  },
  swing: {
    name: 'Swing Trading',
    icon: '🌊',
    description: 'Hold 2-14 days, catch trends',
    risk: 'Medium',
    expectedReturn: '3-8% monthly',
    stress: 'Medium',
  },
  longterm: {
    name: 'Long-Term Investing',
    icon: '📈',
    description: 'Hold months to years',
    risk: 'Low',
    expectedReturn: '1-3% monthly',
    stress: 'Low',
  },
  hybrid: {
    name: 'Hybrid (All Three)',
    icon: '🔄',
    description: 'Combine all strategies',
    risk: 'Variable',
    expectedReturn: '3-10% monthly',
    stress: 'Medium',
  },
};
