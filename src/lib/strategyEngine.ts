// Momentum Strategy Engine

import { StockQuote, StrategyParams, Trade } from './types';
import { PaperTradingEngine } from './tradingEngine';
import { HIGH_MOMENTUM_STOCKS } from './constants';

export interface StrategySignal {
  symbol: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  reason: string;
  price: number;
}

export class MomentumStrategy {
  private quotes: Map<string, StockQuote[]> = new Map();
  private lookbackCandles: number;

  constructor(params: StrategyParams) {
    this.lookbackCandles = params.momentumLookback;
  }

  // Add quote to history
  addQuote(quote: StockQuote): void {
    if (!this.quotes.has(quote.symbol)) {
      this.quotes.set(quote.symbol, []);
    }
    const history = this.quotes.get(quote.symbol)!;
    history.push(quote);

    // Keep only lookback period
    if (history.length > this.lookbackCandles * 2) {
      history.shift();
    }
  }

  // Calculate RSI
  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = prices.length - period; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  // Calculate Simple Moving Average
  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1];
    const slice = prices.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  }

  // Calculate Volume momentum
  private calculateVolumeMomentum(volumes: number[]): number {
    if (volumes.length < 20) return 1;

    const recentAvg = volumes.slice(-5).reduce((a, b) => a + b, 0) / 5;
    const historicalAvg = volumes.slice(0, -5).reduce((a, b) => a + b, 0) / Math.min(15, volumes.length - 5);

    return recentAvg / historicalAvg;
  }

  // Calculate price momentum (rate of change)
  private calculateMomentum(prices: number[]): number {
    if (prices.length < this.lookbackCandles) return 0;
    const oldPrice = prices[prices.length - this.lookbackCandles];
    const currentPrice = prices[prices.length - 1];
    return ((currentPrice - oldPrice) / oldPrice) * 100;
  }

  // Generate signal for a symbol
  analyzeSignal(symbol: string, currentQuote: StockQuote, params: StrategyParams): StrategySignal {
    const history = this.quotes.get(symbol) || [];

    if (history.length < 20) {
      return {
        symbol,
        action: 'hold',
        confidence: 0,
        reason: 'Insufficient data',
        price: currentQuote.price,
      };
    }

    const prices = history.map(q => q.price);
    const volumes = history.map(q => q.volume);

    // Calculate indicators
    const rsi = this.calculateRSI(prices);
    const sma20 = this.calculateSMA(prices, 20);
    const sma50 = this.calculateSMA(prices, 50);
    const momentum = this.calculateMomentum(prices);
    const volumeMomentum = this.calculateVolumeMomentum(volumes);

    // Current price position
    const aboveSMA20 = currentQuote.price > sma20;
    const aboveSMA50 = currentQuote.price > sma50;
    const strongUptrend = aboveSMA20 && aboveSMA50 && currentQuote.price > sma20;

    // Buy conditions (aggressive)
    let buyScore = 0;
    const reasons: string[] = [];

    // RSI oversold with bounce
    if (rsi < params.rsiOversold) {
      buyScore += 3;
      reasons.push('RSI oversold');
    } else if (rsi < 40) {
      buyScore += 1;
      reasons.push('RSI neutral-low');
    }

    // Strong momentum
    if (momentum > 5) {
      buyScore += 3;
      reasons.push('Strong momentum');
    } else if (momentum > 2) {
      buyScore += 2;
      reasons.push('Positive momentum');
    }

    // Volume confirmation
    if (volumeMomentum > params.volumeThreshold) {
      buyScore += 2;
      reasons.push('High volume');
    }

    // Price above moving averages
    if (strongUptrend) {
      buyScore += 2;
      reasons.push('Above MAs');
    }

    // Sell conditions
    let sellScore = 0;
    const sellReasons: string[] = [];

    // RSI overbought
    if (rsi > params.rsiOverbought) {
      sellScore += 3;
      sellReasons.push('RSI overbought');
    } else if (rsi > 60) {
      sellScore += 1;
      sellReasons.push('RSI elevated');
    }

    // Negative momentum
    if (momentum < -3) {
      sellScore += 3;
      sellReasons.push('Negative momentum');
    }

    // Below moving averages
    if (!aboveSMA20) {
      sellScore += 2;
      sellReasons.push('Below SMA20');
    }

    // Determine action
    let action: 'buy' | 'sell' | 'hold' = 'hold';
    let confidence = 0;
    let reason = 'No clear signal';

    if (buyScore >= 5 && buyScore > sellScore) {
      action = 'buy';
      confidence = Math.min(buyScore / 10, 1);
      reason = reasons.slice(0, 3).join(', ');
    } else if (sellScore >= 4 && sellScore > buyScore) {
      action = 'sell';
      confidence = Math.min(sellScore / 10, 1);
      reason = sellReasons.slice(0, 3).join(', ');
    }

    return {
      symbol,
      action,
      confidence,
      reason,
      price: currentQuote.price,
    };
  }

  // Scan all stocks and generate signals
  scanAll(
    quotes: StockQuote[],
    params: StrategyParams
  ): StrategySignal[] {
    const signals: StrategySignal[] = [];

    // Update history with current quotes
    quotes.forEach(quote => this.addQuote(quote));

    // Analyze each stock
    HIGH_MOMENTUM_STOCKS.forEach(symbol => {
      const quote = quotes.find(q => q.symbol === symbol);
      if (quote) {
        const signal = this.analyzeSignal(symbol, quote, params);
        if (signal.action !== 'hold') {
          signals.push(signal);
        }
      }
    });

    // Sort by confidence
    return signals.sort((a, b) => b.confidence - a.confidence);
  }
}

// Trading bot that uses the strategy
export class TradingBot {
  private engine: PaperTradingEngine;
  private strategy: MomentumStrategy;
  private params: StrategyParams;
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(
    engine: PaperTradingEngine,
    params: StrategyParams
  ) {
    this.engine = engine;
    this.params = params;
    this.strategy = new MomentumStrategy(params);
  }

  // Start automated trading
  start(intervalMs: number = 60000): void {
    if (this.isRunning) return;
    this.isRunning = true;

    this.intervalId = setInterval(() => {
      this.tick();
    }, intervalMs);

    // Initial tick
    this.tick();
  }

  // Stop automated trading
  stop(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Single trading tick
  async tick(): Promise<void> {
    // Update market data
    this.engine.updateMarketData();

    const quotes = this.engine.getAllQuotes();
    const portfolio = this.engine.getPortfolio();

    // Check existing positions for stop loss / take profit
    portfolio.positions.forEach(position => {
      const action = this.engine.checkPosition(position.symbol, this.params);

      if (action === 'sell_stop') {
        console.log(`Stop loss triggered for ${position.symbol}`);
        this.engine.sell(position.symbol, position.quantity);
      } else if (action === 'sell_profit') {
        console.log(`Take profit triggered for ${position.symbol}`);
        this.engine.sell(position.symbol, position.quantity);
      }
    });

    // Check if we can trade
    const { canTrade } = this.engine.canTrade();
    if (!canTrade) return;

    // Scan for new opportunities
    const signals = this.strategy.scanAll(quotes, this.params);
    const buySignals = signals.filter(s => s.action === 'buy' && s.confidence > 0.6);

    // Execute trades
    for (const signal of buySignals) {
      if (!this.engine.canTrade().canTrade) break;

      // Don't buy if we already have this position
      if (this.engine.hasPosition(signal.symbol)) continue;

      // Calculate position size
      const maxPositionValue = portfolio.totalValue * (this.params.maxPositionSize / 100);
      const quantity = Math.floor(maxPositionValue / signal.price);

      if (quantity > 0) {
        try {
          const trade = this.engine.buy(signal.symbol, quantity);
          console.log(`BUY: ${quantity} shares of ${signal.symbol} at $${signal.price}`);
          console.log(`Trade ID: ${trade.id}`);

          // Announce trade with voice feedback
          this.announceTrade('BUY', signal.symbol, quantity, signal.price, signal.reason);
        } catch (error) {
          console.error(`Failed to buy ${signal.symbol}:`, error);
        }
      }
    }
  }

  // Announce trade with voice feedback
  private announceTrade(action: 'BUY' | 'SELL', symbol: string, quantity: number, price: number, reason: string): void {
    try {
      const voice = (window as any).voiceFeedback;
      if (voice?.isEnabled()) {
        voice.announceTrade?.(action, symbol, quantity, price, reason);
      }
    } catch (e) {
      // Voice feedback not available
    }
  }

  // Announce reasoning without executing trade
  announceAnalysis(symbol: string, reason: string): void {
    try {
      const voice = (window as any).voiceFeedback;
      if (voice?.isEnabled()) {
        voice.announceReasoning?.(symbol, reason);
      }
    } catch (e) {
      // Voice feedback not available
    }
  }

  // Get current status
  getStatus(): { isRunning: boolean; tradesToday: number } {
    return {
      isRunning: this.isRunning,
      tradesToday: this.engine.getTradeHistory().filter(
        t => new Date(t.timestamp).toDateString() === new Date().toDateString()
      ).length,
    };
  }

  // Update strategy parameters
  updateParams(params: StrategyParams): void {
    this.params = params;
  }
}

// Factory function
export function createTradingBot(
  engine: PaperTradingEngine,
  params: StrategyParams
): TradingBot {
  return new TradingBot(engine, params);
}
