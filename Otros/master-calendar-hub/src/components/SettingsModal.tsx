import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, Palette, Bell, Calendar, Monitor, Sun, Moon, Globe } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useTranslation } from "react-i18next";
import type { CalendarView } from "@/pages/Calendar";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();

  const handleSave = () => {
    // Settings are already saved automatically when changed
    onClose();
  };

  const weekStartOptions = [
    { value: 0, label: t('calendar.days.sunday') },
    { value: 1, label: t('calendar.days.monday') },
    { value: 2, label: t('calendar.days.tuesday') },
    { value: 3, label: t('calendar.days.wednesday') },
    { value: 4, label: t('calendar.days.thursday') },
    { value: 5, label: t('calendar.days.friday') },
    { value: 6, label: t('calendar.days.saturday') },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg border-border/40 shadow-strong max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="h-5 w-5 text-primary" />
            <DialogTitle>{t('settings.title')}</DialogTitle>
          </div>
          <DialogDescription>
            {t('settings.subtitle')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">{t('settings.theme')}</Label>
            </div>
            <RadioGroup 
              value={settings.theme} 
              onValueChange={(value: "light" | "dark" | "system") => 
                updateSettings({ theme: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="light" className="text-sm">{t('settings.themeOptions.light')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Moon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="dark" className="text-sm">{t('settings.themeOptions.dark')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="system" className="text-sm">{t('settings.themeOptions.system')}</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Language Settings */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">{t('settings.language')}</Label>
            </div>
            <Select 
              value={settings.language} 
              onValueChange={(value: string) => updateSettings({ language: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('settings.languageOptions.en')}</SelectItem>
                <SelectItem value="es">{t('settings.languageOptions.es')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">{t('settings.notifications')}</Label>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-sm">
                {t('settings.enableNotifications')}
              </Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSettings({ notifications: checked })}
              />
            </div>
          </div>

          {/* Calendar Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">{t('settings.calendarSettings')}</Label>
            </div>
            
            <div className="space-y-4 pl-6">
              {/* Default View */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  {t('settings.defaultView')}
                </Label>
                <Select 
                  value={settings.defaultView} 
                  onValueChange={(value: CalendarView) => updateSettings({ defaultView: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">{t('calendar.views.month')}</SelectItem>
                    <SelectItem value="week">{t('calendar.views.week')}</SelectItem>
                    <SelectItem value="day">{t('calendar.views.day')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Format */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  {t('settings.timeFormat')}
                </Label>
                <Select 
                  value={settings.timeFormat} 
                  onValueChange={(value: "12h" | "24h") => updateSettings({ timeFormat: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">{t('settings.timeFormatOptions.12h')}</SelectItem>
                    <SelectItem value="24h">{t('settings.timeFormatOptions.24h')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Week Starts On */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  {t('settings.weekStartsOn')}
                </Label>
                <Select 
                  value={settings.weekStartsOn.toString()} 
                  onValueChange={(value) => updateSettings({ weekStartsOn: parseInt(value) as 0 | 1 | 2 | 3 | 4 | 5 | 6 })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weekStartOptions.map(option => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border/40">
          <Button variant="outline" onClick={onClose}>
            {t('common.close')}
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
            {t('settings.saveChanges')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};