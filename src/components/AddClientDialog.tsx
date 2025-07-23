import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
    password: "",
    status: "Attivo",
    plan: "Basic",
  });

  const statusOptions = ["Attivo", "In scadenza", "Sospeso", "Inattivo"];
  const planOptions = ["Basic", "Standard", "Premium", "VIP"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
        toast({
          title: "Errore",
          description: "Nome, email e password sono obbligatori",
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

      // Validate password length
      if (formData.password.length < 6) {
        toast({
          title: "Errore",
          description: "La password deve essere di almeno 6 caratteri",
          variant: "destructive",
        });
        return;
      }

      // Step 1: Create auth user for the client
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.name.split(' ')[0] || formData.name,
            last_name: formData.name.split(' ').slice(1).join(' ') || '',
          },
          emailRedirectTo: `${window.location.origin}/portale-clienti`,
        },
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        toast({
          title: "Errore di registrazione",
          description: "Impossibile creare l'account. Verifica che l'email non sia già in uso.",
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        // Step 2: Create profile manually
        await supabase
          .from('profiles')
          .insert({
            user_id: authData.user.id,
            first_name: formData.name.split(' ')[0] || formData.name,
            last_name: formData.name.split(' ').slice(1).join(' ') || '',
          });

        // Step 3: Assign 'client' role
        await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'client',
          });
      }

      // Add the client to local state (for immediate UI update)
      onAddClient({
        name: formData.name,
        email: formData.email,
        status: formData.status,
        plan: formData.plan,
        nextSession: "Da programmare",
        progress: 0,
      });

      toast({
        title: "Cliente registrato",
        description: `${formData.name} è stato registrato con successo come Cliente`,
      });

      // Reset form and close dialog
      setFormData({
        name: "",
        email: "",
        password: "",
        status: "Attivo",
        plan: "Basic",
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Errore",
        description: "Impossibile registrare il cliente",
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

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Minimo 6 caratteri"
              required
              minLength={6}
            />
            <p className="text-xs text-muted-foreground">
              Il cliente potrà cambiarla in seguito dal suo profilo
            </p>
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
              {loading ? "Registrazione..." : "Registra Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};