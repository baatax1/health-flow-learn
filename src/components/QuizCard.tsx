import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface QuizOption {
  id: string;
  text: string;
  value: number;
}

interface QuizCardProps {
  question: string;
  options: QuizOption[];
  onAnswer: (value: number) => void;
  currentQuestion: number;
  totalQuestions: number;
}

export function QuizCard({ question, options, onAnswer, currentQuestion, totalQuestions }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 100);
    return () => clearTimeout(timer);
  }, [currentQuestion]);

  const handleSubmit = () => {
    if (selectedOption) {
      const option = options.find(opt => opt.id === selectedOption);
      if (option) {
        onAnswer(option.value);
        setSelectedOption(null);
      }
    }
  };

  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className={`transition-all duration-500 ease-out-cubic ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
      <Card className="p-8 md:p-12 bg-gradient-glass backdrop-blur-xl shadow-glass border border-white/10 max-w-3xl mx-auto overflow-hidden relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-hero opacity-5 animate-shimmer bg-[length:200%_100%]" />
        
        {/* Progress Section */}
        <div className="relative z-10 mb-10">
          <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
            <span className="font-medium">Question {currentQuestion}</span>
            <span className="bg-muted/50 px-3 py-1 rounded-full">{totalQuestions} total</span>
          </div>
          
          <div className="relative">
            <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-700 ease-out-cubic rounded-full relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-shimmer bg-[length:200%_100%]" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full shadow-glow animate-pulse-glow" 
                 style={{ left: `${Math.max(progressPercentage - 2, 0)}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="relative z-10 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight tracking-tight animate-fade-in">
            {question}
          </h2>
        </div>

        {/* Options */}
        <div className="relative z-10 space-y-4 mb-10">
          {options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={`w-full p-6 text-left border-2 transition-all duration-300 ease-out-cubic hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden ${
                selectedOption === option.id
                  ? 'border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-glow scale-[1.02]'
                  : 'border-border/30 bg-gradient-glass backdrop-blur-sm hover:border-primary/50 hover:shadow-medium'
              }`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                borderRadius: '16px'
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg leading-relaxed pr-4">{option.text}</span>
                {selectedOption === option.id && (
                  <CheckCircle className="h-6 w-6 text-primary animate-scale-in" />
                )}
              </div>
              
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <div className="relative z-10">
          <Button 
            variant="apple-primary" 
            size="lg" 
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="w-full h-16 text-xl font-semibold tracking-tight disabled:opacity-50 disabled:scale-100"
          >
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}