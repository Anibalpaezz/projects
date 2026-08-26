import { CalendarView } from "@/pages/Calendar";
import { CalendarEvent } from "@/lib/utils";
import { useSettings } from "@/hooks/useSettings";
import { WeekViewCollisionHandler } from "./WeekViewCollisionHandler";

interface CalendarGridProps {
  currentDate: Date;
  view: CalendarView;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick?: (date: Date) => void;
  onCreateEvent?: (date: Date, hour?: number) => void;
}

export const CalendarGrid = ({ currentDate, view, events, onEventClick, onDayClick, onCreateEvent }: CalendarGridProps) => {
  const { settings } = useSettings();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startingDayOfWeek = firstDay.getDay();
    
    // Adjust starting day based on week start setting
    startingDayOfWeek = (startingDayOfWeek - settings.weekStartsOn + 7) % 7;

    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    
    // Calculate the difference to get to the start of the week
    let diff = day - settings.weekStartsOn;
    if (diff < 0) diff += 7;
    
    startOfWeek.setDate(startOfWeek.getDate() - diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push(currentDay);
    }
    return days;
  };

  const getDayHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
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

  const formatEventTime = (timeString: string) => {
    if (!timeString) return '';
    
    // Parse the time string
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!timeMatch) return timeString;
    
    let hour = parseInt(timeMatch[1]);
    const minute = parseInt(timeMatch[2]);
    const ampm = timeMatch[3]?.toUpperCase();
    
    // Convert to 24-hour format first
    if (ampm === 'PM' && hour !== 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    
    // Format according to user preference
    if (settings.timeFormat === "24h") {
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    } else {
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? 'PM' : 'AM';
      return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
    }
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  // Adjust week days based on week start setting
  const allWeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDaysLabels = [];
  for (let i = 0; i < 7; i++) {
    weekDaysLabels.push(allWeekDays[(settings.weekStartsOn + i) % 7]);
  }

  if (view === 'week') {
    const weekDays = getWeekDays(currentDate);
    
    return (
      <div className="p-4">
        {/* Week headers */}
        <div className="grid grid-cols-8 gap-2 mb-4">
          <div className="p-2"></div> {/* Empty cell for time column */}
          {weekDays.map((day, index) => (
            <div key={index} className="p-2 text-center">
              <div className="font-medium text-muted-foreground text-sm">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-bold ${isToday(day) ? 'text-primary' : 'text-foreground'}`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Week grid */}
        <div className="grid grid-cols-8 gap-2">
          {getDayHours().map((hour) => (
            <div key={`row-${hour}`} className="contents">
              {/* Time column */}
              <div className="p-2 text-right text-sm text-muted-foreground font-medium">
                {formatHour(hour)}
              </div>
              {/* Day columns */}
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDate(day).filter(event => {
                  if (!event.time) return hour === 9; // Default to 9 AM for events without time
                  const eventHour = parseInt(event.time.split(':')[0]);
                  const isPM = event.time.toLowerCase().includes('pm');
                  const actualHour = isPM && eventHour !== 12 ? eventHour + 12 : 
                                  !isPM && eventHour === 12 ? 0 : eventHour;
                  return actualHour === hour;
                });
                
                return (
                  <div
                    key={`${hour}-${dayIndex}`}
                    className={`
                      h-12 border border-border/20 rounded relative hover:bg-secondary/30 transition-colors cursor-pointer
                      ${isToday(day) && hour === new Date().getHours() ? 'bg-primary/5 border-primary/30' : ''}
                    `}
                    onClick={() => onDayClick?.(day)}
                    onDoubleClick={() => onCreateEvent?.(day, hour)}
                  >
                    <WeekViewCollisionHandler 
                      events={dayEvents} 
                      onEventClick={onEventClick}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'day') {
    const hours = getDayHours();
    const dayEvents = getEventsForDate(currentDate);
    
    return (
      <div className="p-4">
        {/* Day header */}
        <div className="mb-6 text-center">
          <div className="text-sm font-medium text-muted-foreground">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
          </div>
          <div className={`text-2xl font-bold ${isToday(currentDate) ? 'text-primary' : 'text-foreground'}`}>
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>

        {/* Day timeline */}
        <div className="space-y-0">
          {hours.map((hour) => {
            const hourEvents = dayEvents.filter(event => {
              if (!event.time) return hour === 9; // Default to 9 AM
              const eventHour = parseInt(event.time.split(':')[0]);
              const isPM = event.time.toLowerCase().includes('pm');
              const actualHour = isPM && eventHour !== 12 ? eventHour + 12 : 
                              !isPM && eventHour === 12 ? 0 : eventHour;
              return actualHour === hour;
            });

            return (
              <div key={hour} className="flex border-b border-border/20">
                <div className="w-20 text-right pr-4 py-3 text-sm text-muted-foreground font-medium">
                  {formatHour(hour)}
                </div>
                <div className={`
                  flex-1 min-h-[60px] p-2 relative hover:bg-secondary/30 transition-colors cursor-pointer
                  ${isToday(currentDate) && hour === new Date().getHours() ? 'bg-primary/5' : ''}
                `}
                onDoubleClick={() => onCreateEvent?.(currentDate, hour)}
                >
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className={`
                        p-2 mb-1 rounded text-white cursor-pointer
                        hover:opacity-80 transition-opacity ${event.color}
                      `}
                    >
                      <div className="font-medium">{event.title}</div>
                      {event.description && (
                        <div className="text-xs opacity-90 mt-1">{event.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Month view
  const days = getDaysInMonth(currentDate);

  return (
    <div className="p-4">
      {/* Week headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDaysLabels.map(day => (
          <div key={day} className="p-2 text-center font-medium text-muted-foreground text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          
          return (
            <div
              key={index}
              className={`
                min-h-[120px] p-2 border border-border/20 rounded-lg transition-all duration-300
                ${date ? 'hover:bg-secondary/50 cursor-pointer' : 'bg-muted/20'}
                ${isToday(date) ? 'bg-primary/10 border-primary/30' : ''}
              `}
              onClick={() => date && onDayClick?.(date)}
              onDoubleClick={() => date && onCreateEvent?.(date)}
            >
              {date && (
                <>
                  <div className={`
                    text-sm font-medium mb-2
                    ${isToday(date) ? 'text-primary font-bold' : 'text-foreground'}
                  `}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={`
                          text-xs p-1 rounded text-white cursor-pointer
                          hover:opacity-80 transition-opacity duration-200
                          ${event.color}
                        `}
                      >
                        {event.time && (
                          <div className="font-medium">{formatEventTime(event.time)}</div>
                        )}
                        <div className="truncate">{event.title}</div>
                      </div>
                    ))}
                    
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};