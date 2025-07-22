import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, CreditCard, MessageSquare, Activity, Settings } from "lucide-react";

export default function PortaleClienti() {
  const mockClients = [
    {
      id: 1,
      name: "Marco Rossi",
      email: "marco.rossi@email.com",
      status: "Attivo",
      plan: "Premium",
      nextSession: "2024-01-25 10:00",
      progress: 85
    },
    {
      id: 2,
      name: "Laura Bianchi",
      email: "laura.bianchi@email.com",
      status: "Attivo",
      plan: "Standard",
      nextSession: "2024-01-24 15:30",
      progress: 72
    },
    {
      id: 3,
      name: "Giuseppe Verdi",
      email: "giuseppe.verdi@email.com",
      status: "In scadenza",
      plan: "Basic",
      nextSession: "2024-01-26 09:00",
      progress: 45
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Attivo":
        return <Badge variant="default" className="bg-green-500">Attivo</Badge>;
      case "In scadenza":
        return <Badge variant="destructive">In scadenza</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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
            <div className="text-2xl font-bold">24</div>
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
          <CardTitle>Lista Clienti</CardTitle>
          <CardDescription>
            Panoramica dei tuoi clienti e delle loro informazioni
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">Piano</p>
                    <Badge variant="outline">{client.plan}</Badge>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium">Status</p>
                    {getStatusBadge(client.status)}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium">Prossima Sessione</p>
                    <p className="text-sm text-muted-foreground">{client.nextSession}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium">Progresso</p>
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{client.progress}%</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Gestisci
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Nuovo Cliente</span>
            </CardTitle>
            <CardDescription>Aggiungi un nuovo cliente al sistema</CardDescription>
          </CardHeader>
        </Card>

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