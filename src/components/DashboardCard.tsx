import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  gradient?: boolean;
}

const DashboardCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick,
  gradient = false 
}: DashboardCardProps) => {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-elegant transition-smooth border-2 hover:border-primary/20 ${
        gradient ? 'bg-fitness-gradient text-white' : 'hover:bg-muted/5'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${
            gradient 
              ? 'bg-white/20' 
              : 'bg-primary/10'
          }`}>
            <Icon className={`w-6 h-6 ${
              gradient 
                ? 'text-white' 
                : 'text-primary'
            }`} />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${
              gradient ? 'text-white' : 'text-foreground'
            }`}>
              {title}
            </h3>
            <p className={`text-sm ${
              gradient 
                ? 'text-white/80' 
                : 'text-muted-foreground'
            }`}>
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;