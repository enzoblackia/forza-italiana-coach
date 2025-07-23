import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, CreditCard, MessageSquare, Activity, Settings, Plus } from "lucide-react";
import { ClientRow } from "@/components/ClientRow";
import { AddClientDialog } from "@/components/AddClientDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
  const { isAdmin, profile } = useAuth();
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
      {/* Header personalizzato per clienti */}
      {!isAdmin && profile ? (
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-4 border-white/20">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {profile.first_name?.charAt(0) || ''}
                  {profile.last_name?.charAt(0) || ''}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  Benvenuto, {profile.first_name}! 👋
                </h1>
                <p className="text-white/90 text-lg">
                  Ecco il resoconto della tua attività
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin ? "Portale Clienti" : "Il Mio Account"}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "Gestisci i tuoi clienti, monitora i progressi e mantieni la comunicazione" 
              : "Visualizza le tue informazioni e gestisci il tuo profilo"
            }
          </p>
        </div>
      )}

      {/* Stats Cards - Solo per Admin */}
      {isAdmin && (
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
      )}

      {/* Client List - Solo per Admin */}
      {isAdmin && (
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
      )}

      {/* Sezione per Clienti Non-Admin */}
      {!isAdmin && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                I Miei Progressi
              </CardTitle>
              <CardDescription>
                Visualizza i tuoi risultati e obiettivi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-primary">85%</div>
                <p className="text-sm text-muted-foreground">Obiettivo raggiunto</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Prossima Sessione
              </CardTitle>
              <CardDescription>
                Il tuo prossimo allenamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-lg font-semibold">Domani</div>
                <p className="text-sm text-muted-foreground">ore 15:30</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Messaggi
              </CardTitle>
              <CardDescription>
                Comunicazioni dal tuo trainer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-primary">3</div>
                <p className="text-sm text-muted-foreground">Nuovi messaggi</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions - Solo per Admin */}
      {isAdmin && (
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
      )}
    </div>
  );
}