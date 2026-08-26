import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Settings, 
  Pencil, 
  Trash2, 
  GripVertical,
  Eye,
  EyeOff,
  Palette
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { colorPresets } from "@/lib/colorPresets";

interface Calendar {
  id: string;
  name: string;
  description?: string;
  color: string;
  visible: boolean;
}

interface CalendarSidebarManagerProps {
  calendars: Calendar[];
  selectedCalendars: string[];
  onCalendarToggle: (calendarId: string) => void;
  onCreateCalendar: (calendar: { name: string; description?: string; color: string }) => void;
  onUpdateCalendar: (id: string, calendar: { name: string; description?: string; color: string; visible: boolean }) => void;
  onDeleteCalendar: (id: string) => void;
  onReorderCalendars: (calendars: Calendar[]) => void;
}

export const CalendarSidebarManager = ({
  calendars,
  selectedCalendars,
  onCalendarToggle,
  onCreateCalendar,
  onUpdateCalendar,
  onDeleteCalendar,
  onReorderCalendars
}: CalendarSidebarManagerProps) => {
  const { t } = useTranslation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<Calendar | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: colorPresets[0].value
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: colorPresets[0].value
    });
    setEditingCalendar(null);
  };

  const handleCreate = () => {
    if (formData.name.trim()) {
      onCreateCalendar({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color
      });
      setShowCreateDialog(false);
      resetForm();
    }
  };

  const handleEdit = (calendar: Calendar) => {
    setEditingCalendar(calendar);
    setFormData({
      name: calendar.name,
      description: calendar.description || "",
      color: calendar.color
    });
  };

  const handleUpdate = () => {
    if (editingCalendar && formData.name.trim()) {
      onUpdateCalendar(editingCalendar.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        visible: editingCalendar.visible
      });
      setEditingCalendar(null);
      resetForm();
    }
  };

  const handleVisibilityToggle = (calendar: Calendar) => {
    onUpdateCalendar(calendar.id, {
      ...calendar,
      visible: !calendar.visible
    });
    if (calendar.visible) {
      // If hiding, also unselect
      onCalendarToggle(calendar.id);
    }
  };

  return (
    <Card className="border-border/40 shadow-elegant bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>{t('calendar.myCalendars')}</span>
          </CardTitle>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('calendar.createCalendar')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('calendar.calendarName')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={t('calendar.enterCalendarName')}
                  />
                </div>
                <div>
                  <Label htmlFor="description">{t('calendar.description')} ({t('common.optional')})</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('calendar.enterDescription')}
                  />
                </div>
                <div>
                  <Label>{t('calendar.color')}</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {colorPresets.map(preset => (
                      <button
                        key={preset.value}
                        onClick={() => setFormData(prev => ({ ...prev, color: preset.value }))}
                        className={`
                          w-8 h-8 rounded-full border-2 transition-all duration-200
                          ${formData.color === preset.value 
                            ? 'border-primary scale-110' 
                            : 'border-border hover:scale-105'
                          }
                        `}
                        style={{ backgroundColor: preset.value }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button onClick={handleCreate} disabled={!formData.name.trim()}>
                    {t('common.create')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {calendars.map(calendar => (
          <div 
            key={calendar.id} 
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
            
            <Checkbox
              checked={selectedCalendars.includes(calendar.id) && calendar.visible}
              onCheckedChange={() => onCalendarToggle(calendar.id)}
              disabled={!calendar.visible}
              className="border-border/40"
            />
            
            <div 
              className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0" 
              style={{ backgroundColor: calendar.color }}
            />
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">
                {calendar.name}
              </div>
              {calendar.description && (
                <div className="text-xs text-muted-foreground truncate">
                  {calendar.description}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVisibilityToggle(calendar)}
                className="h-6 w-6 p-0"
                title={calendar.visible ? t('calendar.hideCalendar') : t('calendar.showCalendar')}
              >
                {calendar.visible ? (
                  <Eye className="h-3 w-3" />
                ) : (
                  <EyeOff className="h-3 w-3 text-muted-foreground" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(calendar)}
                className="h-6 w-6 p-0"
                title={t('common.edit')}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    title={t('common.delete')}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('calendar.deleteCalendar')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('calendar.deleteCalendarConfirm', { name: calendar.name })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDeleteCalendar(calendar.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {t('common.delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        
        {calendars.length === 0 && (
          <div className="text-center py-6">
            <Palette className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">
              {t('calendar.noCalendarsYet')}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="mt-2 text-primary"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('calendar.createFirst')}
            </Button>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingCalendar} onOpenChange={(open) => !open && setEditingCalendar(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('calendar.editCalendar')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">{t('calendar.calendarName')}</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('calendar.enterCalendarName')}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">{t('calendar.description')} ({t('common.optional')})</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t('calendar.enterDescription')}
                />
              </div>
              <div>
                <Label>{t('calendar.color')}</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {colorPresets.map(preset => (
                    <button
                      key={preset.value}
                      onClick={() => setFormData(prev => ({ ...prev, color: preset.value }))}
                      className={`
                        w-8 h-8 rounded-full border-2 transition-all duration-200
                        ${formData.color === preset.value 
                          ? 'border-primary scale-110' 
                          : 'border-border hover:scale-105'
                        }
                      `}
                      style={{ backgroundColor: preset.value }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingCalendar(null)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleUpdate} disabled={!formData.name.trim()}>
                  {t('common.save')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};