import { useState, useEffect } from "react";
import { CalendarView } from "@/pages/Calendar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

export interface UserSettings {
  theme: "light" | "dark" | "system";
  defaultView: CalendarView;
  timeFormat: "12h" | "24h";
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
  notifications: boolean;
  language: string;
  locale: string;
}

const defaultSettings: UserSettings = {
  theme: "system",
  defaultView: "month",
  timeFormat: "24h",
  weekStartsOn: 1, // Monday
  notifications: true,
  language: "en",
  locale: "en-US",
};

export const useSettings = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState<UserSettings>(() => {
    if (user) return defaultSettings; // Will be loaded from DB
    
    try {
      const saved = localStorage.getItem("masterCalendar_settings");
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Load settings from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const dbSettings: UserSettings = {
          theme: data.theme as "light" | "dark" | "system",
          defaultView: data.default_view as CalendarView,
          timeFormat: data.time_format as "12h" | "24h",
          weekStartsOn: data.week_starts_on as 0 | 1 | 2 | 3 | 4 | 5 | 6,
          notifications: true, // Default since not in DB
          language: data.language || 'en',
          locale: data.locale || 'en-US',
        };
        setSettings(dbSettings);
        // Update i18n language
        if (data.language && data.language !== i18n.language) {
          i18n.changeLanguage(data.language);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    // Update i18n language if changed
    if (newSettings.language && newSettings.language !== i18n.language) {
      i18n.changeLanguage(newSettings.language);
    }

    if (user) {
      // Save to Supabase
      try {
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            theme: updatedSettings.theme,
            default_view: updatedSettings.defaultView,
            week_starts_on: updatedSettings.weekStartsOn,
            time_format: updatedSettings.timeFormat,
            language: updatedSettings.language,
            locale: updatedSettings.locale,
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    } else {
      // Save to localStorage for guests
      localStorage.setItem("masterCalendar_settings", JSON.stringify(updatedSettings));
    }
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const applySystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
        root.classList.toggle("dark", e.matches);
      };
      
      applySystemTheme(mediaQuery);
      mediaQuery.addEventListener("change", applySystemTheme);
      
      return () => mediaQuery.removeEventListener("change", applySystemTheme);
    } else {
      root.classList.toggle("dark", settings.theme === "dark");
    }
  }, [settings.theme]);

  return { settings, updateSettings };
};

export const formatTime = (date: Date, format: "12h" | "24h" = "12h", locale: string = "en-US") => {
  const localeMap: { [key: string]: string } = {
    'en': 'en-US',
    'es': 'es-ES'
  };
  
  const targetLocale = localeMap[locale] || locale;
  
  if (format === "24h") {
    return date.toLocaleTimeString(targetLocale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } else {
    return date.toLocaleTimeString(targetLocale, {
      hour: "2-digit",
      minute: "2-digit", 
      second: "2-digit",
      hour12: true,
    });
  }
};