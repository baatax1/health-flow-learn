import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Lock, CheckCircle } from "lucide-react";

interface LearningPathCardProps {
  title: string;
  description: string;
  progress: number;
  status: "locked" | "available" | "completed";
  estimatedTime: string;
  lessons: number;
  onStart: () => void;
}

export function LearningPathCard({ 
  title, 
  description, 
  progress, 
  status, 
  estimatedTime, 
  lessons,
  onStart 
}: LearningPathCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "locked":
        return <Lock className="h-5 w-5 text-muted-foreground" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-health-success" />;
      default:
        return <Play className="h-5 w-5 text-primary" />;
    }
  };

  const getButtonVariant = () => {
    switch (status) {
      case "locked":
        return "ghost";
      case "completed":
        return "health-secondary";
      default:
        return "health";
    }
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-glossy border-0 hover:shadow-elevated transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
        <div className="ml-4">
          {getStatusIcon()}
        </div>
      </div>

      {status !== "locked" && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
        <span>{lessons} lessons</span>
        <span>{estimatedTime}</span>
      </div>

      <Button 
        variant={getButtonVariant()}
        className="w-full"
        onClick={onStart}
        disabled={status === "locked"}
      >
        {status === "completed" ? "Review" : status === "locked" ? "Locked" : "Start Learning"}
      </Button>
    </Card>
  );
}