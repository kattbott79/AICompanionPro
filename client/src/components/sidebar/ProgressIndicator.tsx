import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  Target, 
  Palette, 
  Settings, 
  Rocket,
  CheckCircle,
  Circle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "completed" | "current" | "upcoming";
}

interface ProgressIndicatorProps {
  currentStep: string;
  selectedTemplate?: string;
  className?: string;
}

export function ProgressIndicator({ 
  currentStep, 
  selectedTemplate,
  className 
}: ProgressIndicatorProps) {
  const getSteps = (): ProgressStep[] => {
    const baseSteps: ProgressStep[] = [
      {
        id: "initial",
        title: "Initial Consultation",
        description: "Understanding your needs",
        icon: MessageSquare,
        status: "completed"
      },
      {
        id: "focus_selection",
        title: "Choose Focus Area",
        description: "Business or personal automation",
        icon: Target,
        status: currentStep === "initial" ? "current" : 
               ["business_selection", "personal_selection", "exploration", "custom_requirements"].includes(currentStep) ? "completed" : "upcoming"
      },
      {
        id: "template_selection",
        title: "Select Templates",
        description: "Pick automation templates",
        icon: Palette,
        status: ["business_selection", "personal_selection"].includes(currentStep) ? "current" :
               ["template_configuration", "provider_selection", "deployment"].includes(currentStep) ? "completed" : "upcoming"
      },
      {
        id: "configuration",
        title: "AI Configuration",
        description: "Setup your AI assistant",
        icon: Settings,
        status: currentStep === "template_configuration" ? "current" :
               ["provider_selection", "deployment"].includes(currentStep) ? "completed" : "upcoming"
      },
      {
        id: "deployment",
        title: "Deploy & Test",
        description: "Launch your automation",
        icon: Rocket,
        status: currentStep === "deployment" ? "current" : "upcoming"
      }
    ];

    return baseSteps;
  };

  const steps = getSteps();
  const completedSteps = steps.filter(step => step.status === "completed").length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const getStepIcon = (step: ProgressStep) => {
    const IconComponent = step.icon;
    
    switch (step.status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "current":
        return <IconComponent className="w-4 h-4 text-blue-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStepClasses = (step: ProgressStep) => {
    switch (step.status) {
      case "completed":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "current":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20 scale-105";
      default:
        return "text-gray-400 bg-gray-800/50 border-gray-700/50";
    }
  };

  return (
    <Card className={cn("bg-gray-800/50 border-gray-700/50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-200 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-400" />
          Setup Progress
        </CardTitle>
        
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-gray-300">{completedSteps}/{steps.length} steps</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-start space-x-3 p-3 rounded-lg border transition-all duration-300",
              getStepClasses(step)
            )}
          >
            {/* Step Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {getStepIcon(step)}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-medium">{step.title}</h4>
                {step.status === "current" && (
                  <Badge variant="outline" className="text-xs py-0 px-1">
                    Current
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-400">{step.description}</p>
              
              {/* Additional context for current step */}
              {step.status === "current" && (
                <div className="mt-2">
                  {currentStep === "business_selection" && (
                    <p className="text-xs text-blue-400">
                      Choose your business type to continue
                    </p>
                  )}
                  {currentStep === "personal_selection" && (
                    <p className="text-xs text-green-400">
                      Select your personal automation area
                    </p>
                  )}
                  {currentStep === "template_configuration" && selectedTemplate && (
                    <p className="text-xs text-purple-400">
                      Configuring {selectedTemplate} template
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Step Number */}
            <div className="flex-shrink-0">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                step.status === "completed" ? "bg-green-500 text-white" :
                step.status === "current" ? "bg-blue-500 text-white" :
                "bg-gray-700 text-gray-400"
              )}>
                {index + 1}
              </div>
            </div>
          </div>
        ))}

        {/* Next Step Hint */}
        {currentStep !== "deployment" && (
          <div className="pt-3 border-t border-gray-700/50">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>
                {currentStep === "initial" && "Choose your automation focus next"}
                {["business_selection", "personal_selection"].includes(currentStep) && "Select a template to continue"}
                {currentStep === "template_configuration" && "Configure your AI settings"}
                {currentStep === "provider_selection" && "Ready for deployment!"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
