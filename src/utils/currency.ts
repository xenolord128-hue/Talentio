import { CURRENCIES_DATA, getCurrencyByCode, CurrencyItem } from '../data/currenciesData';

export interface MonetaryValue {
  amount: number; // Stored in base currency or units
  currency: string;
}

/**
 * Converts a base USD amount to target currency
 */
export const convertUSDToCurrency = (amountUSD: number, targetCurrencyCode: string): number => {
  const currencyInfo = getCurrencyByCode(targetCurrencyCode);
  const converted = amountUSD * currencyInfo.exchangeRateToUSD;
  
  if (currencyInfo.decimalDigits === 0) {
    return Math.round(converted);
  }
  return Math.round(converted * 100) / 100;
};

/**
 * Converts between any two supported currencies
 */
export const convertBetweenCurrencies = (
  amount: number,
  fromCurrencyCode: string,
  toCurrencyCode: string
): { convertedAmount: number; rate: number } => {
  const fromInfo = getCurrencyByCode(fromCurrencyCode);
  const toInfo = getCurrencyByCode(toCurrencyCode);

  // Convert to USD first
  const amountInUSD = fromInfo.exchangeRateToUSD > 0 ? amount / fromInfo.exchangeRateToUSD : amount;
  const convertedAmount = amountInUSD * toInfo.exchangeRateToUSD;
  const rate = toInfo.exchangeRateToUSD / (fromInfo.exchangeRateToUSD || 1);

  const roundedAmount = toInfo.decimalDigits === 0 
    ? Math.round(convertedAmount) 
    : Math.round(convertedAmount * 100) / 100;

  return {
    convertedAmount: roundedAmount,
    rate: Math.round(rate * 10000) / 10000
  };
};

/**
 * Format a USD base price to formatted string with currency symbol in user's chosen currency
 */
export const formatPrice = (
  amountUSD: number,
  targetCurrencyCode: string = 'USD',
  showCode: boolean = false
): string => {
  const currencyInfo = getCurrencyByCode(targetCurrencyCode);
  const converted = convertUSDToCurrency(amountUSD, targetCurrencyCode);

  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currencyInfo.decimalDigits,
    maximumFractionDigits: currencyInfo.decimalDigits
  }).format(converted);

  const symbol = currencyInfo.symbolNative || currencyInfo.symbol;

  if (showCode) {
    return `${symbol}${formattedNumber} ${currencyInfo.code}`;
  }
  return `${symbol}${formattedNumber}`;
};

/**
 * Format raw currency without conversion
 */
export const formatRawCurrency = (
  amount: number,
  currencyCode: string = 'USD'
): string => {
  const currencyInfo = getCurrencyByCode(currencyCode);
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currencyInfo.decimalDigits,
    maximumFractionDigits: currencyInfo.decimalDigits
  }).format(amount);

  const symbol = currencyInfo.symbolNative || currencyInfo.symbol;
  return `${symbol}${formattedNumber}`;
};
