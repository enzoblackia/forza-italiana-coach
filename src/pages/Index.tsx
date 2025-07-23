import DashboardCard from "@/components/DashboardCard";
import StatsCard from "@/components/StatsCard";
import EarningsDashboard from "@/components/EarningsDashboard";
import { 
  Calendar, 
  Dumbbell, 
  Apple, 
  Users, 
  TrendingUp,
  Clock,
  Target,
  Award,
  ShoppingCart,
  Phone
} from "lucide-react";

// Mock data - sostituire con dati reali da Supabase
const mockEarnings = {
  today: 245.50,
  thisWeek: 1580.75,
  thisMonth: 6240.00,
  thisYear: 52800.00,
  trends: {
    week: { value: 12.5, isPositive: true },
    month: { value: 8.2, isPositive: true }
  }
};

const mockExpiringSubscriptions = [
  {
    id: '1',
    clientName: 'Marco Rossi',
    plan: 'Premium',
    expiryDate: '25/01/2025',
    daysLeft: 3,
    monthlyValue: 120.00
  },
  {
    id: '2', 
    clientName: 'Sofia Bianchi',
    plan: 'Basic',
    expiryDate: '28/01/2025',
    daysLeft: 6,
    monthlyValue: 80.00
  },
  {
    id: '3',
    clientName: 'Luca Ferrari',
    plan: 'Premium',
    expiryDate: '02/02/2025',
    daysLeft: 11,
    monthlyValue: 120.00
  },
  {
    id: '4',
    clientName: 'Giulia Verdi',
    plan: 'Basic',
    expiryDate: '15/02/2025',
    daysLeft: 24,
    monthlyValue: 80.00
  }
];

const Index = () => {
  return (
    <div className="min-h-full bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Earnings Dashboard */}
        <div className="mb-12">
          <EarningsDashboard 
            userName="Alessandro"
            earnings={mockEarnings}
            expiringSubscriptions={mockExpiringSubscriptions}
            totalActiveClients={124}
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Nuovi Clienti"
            value="12"
            icon={Users}
            change="+12% questo mese"
            changeType="positive"
          />
          <StatsCard
            title="Allenamenti Settimana"
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
            title="Tasso Soddisfazione"
            value="98%"
            icon={Target}
            change="+2% questo mese"
            changeType="positive"
          />
        </div>

        {/* Main Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Gestisci la Tua Attività
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <DashboardCard
              title="Shop Proteine"
              description="Acquista proteine, barrette e integratori per i tuoi clienti"
              icon={ShoppingCart}
            />
            <DashboardCard
              title="Nutrizionisti"
              description="Contatta i nostri nutrizionisti specializzati e convenzionati"
              icon={Phone}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-muted/30 rounded-lg p-8">
          <h3 className="text-xl font-bold text-foreground mb-4">
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