import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Bell, Lock, Palette } from "lucide-react";

const Impostazioni = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Impostazioni</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Impostazioni Generali
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Nome Palestra</span>
                <span className="text-sm text-muted-foreground">FitnessPro Studio</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Lingua</span>
                <span className="text-sm text-muted-foreground">Italiano</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Timezone</span>
                <span className="text-sm text-muted-foreground">Europe/Rome</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifiche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email Notifiche</span>
                <span className="text-sm text-muted-foreground">Attive</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">SMS Promemoria</span>
                <span className="text-sm text-muted-foreground">Attive</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Push Notifiche</span>
                <span className="text-sm text-muted-foreground">Disattive</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Sicurezza
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Autenticazione 2FA</span>
                <span className="text-sm text-muted-foreground">Disattiva</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Backup Automatico</span>
                <span className="text-sm text-muted-foreground">Giornaliero</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Log Accesso</span>
                <span className="text-sm text-muted-foreground">30 giorni</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Personalizzazione
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tema</span>
                <span className="text-sm text-muted-foreground">Chiaro</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Colore Primario</span>
                <span className="text-sm text-muted-foreground">Blu</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Layout</span>
                <span className="text-sm text-muted-foreground">Standard</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurazione Avanzata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>Pannello impostazioni in sviluppo...</p>
            <p className="text-sm mt-2">Qui sarà possibile configurare tutte le opzioni avanzate</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Impostazioni;