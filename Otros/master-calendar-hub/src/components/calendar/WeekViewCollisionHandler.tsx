import { useMemo } from "react";
import { CalendarEvent } from "@/lib/utils";

interface EventWithPosition extends CalendarEvent {
  top: number;
  height: number;
  left: number;
  width: number;
  zIndex: number;
}

interface WeekViewCollisionHandlerProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export const WeekViewCollisionHandler = ({ events, onEventClick }: WeekViewCollisionHandlerProps) => {
  const positionedEvents = useMemo(() => {
    const positioned: EventWithPosition[] = [];
    
    if (events.length === 0) return positioned;
    
    // For overlapping events in the same time slot, position them side by side
    const eventCount = events.length;
    const eventWidth = eventCount > 1 ? Math.floor(90 / eventCount) : 90; // Share width if overlapping
    
    events.forEach((event, index) => {
      const positionedEvent: EventWithPosition = {
        ...event,
        top: 2, // Fixed top position within the cell
        height: 32, // Fixed height that fits in the cell
        left: index * (eventWidth + 1), // Side-by-side positioning with small gap
        width: eventWidth,
        zIndex: 10 + index
      };
      
      positioned.push(positionedEvent);
    });
    
    return positioned;
  }, [events]);

  if (events.length === 0) return null;

  return (
    <>
      {positionedEvents.map(event => (
        <div
          key={event.id}
          onClick={(e) => {
            e.stopPropagation();
            onEventClick(event);
          }}
          className={`
            absolute text-xs p-1 rounded text-white cursor-pointer
            hover:opacity-80 transition-all duration-200 hover:scale-105
            ${event.color} shadow-sm hover:shadow-md
          `}
          style={{
            top: `${event.top}px`,
            left: `${event.left}%`,
            width: `${event.width}%`,
            height: `${event.height}px`,
            zIndex: event.zIndex,
            minWidth: '40px'
          }}
          title={`${event.title}${event.time ? ` at ${event.time}` : ''}`}
        >
          <div className="font-medium truncate text-xs leading-tight">{event.title}</div>
          {event.time && events.length === 1 && (
            <div className="text-xs opacity-90 truncate leading-tight">{event.time}</div>
          )}
        </div>
      ))}
    </>
  );
};