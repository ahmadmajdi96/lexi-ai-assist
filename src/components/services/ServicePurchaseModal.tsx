import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight, Loader2, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateCheckout } from "@/hooks/usePurchases";
import { useToast } from "@/hooks/use-toast";

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

export const ServicePurchaseModal = ({ service, isOpen, onClose }: ServicePurchaseModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const createCheckout = useCreateCheckout();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!service) return null;

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in or create an account to purchase services.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createCheckout.mutateAsync({
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-navy-900 to-navy-800 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="pr-8">
                <span className="text-xs uppercase tracking-wider text-gold-400 font-medium">
                  {service.category?.name || "Legal Service"}
                </span>
                <h2 className="font-display text-2xl font-bold mt-1">{service.name}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <p className="text-muted-foreground mb-6">{service.description}</p>

              {/* Features */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">What's Included:</h3>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Turnaround */}
              {service.turnaround_days && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <Shield className="w-4 h-4 text-accent" />
                  <span>Estimated delivery: {service.turnaround_days} business days</span>
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Shield className="w-5 h-5 text-accent" />
                  <span className="text-xs">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <CreditCard className="w-5 h-5 text-accent" />
                  <span className="text-xs">Money-back Guarantee</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6 bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-muted-foreground">Total Price</span>
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">
                    ${(service.price / 100).toFixed(0)}
                  </div>
                </div>
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handlePurchase}
                  disabled={isProcessing}
                  className="min-w-[160px]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Purchase Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                By purchasing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
