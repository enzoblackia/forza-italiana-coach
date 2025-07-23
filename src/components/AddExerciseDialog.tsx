import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface AddExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const MUSCLE_GROUPS = [
  "Petto", "Spalle", "Tricipiti", "Bicipiti", "Dorsali", "Addominali",
  "Quadricipiti", "Femorali", "Glutei", "Polpacci", "Avambracci", "Trapezi"
];

export const AddExerciseDialog = ({ open, onOpenChange, onSuccess }: AddExerciseDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    muscle_groups: [] as string[],
    difficulty_level: "beginner",
    equipment: "",
    instructions: "",
    sets: 3,
    reps: "10-12",
    rest_time: 60,
    is_public: true,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleMuscleGroupChange = (group: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      muscle_groups: checked
        ? [...prev.muscle_groups, group]
        : prev.muscle_groups.filter(g => g !== group)
    }));
  };

  const handleVideoUpload = async (file: File) => {
    if (!user) return;

    setUploadingVideo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('exercise-videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('exercise-videos')
        .getPublicUrl(fileName);

      setVideoUrl(data.publicUrl);
      toast({
        title: "Successo",
        description: "Video caricato con successo",
      });
    } catch (error: any) {
      console.error('Error uploading video:', error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile caricare il video",
        variant: "destructive",
      });
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('exercises')
        .insert({
          ...formData,
          video_url: videoUrl || null,
          created_by: user.id,
        });

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Esercizio creato con successo",
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        muscle_groups: [],
        difficulty_level: "beginner",
        equipment: "",
        instructions: "",
        sets: 3,
        reps: "10-12",
        rest_time: 60,
        is_public: true,
      });
      setVideoFile(null);
      setVideoUrl("");

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating exercise:', error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile creare l'esercizio",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aggiungi Nuovo Esercizio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Esercizio *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipment">Attrezzatura</Label>
              <Input
                id="equipment"
                value={formData.equipment}
                onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                placeholder="Es. Manubri, Bilanciere, Corpo libero"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Gruppi Muscolari</Label>
            <div className="grid grid-cols-3 gap-2">
              {MUSCLE_GROUPS.map((group) => (
                <div key={group} className="flex items-center space-x-2">
                  <Checkbox
                    id={group}
                    checked={formData.muscle_groups.includes(group)}
                    onCheckedChange={(checked) => 
                      handleMuscleGroupChange(group, checked as boolean)
                    }
                  />
                  <Label htmlFor={group} className="text-sm">{group}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficoltà</Label>
              <Select
                value={formData.difficulty_level}
                onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty_level: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Principiante</SelectItem>
                  <SelectItem value="intermediate">Intermedio</SelectItem>
                  <SelectItem value="advanced">Avanzato</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sets">Serie</Label>
              <Input
                id="sets"
                type="number"
                value={formData.sets}
                onChange={(e) => setFormData(prev => ({ ...prev, sets: parseInt(e.target.value) }))}
                min={1}
                max={10}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reps">Ripetizioni</Label>
              <Input
                id="reps"
                value={formData.reps}
                onChange={(e) => setFormData(prev => ({ ...prev, reps: e.target.value }))}
                placeholder="Es. 10-12, 8-10, 15"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rest_time">Tempo di Recupero (secondi)</Label>
            <Input
              id="rest_time"
              type="number"
              value={formData.rest_time}
              onChange={(e) => setFormData(prev => ({ ...prev, rest_time: parseInt(e.target.value) }))}
              min={15}
              max={300}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Istruzioni Dettagliate</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              rows={4}
              placeholder="Descrivi come eseguire correttamente l'esercizio..."
            />
          </div>

          <div className="space-y-2">
            <Label>Video Dimostrativo</Label>
            {videoUrl ? (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <video
                  src={videoUrl}
                  className="w-20 h-20 object-cover rounded"
                  controls
                />
                <div className="flex-1">
                  <p className="text-sm">Video caricato con successo</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeVideo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <div className="mt-2">
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <span className="text-sm font-medium text-primary hover:underline">
                        Carica un video
                      </span>
                      <input
                        id="video-upload"
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setVideoFile(file);
                            handleVideoUpload(file);
                          }
                        }}
                        disabled={uploadingVideo}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    MP4, WebM, MOV fino a 50MB
                  </p>
                  {uploadingVideo && (
                    <p className="text-xs text-primary mt-2">Caricamento in corso...</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_public"
              checked={formData.is_public}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, is_public: checked as boolean }))
              }
            />
            <Label htmlFor="is_public">Rendi pubblico questo esercizio</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit" disabled={loading || uploadingVideo}>
              {loading ? "Creazione..." : "Crea Esercizio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};