import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CalendarEvent } from "@/lib/utils";
import { Plus, Edit, Trash2, X } from "lucide-react";

interface DayDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onCreateEvent: (date: Date) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
}

export const DayDetailsPanel = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  events, 
  onEventClick,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent
}: DayDetailsPanelProps) => {
  const { t, i18n } = useTranslation();
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);
  
  const locale = i18n.language === 'es' ? es : enUS;

  useEffect(() => {
    if (selectedDate) {
      const filtered = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === selectedDate.toDateString();
      });
      setDayEvents(filtered.sort((a, b) => {
        if (a.all_day && !b.all_day) return -1;
        if (!a.all_day && b.all_day) return 1;
        return a.date.getTime() - b.date.getTime();
      }));
    }
  }, [selectedDate, events]);

  if (!selectedDate) return null;

  const formattedDate = format(selectedDate, 'EEEE, MMMM d, yyyy', { locale });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96 sm:max-w-96">
        <SheetHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">
              {t('calendar.eventsForDay', { date: formattedDate })}
            </SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={() => onCreateEvent(selectedDate)}
            size="sm"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('calendar.addEventForDay', { date: format(selectedDate, 'MMM d', { locale }) })}
          </Button>
        </SheetHeader>

        <div className="mt-6">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {t('calendar.noEventsToday')}
              </p>
              <Button 
                variant="outline" 
                onClick={() => onCreateEvent(selectedDate)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('events.createEvent')}
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-3">
                {dayEvents.map((event) => (
                  <Card 
                    key={`${event.id}-${event.date.getTime()}`}
                    className="border-border/40 hover:shadow-medium transition-shadow cursor-pointer"
                    onClick={() => onEventClick(event)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-sm font-medium">
                            {event.title}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            {event.all_day ? (
                              <Badge variant="secondary" className="text-xs">
                                {t('calendar.allDay')}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {event.time}
                              </span>
                            )}
                            <div className="flex items-center space-x-1">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: event.color }}
                              />
                              <span className="text-xs text-muted-foreground">
                                {event.calendar}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditEvent(event);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEvent(event);
                            }}  
                            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {event.description && (
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};