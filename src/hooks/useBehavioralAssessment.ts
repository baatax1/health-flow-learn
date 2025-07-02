import { useState } from "react";

export interface AssessmentResult {
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading";
  motivation: "intrinsic" | "extrinsic" | "mixed";
  pacePreference: "fast" | "moderate" | "slow";
  challengeLevel: "high" | "medium" | "low";
  socialLearning: "individual" | "group" | "mixed";
  timePreference: "short" | "medium" | "long";
  // New UX preferences
  techComfort: "high" | "medium" | "low";
  interfaceStyle: "premium" | "simple" | "accessible";
  accessibilityNeeds: "none" | "visual" | "cognitive" | "motor";
  literacyLevel: "high" | "medium" | "basic";
}

const assessmentQuestions = [
  {
    id: "learning-style-1",
    question: "When learning something new, you prefer to:",
    options: [
      { id: "a", text: "See diagrams, charts, and visual explanations", value: 1 },
      { id: "b", text: "Listen to explanations and discussions", value: 2 },
      { id: "c", text: "Practice hands-on activities and experiments", value: 3 },
      { id: "d", text: "Read detailed written instructions", value: 4 },
    ]
  },
  {
    id: "tech-comfort",
    question: "How comfortable are you with technology and apps?",
    options: [
      { id: "a", text: "Very comfortable - I love trying new features", value: 3 },
      { id: "b", text: "Somewhat comfortable - I can figure things out", value: 2 },
      { id: "c", text: "Basic comfort - I prefer simple, familiar interfaces", value: 1 },
      { id: "d", text: "I need help with technology sometimes", value: 1 },
    ]
  },
  {
    id: "interface-preference",
    question: "Which type of app design do you prefer?",
    options: [
      { id: "a", text: "Sleek, modern design with lots of features", value: 3 },
      { id: "b", text: "Clean, simple design that's easy to navigate", value: 2 },
      { id: "c", text: "Large buttons and text that's easy to see", value: 1 },
      { id: "d", text: "Whatever works best - I don't have a preference", value: 2 },
    ]
  },
  {
    id: "reading-preference",
    question: "When reading health information, you prefer:",
    options: [
      { id: "a", text: "Detailed explanations with medical terminology", value: 3 },
      { id: "b", text: "Clear explanations in everyday language", value: 2 },
      { id: "c", text: "Simple, easy-to-understand descriptions", value: 1 },
      { id: "d", text: "Visual guides with minimal text", value: 1 },
    ]
  },
  {
    id: "accessibility-needs",
    question: "Do you have any preferences that would help you learn better?",
    options: [
      { id: "a", text: "I'd like larger text and buttons", value: 1 },
      { id: "b", text: "I'd prefer audio options when available", value: 2 },
      { id: "c", text: "I need more time to read and process information", value: 3 },
      { id: "d", text: "Standard options work fine for me", value: 4 },
    ]
  },
  {
    id: "motivation-1",
    question: "What motivates you most to learn about health topics?",
    options: [
      { id: "a", text: "Personal curiosity and desire to understand", value: 1 },
      { id: "b", text: "Improving health outcomes and achieving goals", value: 2 },
      { id: "c", text: "Recognition and sharing knowledge with others", value: 2 },
      { id: "d", text: "Both personal interest and practical benefits", value: 3 },
    ]
  },
  {
    id: "pace-1",
    question: "When studying, you typically prefer to:",
    options: [
      { id: "a", text: "Move quickly through material and cover lots of ground", value: 1 },
      { id: "b", text: "Take a steady, consistent pace", value: 2 },
      { id: "c", text: "Go slowly and deeply understand each concept", value: 3 },
      { id: "d", text: "Vary the pace depending on the topic", value: 2 },
    ]
  },
  {
    id: "challenge-1",
    question: "How do you feel about challenging health concepts?",
    options: [
      { id: "a", text: "I love tackling complex topics that push my limits", value: 3 },
      { id: "b", text: "I prefer moderate challenges with clear guidance", value: 2 },
      { id: "c", text: "I like to start with basics and build up gradually", value: 1 },
      { id: "d", text: "I prefer easy-to-understand, practical information", value: 1 },
    ]
  },
  {
    id: "time-1",
    question: "How much time do you typically have for learning sessions?",
    options: [
      { id: "a", text: "5-10 minutes for quick bite-sized lessons", value: 1 },
      { id: "b", text: "15-30 minutes for focused study sessions", value: 2 },
      { id: "c", text: "45+ minutes for deep-dive learning", value: 3 },
      { id: "d", text: "Variable time depending on my schedule", value: 2 },
    ]
  }
];

export function useBehavioralAssessment() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
    }
  };

  const calculateResults = (): AssessmentResult => {
    // Enhanced algorithm to determine learning preferences and UX needs
    const learningStyleScores = { visual: 0, auditory: 0, kinesthetic: 0, reading: 0 };
    const styles = ["visual", "auditory", "kinesthetic", "reading"] as const;
    
    if (answers[0]) {
      learningStyleScores[styles[answers[0] - 1]]++;
    }

    // Extract scores for new UX dimensions
    const techComfortScore = answers[1] || 2;
    const interfaceScore = answers[2] || 2;
    const literacyScore = answers[3] || 2;
    const accessibilityScore = answers[4] || 4;
    const motivationScore = answers[5] || 1;
    const paceScore = answers[6] || 2;
    const challengeScore = answers[7] || 2;
    const timeScore = answers[8] || 2;

    // Determine interface style based on multiple factors
    const determineInterfaceStyle = () => {
      if (accessibilityScore <= 2 || literacyScore === 1 || techComfortScore === 1) {
        return "accessible";
      } else if (interfaceScore === 2 || techComfortScore === 2) {
        return "simple";
      } else {
        return "premium";
      }
    };

    return {
      learningStyle: Object.entries(learningStyleScores).reduce((a, b) => 
        learningStyleScores[a[0] as keyof typeof learningStyleScores] > learningStyleScores[b[0] as keyof typeof learningStyleScores] ? a : b
      )[0] as AssessmentResult["learningStyle"],
      techComfort: techComfortScore === 1 ? "low" : techComfortScore === 2 ? "medium" : "high",
      interfaceStyle: determineInterfaceStyle(),
      accessibilityNeeds: accessibilityScore === 1 ? "visual" : accessibilityScore === 2 ? "visual" : accessibilityScore === 3 ? "cognitive" : "none",
      literacyLevel: literacyScore === 1 ? "basic" : literacyScore === 2 ? "medium" : "high",
      motivation: motivationScore === 1 ? "intrinsic" : motivationScore === 2 ? "extrinsic" : "mixed",
      pacePreference: paceScore === 1 ? "fast" : paceScore === 2 ? "moderate" : "slow",
      challengeLevel: challengeScore === 1 ? "low" : challengeScore === 2 ? "medium" : "high",
      socialLearning: "individual", // Simplified for now
      timePreference: timeScore === 1 ? "short" : timeScore === 2 ? "medium" : "long",
    };
  };

  const getCurrentQuestion = () => assessmentQuestions[currentQuestionIndex];

  const reset = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsComplete(false);
  };

  return {
    currentQuestion: getCurrentQuestion(),
    currentQuestionIndex: currentQuestionIndex + 1,
    totalQuestions: assessmentQuestions.length,
    isComplete,
    handleAnswer,
    calculateResults,
    reset,
  };
}