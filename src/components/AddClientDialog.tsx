import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface Client {
  id: number;
  name: string;
  email: string;
  status: string;
  plan: string;
  nextSession: string;
  progress: number;
}

interface AddClientDialogProps {
  onAddClient: (client: Omit<Client, 'id'>) => void;
  trigger?: React.ReactNode;
}

export const AddClientDialog = ({ onAddClient, trigger }: AddClientDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "Attivo",
    plan: "Basic",
    nextSession: "",
    progress: 0,
  });

  const statusOptions = ["Attivo", "In scadenza", "Sospeso", "Inattivo"];
  const planOptions = ["Basic", "Standard", "Premium", "VIP"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name.trim() || !formData.email.trim()) {
        toast({
          title: "Errore",
          description: "Nome e email sono obbligatori",
          variant: "destructive",
        });
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Errore",
          description: "Inserisci un'email valida",
          variant: "destructive",
        });
        return;
      }

      // Format next session date
      const nextSession = formData.nextSession 
        ? new Date(formData.nextSession).toLocaleString('it-IT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        : "Da programmare";

      // Add the client
      onAddClient({
        ...formData,
        nextSession,
        progress: Number(formData.progress),
      });

      toast({
        title: "Cliente aggiunto",
        description: `${formData.name} è stato aggiunto con successo`,
      });

      // Reset form and close dialog
      setFormData({
        name: "",
        email: "",
        status: "Attivo",
        plan: "Basic",
        nextSession: "",
        progress: 0,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile aggiungere il cliente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Nuovo Cliente
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Aggiungi Nuovo Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Mario Rossi"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="mario.rossi@email.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan">Piano</Label>
              <Select
                value={formData.plan}
                onValueChange={(value) => setFormData(prev => ({ ...prev, plan: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {planOptions.map((plan) => (
                    <SelectItem key={plan} value={plan}>
                      {plan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextSession">Prossima Sessione (opzionale)</Label>
            <Input
              id="nextSession"
              type="datetime-local"
              value={formData.nextSession}
              onChange={(e) => setFormData(prev => ({ ...prev, nextSession: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress">Progresso (%)</Label>
            <Input
              id="progress"
              type="number"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Aggiunta..." : "Aggiungi Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};