import Navbar from "@/components/Navbar";
import DashboardCard from "@/components/DashboardCard";
import StatsCard from "@/components/StatsCard";
import { 
  Calendar, 
  Dumbbell, 
  Apple, 
  Users, 
  TrendingUp,
  Clock,
  Target,
  Award
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-fitness-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Gestione Completa
              <br />
              <span className="text-white/90">Personal Training</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              La piattaforma professionale per gestire clienti, programmi di allenamento,
              piani nutrizionali e il tuo team di personal trainer.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Clienti Attivi"
            value="124"
            icon={Users}
            change="+12% questo mese"
            changeType="positive"
          />
          <StatsCard
            title="Allenamenti Questa Settimana"
            value="89"
            icon={Dumbbell}
            change="+8% vs settimana scorsa"
            changeType="positive"
          />
          <StatsCard
            title="Piani Nutrizionali"
            value="67"
            icon={Apple}
            change="3 nuovi oggi"
            changeType="neutral"
          />
          <StatsCard
            title="Obiettivi Raggiunti"
            value="95%"
            icon={Target}
            change="+5% questo mese"
            changeType="positive"
          />
        </div>

        {/* Main Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Gestisci la Tua Attività
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Planning Settimanale"
              description="Organizza e gestisci tutti gli allenamenti della settimana per i tuoi clienti"
              icon={Calendar}
              gradient={true}
            />
            <DashboardCard
              title="Libreria Esercizi"
              description="Accedi al catalogo completo di esercizi con istruzioni dettagliate"
              icon={Dumbbell}
            />
            <DashboardCard
              title="Nutrizione"
              description="Crea e gestisci piani alimentari personalizzati per ogni cliente"
              icon={Apple}
            />
            <DashboardCard
              title="Gestione Staff"
              description="Amministra il tuo team di personal trainer e le loro autorizzazioni"
              icon={Users}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-muted/30 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Azioni Rapide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardCard
              title="Nuovo Allenamento"
              description="Crea un nuovo programma di allenamento"
              icon={TrendingUp}
            />
            <DashboardCard
              title="Programma Sessione"
              description="Schedula una nuova sessione di training"
              icon={Clock}
            />
            <DashboardCard
              title="Valuta Progressi"
              description="Controlla i risultati dei tuoi clienti"
              icon={Award}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;