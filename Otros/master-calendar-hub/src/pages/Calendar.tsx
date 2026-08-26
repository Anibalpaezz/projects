import { useState, useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar as CalendarIcon, 
  Plus
} from "lucide-react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { CalendarSidebarManager } from "@/components/calendar/CalendarSidebarManager";
import { DaySummaryPanel } from "@/components/calendar/DaySummaryPanel";
import { LiveTimeHeader } from "@/components/calendar/LiveTimeHeader";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { EventModal } from "@/components/EventModal";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CalendarEvent, generateRecurringEvents } from "@/lib/utils";
import { BackToHome } from "@/components/BackToHome";

export type CalendarView = 'month' | 'week' | 'day';

interface CalendarData {
  id: string;
  name: string;
  description?: string;
  color: string;
  visible: boolean;
  owner_id: string;
}

const Calendar = () => {
  const { settings } = useSettings();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(() => settings.defaultView);
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDaySummary, setShowDaySummary] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendars, setCalendars] = useState<CalendarData[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const locale = i18n.language === 'es' ? es : enUS;

  // Load user's calendars and events
  useEffect(() => {
    if (user) {
      loadCalendars();
      loadEvents();
    } else {
      // For non-authenticated users, show empty calendar
      setCalendars([]);
      setEvents([]);
      setSelectedCalendars([]);
      setLoadingData(false);
    }
  }, [user]);

  const loadCalendars = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('calendars')
        .select('*')
        .order('is_primary', { ascending: false });

      if (error) throw error;

      setCalendars(data || []);
      setSelectedCalendars(data?.filter(cal => cal.visible).map(cal => cal.id) || []);
    } catch (error) {
      console.error('Error loading calendars:', error);
      toast({
        title: t('common.error'),
        description: t('errors.loadCalendars'),
        variant: "destructive"
      });
    }
  };

  const loadEvents = async () => {
    if (!user) return;

    try {
      setLoadingData(true);
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          calendars (
            name,
            color
          )
        `)
        .order('start_ts', { ascending: true });

      if (error) throw error;

      const formattedEvents: CalendarEvent[] = (data || []).map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.start_ts),
        time: event.all_day ? undefined : new Date(event.start_ts).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        calendar: event.calendars?.name || 'Unknown',
        color: event.calendars?.color || 'bg-blue-500',
        description: event.description || '',
        start_ts: event.start_ts,
        end_ts: event.end_ts,
        all_day: event.all_day,
        calendar_id: event.calendar_id,
        recurrence_rule: event.recurrence_rule
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: t('common.error'),
        description: t('errors.loadEvents'),
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowDaySummary(true);
  };

  const handleCreateEventForDay = (date: Date, hour?: number) => {
    const startTime = hour !== undefined ? formatHour(hour) : '09:00 AM';
    const startDate = new Date(date);
    if (startTime !== '09:00 AM') {
      const [hours, minutes] = startTime.replace(/[AP]M/, '').split(':');
      let hourNum = parseInt(hours);
      if (startTime.includes('PM') && hourNum !== 12) hourNum += 12;
      if (startTime.includes('AM') && hourNum === 12) hourNum = 0;
      startDate.setHours(hourNum, parseInt(minutes || '0'));
    } else {
      startDate.setHours(9, 0);
    }
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    const newEvent: CalendarEvent = {
      id: '',
      title: '',
      description: '',
      date: date,
      time: startTime,
      start_ts: startDate.toISOString(),
      end_ts: endDate.toISOString(),
      all_day: false,
      calendar_id: selectedCalendars.length > 0 ? selectedCalendars[0] : calendars[0]?.id || '',
      calendar: selectedCalendars.length > 0 ? 
        calendars.find(c => c.id === selectedCalendars[0])?.name || 'Default' : 
        calendars[0]?.name || 'Default',
      color: 'bg-blue-500'
    };
    setSelectedEvent(newEvent);
    setShowEventModal(true);
    setShowDaySummary(false);
  };

  const formatHour = (hour: number) => {
    if (settings.timeFormat === "24h") {
      return `${hour.toString().padStart(2, "0")}:00`;
    } else {
      if (hour === 0) return "12:00 AM";
      if (hour === 12) return "12:00 PM";
      if (hour < 12) return `${hour}:00 AM`;
      return `${hour - 12}:00 PM`;
    }
  };

  const handleCalendarCreate = async (calendarData: { name: string; color: string }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('calendars')
        .insert({
          name: calendarData.name,
          color: calendarData.color,
          owner_id: user.id,
          is_primary: false
        });

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('success.calendarCreated')
      });

      loadCalendars(); // Reload calendars
    } catch (error: any) {
      console.error('Error creating calendar:', error);
      toast({
        title: t('common.error'),
        description: error.message || t('errors.createCalendar'),
        variant: "destructive"
      });
    }
  };

  const handleEventSave = async (eventData: any) => {
    if (!user) return;

    try {
      const startDate = new Date(eventData.date);
      if (eventData.startTime && !eventData.allDay) {
        const [hours, minutes] = eventData.startTime.split(':');
        startDate.setHours(parseInt(hours), parseInt(minutes));
      }

      const endDate = new Date(startDate);
      if (eventData.allDay) {
        endDate.setDate(endDate.getDate() + 1);
      } else if (eventData.endTime) {
        const endDateTime = new Date(eventData.date);
        const [endHours, endMinutes] = eventData.endTime.split(':');
        endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));
        endDate.setTime(endDateTime.getTime());
      } else {
        endDate.setHours(endDate.getHours() + 1);
      }

      const eventPayload = {
        title: eventData.title,
        description: eventData.description || null,
        location: eventData.location || null,
        start_ts: startDate.toISOString(),
        end_ts: endDate.toISOString(),
        all_day: eventData.allDay || false,
        calendar_id: eventData.calendarId,
        created_by: user.id,
        recurrence_rule: eventData.recurrence !== 'none' ? eventData.recurrence : null
      };

      if (selectedEvent) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(eventPayload)
          .eq('id', selectedEvent.id);

        if (error) throw error;

        // Handle reminders for updated event
        if (eventData.reminder && parseInt(eventData.reminder) > 0) {
          // Delete existing reminders and create new one
          await supabase
            .from('reminders')
            .delete()
            .eq('event_id', selectedEvent.id);

          await supabase
            .from('reminders')
            .insert({
              event_id: selectedEvent.id,
              minutes_before: parseInt(eventData.reminder),
              method: 'popup'
            });
        }

        toast({
          title: t('common.success'),
          description: t('success.eventUpdated')
        });
      } else {
        // Create new event
        const { data: newEvent, error } = await supabase
          .from('events')
          .insert(eventPayload)
          .select()
          .single();

        if (error) throw error;

        // Handle reminders for new event
        if (eventData.reminder && parseInt(eventData.reminder) > 0 && newEvent) {
          await supabase
            .from('reminders')
            .insert({
              event_id: newEvent.id,
              minutes_before: parseInt(eventData.reminder),
              method: 'popup'
            });
        }

        toast({
          title: t('common.success'),
          description: t('success.eventCreated')
        });
      }

      loadEvents(); // Reload events
      setShowEventModal(false);
      setSelectedEvent(null);
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast({
        title: t('common.error'),
        description: error.message || t('errors.createEvent'),
        variant: "destructive"
      });
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Filter events by selected calendars and generate recurring events
  const filteredEvents = useMemo(() => {
    const baseEvents = events.filter(event => selectedCalendars.includes(event.calendar_id));
    return generateRecurringEvents(baseEvents, currentDate, view);
  }, [events, selectedCalendars, currentDate, view]);

  const availableCalendars = calendars.map(cal => ({
    id: cal.id,
    name: cal.name,
    color: cal.color || 'bg-blue-500'
  }));

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <CalendarIcon className="h-8 w-8 text-primary animate-pulse mx-auto mb-2" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
      {/* Left: New Event Button */}
      <div className="flex items-center space-x-4">
        <BackToHome variant="back" className="shadow-soft hover:shadow-medium" />
        {user && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEventModal(true)}
            className="shadow-soft hover:shadow-medium transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('calendar.newEvent')}
          </Button>
        )}
      </div>
          
          {/* Center: Brand name and Live Time */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">{t('calendar.title')}</h1>
            </div>
            <LiveTimeHeader />
          </div>
          
          {/* Right: Profile */}
          <div className="flex items-center space-x-4">
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="flex">
        {/* Left Sidebar - Calendar Manager */}
        <div className="w-80 p-6 border-r border-border/40 bg-background/50">
          <CalendarSidebarManager
            calendars={calendars.map(cal => ({ ...cal, visible: selectedCalendars.includes(cal.id) }))}
            selectedCalendars={selectedCalendars}
            onCalendarToggle={(calendarId) => {
              setSelectedCalendars(prev => 
                prev.includes(calendarId) 
                  ? prev.filter(id => id !== calendarId)
                  : [...prev, calendarId]
              );
            }}
            onCreateCalendar={handleCalendarCreate}
            onUpdateCalendar={(id, data) => {
              // Update calendar logic
              console.log('Update calendar:', id, data);
            }}
            onDeleteCalendar={(id) => {
              // Delete calendar logic
              console.log('Delete calendar:', id);
            }}
            onReorderCalendars={(reorderedCalendars) => {
              // Reorder logic
              console.log('Reorder calendars:', reorderedCalendars);
            }}
          />
        </div>

        {/* Main Calendar Content */}
        <div className="flex-1">
          {/* Calendar Navigation */}
          <CalendarHeader 
            currentDate={currentDate}
            view={view}
            onViewChange={setView}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
          />

          {/* Calendar Grid */}
          <CalendarGrid
            currentDate={currentDate}
            view={view}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onDayClick={handleDayClick}
            onCreateEvent={handleCreateEventForDay}
          />
        </div>
      </div>

      {/* Day Summary Panel */}
      <DaySummaryPanel
        isOpen={showDaySummary}
        onClose={() => setShowDaySummary(false)}
        selectedDate={selectedDate}
        events={filteredEvents}
        onCreateEvent={handleCreateEventForDay}
        onEditEvent={(event) => {
          setSelectedEvent(event);
          setShowEventModal(true);
        }}
        onDeleteEvent={(event) => {
          console.log('Delete event:', event);
        }}
        onDuplicateEvent={(event) => {
          console.log('Duplicate event:', event);
        }}
        calendars={availableCalendars}
      />

      {/* Event Modal */}
      <EventModal 
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        availableCalendars={availableCalendars}
        onSave={user ? handleEventSave : undefined}
      />
    </div>
  );
};

export default Calendar;