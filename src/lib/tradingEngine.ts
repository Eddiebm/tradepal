// Paper Trading Engine - Simulates trading without real money

import { Position, Trade, Portfolio, StockQuote, StrategyParams } from './types';
import { ALL_STOCKS, STOCK_COUNTS } from './constants';

export class PaperTradingEngine {
  private cash: number;
  private positions: Map<string, Position> = new Map();
  private tradeHistory: Trade[] = [];
  private quotes: Map<string, StockQuote> = new Map();
  private tradesToday: number = 0;
  private lastTradeDate: Date = new Date();

  constructor(initialCapital: number = 1000) {
    this.cash = initialCapital;
  }

  // Simulate market data (random walk for demo)
  private simulatePrice(symbol: string, basePrice: number = 100): number {
    const volatility = 0.02; // 2% volatility
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const currentPrice = this.quotes.get(symbol)?.price || basePrice;
    return currentPrice * (1 + randomChange);
  }

  // Update simulated quotes for all stocks
  updateMarketData(): void {
    const basePrices: Record<string, number> = {
      // Tech
      'AAPL': 175, 'MSFT': 420, 'GOOGL': 175, 'AMZN': 200, 'META': 520,
      'NVDA': 880, 'TSLA': 245, 'AMD': 165, 'INTC': 45, 'QCOM': 180,
      'AVGO': 1200, 'TXN': 200, 'MU': 110, 'ASML': 950, 'ADI': 220,
      'SNPS': 500, 'CDNS': 280, 'PLTR': 22, 'SMCI': 980, 'RIVN': 12,
      'SNAP': 12, 'ROKU': 70, 'SQ': 80, 'COIN': 180, 'SOFI': 8,
      'UPST': 35, 'HOOD': 15, 'MSTR': 1500, 'LCID': 3.5, 'NIO': 6,
      'XPEV': 8, 'LI': 25, 'RDDT': 55, 'DASH': 115, 'SNOW': 140,
      // Blue Chip
      'JPM': 200, 'BAC': 38, 'GS': 480, 'WFC': 55, 'V': 280, 'MA': 460,
      'JNJ': 160, 'UNH': 530, 'PFE': 28, 'ABBV': 175, 'LLY': 780,
      'MRK': 125, 'BMY': 50, 'KO': 60, 'PEP': 170, 'PG': 165,
      'HD': 380, 'MCD': 290, 'SBUX': 90, 'NKE': 100, 'DIS': 110,
      'NFLX': 600, 'TSM': 140, 'SAP': 200, 'ORCL': 125, 'UPS': 165,
      'FDX': 280, 'CAT': 360, 'DE': 400, 'HON': 200, 'BA': 180,
      // Momentum/Volatile
      'GME': 20, 'AMC': 5, 'BB': 5, 'PLUG': 3,
      'UVXY': 15, 'TQQQ': 45,
      'SOXL': 60, 'GUSH': 45, 'MARA': 12, 'RIOT': 10,
      // Dividend
      'VZ': 40, 'T': 18, 'XOM': 115, 'CVX': 155, 'IBM': 185,
      'PM': 110, 'MO': 45, 'GIS': 70, 'K': 55, 'MMM': 100,
      'EMR': 100, 'ITW': 260, 'GWW': 340, 'ABT': 115, 'MDT': 85,
      'SYK': 320, 'BSX': 75, 'DXCM': 120, 'ISRG': 360, 'BDX': 240,
      // IPO
      'U': 35, 'PATH': 25, 'ABNB': 140, 'DOCU': 60, 'ZM': 60,
      'DKNG': 40, 'TWLO': 60, 'UBER': 75, 'LYFT': 12, 'PINS': 35,
      'SPOT': 280, 'MRNA': 100, 'BNTX': 95, 'BRK.B': 390,
      // Penny Stocks (high volatility, under $5)
      'KOSS': 2, 'NAKD': 0.8, 'FCEL': 1.2, 'SPCE': 1.5, 'SNDL': 2.5,
      'ACOR': 2, 'ENZC': 1.5, 'OGZ': 3, 'ZG': 2, 'INVE': 1.8,
      'AIM': 1.2, 'NAVB': 1.5, 'CNBX': 1, 'RXMD': 1.8, 'PMME': 1.5,
      'LTBR': 1.2, 'ATOS': 1.8, 'REED': 1, 'SRNA': 2, 'SMSNY': 2.5,
      'BRAG': 1.5, 'OPGN': 1.8, 'SNES': 1, 'VTVA': 2, 'GPRO': 3,
      'NOK': 4, 'FFIE': 2, 'NKLA': 3, 'WORK': 4, 'SIEB': 2,
      'BBBY': 1.5, 'RBLX': 40, 'SKLZ': 3, 'DM': 4, 'ROOT': 4,
      'OPEN': 3, 'APLS': 4, 'BILI': 10, 'TAL': 15, 'EDU': 45,
      'GOTU': 4, 'CETX': 1.5, 'AI': 3, 'NCTY': 1.8, 'BRQS': 1.2
    };

    ALL_STOCKS.forEach(symbol => {
      const basePrice = basePrices[symbol] || 100;
      const price = this.simulatePrice(symbol, basePrice);
      const prevPrice = this.quotes.get(symbol)?.price || price;
      const change = price - prevPrice;

      this.quotes.set(symbol, {
        symbol,
        price,
        change,
        changePercent: (change / prevPrice) * 100,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        timestamp: new Date(),
      });
    });
  }

  // Get quote for symbol
  getQuote(symbol: string): StockQuote | undefined {
    return this.quotes.get(symbol);
  }

  // Get all quotes
  getAllQuotes(): StockQuote[] {
    return Array.from(this.quotes.values());
  }

  // Get current portfolio
  getPortfolio(): Portfolio {
    // Update positions with current prices
    this.positions.forEach((position, symbol) => {
      const quote = this.quotes.get(symbol);
      if (quote) {
        position.currentPrice = quote.price;
        position.marketValue = position.quantity * position.currentPrice;
        position.unrealizedPL = position.marketValue - (position.quantity * position.avgPrice);
        position.unrealizedPLPercent = (position.unrealizedPL / (position.quantity * position.avgPrice)) * 100;
      }
    });

    const positions = Array.from(this.positions.values());
    const equity = positions.reduce((sum, p) => sum + p.marketValue, 0);
    const totalValue = this.cash + equity;

    return {
      cash: this.cash,
      equity,
      totalValue,
      dayChange: totalValue - 1000, // vs initial
      dayChangePercent: ((totalValue - 1000) / 1000) * 100,
      positions,
    };
  }

  // Check if can trade
  canTrade(): { canTrade: boolean; reason?: string } {
    const today = new Date().toDateString();
    if (today !== this.lastTradeDate.toDateString()) {
      this.tradesToday = 0;
      this.lastTradeDate = new Date();
    }

    if (this.tradesToday >= 3) {
      return { canTrade: false, reason: 'Daily trade limit reached' };
    }

    return { canTrade: true };
  }

  // Execute buy
  buy(symbol: string, quantity: number): Trade {
    const quote = this.quotes.get(symbol);
    if (!quote) {
      throw new Error(`No quote for ${symbol}`);
    }

    const total = quote.price * quantity;
    if (total > this.cash) {
      throw new Error(`Insufficient funds. Need $${total.toFixed(2)}, have $${this.cash.toFixed(2)}`);
    }

    this.cash -= total;

    if (this.positions.has(symbol)) {
      const position = this.positions.get(symbol)!;
      const totalQty = position.quantity + quantity;
      position.avgPrice = ((position.avgPrice * position.quantity) + total) / totalQty;
      position.quantity = totalQty;
      position.currentPrice = quote.price;
      position.marketValue = position.quantity * position.currentPrice;
    } else {
      this.positions.set(symbol, {
        symbol,
        quantity,
        avgPrice: quote.price,
        currentPrice: quote.price,
        marketValue: total,
        unrealizedPL: 0,
        unrealizedPLPercent: 0,
      });
    }

    const trade: Trade = {
      id: `paper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      symbol,
      side: 'buy',
      quantity,
      price: quote.price,
      total,
      timestamp: new Date(),
      status: 'filled',
    };

    this.tradeHistory.push(trade);
    this.tradesToday++;

    return trade;
  }

  // Execute sell
  sell(symbol: string, quantity: number): Trade {
    const position = this.positions.get(symbol);
    if (!position) {
      throw new Error(`No position in ${symbol}`);
    }

    if (quantity > position.quantity) {
      throw new Error(`Insufficient shares. Have ${position.quantity}, trying to sell ${quantity}`);
    }

    const quote = this.quotes.get(symbol)!;
    const total = quote.price * quantity;
    this.cash += total;

    position.quantity -= quantity;
    position.marketValue = position.quantity * position.currentPrice;

    if (position.quantity === 0) {
      this.positions.delete(symbol);
    }

    const trade: Trade = {
      id: `paper-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      symbol,
      side: 'sell',
      quantity,
      price: quote.price,
      total,
      timestamp: new Date(),
      status: 'filled',
    };

    this.tradeHistory.push(trade);
    this.tradesToday++;

    return trade;
  }

  // Get trade history
  getTradeHistory(): Trade[] {
    return this.tradeHistory;
  }

  // Check position for stop loss / take profit
  checkPosition(symbol: string, strategy: StrategyParams): 'hold' | 'sell_stop' | 'sell_profit' {
    const position = this.positions.get(symbol);
    if (!position) return 'hold';

    const quote = this.quotes.get(symbol);
    if (!quote) return 'hold';

    const pnlPercent = ((quote.price - position.avgPrice) / position.avgPrice) * 100;

    if (pnlPercent <= -strategy.stopLoss) {
      return 'sell_stop';
    }

    if (pnlPercent >= strategy.profitTarget) {
      return 'sell_profit';
    }

    return 'hold';
  }

  // Get positions
  getPositions(): Position[] {
    return Array.from(this.positions.values());
  }

  // Check if owns stock
  hasPosition(symbol: string): boolean {
    return this.positions.has(symbol);
  }

  // Reset (for testing)
  reset(initialCapital: number = 1000): void {
    this.cash = initialCapital;
    this.positions.clear();
    this.tradeHistory = [];
    this.tradesToday = 0;
  }
}

// Factory function
export function createPaperTradingEngine(initialCapital: number = 500): PaperTradingEngine {
  return new PaperTradingEngine(initialCapital);
}
