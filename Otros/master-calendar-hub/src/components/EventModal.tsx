import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Repeat, Bell, Trash2 } from "lucide-react";
import { CalendarEvent } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Calendar {
  id: string;
  name: string;
  color: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  availableCalendars: Calendar[];
  onSave?: (eventData: any) => void;
}

export const EventModal = ({ isOpen, onClose, event, availableCalendars, onSave }: EventModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCalendar, setSelectedCalendar] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [recurrence, setRecurrence] = useState("none");
  const [reminder, setReminder] = useState("15");
  const [loading, setLoading] = useState(false);

  const isEditing = !!event;

  useEffect(() => {
    if (event) {
      // Load event data from database
      const loadEventDetails = async () => {
        try {
          const { data: eventData, error } = await supabase
            .from('events')
            .select('*, reminders(*)')
            .eq('id', event.id)
            .single();

          if (error) throw error;

          setTitle(eventData.title);
          setDescription(eventData.description || "");
          setDate(new Date(eventData.start_ts).toISOString().split('T')[0]);
          
          if (!eventData.all_day) {
            const startTime = new Date(eventData.start_ts).toTimeString().slice(0, 5);
            const endTime = new Date(eventData.end_ts).toTimeString().slice(0, 5);
            setStartTime(startTime);
            setEndTime(endTime);
          }
          
          setLocation(eventData.location || "");
          setSelectedCalendar(eventData.calendar_id);
          setIsAllDay(eventData.all_day);
          
          // Map database recurrence_rule back to form values
          const recurrenceMapping = {
            'daily': 'daily',
            'weekdays': 'weekdays',
            'weekends': 'weekends', 
            'weekly': 'weekly', 
            'monthly': 'monthly',
            'yearly': 'yearly'
          };
          setRecurrence(eventData.recurrence_rule ? recurrenceMapping[eventData.recurrence_rule] || 'none' : 'none');
          
          // Load reminder if exists
          if (eventData.reminders && eventData.reminders.length > 0) {
            setReminder(eventData.reminders[0].minutes_before.toString());
          } else {
            setReminder("15");
          }
        } catch (error) {
          console.error('Error loading event details:', error);
          // Fallback to basic event data
          setTitle(event.title);
          setDescription(event.description || "");
          setDate(event.date.toISOString().split('T')[0]);
          setStartTime(event.time || "");
          setEndTime("");
          setLocation("");
          setSelectedCalendar(event.calendar_id);
          setIsAllDay(event.all_day);
          setRecurrence("none");
          setReminder("15");
        }
      };

      loadEventDetails();
    } else {
      // Reset form for new event
      setTitle("");
      setDescription("");
      setDate(new Date().toISOString().split('T')[0]);
      setStartTime("");
      setEndTime("");
      setLocation("");
      setSelectedCalendar(availableCalendars[0]?.id || "");
      setIsAllDay(false);
      setRecurrence("none");
      setReminder("15");
    }
  }, [event, availableCalendars]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (onSave) {
      // Calculate end time if not all day and start time is provided
      let calculatedEndTime = endTime;
      if (!isAllDay && startTime && !endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        start.setHours(start.getHours() + 1);
        calculatedEndTime = start.toTimeString().slice(0, 5);
      }

      const formData = {
        title,
        description,
        location,
        date,
        startTime: isAllDay ? "" : startTime,
        endTime: isAllDay ? "" : calculatedEndTime,
        allDay: isAllDay,
        calendarId: selectedCalendar,
        recurrence,
        reminder: parseInt(reminder)
      };
      await onSave(formData);
    }
    
    setLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!event) return;
    
    setLoading(true);
    try {
      // For recurring events, the ID format is "original-id-timestamp"
      // We need to extract just the original UUID part
      let eventIdToDelete = event.id;
      
      // Check if this is a recurring event instance (contains timestamp)
      if (event.id.includes('-') && event.id.split('-').length > 5) {
        // This is a recurring event, extract base UUID (first 5 parts of UUID)
        const parts = event.id.split('-');
        eventIdToDelete = parts.slice(0, 5).join('-');
      }
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventIdToDelete);
      
      if (error) throw error;
      
      onClose();
      window.location.reload(); // Refresh to update the calendar
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-border/40 shadow-strong">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <DialogTitle>
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isEditing ? 'Update event details' : 'Add a new event to your calendar'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Event Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-border/40 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-border/40 focus:ring-primary"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="all-day"
                checked={isAllDay}
                onCheckedChange={setIsAllDay}
              />
              <Label htmlFor="all-day" className="text-sm font-medium">
                All day
              </Label>
            </div>

            {!isAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time" className="text-sm font-medium">Start time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="pl-10 border-border/40 focus:ring-primary"
                      required={!isAllDay}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time" className="text-sm font-medium">End time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="pl-10 border-border/40 focus:ring-primary"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="calendar" className="text-sm font-medium">Calendar</Label>
            <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
              <SelectTrigger className="border-border/40">
                <SelectValue placeholder="Select a calendar" />
              </SelectTrigger>
              <SelectContent>
                {availableCalendars.map(calendar => (
                  <SelectItem key={calendar.id} value={calendar.id}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${calendar.color}`} />
                      <span>{calendar.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                type="text"
                placeholder="Add location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 border-border/40 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="Add event description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-border/40 focus:ring-primary min-h-[80px]"
            />
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recurrence" className="text-sm font-medium flex items-center space-x-2">
                <Repeat className="h-4 w-4" />
                <span>Repeat</span>
              </Label>
              <Select value={recurrence} onValueChange={setRecurrence}>
                <SelectTrigger className="border-border/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Does not repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekdays">Every weekday (Mon-Fri)</SelectItem>
                  <SelectItem value="weekends">Every weekend (Sat-Sun)</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder" className="text-sm font-medium flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Reminder</span>
              </Label>
              <Select value={reminder} onValueChange={setReminder}>
                <SelectTrigger className="border-border/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">At event time</SelectItem>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="1440">1 day before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-border/40">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            )}
            
            <div className={`flex space-x-3 ${!isEditing ? 'ml-auto' : ''}`}>
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-primary hover:opacity-90"
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};