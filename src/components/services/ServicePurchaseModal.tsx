import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateCheckout } from "@/hooks/usePurchases";
import { useToast } from "@/hooks/use-toast";
import { IntakeProgressBar } from "./intake/IntakeProgressBar";
import { ClientTypeStep } from "./intake/ClientTypeStep";
import { IndividualInfoStep } from "./intake/IndividualInfoStep";
import { BusinessInfoStep } from "./intake/BusinessInfoStep";
import { LegalMatterStep } from "./intake/LegalMatterStep";
import { ReviewStep } from "./intake/ReviewStep";
import {
  IntakeFormData,
  initialIntakeFormData,
} from "./intake/IntakeFormTypes";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  features: string[];
  turnaround_days: number | null;
  is_popular: boolean | null;
  category?: {
    name: string;
    icon: string | null;
  } | null;
}

interface ServicePurchaseModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = ["Client Type", "Details", "Legal Matter", "Review"];

export const ServicePurchaseModal = ({ service, isOpen, onClose }: ServicePurchaseModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const createCheckout = useCreateCheckout();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<IntakeFormData>(initialIntakeFormData);

  if (!service) return null;

  const handleClose = () => {
    setCurrentStep(0);
    setFormData(initialIntakeFormData);
    onClose();
  };

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in or create an account to purchase services.",
      });
      handleClose();
      navigate("/login");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createCheckout.mutateAsync({
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        intakeData: formData as unknown as Record<string, unknown>,
      });

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start checkout",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ClientTypeStep
            value={formData.clientType}
            onChange={(type) => setFormData({ ...formData, clientType: type })}
            onNext={nextStep}
          />
        );
      case 1:
        return formData.clientType === "individual" ? (
          <IndividualInfoStep
            data={formData.individual}
            onChange={(data) => setFormData({ ...formData, individual: data })}
            onNext={nextStep}
            onBack={prevStep}
          />
        ) : (
          <BusinessInfoStep
            data={formData.business}
            onChange={(data) => setFormData({ ...formData, business: data })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <LegalMatterStep
            data={formData.legalMatter}
            onChange={(data) => setFormData({ ...formData, legalMatter: data })}
            serviceName={service.name}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <ReviewStep
            data={formData}
            service={service}
            onBack={prevStep}
            onSubmit={handlePurchase}
            isProcessing={isProcessing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-[calc(100%-2rem)] max-w-3xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col m-4"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-navy-900 to-navy-800 p-6 text-white shrink-0">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="pr-10">
                <span className="text-xs uppercase tracking-wider text-gold-400 font-medium">
                  {service.category?.name || "Legal Service"}
                </span>
                <h2 className="font-display text-xl md:text-2xl font-bold mt-1">{service.name}</h2>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 pb-4">
                <IntakeProgressBar 
                  currentStep={currentStep} 
                  totalSteps={STEPS.length} 
                  steps={STEPS}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
