import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

  const handleSubmit = () => {
    if (selectedOption) {
      const option = options.find(opt => opt.id === selectedOption);
      if (option) {
        onAnswer(option.value);
        setSelectedOption(null);
      }
    }
  };

  return (
    <Card className="p-8 bg-gradient-card shadow-glossy border-0 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentQuestion}</span>
          <span>{totalQuestions} total</span>
        </div>
        <div className="w-full h-2 bg-muted overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-500 ease-out"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl font-semibold text-foreground mb-8 leading-relaxed">
        {question}
      </h2>

      {/* Options */}
      <div className="space-y-4 mb-8">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={`w-full p-4 text-left border-2 transition-all duration-200 hover:shadow-card ${
              selectedOption === option.id
                ? 'border-primary bg-primary/10 shadow-card'
                : 'border-border bg-background hover:border-primary/50'
            }`}
          >
            <span className="font-medium">{option.text}</span>
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <Button 
        variant="health" 
        size="lg" 
        onClick={handleSubmit}
        disabled={!selectedOption}
        className="w-full"
      >
        Continue
      </Button>
    </Card>
  );
}