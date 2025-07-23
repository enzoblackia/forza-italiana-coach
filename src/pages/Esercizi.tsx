import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Target, Timer, TrendingUp } from "lucide-react";
import { ExerciseList } from "@/components/ExerciseList";
import { AddExerciseDialog } from "@/components/AddExerciseDialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Exercise {
  id: string;
  name: string;
  description: string | null;
  muscle_groups: string[];
  difficulty_level: string;
  equipment: string | null;
  video_url: string | null;
  instructions: string | null;
  sets: number;
  reps: string;
  rest_time: number;
  is_public: boolean;
  created_at: string;
}

const Esercizi = () => {
  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    mostUsed: "Squat",
    avgDuration: 45
  });
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isAdmin } = useAuth();

  const fetchStats = async () => {
    try {
      // Get total exercises count
      const { count: totalCount } = await supabase
        .from('exercises')
        .select('*', { count: 'exact', head: true });

      // Get unique muscle groups count
      const { data: exercisesData } = await supabase
        .from('exercises')
        .select('muscle_groups');

      const allMuscleGroups = new Set();
      exercisesData?.forEach(exercise => {
        exercise.muscle_groups?.forEach((group: string) => allMuscleGroups.add(group));
      });

      setStats({
        total: totalCount || 0,
        categories: allMuscleGroups.size,
        mostUsed: "Squat", // Placeholder
        avgDuration: 45 // Placeholder
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const handleEditExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    // TODO: Implement edit functionality
  };

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Libreria Esercizi</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Esercizi</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Disponibili</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gruppi Muscolari</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-xs text-muted-foreground">Categorie</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Più Utilizzato</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mostUsed}</div>
            <p className="text-xs text-muted-foreground">89% dei programmi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durata Media</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDuration}min</div>
            <p className="text-xs text-muted-foreground">Per sessione</p>
          </CardContent>
        </Card>
      </div>

      {/* Show exercise list only if user has access */}
      <ExerciseList
        onAdd={() => setShowAddDialog(true)}
        onEdit={handleEditExercise}
        refreshTrigger={refreshTrigger}
      />

      {/* Show add dialog only to admins */}
      {isAdmin && (
        <AddExerciseDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default Esercizi;