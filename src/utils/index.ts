import { tokenConfigs } from '@/config/token';

export const getDecimals = (network: string, tokenAddress?: string): number => {
  const config = (tokenConfigs as any)[network];
  if (!config) return 18;
  
  if (tokenAddress) {
      const token = config.tokens?.find((t: any) => t.address.toLowerCase() === tokenAddress.toLowerCase());
      return token ? token.decimals : 18;
  }
  
  return config.native?.decimals || 18;
};

export const toBaseUnit = (amount: string, decimals: number): string => {
  if (!amount) return '0';
  const cleanAmount = amount.trim();
  if (cleanAmount === '') return '0';

  let [integer, fraction = ''] = cleanAmount.split('.');
  
  if (fraction.length > decimals) {
      fraction = fraction.slice(0, decimals);
  }
  
  const combined = (integer === '' ? '0' : integer) + fraction.padEnd(decimals, '0');
  
  try {
    return BigInt(combined).toString();
  } catch {
    return '0';
  }
};