import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarPlus, Palette } from "lucide-react";
import { colorPresets } from "@/lib/colorPresets";

interface CreateCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (calendarData: { name: string; color: string }) => void;
}

export const CreateCalendarModal = ({ isOpen, onClose, onSave }: CreateCalendarModalProps) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [loading, setLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#3B82F6');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        color: selectedColor
      });
      
      // Reset form
      setName("");
      setSelectedColor('#3B82F6');
      setShowColorPicker(false);
      setCustomColor('#3B82F6');
      onClose();
    } catch (error) {
      console.error('Error creating calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName("");
      setSelectedColor('#3B82F6');
      setShowColorPicker(false);
      setCustomColor('#3B82F6');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-border/40 shadow-strong">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <CalendarPlus className="h-5 w-5 text-primary" />
            <DialogTitle>Create New Calendar</DialogTitle>
          </div>
          <DialogDescription>
            Add a new calendar to organize your events
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="calendar-name" className="text-sm font-medium">
              Calendar Name
            </Label>
            <Input
              id="calendar-name"
              type="text"
              placeholder="e.g., Work, Personal, Family"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border/40 focus:ring-primary"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Color</span>
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  {showColorPicker ? 'Color Presets' : 'Custom Color'}
                </Button>
                <div 
                  className="w-8 h-8 rounded border border-border" 
                  style={{ backgroundColor: selectedColor }}
                />
              </div>

              {showColorPicker ? (
                <div className="space-y-2">
                  <Input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setSelectedColor(e.target.value);
                    }}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-8 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      className={`w-8 h-8 rounded border-2 transition-all ${
                        selectedColor === preset.value 
                          ? 'border-primary scale-110' 
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: preset.value }}
                      onClick={() => setSelectedColor(preset.value)}
                      title={preset.name}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border/40">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:opacity-90"
              disabled={loading || !name.trim()}
            >
              {loading ? 'Creating...' : 'Create Calendar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};