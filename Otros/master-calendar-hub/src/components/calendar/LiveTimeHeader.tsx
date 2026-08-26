import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
export const LiveTimeHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const {
    settings
  } = useSettings();
  const {
    i18n
  } = useTranslation();
  const locale = i18n.language === 'es' ? es : enUS;

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const formatTime = (date: Date) => {
    if (settings.timeFormat === "24h") {
      return format(date, 'HH:mm:ss');
    } else {
      return format(date, 'h:mm:ss a');
    }
  };
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <Clock className="h-4 w-4" />
      <span>{formatTime(currentTime)}</span>
    </div>
  );
};
