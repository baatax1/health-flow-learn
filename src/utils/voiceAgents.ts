import { AssessmentResult } from "@/hooks/useBehavioralAssessment";

// ElevenLabs agent configurations for different learning profiles
export const VOICE_AGENTS = {
  // For users with basic literacy or accessible interface needs
  simple: "agent_01jzaf1ma5fehrgqx2npgdq8sq", // Your provided agent ID as default
  
  // For medium literacy users  
  standard: "agent_01jzaf1ma5fehrgqx2npgdq8sq", // Replace with actual agent IDs
  
  // For high literacy users
  advanced: "agent_01jzaf1ma5fehrgqx2npgdq8sq", // Replace with actual agent IDs
  
  // Specialized agents for different behavioral types
  anxious: "agent_01jzaf1ma5fehrgqx2npgdq8sq", // Slow, encouraging pace
  confident: "agent_01jzaf1ma5fehrgqx2npgdq8sq", // Direct, efficient style
  visual: "agent_01jzaf1ma5fehrgqx2npgdq8sq", // Descriptive, visual-focused
} as const;

export interface VoiceAgentConfig {
  agentId: string;
  style: "patient" | "standard" | "efficient";
  pace: "slow" | "normal" | "fast";
  encouragement: "high" | "medium" | "low";
}

export function getVoiceAgentForProfile(profile: AssessmentResult): VoiceAgentConfig {
  // Map behavioral profile to appropriate voice agent
  if (profile.literacyLevel === "basic" || profile.interfaceStyle === "accessible") {
    return {
      agentId: VOICE_AGENTS.simple,
      style: "patient",
      pace: "slow", 
      encouragement: "high"
    };
  }
  
  if (profile.motivation === "intrinsic" || profile.challengeLevel === "low") {
    return {
      agentId: VOICE_AGENTS.anxious,
      style: "patient",
      pace: "normal",
      encouragement: "high"
    };
  }
  
  if (profile.learningStyle === "visual") {
    return {
      agentId: VOICE_AGENTS.visual,
      style: "standard", 
      pace: "normal",
      encouragement: "medium"
    };
  }
  
  if (profile.literacyLevel === "high") {
    return {
      agentId: VOICE_AGENTS.advanced,
      style: "efficient",
      pace: "fast",
      encouragement: "low"
    };
  }
  
  // Default to standard agent
  return {
    agentId: VOICE_AGENTS.standard,
    style: "standard",
    pace: "normal", 
    encouragement: "medium"
  };
}

export function getConversationalContext(
  moduleTitle: string, 
  lessonTitle: string, 
  lessonContent: string,
  profile: AssessmentResult
): string {
  const agentConfig = getVoiceAgentForProfile(profile);
  
  let context = `You are a health education tutor helping with the module "${moduleTitle}", specifically the lesson "${lessonTitle}".`;
  
  // Add style guidance based on profile
  if (agentConfig.style === "patient") {
    context += " Speak slowly and encouragingly. Break down complex concepts into simple terms.";
  } else if (agentConfig.style === "efficient") {
    context += " Be direct and comprehensive. Use advanced terminology when appropriate.";
  }
  
  if (agentConfig.encouragement === "high") {
    context += " Provide frequent positive reinforcement and check for understanding.";
  }
  
  if (profile.learningStyle === "visual") {
    context += " Describe visual elements and suggest imagining scenarios to help with comprehension.";
  }
  
  context += `\n\nLesson content to cover:\n${lessonContent}`;
  
  return context;
}