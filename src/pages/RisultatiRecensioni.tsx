import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, Award, MessageSquare, ThumbsUp, Target } from "lucide-react";

export default function RisultatiRecensioni() {
  const [activeTab, setActiveTab] = useState<'risultati' | 'recensioni'>('risultati');

  // Mock data per i risultati
  const risultatiClienti = [
    {
      id: 1,
      nome: "Marco Rossi",
      obiettivo: "Perdita peso",
      progressoIniziale: 85,
      progressoAttuale: 72,
      dataInizio: "2024-01-15",
      durataProgramma: "3 mesi"
    },
    {
      id: 2,
      nome: "Laura Bianchi",
      obiettivo: "Aumento massa",
      progressoIniziale: 60,
      progressoAttuale: 78,
      dataInizio: "2024-02-01",
      durataProgramma: "4 mesi"
    },
    {
      id: 3,
      nome: "Giuseppe Verdi",
      obiettivo: "Tonificazione",
      progressoIniziale: 70,
      progressoAttuale: 85,
      dataInizio: "2024-01-20",
      durataProgramma: "2 mesi"
    }
  ];

  // Mock data per le recensioni
  const recensioni = [
    {
      id: 1,
      cliente: "Marco Rossi",
      valutazione: 5,
      commento: "Servizio eccellente! Ho raggiunto tutti i miei obiettivi grazie al programma personalizzato.",
      data: "2024-01-20",
      programma: "Perdita peso"
    },
    {
      id: 2,
      cliente: "Laura Bianchi",
      valutazione: 4,
      commento: "Molto soddisfatta dei risultati. Il trainer è stato molto professionale e disponibile.",
      data: "2024-01-18",
      programma: "Aumento massa"
    },
    {
      id: 3,
      cliente: "Giuseppe Verdi",
      valutazione: 5,
      commento: "Ambiente accogliente e attrezzature di qualità. Consigliatissimo!",
      data: "2024-01-15",
      programma: "Tonificazione"
    }
  ];

  const calcolaProgresso = (iniziale: number, attuale: number) => {
    const differenza = Math.abs(attuale - iniziale);
    const percentuale = (differenza / iniziale) * 100;
    return Math.round(percentuale);
  };

  const getProgressoColor = (iniziale: number, attuale: number, obiettivo: string) => {
    if (obiettivo === "Perdita peso") {
      return attuale < iniziale ? "bg-green-500" : "bg-red-500";
    } else {
      return attuale > iniziale ? "bg-green-500" : "bg-orange-500";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Risultati e Recensioni</h1>
        <p className="text-muted-foreground">
          Monitora i progressi dei clienti e le loro valutazioni
        </p>
      </div>

      {/* Statistiche Generali */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clienti con Obiettivi Raggiunti</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+20% dal mese scorso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valutazione Media</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Su 5 stelle</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasso di Successo</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">Obiettivi completati</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recensioni Totali</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Questo mese</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'risultati' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('risultati')}
          className="rounded-md"
        >
          <Award className="h-4 w-4 mr-2" />
          Risultati Clienti
        </Button>
        <Button
          variant={activeTab === 'recensioni' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('recensioni')}
          className="rounded-md"
        >
          <Star className="h-4 w-4 mr-2" />
          Recensioni
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'risultati' ? (
        <Card>
          <CardHeader>
            <CardTitle>Progressi Clienti</CardTitle>
            <CardDescription>
              Traccia i risultati ottenuti dai tuoi clienti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {risultatiClienti.map((cliente) => (
                <div key={cliente.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{cliente.nome}</h3>
                      <p className="text-sm text-muted-foreground">
                        Obiettivo: {cliente.obiettivo} • {cliente.durataProgramma}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {calcolaProgresso(cliente.progressoIniziale, cliente.progressoAttuale)}% progresso
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Valore iniziale</span>
                      <span>{cliente.progressoIniziale}kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Valore attuale</span>
                      <span>{cliente.progressoAttuale}kg</span>
                    </div>
                    <Progress 
                      value={calcolaProgresso(cliente.progressoIniziale, cliente.progressoAttuale)} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recensioni Clienti</CardTitle>
            <CardDescription>
              Feedback e valutazioni ricevute dai clienti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recensioni.map((recensione) => (
                <div key={recensione.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{recensione.cliente}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {renderStars(recensione.valutazione)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {recensione.data}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{recensione.programma}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    "{recensione.commento}"
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Raccomandato</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}