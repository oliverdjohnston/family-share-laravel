import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CurrencyInputProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    placeholder?: string
    className?: string
    currency?: string
}

export const CurrencyInput = ({
    value,
    onChange,
    disabled = false,
    placeholder = "0.00",
    className,
    currency = "£"
}: CurrencyInputProps) => (
    <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {currency}
        </span>
        <Input
            type="number"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
                "h-6 pl-5 text-right text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                className
            )}
            disabled={disabled}
        />
    </div>
)
