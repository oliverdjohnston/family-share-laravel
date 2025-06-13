import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface DatePickerProps {
    date?: Date
    onDateChange: (date: Date | undefined) => void
    disabled?: boolean
    placeholder?: string
    className?: string
}

export const DatePicker = ({
    date,
    onDateChange,
    disabled = false,
    placeholder = "Pick date",
    className
}: DatePickerProps) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                className={cn(
                    "h-6 w-full justify-start text-left text-sm font-normal",
                    !date && "text-muted-foreground",
                    disabled && "opacity-50 cursor-not-allowed",
                    className
                )}
                disabled={disabled}
            >
                <CalendarIcon className="mr-2 h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                    {date ? format(date, "MMM d, yyyy") : placeholder}
                </span>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
            <Calendar
                mode="single"
                selected={date}
                onSelect={onDateChange}
                initialFocus
            />
        </PopoverContent>
    </Popover>
)
