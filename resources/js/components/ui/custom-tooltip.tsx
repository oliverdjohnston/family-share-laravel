import { TooltipProps } from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {
    valueLabel: string;
    formatValue?: (value: number) => string;
}

export const CustomTooltip = ({
    active,
    payload,
    label,
    valueLabel,
    formatValue = (v) => v?.toString() || '0'
}: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;

    const value = payload[0].value;
    const displayValue = formatValue(Number(value));

    return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
            <p className="font-medium">{label || payload[0].name}</p>
            <span className="font-medium">{valueLabel}:</span> {displayValue}
            {payload[0].payload?.games && (
                <p className="text-muted-foreground text-xs">Games: {payload[0].payload.games}</p>
            )}
        </div>
    );
};
