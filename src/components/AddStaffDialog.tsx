import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddStaffDialog = ({ open, onOpenChange, onSuccess }: AddStaffDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    position: "", // Will be "Admin" or "Cliente"
    hire_date: "",
    salary: "",
    notes: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create staff record first without user_id
      const { data: employeeIdData } = await supabase.rpc('generate_employee_id');
      
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .insert({
          employee_id: employeeIdData || `EMP${Date.now().toString().slice(-3)}`,
          position: formData.position,
          hire_date: formData.hire_date,
          salary: formData.salary ? parseFloat(formData.salary) : null,
          notes: formData.notes,
          temp_email: formData.email, // Store email temporarily
        })
        .select()
        .single();

      if (staffError) throw staffError;

      // Step 2: Try to create auth user
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.first_name,
              last_name: formData.last_name,
            },
            emailRedirectTo: `${window.location.origin}/staff`,
          },
        });

        if (authData.user) {
          // Step 3: Create profile manually
          await supabase
            .from('profiles')
            .insert({
              user_id: authData.user.id,
              first_name: formData.first_name,
              last_name: formData.last_name,
              phone: formData.phone,
            });

          // Step 4: Create user role manually
          const userRole = formData.position === 'Admin' ? 'admin' : 'client';
          await supabase
            .from('user_roles')
            .insert({
              user_id: authData.user.id,
              role: userRole,
            });

          // Step 5: Update staff record with user_id
          await supabase
            .from('staff')
            .update({
              user_id: authData.user.id,
              temp_email: null, // Clear temporary email
            })
            .eq('id', staffData.id);
        }
      } catch (authError) {
        console.warn('Auth creation failed, but staff record created:', authError);
        // Staff record exists even if auth fails
      }

      toast({
        title: "Successo",
        description: "Membro del personale aggiunto con successo",
      });

      // Reset form
      setFormData({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        position: "",
        hire_date: "",
        salary: "",
        notes: "",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error adding staff:', error);
      toast({
        title: "Errore",
        description: error.message || "Impossibile aggiungere il membro del personale",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Aggiungi Membro del Personale</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Nome *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Cognome *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Ruolo *</Label>
            <Select
              value={formData.position}
              onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona ruolo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hire_date">Data Assunzione *</Label>
            <Input
              id="hire_date"
              type="date"
              value={formData.hire_date}
              onChange={(e) => setFormData(prev => ({ ...prev, hire_date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Stipendio (€)</Label>
            <Input
              id="salary"
              type="number"
              step="0.01"
              value={formData.salary}
              onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Note</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creazione..." : "Aggiungi Membro"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};