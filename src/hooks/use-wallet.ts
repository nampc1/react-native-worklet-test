import { useState } from 'react';

export interface WalletData {
  id: string;
  name: string;
  address: string;
}

export interface BalanceItem {
  token: string;
  symbol: string;
  balance: number;
  usdValue: number;
  color: string;
  icon?: any; 
}

export interface TransactionItem {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  token: string;
  date: string;
  status: 'confirmed' | 'pending';
}

// --- MOCK DATA ---

const MOCK_WALLET = {
  id: 'wallet-1',
  name: 'Main Wallet',
  address: '0x123...abc',
};

const MOCK_BALANCES: BalanceItem[] = [
  { 
    token: 'Bitcoin', 
    symbol: 'BTC', 
    balance: 0.045, 
    usdValue: 4350.00, 
    color: '#F7931A',
    icon: require('../../assets/images/tokens/bitcoin-btc-logo.png')
  },
  { 
    token: 'Tether', 
    symbol: 'USDt', 
    balance: 1250.00, 
    usdValue: 1250.00, 
    color: '#26A17B',
    icon: require('../../assets/images/tokens/tether-usdt-logo.png')
  },
  { 
    token: 'Tether Gold', 
    symbol: 'XAUt', 
    balance: 2.5, 
    usdValue: 5100.25, 
    color: '#D4AF37',
    icon: require('../../assets/images/tokens/tether-xaut-logo.png')
  },
];

const MOCK_TRANSACTIONS: TransactionItem[] = [
  { 
    id: 'tx1', 
    type: 'received', 
    amount: 500, 
    token: 'USDt', 
    date: 'Today', 
    status: 'confirmed' 
  },
  { 
    id: 'tx2', 
    type: 'sent', 
    amount: 0.01, 
    token: 'BTC', 
    date: 'Yesterday', 
    status: 'confirmed' 
  },
  { 
    id: 'tx3', 
    type: 'received', 
    amount: 0.5, 
    token: 'XAUt', 
    date: 'Dec 25', 
    status: 'confirmed' 
  },
];

export function useWallet() {
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState<WalletData | null>(MOCK_WALLET);
  const [balances, setBalances] = useState<BalanceItem[]>(MOCK_BALANCES);
  const [transactions, setTransactions] = useState<TransactionItem[]>(MOCK_TRANSACTIONS);

  const refreshWallet = async () => {
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  // Calculate total balance dynamically
  const totalBalanceUSD = balances.reduce((acc, item) => acc + item.usdValue, 0);

  // Mock function for creating a wallet (used in Onboarding Complete screen)
  const createWallet = async (data: { name: string; mnemonic: string }) => {
    setIsLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setWallet({
          id: 'new-wallet',
          name: data.name,
          address: '0xNew...Wallet',
        });
        setIsLoading(false);
        resolve();
      }, 1500);
    });
  };

  return {
    wallet,
    balances,
    transactions,
    totalBalanceUSD,
    isLoading,
    refreshWallet,
    createWallet,
    isUnlocked: true, // Mock unlock status
  };
}