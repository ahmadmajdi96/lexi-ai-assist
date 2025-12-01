import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface IntakeProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const IntakeProgressBar = ({ currentStep, totalSteps, steps }: IntakeProgressBarProps) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-border rounded-full" />
        
        {/* Active progress line */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Step indicators */}
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted || isCurrent ? "rgb(212, 175, 55)" : "rgb(var(--muted))"
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  isCompleted 
                    ? "bg-gold-500 border-gold-400" 
                    : isCurrent 
                      ? "bg-gold-500 border-gold-300 shadow-lg shadow-gold-500/30" 
                      : "bg-muted border-border"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-navy-900" />
                ) : (
                  <span className={`text-sm font-semibold ${
                    isCurrent ? "text-navy-900" : "text-muted-foreground"
                  }`}>
                    {index + 1}
                  </span>
                )}
              </motion.div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`absolute -bottom-6 text-xs whitespace-nowrap ${
                  isCurrent ? "text-gold-500 font-medium" : "text-muted-foreground"
                }`}
              >
                {step}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
