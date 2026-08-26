import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { CalendarView } from "@/pages/Calendar";
import { useSettings, formatTime } from "@/hooks/useSettings";
import { useState, useEffect } from "react";
interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}
export const CalendarHeader = ({
  currentDate,
  view,
  onViewChange,
  onPreviousMonth,
  onNextMonth
}: CalendarHeaderProps) => {
  const {
    settings
  } = useSettings();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };
    return currentDate.toLocaleDateString('en-US', options);
  };
  const viewButtons = [{
    value: 'month' as const,
    label: 'Month'
  }, {
    value: 'week' as const,
    label: 'Week'
  }, {
    value: 'day' as const,
    label: 'Day'
  }];
  return <div className="px-6 py-4 border-b border-border/40 bg-background/50">
      <div className="flex items-center justify-between">
        {/* Date Navigation */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onPreviousMonth} className="hover:bg-primary/10 transition-all duration-300">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-foreground min-w-[180px] text-center">
              {formatDate()}
            </h2>
            <Button variant="ghost" size="sm" onClick={onNextMonth} className="hover:bg-primary/10 transition-all duration-300">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Center: Today's Date + Live Clock */}
        <div className="flex items-center space-x-3">
          
          
          <Button variant="outline" size="sm" onClick={() => {
          // Simple approach to go to today - we'll improve this later
          window.location.reload();
        }} className="hover:bg-primary/5 transition-all duration-300 text-xs">
            Today
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-secondary/50 rounded-lg p-1">
          {viewButtons.map(button => <Button key={button.value} variant={view === button.value ? "default" : "ghost"} size="sm" onClick={() => onViewChange(button.value)} className={`
                transition-all duration-300
                ${view === button.value ? 'bg-primary text-primary-foreground shadow-soft' : 'hover:bg-primary/10 text-muted-foreground'}
              `}>
              {button.label}
            </Button>)}
        </div>
      </div>
    </div>;
};