import { useState } from "react";
import { format, addDays, subDays, isToday, isYesterday } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateNavigation = ({ selectedDate, onDateChange }: DateNavigationProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const goToPreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const goToNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const goToYesterday = () => {
    onDateChange(subDays(new Date(), 1));
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Oggi";
    if (isYesterday(date)) return "Ieri";
    return format(date, "d MMMM yyyy", { locale: it });
  };

  const minDate = new Date(2025, 0, 1); // 1 gennaio 2025
  const maxDate = new Date(2027, 11, 31); // 31 dicembre 2027

  const isDateDisabled = (date: Date) => {
    return date < minDate || date > maxDate;
  };

  return (
    <div className="flex items-center space-x-4 bg-card rounded-lg p-4 border">
      {/* Quick Actions */}
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToYesterday}
          className="text-black"
        >
          Ieri
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToToday}
          className="text-black"
        >
          Oggi
        </Button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousDay}
          disabled={selectedDate <= minDate}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "min-w-[200px] justify-start text-left font-normal text-black",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getDateLabel(selectedDate)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date && !isDateDisabled(date)) {
                  onDateChange(date);
                  setIsCalendarOpen(false);
                }
              }}
              disabled={isDateDisabled}
              fromDate={minDate}
              toDate={maxDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextDay}
          disabled={selectedDate >= maxDate}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Date Range Info */}
      <div className="text-sm text-muted-foreground">
        Disponibile dal 1 Gen 2025 al 31 Dic 2027
      </div>
    </div>
  );
};

export default DateNavigation;