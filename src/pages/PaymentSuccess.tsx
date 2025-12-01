import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { usePurchases } from "@/hooks/usePurchases";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: purchases, isLoading } = usePurchases();
  const [countdown, setCountdown] = useState(3);

  // Get the most recent purchase
  const latestPurchase = purchases?.[0];

  useEffect(() => {
    if (!isLoading && latestPurchase) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate(`/purchase/${latestPurchase.id}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading, latestPurchase, navigate]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="font-display text-3xl font-bold mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your legal service is now being prepared.
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading your order...</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Redirecting to your order in {countdown} seconds...
            </p>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
