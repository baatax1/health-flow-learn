import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, Trophy, Star, MessageCircle } from "lucide-react";
import { AssessmentResult } from "@/hooks/useBehavioralAssessment";
import { learningModules, getAdaptedContent, LearningModule } from "@/data/learningContent";
import { getUIConfig, getButtonVariant } from "@/utils/adaptiveUI";
import { ConversationalTutorView } from "@/components/ConversationalTutorView";
import confetti from "canvas-confetti";

interface LearningModuleViewProps {
  moduleId: string;
  userProfile: AssessmentResult;
  onBack: () => void;
  onModuleComplete: (moduleId: string) => void;
}

export function LearningModuleView({ moduleId, userProfile, onBack, onModuleComplete }: LearningModuleViewProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [moduleCompleted, setModuleCompleted] = useState(false);
  const [showConversationalMode, setShowConversationalMode] = useState(false);
  
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

  const triggerCelebration = () => {
    // Confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B']
    });
    
    // Additional bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
    }, 250);
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);
  };

  const handleNext = () => {
    const newCompletedLessons = new Set(completedLessons).add(currentLessonIndex);
    setCompletedLessons(newCompletedLessons);
    
    if (currentLessonIndex < module.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else {
      // Module completed!
      setModuleCompleted(true);
      setShowCelebration(true);
      triggerCelebration();
      
      // Auto-return to dashboard after celebration
      setTimeout(() => {
        onModuleComplete(moduleId);
        onBack();
      }, 3000);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const isLastLesson = currentLessonIndex === module.lessons.length - 1;
  const isFirstLesson = currentLessonIndex === 0;
  const isCompleted = completedLessons.has(currentLessonIndex);
  const hasConversationalMode = currentLesson.conversationalEnabled;

  // Show conversational mode if enabled
  if (showConversationalMode && hasConversationalMode) {
    return (
      <ConversationalTutorView
        module={module}
        lesson={currentLesson}
        userProfile={userProfile}
        onBack={() => setShowConversationalMode(false)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isFirstLesson={isFirstLesson}
        isLastLesson={isLastLesson}
      />
    );
  }

  // Celebration overlay
  if (showCelebration) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-20 animate-pulse" />
        <Card className="p-12 bg-gradient-glass backdrop-blur-xl shadow-large border border-white/20 text-center max-w-lg mx-auto animate-scale-in">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-primary mx-auto mb-6 flex items-center justify-center shadow-glow animate-bounce-gentle" style={{ borderRadius: '20px' }}>
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              🎉 Congratulations!
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              You've completed <span className="font-semibold text-primary">{module.title}</span>!
            </p>
            <div className="flex items-center justify-center gap-2 text-health-success">
              <Star className="h-6 w-6 animate-pulse" />
              <span className="font-medium">Module Complete</span>
              <Star className="h-6 w-6 animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground">
            Returning to dashboard in a moment...
          </p>
        </Card>
      </div>
    );
  }

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
            
            <div className="flex items-center justify-between mb-4">
              {isCompleted && (
                <div className="flex items-center gap-2 text-health-success animate-fade-in">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Lesson Complete</span>
                </div>
              )}
              
              {hasConversationalMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConversationalMode(true)}
                  className="flex items-center gap-2 ml-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  Talk with Tutor
                </Button>
              )}
            </div>
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
            {isLastLesson ? "🏆 Complete Module" : "Next Lesson"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}