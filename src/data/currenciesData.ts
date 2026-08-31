export interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  symbolNative?: string;
  decimalDigits: number;
  exchangeRateToUSD: number; // 1 USD = X Currency
  active: boolean;
  flag: string;
}

export const CURRENCIES_DATA: CurrencyItem[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', symbolNative: '$', decimalDigits: 2, exchangeRateToUSD: 1.0, active: true, flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', symbolNative: '€', decimalDigits: 2, exchangeRateToUSD: 0.92, active: true, flag: '🇪🇺' },
  { code: 'GBP', name: 'Pound Sterling', symbol: '£', symbolNative: '£', decimalDigits: 2, exchangeRateToUSD: 0.79, active: true, flag: '🇬🇧' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', symbolNative: '৳', decimalDigits: 0, exchangeRateToUSD: 119.5, active: true, flag: '🇧🇩' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', symbolNative: '₹', decimalDigits: 0, exchangeRateToUSD: 86.8, active: true, flag: '🇮🇳' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', symbolNative: '￥', decimalDigits: 0, exchangeRateToUSD: 154.2, active: true, flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', symbolNative: '$', decimalDigits: 2, exchangeRateToUSD: 1.38, active: true, flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', symbolNative: '$', decimalDigits: 2, exchangeRateToUSD: 1.54, active: true, flag: '🇦🇺' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: 'CN¥', symbolNative: '¥', decimalDigits: 2, exchangeRateToUSD: 7.24, active: true, flag: '🇨🇳' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', symbolNative: '₩', decimalDigits: 0, exchangeRateToUSD: 1390.0, active: true, flag: '🇰🇷' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED', symbolNative: 'د.إ', decimalDigits: 2, exchangeRateToUSD: 3.67, active: true, flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR', symbolNative: '﷼', decimalDigits: 2, exchangeRateToUSD: 3.75, active: true, flag: '🇸🇦' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', symbolNative: 'RM', decimalDigits: 2, exchangeRateToUSD: 4.45, active: true, flag: '🇲🇾' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'SG$', symbolNative: '$', decimalDigits: 2, exchangeRateToUSD: 1.34, active: true, flag: '🇸🇬' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', symbolNative: 'CHF', decimalDigits: 2, exchangeRateToUSD: 0.89, active: true, flag: '🇨🇭' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'SEK', symbolNative: 'kr', decimalDigits: 2, exchangeRateToUSD: 10.6, active: true, flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'NOK', symbolNative: 'kr', decimalDigits: 2, exchangeRateToUSD: 10.9, active: true, flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'DKK', symbolNative: 'kr', decimalDigits: 2, exchangeRateToUSD: 6.86, active: true, flag: '🇩🇰' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', symbolNative: '$', decimalDigits: 2, exchangeRateToUSD: 1.68, active: true, flag: '🇳🇿' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', symbolNative: 'R$', decimalDigits: 2, exchangeRateToUSD: 5.75, active: true, flag: '🇧🇷' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'ZAR', symbolNative: 'R', decimalDigits: 2, exchangeRateToUSD: 18.2, active: true, flag: '🇿🇦' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'PKR', symbolNative: '₨', decimalDigits: 0, exchangeRateToUSD: 278.5, active: true, flag: '🇵🇰' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', symbolNative: '₦', decimalDigits: 0, exchangeRateToUSD: 1530.0, active: true, flag: '🇳🇬' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', symbolNative: '₱', decimalDigits: 2, exchangeRateToUSD: 58.4, active: true, flag: '🇵🇭' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'IDR', symbolNative: 'Rp', decimalDigits: 0, exchangeRateToUSD: 15900.0, active: true, flag: '🇮🇩' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', symbolNative: '₺', decimalDigits: 2, exchangeRateToUSD: 34.5, active: true, flag: '🇹🇷' }
];

export const getCurrencyByCode = (code: string): CurrencyItem => {
  const found = CURRENCIES_DATA.find(c => c.code.toUpperCase() === (code || 'USD').toUpperCase());
  return found || CURRENCIES_DATA[0];
};
