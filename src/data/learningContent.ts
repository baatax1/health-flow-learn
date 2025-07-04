import { AssessmentResult } from "@/hooks/useBehavioralAssessment";

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: LessonContent[];
  quizQuestions: QuizQuestion[];
}

export interface LessonContent {
  id: string;
  title: string;
  type: "text" | "video" | "interactive" | "quiz" | "conversational";
  content: {
    simple?: string;
    standard?: string;
    advanced?: string;
  };
  visualAids?: string[];
  audioScript?: string;
  conversationalEnabled?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: {
    simple: string;
    standard: string;
    advanced: string;
  };
  options: Array<{
    id: string;
    text: {
      simple: string;
      standard: string;
      advanced: string;
    };
    correct: boolean;
    explanation: {
      simple: string;
      standard: string;
      advanced: string;
    };
  }>;
}

export const learningModules: LearningModule[] = [
  {
    id: "cardiovascular-health",
    title: "Heart Health Basics",
    description: "Understanding how your heart works and how to keep it healthy",
    duration: "25 min",
    lessons: [
      {
        id: "heart-anatomy",
        title: "How Your Heart Works",
        type: "text",
        content: {
          simple: "Your heart is like a pump. It pushes blood around your body. Blood carries oxygen and food to all parts of your body.",
          standard: "The heart is a muscular pump that circulates blood throughout your body. Blood delivers oxygen and nutrients to your organs and tissues.",
          advanced: "The cardiovascular system consists of the heart, blood vessels, and blood. The heart's four chambers work in coordination to maintain systemic and pulmonary circulation, ensuring optimal tissue perfusion."
        },
        visualAids: ["heart-diagram-simple.svg", "blood-flow-animation.gif"],
        audioScript: "Let me tell you about your amazing heart...",
        conversationalEnabled: true
      },
      {
        id: "blood-pressure-basics",
        title: "Understanding Blood Pressure",
        type: "text",
        content: {
          simple: "Blood pressure is how hard your blood pushes against your blood vessel walls. Normal is usually around 120/80.",
          standard: "Blood pressure measures the force of blood against artery walls. It's recorded as two numbers: systolic (top) and diastolic (bottom) pressure.",
          advanced: "Blood pressure represents the hemodynamic force exerted by circulating blood on arterial walls. Systolic pressure reflects ventricular contraction, while diastolic represents ventricular relaxation and arterial elasticity."
        },
        conversationalEnabled: true
      },
      {
        id: "heart-healthy-habits",
        title: "Keeping Your Heart Healthy",
        type: "interactive",
        content: {
          simple: "Eat good foods. Move your body. Don't smoke. Get enough sleep. These help your heart stay strong.",
          standard: "Maintain heart health through regular exercise, a balanced diet rich in fruits and vegetables, adequate sleep, stress management, and avoiding tobacco.",
          advanced: "Cardiovascular risk reduction involves multiple lifestyle interventions: aerobic exercise (150 min/week), Mediterranean-style diet, optimal sleep hygiene (7-9 hours), stress reduction techniques, and smoking cessation."
        },
        conversationalEnabled: true
      }
    ],
    quizQuestions: [
      {
        id: "q1",
        question: {
          simple: "What does your heart do?",
          standard: "What is the primary function of the heart?",
          advanced: "Which best describes the heart's role in cardiovascular physiology?"
        },
        options: [
          {
            id: "a",
            text: {
              simple: "Pumps blood around your body",
              standard: "Circulates blood throughout the body",
              advanced: "Maintains hemodynamic circulation via coordinated ventricular contractions"
            },
            correct: true,
            explanation: {
              simple: "Yes! Your heart pumps blood to bring oxygen and food to all parts of your body.",
              standard: "Correct! The heart's main job is to pump blood, delivering oxygen and nutrients throughout your body.",
              advanced: "Excellent! The heart functions as a dual-pump system maintaining both systemic and pulmonary circulation."
            }
          },
          {
            id: "b",
            text: {
              simple: "Makes you breathe",
              standard: "Controls breathing",
              advanced: "Regulates respiratory function"
            },
            correct: false,
            explanation: {
              simple: "Not quite. Your lungs help you breathe. Your heart pumps blood.",
              standard: "Not correct. The lungs control breathing, while the heart pumps blood.",
              advanced: "Incorrect. Respiratory control is managed by the medullary respiratory centers, not the heart."
            }
          }
        ]
      }
    ]
  },
  {
    id: "nutrition-basics",
    title: "Nutrition Fundamentals",
    description: "Learn about nutrients your body needs and how to eat well",
    duration: "30 min",
    lessons: [
      {
        id: "macronutrients",
        title: "The Big Three: Carbs, Proteins, and Fats",
        type: "text",
        content: {
          simple: "Your body needs three main types of food: carbs for energy, protein to build muscles, and healthy fats for your brain.",
          standard: "Macronutrients include carbohydrates (energy), proteins (tissue building and repair), and fats (hormone production and brain function).",
          advanced: "Macronutrients provide energy and structural components: carbohydrates (4 kcal/g) for immediate energy, proteins (4 kcal/g) for tissue synthesis and enzymatic functions, and lipids (9 kcal/g) for membrane integrity and signaling molecules."
        },
        conversationalEnabled: true
      },
      {
        id: "portion-control",
        title: "How Much Should You Eat?",
        type: "interactive",
        content: {
          simple: "Use your hand to measure food. Your palm = protein. Your fist = vegetables. Your thumb = healthy fats.",
          standard: "Practice portion control using hand measurements as guides. Fill half your plate with vegetables, quarter with lean protein, quarter with whole grains.",
          advanced: "Implement evidence-based portion control strategies using anthropometric measurements. Follow the MyPlate guidelines: 50% non-starchy vegetables, 25% lean protein, 25% complex carbohydrates."
        },
        conversationalEnabled: true
      }
    ],
    quizQuestions: [
      {
        id: "q1",
        question: {
          simple: "What gives your body energy?",
          standard: "Which macronutrient is the body's primary energy source?",
          advanced: "Which macronutrient provides the most readily available glucose for cellular metabolism?"
        },
        options: [
          {
            id: "a",
            text: {
              simple: "Carbs (like bread and fruit)",
              standard: "Carbohydrates",
              advanced: "Carbohydrates via glycolytic pathways"
            },
            correct: true,
            explanation: {
              simple: "Right! Carbs give you quick energy for daily activities.",
              standard: "Correct! Carbohydrates are broken down into glucose, your body's preferred energy source.",
              advanced: "Excellent! Carbohydrates are metabolized to glucose, the primary substrate for cellular ATP production."
            }
          }
        ]
      }
    ]
  }
];

// Adaptive content selector based on user profile
export function getAdaptedContent(content: { simple?: string; standard?: string; advanced?: string }, profile: AssessmentResult): string {
  if (profile.literacyLevel === "basic" || profile.interfaceStyle === "accessible") {
    return content.simple || content.standard || content.advanced || "";
  } else if (profile.literacyLevel === "medium" || profile.interfaceStyle === "simple") {
    return content.standard || content.simple || content.advanced || "";
  } else {
    return content.advanced || content.standard || content.simple || "";
  }
}