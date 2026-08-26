import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Copy 
} from "lucide-react";
import { CalendarEvent } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface DaySummaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  events: CalendarEvent[];
  onCreateEvent: (date: Date) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (event: CalendarEvent) => void;
  onDuplicateEvent: (event: CalendarEvent) => void;
  calendars: Array<{ id: string; name: string; color: string }>;
}

export const DaySummaryPanel = ({
  isOpen,
  onClose,
  selectedDate,
  events,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onDuplicateEvent,
  calendars
}: DaySummaryPanelProps) => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [compactMode, setCompactMode] = useState(false);
  
  const locale = i18n.language === 'es' ? es : enUS;

  if (!selectedDate) return null;

  // Filter events for the selected date
  const dayEvents = events.filter(event => 
    event.date.toDateString() === selectedDate.toDateString()
  );

  // Apply search and calendar filters
  const filteredEvents = dayEvents.filter(event => {
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCalendar = selectedCalendars.length === 0 || 
      selectedCalendars.includes(event.calendar_id);
    
    return matchesSearch && matchesCalendar;
  });

  const formatEventTime = (event: CalendarEvent) => {
    if (event.all_day) return t('calendar.allDay');
    if (!event.time) return '';
    return event.time;
  };

  const getCalendarBadge = (event: CalendarEvent) => {
    const calendar = calendars.find(cal => cal.id === event.calendar_id);
    return calendar || { name: event.calendar, color: event.color };
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96 p-0">
        <SheetHeader className="px-6 py-4 border-b border-border/40">
          <SheetTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <div>
              <div className="text-lg font-semibold">
                {format(selectedDate, 'EEEE', { locale })}
              </div>
              <div className="text-sm text-muted-foreground">
                {format(selectedDate, 'MMMM d, yyyy', { locale })}
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col h-full">
          {/* Search and Filters */}
          <div className="px-6 py-4 border-b border-border/40 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('calendar.searchEvents')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Calendar Filter */}
            {calendars.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {calendars.map(calendar => (
                  <Badge
                    key={calendar.id}
                    variant={selectedCalendars.includes(calendar.id) ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => {
                      setSelectedCalendars(prev => 
                        prev.includes(calendar.id)
                          ? prev.filter(id => id !== calendar.id)
                          : [...prev, calendar.id]
                      );
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full mr-1" 
                      style={{ backgroundColor: calendar.color }}
                    />
                    {calendar.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* View Options */}
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCompactMode(!compactMode)}
                className="text-xs"
              >
                {compactMode ? t('calendar.expandedView') : t('calendar.compactView')}
              </Button>
              <span className="text-xs text-muted-foreground">
                {filteredEvents.length} {filteredEvents.length === 1 ? t('calendar.event') : t('calendar.events')}
              </span>
            </div>
          </div>

          {/* Events List */}
          <ScrollArea className="flex-1 px-6">
            <div className="py-4 space-y-3">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">
                    {searchQuery || selectedCalendars.length > 0 
                      ? t('calendar.noEventsMatchFilter')
                      : t('calendar.noEventsThisDay')
                    }
                  </p>
                </div>
              ) : (
                filteredEvents.map(event => {
                  const calendarBadge = getCalendarBadge(event);
                  
                  return (
                    <Card key={event.id} className="shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className={`p-4 ${compactMode ? 'py-3' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatEventTime(event)}</span>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{ 
                              backgroundColor: calendarBadge.color + '20',
                              color: calendarBadge.color 
                            }}
                          >
                            {calendarBadge.name}
                          </Badge>
                        </div>

                        {!compactMode && event.description && (
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {event.description}
                          </p>
                        )}

                        {/* Quick Actions */}
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditEvent(event)}
                            className="h-8 px-2 text-xs"
                          >
                            <Pencil className="h-3 w-3 mr-1" />
                            {t('common.edit')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDuplicateEvent(event)}
                            className="h-8 px-2 text-xs"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            {t('common.duplicate')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteEvent(event)}
                            className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            {t('common.delete')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {/* Create Event Button */}
          <div className="p-6 border-t border-border/40">
            <Button
              onClick={() => onCreateEvent(selectedDate)}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('calendar.createEvent')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};