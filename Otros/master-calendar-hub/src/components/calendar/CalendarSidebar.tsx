import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, Filter } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Calendar {
  id: string;
  name: string;
  color: string;
}

interface CalendarSidebarProps {
  availableCalendars: Calendar[];
  selectedCalendars: string[];
  onCalendarToggle: (calendarId: string) => void;
  onCreateCalendar: () => void;
}

export const CalendarSidebar = ({ 
  availableCalendars, 
  selectedCalendars, 
  onCalendarToggle,
  onCreateCalendar
}: CalendarSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Calendars</span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="absolute top-12 left-6 z-50 bg-background border border-border/40 rounded-lg shadow-medium p-4 min-w-[200px]">
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-foreground">My Calendars</h3>
          
          {availableCalendars.map(calendar => (
            <div key={calendar.id} className="flex items-center space-x-3">
              <Checkbox
                id={calendar.id}
                checked={selectedCalendars.includes(calendar.id)}
                onCheckedChange={() => onCalendarToggle(calendar.id)}
                className="border-border/40"
              />
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${calendar.color}`} />
                <label 
                  htmlFor={calendar.id} 
                  className="text-sm text-foreground cursor-pointer"
                >
                  {calendar.name}
                </label>
              </div>
            </div>
          ))}
          
          <div className="pt-2 border-t border-border/40">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCreateCalendar}
              className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
            >
              + Add Calendar
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};