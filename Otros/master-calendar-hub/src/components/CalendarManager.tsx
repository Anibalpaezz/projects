import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { colorPresets } from "@/lib/colorPresets";

interface CalendarData {
  id: string;
  name: string;
  description?: string;
  color: string;
  visible: boolean;
  owner_id: string;
  is_primary: boolean;
}

interface CalendarManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onCalendarsChange: () => void;
}

export const CalendarManager = ({ isOpen, onClose, onCalendarsChange }: CalendarManagerProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [calendars, setCalendars] = useState<CalendarData[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<CalendarData | null>(null);
  const [deletingCalendar, setDeletingCalendar] = useState<CalendarData | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#3B82F6');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    visible: true
  });

  useEffect(() => {
    if (isOpen && user) {
      loadCalendars();
    }
  }, [isOpen, user]);

  const loadCalendars = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('calendars')
        .select('*')
        .order('is_primary', { ascending: false });

      if (error) throw error;
      setCalendars(data || []);
    } catch (error) {
      console.error('Error loading calendars:', error);
      toast({
        title: t('common.error'),
        description: t('errors.loadCalendars'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      visible: true
    });
    setEditingCalendar(null);
    setShowCreateForm(false);
    setShowColorPicker(false);
  };

  const handleCreate = () => {
    resetForm();
    setShowCreateForm(true);
  };

  const handleEdit = (calendar: CalendarData) => {
    setFormData({
      name: calendar.name,
      description: calendar.description || '',
      color: calendar.color,
      visible: calendar.visible
    });
    setEditingCalendar(calendar);
    setShowCreateForm(true);
  };

  const handleSave = async () => {
    if (!user || !formData.name.trim()) return;

    try {
      setLoading(true);
      
      if (editingCalendar) {
        // Update existing calendar
        const { error } = await supabase
          .from('calendars')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            color: formData.color,
            visible: formData.visible
          })
          .eq('id', editingCalendar.id);

        if (error) throw error;

        toast({
          title: t('common.success'),
          description: t('success.calendarUpdated')
        });
      } else {
        // Create new calendar
        const { error } = await supabase
          .from('calendars')
          .insert({
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            color: formData.color,
            visible: formData.visible,
            owner_id: user.id,
            is_primary: false
          });

        if (error) throw error;

        toast({
          title: t('common.success'),
          description: t('success.calendarCreated')
        });
      }

      await loadCalendars();
      onCalendarsChange();
      resetForm();
    } catch (error: any) {
      console.error('Error saving calendar:', error);
      toast({
        title: t('common.error'),
        description: editingCalendar ? t('errors.updateCalendar') : t('errors.createCalendar'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCalendar) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('calendars')
        .delete()
        .eq('id', deletingCalendar.id);

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('success.calendarDeleted')
      });

      await loadCalendars();
      onCalendarsChange();
      setDeletingCalendar(null);
    } catch (error: any) {
      console.error('Error deleting calendar:', error);
      toast({
        title: t('common.error'),
        description: t('errors.deleteCalendar'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (calendar: CalendarData) => {
    try {
      const { error } = await supabase
        .from('calendars')
        .update({ visible: !calendar.visible })
        .eq('id', calendar.id);

      if (error) throw error;

      await loadCalendars();
      onCalendarsChange();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl border-border/40 shadow-strong max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('calendars.manageCalendars')}</DialogTitle>
            <DialogDescription>
              {t('calendars.createCalendar')} • {t('calendars.editCalendar')} • {t('calendars.deleteCalendar')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{t('calendar.myCalendars')}</h3>
              <Button onClick={handleCreate} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t('calendar.addCalendar')}
              </Button>
            </div>

            {loading && calendars.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('common.loading')}
              </div>
            ) : calendars.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">{t('empty.noCalendars')}</p>
                <Button onClick={handleCreate} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('empty.createFirstCalendar')}
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {calendars.map((calendar) => (
                  <Card key={calendar.id} className="border-border/40">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full border border-white/20" 
                            style={{ backgroundColor: calendar.color }}
                          />
                          <CardTitle className="text-base">{calendar.name}</CardTitle>
                          {calendar.is_primary && (
                            <Badge variant="secondary" className="text-xs">
                              {t('calendars.personal')}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleVisibility(calendar)}
                          >
                            {calendar.visible ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(calendar)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {!calendar.is_primary && (
                            <Button
                              variant="ghost"  
                              size="sm"
                              onClick={() => setDeletingCalendar(calendar)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {calendar.description && (
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground">{calendar.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Calendar Dialog */}
      <Dialog open={showCreateForm} onOpenChange={resetForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCalendar ? t('calendars.editCalendar') : t('calendars.createCalendar')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('calendars.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('calendars.name')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('calendars.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('calendars.description')}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('calendars.color')}</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    {showColorPicker ? t('calendars.colorPresets') : t('calendars.customColor')}
                  </Button>
                  <div 
                    className="w-8 h-8 rounded border border-border" 
                    style={{ backgroundColor: formData.color }}
                  />
                </div>

                {showColorPicker ? (
                  <div className="space-y-2">
                    <Input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        setFormData({ ...formData, color: e.target.value });
                      }}
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-8 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        className={`w-8 h-8 rounded border-2 transition-all ${
                          formData.color === preset.value 
                            ? 'border-primary scale-110' 
                            : 'border-border hover:scale-105'
                        }`}
                        style={{ backgroundColor: preset.value }}
                        onClick={() => setFormData({ ...formData, color: preset.value })}
                        title={preset.name}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="visible">{t('calendars.visibility')}</Label>
              <Switch
                id="visible"
                checked={formData.visible}
                onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={resetForm}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim() || loading}>
              {editingCalendar ? t('common.save') : t('common.create')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCalendar} onOpenChange={() => setDeletingCalendar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('calendars.deleteCalendar')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('calendars.deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};