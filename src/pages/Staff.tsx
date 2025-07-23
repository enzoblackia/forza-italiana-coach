import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Clock, Award } from "lucide-react";
import { StaffList } from "@/components/StaffList";
import { AddStaffDialog } from "@/components/AddStaffDialog";
import { ScheduleDialog } from "@/components/ScheduleDialog";
import { supabase } from "@/integrations/supabase/client";

interface Staff {
  id: string;
  employee_id: string;
  position: string;
  department: string;
  hire_date: string;
  status: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  } | null;
}

const Staff = () => {
  const [staffStats, setStaffStats] = useState({
    total: 0,
    newHires: 0,
    totalHours: 0,
    performance: 92
  });
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchStats = async () => {
    try {
      // Get total staff count
      const { count: totalCount } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get new hires this month
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
      const { count: newHiresCount } = await supabase
        .from('staff')
        .select('*', { count: 'exact', head: true })
        .gte('hire_date', `${currentMonth}-01`)
        .eq('status', 'active');

      // Get total hours this week (placeholder calculation)
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const { data: timeLogs } = await supabase
        .from('time_logs')
        .select('total_hours')
        .gte('date', startOfWeek.toISOString().split('T')[0])
        .lte('date', endOfWeek.toISOString().split('T')[0]);

      const totalHours = timeLogs?.reduce((sum, log) => sum + (log.total_hours || 0), 0) || 0;

      setStaffStats({
        total: totalCount || 0,
        newHires: newHiresCount || 0,
        totalHours: Math.round(totalHours),
        performance: 92 // Placeholder
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    // TODO: Implement edit functionality
  };

  const handleScheduleStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setShowScheduleDialog(true);
  };

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Gestione Staff</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Totale</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.total}</div>
            <p className="text-xs text-muted-foreground">Membri attivi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuove Assunzioni</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.newHires}</div>
            <p className="text-xs text-muted-foreground">Questo mese</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ore Lavorate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">Questa settimana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staffStats.performance}%</div>
            <p className="text-xs text-muted-foreground">Soddisfazione media</p>
          </CardContent>
        </Card>
      </div>

      <StaffList
        onEdit={handleEditStaff}
        onSchedule={handleScheduleStaff}
        onAdd={() => setShowAddDialog(true)}
        refreshTrigger={refreshTrigger}
      />

      <AddStaffDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={handleSuccess}
      />

      <ScheduleDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        staff={selectedStaff}
      />
    </div>
  );
};

export default Staff;