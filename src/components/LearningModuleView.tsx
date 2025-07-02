import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen } from "lucide-react";
import { AssessmentResult } from "@/hooks/useBehavioralAssessment";
import { learningModules, getAdaptedContent, LearningModule } from "@/data/learningContent";
import { getUIConfig, getButtonVariant } from "@/utils/adaptiveUI";

interface LearningModuleViewProps {
  moduleId: string;
  userProfile: AssessmentResult;
  onBack: () => void;
}

export function LearningModuleView({ moduleId, userProfile, onBack }: LearningModuleViewProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  
  const module = learningModules.find(m => m.id === moduleId);
  const uiConfig = getUIConfig(userProfile);
  const buttonVariant = getButtonVariant(userProfile);
  
  if (!module) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Module not found</h2>
          <Button variant={buttonVariant} onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const currentLesson = module.lessons[currentLessonIndex];
  const progress = (completedLessons.size / module.lessons.length) * 100;

  const handleNext = () => {
    setCompletedLessons(prev => new Set(prev).add(currentLessonIndex));
    
    if (currentLessonIndex < module.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const isLastLesson = currentLessonIndex === module.lessons.length - 1;
  const isFirstLesson = currentLessonIndex === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-soft">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size={uiConfig.buttonSize}
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Button>
            <div className="text-center">
              <h1 className={`font-bold text-foreground ${uiConfig.fontSize === "xl" ? "text-2xl" : "text-xl"}`}>
                {module.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {module.lessons.length}
              </p>
            </div>
            <div className="w-24" /> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Section */}
        <div className={`mb-8 ${uiConfig.spacing === "loose" ? "mb-12" : ""}`}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Overall Progress
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Lesson Content */}
        <Card className="p-8 md:p-12 bg-gradient-glass backdrop-blur-xl shadow-glass border border-white/10 mb-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className={`font-bold text-foreground ${uiConfig.fontSize === "xl" ? "text-4xl" : uiConfig.fontSize === "lg" ? "text-3xl" : "text-2xl"}`}>
                {currentLesson.title}
              </h2>
            </div>
            
            {completedLessons.has(currentLessonIndex) && (
              <div className="flex items-center gap-2 text-health-success mb-4">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Lesson Complete</span>
              </div>
            )}
          </div>

          <div className={`prose prose-lg max-w-none ${uiConfig.fontSize === "xl" ? "prose-xl" : ""}`}>
            <div className={`text-foreground leading-relaxed ${uiConfig.fontSize === "xl" ? "text-2xl" : uiConfig.fontSize === "lg" ? "text-xl" : "text-lg"}`}>
              {getAdaptedContent(currentLesson.content, userProfile)}
            </div>
          </div>

          {/* Audio Option for Accessibility */}
          {userProfile.accessibilityNeeds === "visual" && currentLesson.audioScript && (
            <div className="mt-8 p-6 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">🔊 Audio Available</h4>
              <p className="text-sm text-muted-foreground">
                Audio narration available for this lesson
              </p>
            </div>
          )}

          {/* Visual Aids */}
          {currentLesson.visualAids && currentLesson.visualAids.length > 0 && (
            <div className="mt-8">
              <h4 className="font-medium mb-4">📊 Visual Learning Aids</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {currentLesson.visualAids.map((aid, index) => (
                  <div key={index} className="p-4 bg-muted/20 rounded-lg text-center">
                    <div className="w-full h-32 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-primary font-medium">{aid}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="apple-outline"
            size={uiConfig.buttonSize}
            onClick={handlePrevious}
            disabled={isFirstLesson}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Previous
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {currentLessonIndex + 1} of {module.lessons.length} lessons
            </p>
          </div>

          <Button
            variant={buttonVariant}
            size={uiConfig.buttonSize}
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            {isLastLesson ? "Complete Module" : "Next Lesson"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}