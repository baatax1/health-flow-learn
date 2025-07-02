import { AssessmentResult } from "@/hooks/useBehavioralAssessment";

// Word banks for generating memorable codes
const STYLE_WORDS = {
  visual: ["bright", "sharp", "clear", "vivid", "crystal"],
  auditory: ["melodic", "rhythmic", "harmonic", "tuned", "resonant"],
  kinesthetic: ["swift", "agile", "dynamic", "active", "kinetic"],
  reading: ["wise", "studious", "scholarly", "thoughtful", "detailed"]
};

const COMFORT_WORDS = {
  premium: ["eagle", "falcon", "phoenix", "hawk", "dragon"],
  simple: ["oak", "pine", "cedar", "maple", "willow"],
  accessible: ["gentle", "calm", "steady", "patient", "kind"]
};

const CHALLENGE_WORDS = {
  high: ["summit", "peak", "apex", "zenith", "crest"],
  medium: ["bridge", "path", "journey", "flow", "stream"],
  low: ["meadow", "garden", "harbor", "haven", "grove"]
};

// Preset profile codes for common learning patterns
export const PRESET_PROFILES: Record<string, AssessmentResult> = {
  "bright-eagle-summit": {
    learningStyle: "visual",
    motivation: "intrinsic",
    pacePreference: "fast",
    challengeLevel: "high",
    socialLearning: "individual",
    timePreference: "medium",
    techComfort: "high",
    interfaceStyle: "premium",
    accessibilityNeeds: "none",
    literacyLevel: "high"
  },
  "wise-oak-bridge": {
    learningStyle: "reading",
    motivation: "mixed",
    pacePreference: "moderate",
    challengeLevel: "medium",
    socialLearning: "individual",
    timePreference: "medium",
    techComfort: "medium",
    interfaceStyle: "simple",
    accessibilityNeeds: "none",
    literacyLevel: "medium"
  },
  "gentle-calm-garden": {
    learningStyle: "visual",
    motivation: "extrinsic",
    pacePreference: "slow",
    challengeLevel: "low",
    socialLearning: "individual",
    timePreference: "short",
    techComfort: "low",
    interfaceStyle: "accessible",
    accessibilityNeeds: "visual",
    literacyLevel: "basic"
  },
  "melodic-pine-flow": {
    learningStyle: "auditory",
    motivation: "mixed",
    pacePreference: "moderate",
    challengeLevel: "medium",
    socialLearning: "group",
    timePreference: "medium",
    techComfort: "medium",
    interfaceStyle: "simple",
    accessibilityNeeds: "none",
    literacyLevel: "medium"
  },
  "swift-falcon-peak": {
    learningStyle: "kinesthetic",
    motivation: "intrinsic",
    pacePreference: "fast",
    challengeLevel: "high",
    socialLearning: "mixed",
    timePreference: "long",
    techComfort: "high",
    interfaceStyle: "premium",
    accessibilityNeeds: "none",
    literacyLevel: "high"
  }
};

// Generate a code from assessment result
export function encodeProfile(profile: AssessmentResult): string {
  const styleWord = STYLE_WORDS[profile.learningStyle][0];
  const comfortWord = COMFORT_WORDS[profile.interfaceStyle][0];
  const challengeWord = CHALLENGE_WORDS[profile.challengeLevel][0];
  
  return `${styleWord}-${comfortWord}-${challengeWord}`;
}

// Decode a profile code back to assessment result
export function decodeProfile(code: string): AssessmentResult | null {
  // Check preset profiles first
  if (PRESET_PROFILES[code]) {
    return PRESET_PROFILES[code];
  }
  
  const parts = code.split('-');
  if (parts.length !== 3) return null;
  
  const [styleWord, comfortWord, challengeWord] = parts;
  
  // Find matching style
  const learningStyle = Object.entries(STYLE_WORDS).find(([_, words]) => 
    words.includes(styleWord)
  )?.[0] as AssessmentResult['learningStyle'];
  
  // Find matching interface style
  const interfaceStyle = Object.entries(COMFORT_WORDS).find(([_, words]) => 
    words.includes(comfortWord)
  )?.[0] as AssessmentResult['interfaceStyle'];
  
  // Find matching challenge level
  const challengeLevel = Object.entries(CHALLENGE_WORDS).find(([_, words]) => 
    words.includes(challengeWord)
  )?.[0] as AssessmentResult['challengeLevel'];
  
  if (!learningStyle || !interfaceStyle || !challengeLevel) return null;
  
  // Create a reasonable default profile based on the decoded values
  return createDefaultProfile(learningStyle, interfaceStyle, challengeLevel);
}

// Create a sensible default profile from core attributes
function createDefaultProfile(
  learningStyle: AssessmentResult['learningStyle'],
  interfaceStyle: AssessmentResult['interfaceStyle'],
  challengeLevel: AssessmentResult['challengeLevel']
): AssessmentResult {
  return {
    learningStyle,
    interfaceStyle,
    challengeLevel,
    motivation: challengeLevel === "high" ? "intrinsic" : challengeLevel === "low" ? "extrinsic" : "mixed",
    pacePreference: challengeLevel === "high" ? "fast" : challengeLevel === "low" ? "slow" : "moderate",
    socialLearning: "individual",
    timePreference: challengeLevel === "high" ? "long" : challengeLevel === "low" ? "short" : "medium",
    techComfort: interfaceStyle === "premium" ? "high" : interfaceStyle === "accessible" ? "low" : "medium",
    accessibilityNeeds: interfaceStyle === "accessible" ? "visual" : "none",
    literacyLevel: challengeLevel === "high" ? "high" : challengeLevel === "low" ? "basic" : "medium"
  };
}

// Get a human-readable description of a profile code
export function getProfileDescription(code: string): string {
  const profile = decodeProfile(code);
  if (!profile) return "Unknown profile";
  
  const styleDesc = {
    visual: "visual learner",
    auditory: "auditory learner", 
    kinesthetic: "hands-on learner",
    reading: "reading-focused learner"
  }[profile.learningStyle];
  
  const interfaceDesc = {
    premium: "advanced interface",
    simple: "clean interface", 
    accessible: "accessible design"
  }[profile.interfaceStyle];
  
  const challengeDesc = {
    high: "high challenge",
    medium: "balanced approach",
    low: "gentle progression"
  }[profile.challengeLevel];
  
  return `${styleDesc} with ${interfaceDesc} and ${challengeDesc}`;
}

// Generate a shareable URL with profile code
export function generateShareableURL(code: string, baseURL?: string): string {
  const base = baseURL || window.location.origin;
  return `${base}?profile=${code}`;
}

// Extract profile code from URL
export function getProfileFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('profile');
}

// Get all available preset profile codes
export function getPresetCodes(): Array<{ code: string; description: string }> {
  return Object.keys(PRESET_PROFILES).map(code => ({
    code,
    description: getProfileDescription(code)
  }));
}