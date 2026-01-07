import Decimal from 'decimal.js';

export enum AssetTicker {
  BTC = 'BTC',
  USDT = 'USDT',
  XAUT = 'XAUT',
  ETH = 'ETH'
}

export enum FiatCurrency {
  USD = 'USD',
  EUR = 'EUR'
}

// --- Mock Data ---

const MOCK_RATES: Record<string, number> = {
  [AssetTicker.BTC]: 96500.50,
  [AssetTicker.USDT]: 1.00,
  [AssetTicker.XAUT]: 2450.75,
  [AssetTicker.ETH]: 2800.00,
};

// --- Hook Interface ---

export interface UsePricesReturn {
  /**
   * Calculates the fiat value of a specific token amount.
   * Example: 0.1 BTC -> 9650.05
   */
  getFiatValue: (amount: number, asset: AssetTicker | string, currency?: FiatCurrency) => number;

  /**
   * Returns the current price of 1 unit of the asset.
   */
  getExchangeRate: (asset: AssetTicker | string, currency?: FiatCurrency) => number;

  /**
   * Status indicator for UI loaders.
   */
  isLoading: boolean;

  /**
   * Trigger to reload prices (placeholder for API call).
   */
  refreshPrices: () => Promise<void>;
}

// --- Hook Implementation ---

export function usePrices(): UsePricesReturn {
  const isLoading = false;

  const getExchangeRate = (asset: AssetTicker | string, currency: FiatCurrency = FiatCurrency.USD) => {
    // Return the mock rate or default to 0 if not found
    return MOCK_RATES[asset as string] || 0;
  };

  const getFiatValue = (amount: number, asset: AssetTicker | string, currency: FiatCurrency = FiatCurrency.USD) => {
    const rate = getExchangeRate(asset, currency);
    // Use Decimal for precision, mimicking the original service behavior
    return new Decimal(amount).mul(rate).toNumber();
  };

  const refreshPrices = async () => {
    // Placeholder: In real app, this would fetch new data
    console.log('usePrices: Refreshing rates...');
    return Promise.resolve();
  };

  return {
    getFiatValue,
    getExchangeRate,
    isLoading,
    refreshPrices,
  };
}