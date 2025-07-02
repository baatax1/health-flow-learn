import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Lock, CheckCircle, Clock, BookOpen } from "lucide-react";

interface LearningPathCardProps {
  title: string;
  description: string;
  progress: number;
  status: "locked" | "available" | "completed";
  estimatedTime: string;
  lessons: number;
  onStart: () => void;
  delay?: number;
}

export function LearningPathCard({ 
  title, 
  description, 
  progress, 
  status, 
  estimatedTime, 
  lessons,
  onStart,
  delay = 0
}: LearningPathCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "locked":
        return <Lock className="h-6 w-6 text-muted-foreground" />;
      case "completed":
        return <CheckCircle className="h-6 w-6 text-health-success" />;
      default:
        return <Play className="h-6 w-6 text-primary" />;
    }
  };

  const getButtonVariant = () => {
    switch (status) {
      case "locked":
        return "apple-minimal";
      case "completed":
        return "apple-secondary";
      default:
        return "apple-primary";
    }
  };

  const getCardStyles = () => {
    if (status === "locked") {
      return "opacity-60 cursor-not-allowed";
    }
    return "hover:scale-[1.02] hover:shadow-large cursor-pointer";
  };

  return (
    <Card 
      className={`p-8 bg-gradient-glass backdrop-blur-xl shadow-glass border border-white/10 transition-all duration-500 ease-out-cubic group relative overflow-hidden animate-fade-in ${getCardStyles()}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-3 leading-tight tracking-tight">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <div className="ml-6 flex-shrink-0">
            <div className="p-3 bg-gradient-surface rounded-xl shadow-soft group-hover:shadow-medium transition-all duration-300">
              {getStatusIcon()}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {status !== "locked" && (
          <div className="mb-6">
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
              <span className="font-medium">Progress</span>
              <span className="bg-muted/50 px-2 py-1 rounded-full text-xs font-medium">{progress}%</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-2.5 bg-muted/30" />
              {progress > 0 && (
                <div className="absolute top-0 left-0 h-2.5 bg-gradient-primary rounded-full transition-all duration-500"
                     style={{ width: `${progress}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-shimmer bg-[length:200%_100%]" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center gap-6 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="font-medium">{lessons} lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{estimatedTime}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          variant={getButtonVariant()}
          size="lg"
          className="w-full h-14 text-lg font-semibold tracking-tight"
          onClick={onStart}
          disabled={status === "locked"}
        >
          {status === "completed" ? "Review Content" : status === "locked" ? "Coming Soon" : "Start Learning"}
        </Button>
      </div>

      {/* Shimmer effect for available/completed cards */}
      {status !== "locked" && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent animate-shimmer bg-[length:200%_100%]" />
        </div>
      )}
    </Card>
  );
}