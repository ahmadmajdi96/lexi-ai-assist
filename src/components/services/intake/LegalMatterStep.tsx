import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Clock, Zap, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LegalMatterInfo, URGENCY_LEVELS } from "./IntakeFormTypes";

interface LegalMatterStepProps {
  data: LegalMatterInfo;
  onChange: (data: LegalMatterInfo) => void;
  serviceName: string;
  onNext: () => void;
  onBack: () => void;
}

export const LegalMatterStep = ({ data, onChange, serviceName, onNext, onBack }: LegalMatterStepProps) => {
  const updateField = (field: keyof LegalMatterInfo, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  const isValid = data.matterDescription.length >= 20;

  const urgencyIcons = {
    standard: Clock,
    priority: Zap,
    urgent: AlertTriangle
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 }
    })
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <motion.h3 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold mb-2"
        >
          Legal Matter Details
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm"
        >
          Tell us about your legal needs for <span className="text-gold-500 font-medium">{serviceName}</span>
        </motion.p>
      </div>

      <div className="space-y-5 max-h-[50vh] overflow-y-auto pr-2">
        {/* Matter Description */}
        <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
          <Label htmlFor="matterDescription" className="text-sm font-medium">
            Describe Your Legal Matter *
          </Label>
          <Textarea
            id="matterDescription"
            value={data.matterDescription}
            onChange={(e) => updateField("matterDescription", e.target.value)}
            placeholder="Please provide a detailed description of your legal needs, including any relevant background information..."
            className="mt-1.5 min-h-[120px] resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {data.matterDescription.length}/20 minimum characters
          </p>
        </motion.div>

        {/* Urgency Level */}
        <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
          <Label className="text-sm font-medium mb-3 block">Urgency Level</Label>
          <div className="grid grid-cols-3 gap-3">
            {URGENCY_LEVELS.map((level) => {
              const Icon = urgencyIcons[level.value as keyof typeof urgencyIcons];
              const isSelected = data.urgencyLevel === level.value;
              
              return (
                <button
                  key={level.value}
                  onClick={() => updateField("urgencyLevel", level.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all duration-300 ${
                    isSelected
                      ? "border-gold-500 bg-gold-500/10"
                      : "border-border hover:border-gold-500/50"
                  }`}
                >
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? "text-gold-500" : "text-muted-foreground"}`} />
                  <p className="text-sm font-medium">{level.label}</p>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Opposing Party */}
        <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible">
          <Label htmlFor="opposingParty" className="text-sm font-medium">
            Opposing Party (if applicable)
          </Label>
          <Input
            id="opposingParty"
            value={data.opposingParty}
            onChange={(e) => updateField("opposingParty", e.target.value)}
            placeholder="Name of other party involved, if any"
            className="mt-1.5"
          />
        </motion.div>

        {/* Relevant Dates */}
        <motion.div custom={3} variants={inputVariants} initial="hidden" animate="visible">
          <Label htmlFor="relevantDates" className="text-sm font-medium">
            Important Dates or Deadlines
          </Label>
          <Input
            id="relevantDates"
            value={data.relevantDates}
            onChange={(e) => updateField("relevantDates", e.target.value)}
            placeholder="e.g., Contract expires on Dec 31, 2024"
            className="mt-1.5"
          />
        </motion.div>

        {/* Additional Notes */}
        <motion.div custom={4} variants={inputVariants} initial="hidden" animate="visible">
          <Label htmlFor="additionalNotes" className="text-sm font-medium">
            Additional Notes
          </Label>
          <Textarea
            id="additionalNotes"
            value={data.additionalNotes}
            onChange={(e) => updateField("additionalNotes", e.target.value)}
            placeholder="Any other information that might be helpful..."
            className="mt-1.5 min-h-[80px] resize-none"
          />
        </motion.div>

        {/* Existing Documents */}
        <motion.div custom={5} variants={inputVariants} initial="hidden" animate="visible">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium">Do you have existing documents?</p>
              <p className="text-xs text-muted-foreground">You can upload them after purchase</p>
            </div>
            <Switch
              checked={data.hasExistingDocuments}
              onCheckedChange={(checked) => updateField("hasExistingDocuments", checked)}
            />
          </div>
        </motion.div>

        {/* Preferred Communication */}
        <motion.div custom={6} variants={inputVariants} initial="hidden" animate="visible">
          <Label className="text-sm font-medium mb-3 block">Preferred Communication Method</Label>
          <div className="flex gap-3">
            {["email", "phone", "both"].map((method) => (
              <button
                key={method}
                onClick={() => updateField("preferredCommunication", method)}
                className={`flex-1 py-2 px-4 rounded-lg border-2 capitalize text-sm transition-all duration-300 ${
                  data.preferredCommunication === method
                    ? "border-gold-500 bg-gold-500/10 text-gold-500"
                    : "border-border hover:border-gold-500/50"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onBack}
          className="flex-1 py-3 px-6 border border-border hover:bg-muted rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 disabled:from-muted disabled:to-muted disabled:text-muted-foreground text-navy-900 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-gold-500/20 disabled:shadow-none"
        >
          Review Order
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
