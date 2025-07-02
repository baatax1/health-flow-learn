import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuizCard } from "@/components/QuizCard";
import { ProgressCard } from "@/components/ProgressCard";
import { LearningPathCard } from "@/components/LearningPathCard";
import { LearningModuleView } from "@/components/LearningModuleView";
import { ProfileCodeCard } from "@/components/ProfileCodeCard";
import { useBehavioralAssessment, type AssessmentResult } from "@/hooks/useBehavioralAssessment";
import { learningModules, getAdaptedContent } from "@/data/learningContent";
import { getUIConfig, getButtonVariant, getLanguageStyle } from "@/utils/adaptiveUI";
import { getProfileFromURL, decodeProfile } from "@/utils/profileCodes";
import { Brain, Heart, Activity, Users, BookOpen, Target } from "lucide-react";
import heroImage from "@/assets/hero-health.jpg";

type AppState = "welcome" | "assessment" | "dashboard" | "learning";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [userProfile, setUserProfile] = useState<AssessmentResult | null>(null);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  
  // Check for profile code in URL on load
  useEffect(() => {
    const profileCode = getProfileFromURL();
    if (profileCode) {
      const decodedProfile = decodeProfile(profileCode);
      if (decodedProfile) {
        setUserProfile(decodedProfile);
        setAppState("dashboard");
        // Clean URL without reload
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);
  
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
    const uiConfig = getUIConfig(profile);
    const language = getLanguageStyle(profile);
    
    return learningModules.map((module, index) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      progress: completedModules.has(module.id) ? 100 : 0,
      status: (index === 0 || completedModules.has(learningModules[index - 1]?.id)) ? "available" as const : 
               completedModules.has(module.id) ? "completed" as const : "locked" as const,
      estimatedTime: module.duration,
      lessons: module.lessons.length,
      content: module.lessons.map(lesson => ({
        ...lesson,
        adaptedContent: getAdaptedContent(lesson.content, profile)
      })),
      onStart: () => {
        setCurrentModule(module.id);
        setAppState("learning");
      }
    }));
  };

  const getAdaptiveText = (profile: AssessmentResult | null) => {
    if (!profile) return {};
    
    const language = getLanguageStyle(profile);
    
    return {
      heroTitle: language.simple ? "Learn About Health" : language.standard ? "Your Health Learning Journey" : "Personalized Health Learning Journey",
      heroSubtitle: language.simple 
        ? "Learn how to stay healthy. Easy lessons just for you." 
        : language.standard 
        ? "Learn health topics that match how you like to learn."
        : "Master health concepts through adaptive learning powered by behavioral science. Get a personalized curriculum that matches your unique learning style.",
      startButton: language.simple ? "Start" : language.standard ? "Begin Assessment" : "Start Your Assessment",
      welcomeText: language.simple
        ? "Welcome! Let's start learning."
        : language.standard
        ? "Welcome to your personalized learning space"
        : "Welcome to Your Personalized Learning Dashboard"
    };
  };

  if (appState === "welcome") {
    // Default text for welcome state
    const adaptiveText = {
      heroTitle: "Personalized Health",
      heroSubtitle: "Master health concepts through adaptive learning powered by behavioral science. Get a personalized curriculum that matches your unique learning style.",
      startButton: "Start Your Assessment"
    };
    
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
              <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-8 tracking-tight" style={{ lineHeight: '1.2' }}>
                {adaptiveText.heroTitle}
                <span className="block bg-gradient-hero bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]" style={{ lineHeight: '1.2' }}>
                  Learning Journey
                </span>
              </h1>
              <p className="text-2xl text-muted-foreground mb-12 leading-relaxed font-light max-w-3xl mx-auto">
                {adaptiveText.heroSubtitle}
              </p>
              
              {/* Inspirational pre-assessment text */}
              <div className="mb-8 p-6 bg-gradient-glass backdrop-blur-xl shadow-glass border border-white/10 max-w-2xl mx-auto" style={{ borderRadius: '20px' }}>
                <p className="text-lg text-foreground mb-4 font-medium">
                  🌟 Ready to transform your health knowledge?
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Take our quick 2-minute assessment to discover your unique learning style and unlock a personalized health education experience designed just for you.
                </p>
              </div>
              
              <Button 
                variant="apple-primary" 
                size="xl"
                onClick={handleStartAssessment}
                className="text-xl px-12 py-6 h-auto shadow-glow hover:shadow-large animate-bounce-gentle"
              >
                {adaptiveText.startButton}
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
    const uiConfig = getUIConfig(userProfile);
    const adaptiveText = getAdaptiveText(userProfile);
    const buttonVariant = getButtonVariant(userProfile);

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card shadow-card">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className={`text-2xl font-bold text-foreground ${uiConfig.fontSize === "xl" ? "text-4xl" : uiConfig.fontSize === "lg" ? "text-3xl" : ""}`}>
                HealthLearn
              </h1>
              <Button variant={buttonVariant} size={uiConfig.buttonSize} onClick={() => setAppState("welcome")}>
                Reset Assessment
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className={`mb-12 ${uiConfig.spacing === "loose" ? "mb-16" : ""}`}>
            <h2 className={`font-bold text-foreground mb-4 ${uiConfig.fontSize === "xl" ? "text-5xl" : uiConfig.fontSize === "lg" ? "text-4xl" : "text-3xl"}`}>
              {adaptiveText.welcomeText}
            </h2>
            <p className={`text-muted-foreground ${uiConfig.fontSize === "xl" ? "text-2xl" : uiConfig.fontSize === "lg" ? "text-xl" : "text-lg"}`}>
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
          <div className={`mb-12 ${uiConfig.spacing === "loose" ? "mb-16" : ""}`}>
            <h3 className={`font-bold text-foreground mb-6 ${uiConfig.fontSize === "xl" ? "text-4xl" : uiConfig.fontSize === "lg" ? "text-3xl" : "text-2xl"}`}>
              Your Learning Path
            </h3>
            <div className={`grid gap-6 ${uiConfig.spacing === "loose" ? "gap-8" : ""} ${learningPaths.length > 2 ? "md:grid-cols-2" : "md:grid-cols-1 max-w-2xl"}`}>
              {learningPaths.map((path, index) => (
                <LearningPathCard
                  key={path.id}
                  title={path.title}
                  description={path.description}
                  progress={path.progress}
                  status={path.status}
                  estimatedTime={path.estimatedTime}
                  lessons={path.lessons}
                  onStart={path.onStart}
                  delay={index * 200}
                />
              ))}
            </div>
          </div>

          {/* Profile Code and Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <ProfileCodeCard 
              userProfile={userProfile}
              onProfileChange={setUserProfile}
            />
            
            <Card className="p-6 bg-gradient-card shadow-glossy border-0">
              <h3 className="text-xl font-semibold mb-4">Your Learning Profile</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
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
                  <span className="text-muted-foreground">Interface Style:</span>
                  <p className="font-medium capitalize">{userProfile.interfaceStyle}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tech Comfort:</span>
                  <p className="font-medium capitalize">{userProfile.techComfort}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (appState === "learning" && userProfile && currentModule) {
    return (
      <LearningModuleView
        moduleId={currentModule}
        userProfile={userProfile}
        onBack={() => setAppState("dashboard")}
        onModuleComplete={(moduleId) => {
          setCompletedModules(prev => new Set(prev).add(moduleId));
        }}
      />
    );
  }
  return null;
};

export default Index;