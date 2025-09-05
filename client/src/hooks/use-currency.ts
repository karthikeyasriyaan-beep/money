import { useState, useEffect } from 'react';
import { formatCurrency, getCurrencySymbol, defaultCurrency } from '@shared/currency';

const CURRENCY_STORAGE_KEY = 'lumeo-currency';

export function useCurrency() {
  const [currency, setCurrency] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(CURRENCY_STORAGE_KEY) || defaultCurrency.code;
    }
    return defaultCurrency.code;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    }
  }, [currency]);

  const formatAmount = (amount: number) => formatCurrency(amount, currency);
  const getSymbol = () => getCurrencySymbol(currency);

  return {
    currency,
    setCurrency,
    formatAmount,
    getSymbol,
  };
}