import { Card } from "@/components/ui/card";
import { Trophy, Target, Clock, TrendingUp } from "lucide-react";

interface ProgressCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: "trophy" | "target" | "clock" | "trending";
  gradient?: "primary" | "secondary";
}

export function ProgressCard({ title, value, subtitle, icon, gradient = "primary" }: ProgressCardProps) {
  const iconMap = {
    trophy: Trophy,
    target: Target,
    clock: Clock,
    trending: TrendingUp,
  };

  const IconComponent = iconMap[icon];
  const gradientClass = gradient === "primary" ? "bg-gradient-primary" : "bg-gradient-secondary";

  return (
    <Card className="p-6 bg-gradient-card shadow-glossy border-0 hover:shadow-elevated transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-muted-foreground">{title}</h3>
        <div className={`p-2 ${gradientClass} text-white shadow-card`}>
          <IconComponent className="h-4 w-4" />
        </div>
      </div>
      
      <div className="mb-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
      </div>
      
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </Card>
  );
}