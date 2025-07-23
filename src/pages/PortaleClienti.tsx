import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, CreditCard, MessageSquare, Activity, Settings, Plus } from "lucide-react";
import { ClientRow } from "@/components/ClientRow";
import { AddClientDialog } from "@/components/AddClientDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

export default function PortaleClienti() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i clienti",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClientUpdate = async (id: string, updates: Partial<Client>) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...updates } : client
      ));

      toast({
        title: "Cliente aggiornato",
        description: "Le modifiche sono state salvate",
      });
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il cliente",
        variant: "destructive",
      });
    }
  };

  const handleClientDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== id));

      toast({
        title: "Cliente rimosso",
        description: "Il cliente è stato rimosso dal sistema",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Errore",
        description: "Impossibile rimuovere il cliente",
        variant: "destructive",
      });
    }
  };

  const handleAddClient = (newClient: Client) => {
    setClients(prev => [newClient, ...prev]);
  };

  const activeClients = clients.filter(client => client.status === "Attivo").length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portale Clienti</h1>
        <p className="text-muted-foreground">
          Gestisci i tuoi clienti, monitora i progressi e mantieni la comunicazione
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clienti Attivi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground">+2 dal mese scorso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessioni Oggi</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">6 completate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messaggi</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Non letti</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fatturato Mese</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€3,240</div>
            <p className="text-xs text-muted-foreground">+12% dal mese scorso</p>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista Clienti</CardTitle>
              <CardDescription>
                Clicca su qualsiasi campo per modificarlo rapidamente
              </CardDescription>
            </div>
            <AddClientDialog onAddClient={handleAddClient} />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Caricamento clienti...
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nessun cliente trovato
            </div>
          ) : (
            <div className="space-y-3">
              {clients.map((client) => (
                <ClientRow
                  key={client.id}
                  client={client}
                  onUpdate={handleClientUpdate}
                  onDelete={handleClientDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <AddClientDialog 
          onAddClient={handleAddClient}
          trigger={
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Nuovo Cliente</span>
                </CardTitle>
                <CardDescription>Aggiungi un nuovo cliente al sistema</CardDescription>
              </CardHeader>
            </Card>
          }
        />

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Programma Sessione</span>
            </CardTitle>
            <CardDescription>Pianifica una nuova sessione di allenamento</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Invia Messaggio</span>
            </CardTitle>
            <CardDescription>Comunica con i tuoi clienti</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}