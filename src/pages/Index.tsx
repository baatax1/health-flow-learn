import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuizCard } from "@/components/QuizCard";
import { ProgressCard } from "@/components/ProgressCard";
import { LearningPathCard } from "@/components/LearningPathCard";
import { useBehavioralAssessment, type AssessmentResult } from "@/hooks/useBehavioralAssessment";
import { Brain, Heart, Activity, Users, BookOpen, Target } from "lucide-react";
import heroImage from "@/assets/hero-health.jpg";

type AppState = "welcome" | "assessment" | "dashboard";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [userProfile, setUserProfile] = useState<AssessmentResult | null>(null);
  
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isComplete,
    handleAnswer,
    calculateResults,
    reset,
  } = useBehavioralAssessment();

  const handleStartAssessment = () => {
    setAppState("assessment");
    reset();
  };

  const handleAssessmentComplete = () => {
    const results = calculateResults();
    setUserProfile(results);
    setAppState("dashboard");
  };

  const getPersonalizedLearningPaths = (profile: AssessmentResult) => {
    return [
      {
        title: "Cardiovascular Health Fundamentals",
        description: "Understanding heart health, blood pressure, and circulation basics tailored to your learning style.",
        progress: 0,
        status: "available" as const,
        estimatedTime: profile.timePreference === "short" ? "15 min" : profile.timePreference === "medium" ? "25 min" : "40 min",
        lessons: profile.challengeLevel === "high" ? 8 : profile.challengeLevel === "medium" ? 6 : 4,
      },
      {
        title: "Nutrition Science & Meal Planning",
        description: "Evidence-based nutrition principles with practical meal planning strategies.",
        progress: 0,
        status: "available" as const,
        estimatedTime: profile.timePreference === "short" ? "20 min" : profile.timePreference === "medium" ? "30 min" : "45 min",
        lessons: profile.challengeLevel === "high" ? 10 : profile.challengeLevel === "medium" ? 7 : 5,
      },
      {
        title: "Exercise Physiology & Movement",
        description: "How your body responds to exercise and creating sustainable fitness routines.",
        progress: 0,
        status: "locked" as const,
        estimatedTime: "25 min",
        lessons: 6,
      },
      {
        title: "Mental Health & Stress Management",
        description: "Psychological wellness, stress reduction techniques, and emotional regulation.",
        progress: 0,
        status: "locked" as const,
        estimatedTime: "30 min",
        lessons: 8,
      },
    ];
  };

  if (appState === "welcome") {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-20" />
          
          <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
            <div className="max-w-4xl mx-auto animate-fade-in-up">
              <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-8 leading-none tracking-tight">
                Personalized Health
                <span className="block bg-gradient-hero bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                  Learning Journey
                </span>
              </h1>
              <p className="text-2xl text-muted-foreground mb-12 leading-relaxed font-light max-w-3xl mx-auto">
                Master health concepts through adaptive learning powered by behavioral science. 
                Get a personalized curriculum that matches your unique learning style.
              </p>
              <Button 
                variant="apple-primary" 
                size="xl"
                onClick={handleStartAssessment}
                className="text-2xl px-12 py-6 h-auto shadow-glow hover:shadow-large animate-bounce-gentle"
              >
                Start Your Assessment
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: "Adaptive Learning", desc: "AI-powered algorithm that adapts to your pace, preferences, and progress.", delay: 0 },
              { icon: Target, title: "Behavioral Science", desc: "Evidence-based approach using psychology to optimize your learning experience.", delay: 200 },
              { icon: Heart, title: "Health-Focused", desc: "Comprehensive health education covering nutrition, fitness, and wellness.", delay: 400 }
            ].map((feature, index) => (
              <Card key={index} className="p-10 bg-gradient-glass backdrop-blur-xl shadow-glass border border-white/10 text-center hover:shadow-large transition-all duration-500 hover:scale-[1.02] group animate-fade-in" style={{ animationDelay: `${feature.delay}ms` }}>
                <div className="w-20 h-20 bg-gradient-primary mx-auto mb-8 flex items-center justify-center shadow-glow group-hover:shadow-large transition-all duration-300 group-hover:scale-110" style={{ borderRadius: '20px' }}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (appState === "assessment") {
    if (isComplete) {
      handleAssessmentComplete();
      return null;
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Learning Style Assessment
            </h1>
            <p className="text-muted-foreground">
              Help us understand how you learn best so we can personalize your experience
            </p>
          </div>

          <QuizCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            onAnswer={handleAnswer}
            currentQuestion={currentQuestionIndex}
            totalQuestions={totalQuestions}
          />
        </div>
      </div>
    );
  }

  if (appState === "dashboard" && userProfile) {
    const learningPaths = getPersonalizedLearningPaths(userProfile);

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card shadow-card">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">HealthLearn</h1>
              <Button variant="health-outline" onClick={() => setAppState("welcome")}>
                Reset Assessment
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Welcome to Your Personalized Learning Dashboard
            </h2>
            <p className="text-muted-foreground text-lg">
              Based on your assessment, we've customized your learning experience for{" "}
              <span className="font-medium text-primary">{userProfile.learningStyle}</span> learning with{" "}
              <span className="font-medium text-primary">{userProfile.challengeLevel}</span> challenge level.
            </p>
          </div>

          {/* Progress Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <ProgressCard
              title="Learning Streak"
              value="0"
              subtitle="days in a row"
              icon="trophy"
              gradient="primary"
            />
            <ProgressCard
              title="Modules Completed"
              value="0"
              subtitle="out of 4 available"
              icon="target"
              gradient="secondary"
            />
            <ProgressCard
              title="Study Time"
              value="0h"
              subtitle="total this week"
              icon="clock"
              gradient="primary"
            />
            <ProgressCard
              title="Knowledge Score"
              value="0%"
              subtitle="average across topics"
              icon="trending"
              gradient="secondary"
            />
          </div>

          {/* Learning Paths */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">Your Learning Path</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {learningPaths.map((path, index) => (
                <LearningPathCard
                  key={index}
                  {...path}
                  onStart={() => {
                    // Here you would navigate to the specific learning module
                    console.log(`Starting: ${path.title}`);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Profile Summary */}
          <Card className="p-6 bg-gradient-card shadow-glossy border-0">
            <h3 className="text-xl font-semibold mb-4">Your Learning Profile</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Learning Style:</span>
                <p className="font-medium capitalize">{userProfile.learningStyle}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Motivation:</span>
                <p className="font-medium capitalize">{userProfile.motivation}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Pace Preference:</span>
                <p className="font-medium capitalize">{userProfile.pacePreference}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Challenge Level:</span>
                <p className="font-medium capitalize">{userProfile.challengeLevel}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Social Learning:</span>
                <p className="font-medium capitalize">{userProfile.socialLearning}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Session Length:</span>
                <p className="font-medium capitalize">{userProfile.timePreference}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;