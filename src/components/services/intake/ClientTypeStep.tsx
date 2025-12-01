import { motion } from "framer-motion";
import { User, Building2, ArrowRight } from "lucide-react";
import { ClientType } from "./IntakeFormTypes";

interface ClientTypeStepProps {
  value: ClientType;
  onChange: (type: ClientType) => void;
  onNext: () => void;
}

export const ClientTypeStep = ({ value, onChange, onNext }: ClientTypeStepProps) => {
  const options = [
    {
      type: "individual" as ClientType,
      icon: User,
      title: "Individual",
      description: "Personal legal services for individuals and families",
      features: ["Personal contracts", "Estate planning", "Family law matters"]
    },
    {
      type: "business" as ClientType,
      icon: Building2,
      title: "Business",
      description: "Legal services for companies and organizations",
      features: ["Business formation", "Commercial contracts", "Corporate compliance"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.h3 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold mb-2"
        >
          What type of client are you?
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Select the option that best describes your situation
        </motion.p>
      </div>

      <div className="grid gap-4">
        {options.map((option, index) => {
          const Icon = option.icon;
          const isSelected = value === option.type;

          return (
            <motion.button
              key={option.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              onClick={() => onChange(option.type)}
              className={`relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                isSelected
                  ? "border-gold-500 bg-gold-500/10 shadow-lg shadow-gold-500/10"
                  : "border-border hover:border-gold-500/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  isSelected ? "bg-gold-500 text-navy-900" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">{option.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                  <ul className="space-y-1">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-gold-500" : "bg-muted-foreground/50"}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? "border-gold-500 bg-gold-500" : "border-muted-foreground/30"
                }`}>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-navy-900"
                    />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onNext}
        className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-900 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30"
      >
        Continue
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};
