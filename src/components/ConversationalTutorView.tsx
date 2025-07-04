import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mic, MicOff, MessageCircle, Volume2 } from "lucide-react";
import { AssessmentResult } from "@/hooks/useBehavioralAssessment";
import { LearningModule, LessonContent, getAdaptedContent } from "@/data/learningContent";
import { getVoiceAgentForProfile, getConversationalContext } from "@/utils/voiceAgents";
import { getUIConfig, getButtonVariant } from "@/utils/adaptiveUI";

interface ConversationalTutorViewProps {
  module: LearningModule;
  lesson: LessonContent;
  userProfile: AssessmentResult;
  onBack: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstLesson: boolean;
  isLastLesson: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': {
        'agent-id': string;
        style?: React.CSSProperties;
      };
    }
  }
}

export function ConversationalTutorView({
  module,
  lesson,
  userProfile,
  onBack,
  onNext,
  onPrevious,
  isFirstLesson,
  isLastLesson
}: ConversationalTutorViewProps) {
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);
  
  const uiConfig = getUIConfig(userProfile);
  const buttonVariant = getButtonVariant(userProfile);
  const agentConfig = getVoiceAgentForProfile(userProfile);
  const lessonContent = getAdaptedContent(lesson.content, userProfile);
  
  const conversationContext = getConversationalContext(
    module.title,
    lesson.title,
    lessonContent,
    userProfile
  );

  useEffect(() => {
    // Initialize conversation widget when component mounts
    if (conversationRef.current) {
      console.log("Initializing ElevenLabs conversation with agent:", agentConfig.agentId);
      console.log("Conversation context:", conversationContext);
    }
  }, [agentConfig.agentId, conversationContext]);

  const handleStartConversation = () => {
    setIsConversationActive(true);
    // The ElevenLabs widget will handle the actual conversation
  };

  const handleEndConversation = () => {
    setIsConversationActive(false);
  };

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
              Back to Lesson
            </Button>
            <div className="text-center">
              <h1 className={`font-bold text-foreground ${uiConfig.fontSize === "xl" ? "text-2xl" : "text-xl"}`}>
                🎙️ Voice Tutor: {lesson.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {module.title} - Interactive Learning
              </p>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Conversation Interface */}
        <Card className="p-8 bg-gradient-glass backdrop-blur-xl shadow-glass border border-white/10 mb-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-primary mx-auto mb-6 flex items-center justify-center shadow-glow animate-pulse" style={{ borderRadius: '20px' }}>
              <Volume2 className="h-12 w-12 text-white" />
            </div>
            
            <h2 className={`font-bold text-foreground mb-4 ${uiConfig.fontSize === "xl" ? "text-3xl" : "text-2xl"}`}>
              Your AI Health Tutor
            </h2>
            
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Have a natural conversation about {lesson.title}. Your tutor is personalized to your learning style: 
              <span className="font-medium text-primary"> {agentConfig.style} pace, {agentConfig.encouragement} encouragement</span>.
            </p>

            {/* Conversation Status */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isConversationActive 
                  ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                  : 'bg-muted/40 text-muted-foreground'
              }`}>
                {isConversationActive ? (
                  <>
                    <Mic className="h-4 w-4 animate-pulse" />
                    <span className="text-sm font-medium">Conversation Active</span>
                  </>
                ) : (
                  <>
                    <MicOff className="h-4 w-4" />
                    <span className="text-sm font-medium">Ready to Start</span>
                  </>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mb-8">
              {!isConversationActive ? (
                <Button
                  variant={buttonVariant}
                  size="lg"
                  onClick={handleStartConversation}
                  className="flex items-center gap-2"
                >
                  <Mic className="h-5 w-5" />
                  Start Conversation
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleEndConversation}
                  className="flex items-center gap-2"
                >
                  <MicOff className="h-5 w-5" />
                  End Conversation
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                {showTranscript ? 'Hide' : 'Show'} Content
              </Button>
            </div>
          </div>

          {/* ElevenLabs Conversation Widget */}
          <div ref={conversationRef} className="mb-8">
            <elevenlabs-convai 
              agent-id={agentConfig.agentId}
              style={{
                width: '100%',
                height: '400px',
                border: 'none',
                borderRadius: '12px'
              }}
            />
          </div>

          {/* Lesson Content (Hidden by default, shown on request) */}
          {showTranscript && (
            <div className="mt-8 p-6 bg-muted/20 rounded-lg">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                📚 Lesson Content Reference
              </h4>
              <div className={`prose prose-lg max-w-none ${uiConfig.fontSize === "xl" ? "prose-xl" : ""}`}>
                <div className={`text-foreground leading-relaxed ${uiConfig.fontSize === "xl" ? "text-xl" : "text-lg"}`}>
                  {lessonContent}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="apple-outline"
            size={uiConfig.buttonSize}
            onClick={onPrevious}
            disabled={isFirstLesson}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Previous Lesson
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Voice tutoring for {lesson.title}
            </p>
          </div>

          <Button
            variant={buttonVariant}
            size={uiConfig.buttonSize}
            onClick={onNext}
            className="flex items-center gap-2"
          >
            {isLastLesson ? "🏆 Complete Module" : "Next Lesson"}
          </Button>
        </div>
      </div>
    </div>
  );
}