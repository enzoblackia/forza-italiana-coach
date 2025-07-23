import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Target, 
  Plus, 
  Calendar, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Edit,
  Trash2
} from "lucide-react";

interface Obiettivo {
  id: number;
  titolo: string;
  descrizione: string;
  cliente: string;
  categoria: string;
  priorita: 'Alta' | 'Media' | 'Bassa';
  stato: 'In corso' | 'Completato' | 'In pausa' | 'Cancellato';
  progresso: number;
  dataInizio: string;
  dataScadenza: string;
  note?: string;
}

export default function PianificazioneObiettivi() {
  const [activeView, setActiveView] = useState<'tutti' | 'in-corso' | 'completati'>('tutti');
  const [showNewObjectiveDialog, setShowNewObjectiveDialog] = useState(false);

  // Mock data per gli obiettivi
  const [obiettivi, setObiettivi] = useState<Obiettivo[]>([
    {
      id: 1,
      titolo: "Perdita di 10kg",
      descrizione: "Raggiungere una perdita di peso di 10kg attraverso dieta bilanciata e allenamento cardio",
      cliente: "Marco Rossi",
      categoria: "Perdita peso",
      priorita: "Alta",
      stato: "In corso",
      progresso: 65,
      dataInizio: "2024-01-15",
      dataScadenza: "2024-04-15",
      note: "Cliente molto motivato, progressi costanti"
    },
    {
      id: 2,
      titolo: "Aumento massa muscolare",
      descrizione: "Incremento di 5kg di massa magra concentrandosi su gruppi muscolari principali",
      cliente: "Laura Bianchi",
      categoria: "Aumento massa",
      priorita: "Media",
      stato: "In corso",
      progresso: 40,
      dataInizio: "2024-02-01",
      dataScadenza: "2024-06-01"
    },
    {
      id: 3,
      titolo: "Preparazione maratona",
      descrizione: "Completare la maratona di Roma in meno di 4 ore",
      cliente: "Giuseppe Verdi",
      categoria: "Resistenza",
      priorita: "Alta",
      stato: "Completato",
      progresso: 100,
      dataInizio: "2023-12-01",
      dataScadenza: "2024-03-15"
    },
    {
      id: 4,
      titolo: "Tonificazione generale",
      descrizione: "Migliorare la tonicità muscolare generale e ridurre la percentuale di grasso corporeo",
      cliente: "Anna Neri",
      categoria: "Tonificazione",
      priorita: "Bassa",
      stato: "In pausa",
      progresso: 25,
      dataInizio: "2024-01-10",
      dataScadenza: "2024-05-10"
    }
  ]);

  const [newObjective, setNewObjective] = useState({
    titolo: "",
    descrizione: "",
    cliente: "",
    categoria: "",
    priorita: "Media" as const,
    dataScadenza: "",
    note: ""
  });

  const filteredObiettivi = obiettivi.filter(obiettivo => {
    switch (activeView) {
      case 'in-corso':
        return obiettivo.stato === 'In corso';
      case 'completati':
        return obiettivo.stato === 'Completato';
      default:
        return true;
    }
  });

  const getStatusBadge = (stato: string) => {
    switch (stato) {
      case 'In corso':
        return <Badge className="bg-blue-100 text-blue-800">In corso</Badge>;
      case 'Completato':
        return <Badge className="bg-green-100 text-green-800">Completato</Badge>;
      case 'In pausa':
        return <Badge variant="secondary">In pausa</Badge>;
      case 'Cancellato':
        return <Badge variant="destructive">Cancellato</Badge>;
      default:
        return <Badge variant="outline">{stato}</Badge>;
    }
  };

  const getPriorityBadge = (priorita: string) => {
    switch (priorita) {
      case 'Alta':
        return <Badge variant="destructive">Alta</Badge>;
      case 'Media':
        return <Badge variant="default">Media</Badge>;
      case 'Bassa':
        return <Badge variant="secondary">Bassa</Badge>;
      default:
        return <Badge variant="outline">{priorita}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreateObjective = () => {
    const newObj: Obiettivo = {
      id: obiettivi.length + 1,
      ...newObjective,
      stato: 'In corso',
      progresso: 0,
      dataInizio: new Date().toISOString().split('T')[0]
    };
    
    setObiettivi([...obiettivi, newObj]);
    setNewObjective({
      titolo: "",
      descrizione: "",
      cliente: "",
      categoria: "",
      priorita: "Media",
      dataScadenza: "",
      note: ""
    });
    setShowNewObjectiveDialog(false);
  };

  const statsData = {
    totali: obiettivi.length,
    inCorso: obiettivi.filter(o => o.stato === 'In corso').length,
    completati: obiettivi.filter(o => o.stato === 'Completato').length,
    progressoMedio: Math.round(obiettivi.reduce((acc, obj) => acc + obj.progresso, 0) / obiettivi.length)
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pianificazione Obiettivi</h1>
        <p className="text-muted-foreground">
          Crea, monitora e gestisci gli obiettivi dei tuoi clienti
        </p>
      </div>

      {/* Statistiche */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obiettivi Totali</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totali}</div>
            <p className="text-xs text-muted-foreground">Obiettivi creati</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Corso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.inCorso}</div>
            <p className="text-xs text-muted-foreground">Attualmente attivi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completati</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.completati}</div>
            <p className="text-xs text-muted-foreground">Obiettivi raggiunti</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Medio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.progressoMedio}%</div>
            <p className="text-xs text-muted-foreground">Di tutti gli obiettivi</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeView === 'tutti' ? 'default' : 'ghost'}
            onClick={() => setActiveView('tutti')}
            className="rounded-md"
          >
            Tutti
          </Button>
          <Button
            variant={activeView === 'in-corso' ? 'default' : 'ghost'}
            onClick={() => setActiveView('in-corso')}
            className="rounded-md"
          >
            In Corso
          </Button>
          <Button
            variant={activeView === 'completati' ? 'default' : 'ghost'}
            onClick={() => setActiveView('completati')}
            className="rounded-md"
          >
            Completati
          </Button>
        </div>

        <Dialog open={showNewObjectiveDialog} onOpenChange={setShowNewObjectiveDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuovo Obiettivo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crea Nuovo Obiettivo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titolo">Titolo *</Label>
                <Input
                  id="titolo"
                  value={newObjective.titolo}
                  onChange={(e) => setNewObjective(prev => ({ ...prev, titolo: e.target.value }))}
                  placeholder="Es. Perdita di 5kg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descrizione">Descrizione</Label>
                <Textarea
                  id="descrizione"
                  value={newObjective.descrizione}
                  onChange={(e) => setNewObjective(prev => ({ ...prev, descrizione: e.target.value }))}
                  placeholder="Descrivi l'obiettivo in dettaglio..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input
                    id="cliente"
                    value={newObjective.cliente}
                    onChange={(e) => setNewObjective(prev => ({ ...prev, cliente: e.target.value }))}
                    placeholder="Nome cliente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={newObjective.categoria}
                    onValueChange={(value) => setNewObjective(prev => ({ ...prev, categoria: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Perdita peso">Perdita peso</SelectItem>
                      <SelectItem value="Aumento massa">Aumento massa</SelectItem>
                      <SelectItem value="Tonificazione">Tonificazione</SelectItem>
                      <SelectItem value="Resistenza">Resistenza</SelectItem>
                      <SelectItem value="Forza">Forza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priorita">Priorità</Label>
                  <Select
                    value={newObjective.priorita}
                    onValueChange={(value: any) => setNewObjective(prev => ({ ...prev, priorita: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Bassa">Bassa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataScadenza">Data Scadenza</Label>
                  <Input
                    id="dataScadenza"
                    type="date"
                    value={newObjective.dataScadenza}
                    onChange={(e) => setNewObjective(prev => ({ ...prev, dataScadenza: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={newObjective.note}
                  onChange={(e) => setNewObjective(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Note aggiuntive..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewObjectiveDialog(false)}
                >
                  Annulla
                </Button>
                <Button onClick={handleCreateObjective}>
                  Crea Obiettivo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista Obiettivi */}
      <div className="grid gap-4">
        {filteredObiettivi.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-muted-foreground">
                {activeView === 'tutti' 
                  ? "Nessun obiettivo trovato" 
                  : `Nessun obiettivo ${activeView === 'in-corso' ? 'in corso' : 'completato'} trovato`}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredObiettivi.map((obiettivo) => (
            <Card key={obiettivo.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{obiettivo.titolo}</CardTitle>
                    <CardDescription className="mt-2">
                      {obiettivo.descrizione}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{obiettivo.cliente}</span>
                      </div>
                      <Badge variant="outline">{obiettivo.categoria}</Badge>
                      {getPriorityBadge(obiettivo.priorita)}
                      {getStatusBadge(obiettivo.stato)}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Scadenza: {formatDate(obiettivo.dataScadenza)}</span>
                      {obiettivo.stato === 'In corso' && (
                        <span className="ml-2">
                          ({getDaysRemaining(obiettivo.dataScadenza)} giorni)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{obiettivo.progresso}%</span>
                    </div>
                    <Progress value={obiettivo.progresso} className="h-2" />
                  </div>

                  {obiettivo.note && (
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      <strong>Note:</strong> {obiettivo.note}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}