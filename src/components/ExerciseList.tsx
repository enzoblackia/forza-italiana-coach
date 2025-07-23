import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Edit, 
  Eye,
  Play,
  Target,
  Dumbbell
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface ExerciseListProps {
  onAdd: () => void;
  onEdit: (exercise: Exercise) => void;
  refreshTrigger?: number;
}

export const ExerciseList = ({ onAdd, onEdit, refreshTrigger }: ExerciseListProps) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExercises(data || []);
      setFilteredExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare gli esercizi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [refreshTrigger]);

  useEffect(() => {
    const filtered = exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.muscle_groups.some(group => 
        group.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      exercise.equipment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.difficulty_level.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchQuery, exercises]);

  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Principiante</Badge>;
      case 'intermediate':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Intermedio</Badge>;
      case 'advanced':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Avanzato</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getMuscleGroupsDisplay = (groups: string[]) => {
    return groups.slice(0, 2).join(", ") + (groups.length > 2 ? `... +${groups.length - 2}` : "");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Caricamento esercizi...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Libreria Esercizi
          </CardTitle>
          <Button onClick={onAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Aggiungi Esercizio
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per nome, gruppo muscolare, attrezzo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredExercises.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            {searchQuery ? "Nessun esercizio trovato" : "Nessun esercizio disponibile"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Gruppi Muscolari</TableHead>
                <TableHead>Difficoltà</TableHead>
                <TableHead>Attrezzatura</TableHead>
                <TableHead>Serie x Rip</TableHead>
                <TableHead>Video</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExercises.map((exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{exercise.name}</div>
                      {exercise.description && (
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {exercise.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {exercise.muscle_groups.length > 0 ? (
                        <span className="text-sm">
                          {getMuscleGroupsDisplay(exercise.muscle_groups)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Non specificato</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getDifficultyBadge(exercise.difficulty_level)}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {exercise.equipment || "Corpo libero"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">
                      {exercise.sets} x {exercise.reps}
                    </span>
                  </TableCell>
                  <TableCell>
                    {exercise.video_url ? (
                      <Button variant="outline" size="sm">
                        <Play className="h-3 w-3" />
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(exercise)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};