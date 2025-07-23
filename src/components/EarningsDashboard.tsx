import { useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { it } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DateNavigation from "@/components/DateNavigation";
import { 
  Euro, 
  TrendingUp, 
  Users, 
  Calendar,
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";

interface EarningsCardProps {
  title: string;
  amount: number;
  period: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ComponentType<any>;
}

const EarningsCard = ({ title, amount, period, trend, icon: Icon }: EarningsCardProps) => {
  return (
    <Card className="hover:shadow-elegant transition-smooth">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          €{amount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
          <span>{period}</span>
          {trend && (
            <Badge variant={trend.isPositive ? "default" : "destructive"} className="text-xs">
              {trend.isPositive ? '+' : ''}{trend.value}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface ExpiringSubscription {
  id: string;
  clientName: string;
  plan: string;
  expiryDate: string;
  daysLeft: number;
  monthlyValue: number;
}

interface EarningsDashboardProps {
  userName?: string;
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
    trends: {
      week: { value: number; isPositive: boolean };
      month: { value: number; isPositive: boolean };
    };
  };
  expiringSubscriptions: ExpiringSubscription[];
  totalActiveClients: number;
}

const EarningsDashboard = ({ 
  userName = "Personal Trainer",
  earnings,
  expiringSubscriptions,
  totalActiveClients
}: EarningsDashboardProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const urgentExpirations = expiringSubscriptions.filter(sub => sub.daysLeft <= 7);
  const potentialLoss = urgentExpirations.reduce((total, sub) => total + sub.monthlyValue, 0);

  return (
    <div className="space-y-6">

      {/* Date Navigation */}
      <DateNavigation 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Earnings Overview */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <Euro className="w-5 h-5 mr-2 text-primary" />
          Panoramica Guadagni
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <EarningsCard
            title={isToday(selectedDate) ? "Oggi" : 
                  isYesterday(selectedDate) ? "Ieri" : 
                  format(selectedDate, "d MMM yyyy", { locale: it })}
            amount={earnings.today}
            period="Entrate giornaliere"
            icon={Euro}
          />
          <EarningsCard
            title="Settimana"
            amount={earnings.thisWeek}
            period={`Settimana del ${format(selectedDate, "d MMM", { locale: it })}`}
            trend={earnings.trends.week}
            icon={TrendingUp}
          />
          <EarningsCard
            title="Mese"
            amount={earnings.thisMonth}
            period={format(selectedDate, "MMMM yyyy", { locale: it })}
            trend={earnings.trends.month}
            icon={Calendar}
          />
          <EarningsCard
            title="Anno"
            amount={earnings.thisYear}
            period={format(selectedDate, "yyyy", { locale: it })}
            icon={Users}
          />
        </div>
      </div>

      {/* Expiring Subscriptions Alert */}
      {urgentExpirations.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Abbonamenti in Scadenza ({urgentExpirations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-destructive/10 rounded-lg p-3 mb-4">
                <div className="text-sm text-destructive font-medium">
                  Potenziale perdita entrate: €{potentialLoss.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                </div>
              </div>
              {urgentExpirations.slice(0, 3).map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{subscription.clientName}</div>
                    <div className="text-sm text-muted-foreground">
                      Piano {subscription.plan} • Scade il {subscription.expiryDate}
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="text-sm font-medium text-foreground">
                      €{subscription.monthlyValue}/mese
                    </div>
                    <Badge variant={subscription.daysLeft <= 3 ? "destructive" : "secondary"}>
                      {subscription.daysLeft} giorni
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    Contatta
                  </Button>
                </div>
              ))}
              {urgentExpirations.length > 3 && (
                <Button variant="ghost" className="w-full">
                  Vedi tutti ({urgentExpirations.length - 3} altri)
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Expiring Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Prossime Scadenze (30 giorni)
            </span>
            <Badge variant="secondary">{expiringSubscriptions.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expiringSubscriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nessun abbonamento in scadenza nei prossimi 30 giorni</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {expiringSubscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-smooth">
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{subscription.clientName}</div>
                    <div className="text-sm text-muted-foreground">
                      Piano {subscription.plan} • {subscription.expiryDate}
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="text-sm font-medium">€{subscription.monthlyValue}/mese</div>
                    <Badge variant={subscription.daysLeft <= 7 ? "destructive" : subscription.daysLeft <= 14 ? "secondary" : "outline"}>
                      {subscription.daysLeft} giorni
                    </Badge>
                  </div>
                  <Button size="sm" variant="ghost">
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsDashboard;