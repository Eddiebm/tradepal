// Alpaca Trading API Integration

import { Position, Trade, Portfolio, StockQuote, TradingConfig } from './types';

const ALPACA_DATA_URL = 'https://data.alpaca.markets';

export class AlpacaAPI {
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string;
  private isPaper: boolean;

  constructor(config: TradingConfig) {
    this.apiKey = config.alpacaApiKey;
    this.secretKey = config.alpacaSecretKey;
    this.baseUrl = config.paperTrading
      ? 'https://paper-api.alpaca.markets'
      : 'https://api.alpaca.markets';
    this.isPaper = config.paperTrading;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'APCA-API-KEY-ID': this.apiKey,
        'APCA-API-SECRET-KEY': this.secretKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Alpaca API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Get account info
  async getAccount() {
    return this.request('/v2/account');
  }

  // Get current portfolio
  async getPortfolio(): Promise<Portfolio> {
    try {
      const account = await this.request<any>('/v2/account');
      const positions = await this.request<any[]>('/v2/positions');

      const portfolioPositions: Position[] = positions.map((pos: any) => ({
        symbol: pos.symbol,
        quantity: parseFloat(pos.qty),
        avgPrice: parseFloat(pos.avg_entry_price),
        currentPrice: parseFloat(pos.current_price),
        marketValue: parseFloat(pos.market_value),
        unrealizedPL: parseFloat(pos.unrealized_pl),
        unrealizedPLPercent: parseFloat(pos.unrealized_plpc) * 100,
      }));

      return {
        cash: parseFloat(account.cash),
        equity: parseFloat(account.equity),
        totalValue: parseFloat(account.portfolio_value),
        dayChange: parseFloat(account.equity) - parseFloat(account.last_equity),
        dayChangePercent: ((parseFloat(account.equity) - parseFloat(account.last_equity)) / parseFloat(account.last_equity)) * 100,
        positions: portfolioPositions,
      };
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  }

  // Get stock quote
  async getQuote(symbol: string): Promise<StockQuote> {
    try {
      const response = await this.request<any>(
        `${ALPACA_DATA_URL}/v2/stocks/${symbol}/quotes/latest`
      );
      const quote = response.quote;
      return {
        symbol,
        price: quote.ap,
        change: quote.ap - quote.op,
        changePercent: ((quote.ap - quote.op) / quote.op) * 100,
        volume: quote.v,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  }

  // Get multiple quotes
  async getQuotes(symbols: string[]): Promise<StockQuote[]> {
    const quotes = await Promise.all(
      symbols.map(symbol => this.getQuote(symbol).catch(() => null))
    );
    return quotes.filter((q): q is StockQuote => q !== null);
  }

  // Place order
  async placeOrder(symbol: string, quantity: number, side: 'buy' | 'sell'): Promise<Trade> {
    const order = await this.request<any>('/v2/orders', {
      method: 'POST',
      body: JSON.stringify({
        symbol,
        qty: quantity,
        side,
        type: 'market',
        time_in_force: 'day',
      }),
    });

    return {
      id: order.id,
      symbol: order.symbol,
      side: order.side,
      quantity: parseInt(order.qty),
      price: parseFloat(order.filled_avg_price || '0'),
      total: parseFloat(order.notional || '0'),
      timestamp: new Date(order.created_at),
      status: order.status === 'filled' ? 'filled' :
              order.status === 'cancelled' ? 'cancelled' : 'pending',
    };
  }

  // Get order history
  async getOrders(limit: number = 50): Promise<Trade[]> {
    const orders = await this.request<any[]>(
      `/v2/orders?limit=${limit}&status=all`
    );

    return orders.map(order => ({
      id: order.id,
      symbol: order.symbol,
      side: order.side,
      quantity: parseInt(order.qty),
      price: parseFloat(order.filled_avg_price || '0'),
      total: parseFloat(order.notional || '0'),
      timestamp: new Date(order.created_at),
      status: order.status === 'filled' ? 'filled' :
              order.status === 'cancelled' ? 'cancelled' : 'pending',
    }));
  }

  // Cancel order
  async cancelOrder(orderId: string): Promise<void> {
    await this.request(`/v2/orders/${orderId}`, { method: 'DELETE' });
  }

  // Check if API is connected
  async isConnected(): Promise<boolean> {
    try {
      await this.getAccount();
      return true;
    } catch {
      return false;
    }
  }
}

// Factory function to create API instance
export function createAlpacaAPI(config: TradingConfig): AlpacaAPI {
  return new AlpacaAPI(config);
}
