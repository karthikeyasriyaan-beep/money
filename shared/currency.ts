export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
];

export const defaultCurrency = currencies[0]; // USD

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const currency = currencies.find(c => c.code === currencyCode) || defaultCurrency;
  
  // For currencies that don't typically show decimals (like JPY, KRW)
  const noDecimalCurrencies = ['JPY', 'KRW', 'HUF'];
  
  const formattedAmount = noDecimalCurrencies.includes(currencyCode) 
    ? Math.round(amount).toLocaleString()
    : amount.toFixed(2);
    
  return `${currency.symbol}${formattedAmount}`;
}

export function getCurrencySymbol(currencyCode: string = 'USD'): string {
  const currency = currencies.find(c => c.code === currencyCode) || defaultCurrency;
  return currency.symbol;
}