import { useState, useEffect } from "react";
import { Bell, BellOff, Clock, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = "conscientistas-study-reminder";
const REMINDER_SHOWN_KEY = "conscientistas-reminder-shown-today";

interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

const defaultSettings: ReminderSettings = {
  enabled: false,
  hour: 18,
  minute: 0,
};

const loadSettings = (): ReminderSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

const saveSettings = (settings: ReminderSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

const timeOptions = [
  { label: "Manha (8h)", hour: 8, minute: 0 },
  { label: "Almoco (12h)", hour: 12, minute: 0 },
  { label: "Tarde (15h)", hour: 15, minute: 0 },
  { label: "Noite (18h)", hour: 18, minute: 0 },
  { label: "Noite (20h)", hour: 20, minute: 0 },
];

export const StudyReminder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<ReminderSettings>(loadSettings);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setHasPermission(Notification.permission === "granted");
    }
  }, []);

  useEffect(() => {
    if (!settings.enabled) return;

    const checkReminder = () => {
      const now = new Date();
      const todayKey = now.toDateString();
      const shownToday = localStorage.getItem(REMINDER_SHOWN_KEY);

      if (shownToday === todayKey) return;

      if (now.getHours() === settings.hour && now.getMinutes() === settings.minute) {
        localStorage.setItem(REMINDER_SHOWN_KEY, todayKey);

        if (hasPermission) {
          new Notification("Hora de estudar! 📚", {
            body: "Sua trilha STEM esta te esperando no Conscientistas!",
            icon: "/favicon.ico",
          });
        }

        toast({
          title: "Hora de estudar! 📚",
          description: "Continue sua jornada STEM e ganhe mais XP!",
        });
      }
    };

    const interval = setInterval(checkReminder, 60_000);
    checkReminder();
    return () => clearInterval(interval);
  }, [settings, hasPermission]);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notificacoes nao suportadas",
        description: "Seu navegador nao suporta notificacoes.",
        variant: "destructive",
      });
      return;
    }

    const result = await Notification.requestPermission();
    setHasPermission(result === "granted");

    if (result === "granted") {
      toast({ title: "Notificacoes ativadas!" });
    }
  };

  const toggleReminder = (hour: number, minute: number) => {
    const isCurrentlySelected = settings.enabled && settings.hour === hour && settings.minute === minute;

    if (isCurrentlySelected) {
      const newSettings = { ...settings, enabled: false };
      setSettings(newSettings);
      saveSettings(newSettings);
      toast({ title: "Lembrete desativado" });
    } else {
      if (!hasPermission) {
        requestPermission();
      }
      const newSettings = { enabled: true, hour, minute };
      setSettings(newSettings);
      saveSettings(newSettings);
      toast({
        title: "Lembrete ativado!",
        description: `Voce sera lembrada todos os dias as ${hour}h${minute > 0 ? minute.toString().padStart(2, "0") : ""}.`,
      });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        aria-label="Lembretes de estudo"
      >
        {settings.enabled ? (
          <>
            <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-700" />
          </>
        ) : (
          <BellOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <Card className="absolute right-0 top-12 z-50 w-72 p-4 shadow-xl animate-pop-in dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                Lembrete de Estudo
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Escolha o melhor horario para estudar:
            </p>

            <div className="space-y-1.5">
              {timeOptions.map((opt) => {
                const isSelected = settings.enabled && settings.hour === opt.hour && settings.minute === opt.minute;
                return (
                  <button
                    key={`${opt.hour}-${opt.minute}`}
                    onClick={() => toggleReminder(opt.hour, opt.minute)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>

            {!hasPermission && settings.enabled && (
              <Button
                onClick={requestPermission}
                variant="outline"
                size="sm"
                className="w-full mt-3 text-xs"
              >
                Ativar notificacoes do navegador
              </Button>
            )}
          </Card>
        </>
      )}
    </div>
  );
};
