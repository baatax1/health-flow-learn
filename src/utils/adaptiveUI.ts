import { AssessmentResult } from "@/hooks/useBehavioralAssessment";

export interface UIConfig {
  buttonSize: "sm" | "default" | "lg" | "xl";
  fontSize: "sm" | "base" | "lg" | "xl";
  spacing: "tight" | "normal" | "loose";
  contrast: "normal" | "high";
  animations: "minimal" | "standard" | "enhanced";
  complexity: "simple" | "standard" | "advanced";
}

export function getUIConfig(profile: AssessmentResult): UIConfig {
  // Accessible design for users with accessibility needs or low tech comfort
  if (profile.interfaceStyle === "accessible") {
    return {
      buttonSize: "xl",
      fontSize: "xl",
      spacing: "loose",
      contrast: "high",
      animations: "minimal",
      complexity: "simple"
    };
  }
  
  // Simple design for users who prefer simplicity
  if (profile.interfaceStyle === "simple") {
    return {
      buttonSize: "lg",
      fontSize: "lg",
      spacing: "normal",
      contrast: "normal",
      animations: "standard",
      complexity: "simple"
    };
  }
  
  // Premium design for tech-savvy users
  return {
    buttonSize: "default",
    fontSize: "base",
    spacing: "normal",
    contrast: "normal",
    animations: "enhanced",
    complexity: "advanced"
  };
}

export function getButtonVariant(profile: AssessmentResult, defaultVariant: string = "default"): "default" | "apple-outline" | "apple-minimal" | "apple-primary" | "link" | "secondary" | "destructive" | "outline" | "ghost" | "apple-secondary" | "apple-glass" | "health" | "health-secondary" | "health-outline" {
  if (profile.interfaceStyle === "accessible") {
    return "apple-outline"; // High contrast, clear boundaries
  } else if (profile.interfaceStyle === "simple") {
    return "apple-minimal"; // Clean, simple design
  } else {
    return "apple-primary"; // Premium gradient design
  }
}

export function getLanguageStyle(profile: AssessmentResult) {
  return {
    simple: profile.literacyLevel === "basic" || profile.interfaceStyle === "accessible",
    standard: profile.literacyLevel === "medium" || profile.interfaceStyle === "simple",
    advanced: profile.literacyLevel === "high" && profile.interfaceStyle === "premium"
  };
}