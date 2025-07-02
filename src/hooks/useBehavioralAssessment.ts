import { useState } from "react";

export interface AssessmentResult {
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading";
  motivation: "intrinsic" | "extrinsic" | "mixed";
  pacePreference: "fast" | "moderate" | "slow";
  challengeLevel: "high" | "medium" | "low";
  socialLearning: "individual" | "group" | "mixed";
  timePreference: "short" | "medium" | "long";
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
    id: "social-1",
    question: "Your ideal learning environment includes:",
    options: [
      { id: "a", text: "Self-paced individual study", value: 1 },
      { id: "b", text: "Group discussions and collaborative learning", value: 2 },
      { id: "c", text: "Mix of individual and group activities", value: 3 },
      { id: "d", text: "One-on-one guidance with personalized feedback", value: 1 },
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
    // Simple algorithm to determine learning preferences
    const learningStyleScores = { visual: 0, auditory: 0, kinesthetic: 0, reading: 0 };
    const styles = ["visual", "auditory", "kinesthetic", "reading"] as const;
    
    if (answers[0]) {
      learningStyleScores[styles[answers[0] - 1]]++;
    }

    const motivationScore = answers[1] || 1;
    const paceScore = answers[2] || 2;
    const challengeScore = answers[3] || 2;
    const socialScore = answers[4] || 1;
    const timeScore = answers[5] || 2;

    return {
      learningStyle: Object.entries(learningStyleScores).reduce((a, b) => 
        learningStyleScores[a[0] as keyof typeof learningStyleScores] > learningStyleScores[b[0] as keyof typeof learningStyleScores] ? a : b
      )[0] as AssessmentResult["learningStyle"],
      motivation: motivationScore === 1 ? "intrinsic" : motivationScore === 2 ? "extrinsic" : "mixed",
      pacePreference: paceScore === 1 ? "fast" : paceScore === 2 ? "moderate" : "slow",
      challengeLevel: challengeScore === 1 ? "low" : challengeScore === 2 ? "medium" : "high",
      socialLearning: socialScore === 1 ? "individual" : socialScore === 2 ? "group" : "mixed",
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