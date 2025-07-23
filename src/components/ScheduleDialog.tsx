import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Staff {
  id: string;
  employee_id: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface WorkSchedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_working_day: boolean;
}

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: Staff | null;
}

const DAYS = [
  'Domenica',
  'Lunedì', 
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato'
];

export const ScheduleDialog = ({ open, onOpenChange, staff }: ScheduleDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState<WorkSchedule[]>([]);
  const { toast } = useToast();

  // Initialize schedules for all days
  useEffect(() => {
    if (staff && open) {
      fetchSchedules();
    }
  }, [staff, open]);

  const fetchSchedules = async () => {
    if (!staff) return;

    try {
      const { data, error } = await supabase
        .from('work_schedules')
        .select('*')
        .eq('staff_id', staff.id)
        .order('day_of_week');

      if (error) throw error;

      // Create default schedules for missing days
      const existingDays = new Set(data.map(s => s.day_of_week));
      const defaultSchedules: WorkSchedule[] = [];

      for (let day = 0; day < 7; day++) {
        if (existingDays.has(day)) {
          const schedule = data.find(s => s.day_of_week === day);
          defaultSchedules.push({
            day_of_week: day,
            start_time: schedule?.start_time || '09:00',
            end_time: schedule?.end_time || '17:00',
            is_working_day: schedule?.is_working_day ?? false,
          });
        } else {
          defaultSchedules.push({
            day_of_week: day,
            start_time: '09:00',
            end_time: '17:00',
            is_working_day: false,
          });
        }
      }

      setSchedules(defaultSchedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare gli orari",
        variant: "destructive",
      });
    }
  };

  const updateSchedule = (dayIndex: number, field: keyof WorkSchedule, value: any) => {
    setSchedules(prev => prev.map((schedule, index) => 
      index === dayIndex ? { ...schedule, [field]: value } : schedule
    ));
  };

  const handleSave = async () => {
    if (!staff) return;

    setLoading(true);
    try {
      // Delete existing schedules
      await supabase
        .from('work_schedules')
        .delete()
        .eq('staff_id', staff.id);

      // Insert new schedules (only for working days)
      const workingSchedules = schedules
        .filter(s => s.is_working_day)
        .map(s => ({
          staff_id: staff.id,
          day_of_week: s.day_of_week,
          start_time: s.start_time,
          end_time: s.end_time,
          is_working_day: s.is_working_day,
        }));

      if (workingSchedules.length > 0) {
        const { error } = await supabase
          .from('work_schedules')
          .insert(workingSchedules);

        if (error) throw error;
      }

      toast({
        title: "Successo",
        description: "Orari di lavoro salvati con successo",
      });

      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving schedules:', error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile salvare gli orari",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Gestione Orari - {staff?.profiles?.first_name} {staff?.profiles?.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {schedules.map((schedule, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  {DAYS[schedule.day_of_week]}
                  <Switch
                    checked={schedule.is_working_day}
                    onCheckedChange={(checked) => 
                      updateSchedule(index, 'is_working_day', checked)
                    }
                  />
                </CardTitle>
              </CardHeader>
              {schedule.is_working_day && (
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`start_${index}`}>Ora Inizio</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`start_${index}`}
                          type="time"
                          value={schedule.start_time}
                          onChange={(e) => updateSchedule(index, 'start_time', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`end_${index}`}>Ora Fine</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`end_${index}`}
                          type="time"
                          value={schedule.end_time}
                          onChange={(e) => updateSchedule(index, 'end_time', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Salvataggio..." : "Salva Orari"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};