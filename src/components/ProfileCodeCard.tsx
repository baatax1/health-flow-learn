import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, RotateCcw, Sparkles, CheckCircle } from "lucide-react";
import { AssessmentResult } from "@/hooks/useBehavioralAssessment";
import { encodeProfile, decodeProfile, getProfileDescription, generateShareableURL, getPresetCodes } from "@/utils/profileCodes";
import { useToast } from "@/hooks/use-toast";

interface ProfileCodeCardProps {
  userProfile: AssessmentResult;
  onProfileChange: (profile: AssessmentResult) => void;
  className?: string;
}

export function ProfileCodeCard({ userProfile, onProfileChange, className }: ProfileCodeCardProps) {
  const [codeInput, setCodeInput] = useState("");
  const [isDecoding, setIsDecoding] = useState(false);
  const { toast } = useToast();
  
  const currentCode = encodeProfile(userProfile);
  const presetCodes = getPresetCodes();

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      toast({
        title: "Copied!",
        description: "Profile code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleShareURL = async () => {
    try {
      const shareURL = generateShareableURL(currentCode);
      await navigator.clipboard.writeText(shareURL);
      toast({
        title: "Share URL copied!",
        description: "Anyone can use this link to load your learning profile",
      });
    } catch (err) {
      toast({
        title: "Share failed",
        description: "Could not copy share URL",
        variant: "destructive",
      });
    }
  };

  const handleDecodeCode = () => {
    if (!codeInput.trim()) return;
    
    setIsDecoding(true);
    const decoded = decodeProfile(codeInput.trim().toLowerCase());
    
    if (decoded) {
      onProfileChange(decoded);
      setCodeInput("");
      toast({
        title: "Profile loaded!",
        description: `Applied profile: ${getProfileDescription(codeInput)}`,
      });
    } else {
      toast({
        title: "Invalid code",
        description: "Could not decode this profile code",
        variant: "destructive",
      });
    }
    setIsDecoding(false);
  };

  const handlePresetSelect = (code: string) => {
    const profile = decodeProfile(code);
    if (profile) {
      onProfileChange(profile);
      toast({
        title: "Preset applied!",
        description: `Loaded: ${getProfileDescription(code)}`,
      });
    }
  };

  return (
    <Card className={`p-6 bg-gradient-glass backdrop-blur-xl shadow-glass border border-white/10 ${className}`}>
      <div className="space-y-6">
        {/* Current Profile Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Your Profile Code</h3>
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="text-lg px-4 py-2 font-mono">
              {currentCode}
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleCopyCode}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShareURL}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {getProfileDescription(currentCode)}
          </p>
        </div>

        {/* Load Profile Section */}
        <div>
          <h4 className="font-medium mb-3">Load Different Profile</h4>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter profile code (e.g. bright-eagle-summit)"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDecodeCode()}
              className="font-mono"
            />
            <Button 
              onClick={handleDecodeCode}
              disabled={!codeInput.trim() || isDecoding}
              size="sm"
            >
              {isDecoding ? <RotateCcw className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Preset Profiles */}
        <div>
          <h4 className="font-medium mb-3">Quick Presets</h4>
          <div className="grid grid-cols-1 gap-2">
            {presetCodes.slice(0, 3).map(({ code, description }) => (
              <button
                key={code}
                onClick={() => handlePresetSelect(code)}
                className="text-left p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-primary">{code}</span>
                  {currentCode === code && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-3">
          <p className="font-medium mb-1">💡 How it works:</p>
          <p>Profile codes are memorable 3-word combinations that encode your learning preferences. Share them with others or bookmark different learning styles!</p>
        </div>
      </div>
    </Card>
  );
}