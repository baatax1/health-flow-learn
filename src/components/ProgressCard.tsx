import { Card } from "@/components/ui/card";
import { Trophy, Target, Clock, TrendingUp } from "lucide-react";

interface ProgressCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: "trophy" | "target" | "clock" | "trending";
  gradient?: "primary" | "secondary";
  delay?: number;
}

export function ProgressCard({ title, value, subtitle, icon, gradient = "primary", delay = 0 }: ProgressCardProps) {
  const iconMap = {
    trophy: Trophy,
    target: Target,
    clock: Clock,
    trending: TrendingUp,
  };

  const IconComponent = iconMap[icon];
  const gradientClass = gradient === "primary" ? "bg-gradient-primary" : "bg-gradient-secondary";

  return (
    <Card 
      className="p-6 bg-gradient-glass backdrop-blur-xl shadow-glass border border-white/10 hover:shadow-large transition-all duration-500 ease-out-cubic hover:scale-[1.02] group relative overflow-hidden animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium text-muted-foreground text-sm uppercase tracking-wider">{title}</h3>
          <div className={`p-3 ${gradientClass} text-white shadow-glow group-hover:shadow-large transition-all duration-300 group-hover:scale-110`} style={{ borderRadius: '12px' }}>
            <IconComponent className="h-5 w-5" />
          </div>
        </div>
        
        <div className="mb-3">
          <span className="text-4xl font-bold text-foreground tracking-tight">{value}</span>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer bg-[length:200%_100%]" />
      </div>
    </Card>
  );
}