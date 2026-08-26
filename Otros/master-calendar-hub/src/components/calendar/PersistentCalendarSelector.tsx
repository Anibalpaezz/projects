import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface Calendar {
  id: string;
  name: string;
  color: string;
}

interface PersistentCalendarSelectorProps {
  availableCalendars: Calendar[];
  selectedCalendars: string[];
  onCalendarToggle: (calendarId: string) => void;
  onCreateCalendar: () => void;
}

export const PersistentCalendarSelector = ({ 
  availableCalendars, 
  selectedCalendars, 
  onCalendarToggle,
  onCreateCalendar
}: PersistentCalendarSelectorProps) => {
  return (
    <Card className="border-border/40 shadow-elegant bg-card/80 backdrop-blur-sm h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          My Calendars
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {availableCalendars.map(calendar => (
          <div key={calendar.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
            <Checkbox
              id={calendar.id}
              checked={selectedCalendars.includes(calendar.id)}
              onCheckedChange={() => onCalendarToggle(calendar.id)}
              className="border-border/40"
            />
            <div className="flex items-center space-x-2 flex-1">
              <div 
                className="w-3 h-3 rounded-full border border-white/20" 
                style={{ backgroundColor: calendar.color }}
              />
              <label 
                htmlFor={calendar.id} 
                className="text-sm text-foreground cursor-pointer flex-1"
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
            className="w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};