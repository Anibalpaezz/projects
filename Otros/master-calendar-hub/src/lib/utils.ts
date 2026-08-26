import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calendar event recurrence utility functions
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  calendar: string;
  color: string;
  description: string;
  start_ts: string;
  end_ts: string;
  all_day: boolean;
  calendar_id: string;
  recurrence_rule?: string | null;
}

// Generate recurring events based on recurrence rule
export function generateRecurringEvents(
  baseEvents: CalendarEvent[],
  viewDate: Date,
  view: 'day' | 'week' | 'month'
): CalendarEvent[] {
  const recurringEvents: CalendarEvent[] = [];
  
  // Calculate date range based on view
  let startDate: Date, endDate: Date;
  
  switch (view) {
    case 'day':
      startDate = new Date(viewDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(viewDate);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'week':
      startDate = new Date(viewDate);
      startDate.setDate(viewDate.getDate() - viewDate.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'month':
      startDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
      endDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
      // Extend to show full weeks
      startDate.setDate(startDate.getDate() - startDate.getDay());
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
      break;
  }

  baseEvents.forEach(event => {
    // Always include the original event
    recurringEvents.push(event);
    
    // If no recurrence rule, skip generating additional instances
    if (!event.recurrence_rule || event.recurrence_rule === 'none') {
      return;
    }

    const eventDate = new Date(event.start_ts);
    const eventDuration = new Date(event.end_ts).getTime() - new Date(event.start_ts).getTime();
    
    // Generate recurring instances
    let currentDate = new Date(eventDate);
    
    // For daily recurring events, start checking from the next day
    // For other types, start checking from the original date
    if (event.recurrence_rule === 'daily') {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    while (currentDate <= endDate) {
      let shouldInclude = false;
      let nextIncrement = 1; // Default increment in days
      
      switch (event.recurrence_rule) {
        case 'daily':
          shouldInclude = currentDate >= startDate;
          break;
        case 'weekdays':
          const weekday = currentDate.getDay();
          shouldInclude = (weekday >= 1 && weekday <= 5) && currentDate >= startDate; // Monday to Friday
          break;
        case 'weekends':
          const weekend = currentDate.getDay();
          shouldInclude = (weekend === 0 || weekend === 6) && currentDate >= startDate; // Saturday and Sunday
          break;
        case 'weekly':
          shouldInclude = currentDate.getDay() === eventDate.getDay() && currentDate >= startDate;
          break;
        case 'monthly':
          shouldInclude = currentDate.getDate() === eventDate.getDate() && currentDate >= startDate;
          // Skip to next month
          const nextMonth = new Date(currentDate);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          nextIncrement = Math.ceil((nextMonth.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
          break;
        case 'yearly':
          shouldInclude = (currentDate.getDate() === eventDate.getDate() && 
                          currentDate.getMonth() === eventDate.getMonth()) && currentDate >= startDate;
          // Skip to next year
          const nextYear = new Date(currentDate);
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          nextIncrement = Math.ceil((nextYear.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
          break;
        default:
          break;
      }
      
      // Add the recurring event if it should be included
      if (shouldInclude && currentDate.getTime() !== eventDate.getTime()) {
        const recurringEvent: CalendarEvent = {
          ...event,
          id: `${event.id}-${currentDate.getTime()}`, // Unique ID for recurring instance
          date: new Date(currentDate),
          start_ts: new Date(currentDate.getTime()).toISOString(),
          end_ts: new Date(currentDate.getTime() + eventDuration).toISOString(),
          time: event.all_day ? undefined : new Date(currentDate.getTime()).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        };
        
        recurringEvents.push(recurringEvent);
      }
      
      // Move to next date
      currentDate.setDate(currentDate.getDate() + nextIncrement);
    }
  });

  return recurringEvents;
}
