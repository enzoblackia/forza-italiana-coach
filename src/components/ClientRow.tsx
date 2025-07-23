import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, Activity, Trash2, Settings } from "lucide-react";
import { EditableField } from "./EditableField";
import { useToast } from "@/hooks/use-toast";

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  plan: string;
  phone?: string;
  notes?: string;
}

interface ClientRowProps {
  client: Client;
  onUpdate: (id: string, updates: Partial<Client>) => void;
  onDelete: (id: string) => void;
}

export const ClientRow = ({ client, onUpdate, onDelete }: ClientRowProps) => {
  const { toast } = useToast();

  const statusOptions = ["Attivo", "In scadenza", "Sospeso", "Inattivo"];
  const planOptions = ["Basic", "Standard", "Premium", "VIP"];

  const handleUpdate = (field: keyof Client, value: string) => {
    onUpdate(client.id, { [field]: value });
  };

  const handleDelete = () => {
    onDelete(client.id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Attivo":
        return <Badge variant="default" className="bg-green-500">Attivo</Badge>;
      case "In scadenza":
        return <Badge variant="destructive">In scadenza</Badge>;
      case "Sospeso":
        return <Badge variant="secondary">Sospeso</Badge>;
      case "Inattivo":
        return <Badge variant="outline">Inattivo</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "VIP":
        return <Badge className="bg-purple-500">VIP</Badge>;
      case "Premium":
        return <Badge className="bg-blue-500">Premium</Badge>;
      case "Standard":
        return <Badge variant="default">Standard</Badge>;
      case "Basic":
        return <Badge variant="outline">Basic</Badge>;
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <div className="flex space-x-2">
            <EditableField
              value={client.first_name}
              onSave={(value) => handleUpdate('first_name', value)}
              placeholder="Nome"
              className="font-medium"
            />
            <EditableField
              value={client.last_name}
              onSave={(value) => handleUpdate('last_name', value)}
              placeholder="Cognome"
              className="font-medium"
            />
          </div>
          <EditableField
            value={client.email}
            onSave={(value) => handleUpdate('email', value)}
            type="email"
            placeholder="email@example.com"
            className="text-sm text-muted-foreground"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="text-center min-w-[80px]">
          <p className="text-sm font-medium mb-1">Piano</p>
          <div onClick={(e) => e.stopPropagation()}>
            <EditableField
              value={client.plan}
              onSave={(value) => handleUpdate('plan', value)}
              type="select"
              options={planOptions}
            />
          </div>
        </div>
        
        <div className="text-center min-w-[100px]">
          <p className="text-sm font-medium mb-1">Status</p>
          <div onClick={(e) => e.stopPropagation()}>
            <EditableField
              value={client.status}
              onSave={(value) => handleUpdate('status', value)}
              type="select"
              options={statusOptions}
            />
          </div>
        </div>
        
        <div className="text-center min-w-[100px]">
          <p className="text-sm font-medium">Telefono</p>
          <EditableField
            value={client.phone || ""}
            onSave={(value) => handleUpdate('phone', value)}
            placeholder="Telefono"
            className="text-sm text-muted-foreground"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Gestisci
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Rimuovi Cliente</AlertDialogTitle>
                <AlertDialogDescription>
                  Sei sicuro di voler rimuovere {client.first_name} {client.last_name} dal sistema? Questa azione non può essere annullata.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Rimuovi
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};