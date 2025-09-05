import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { currencies } from "@shared/currency";

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}

export function CurrencySelector({ value, onChange, className, label = "Currency" }: CurrencySelectorProps) {
  return (
    <div className={className}>
      <Label htmlFor="currency">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger data-testid="select-currency">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{currency.symbol}</span>
                <span>{currency.code}</span>
                <span className="text-muted-foreground">- {currency.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}