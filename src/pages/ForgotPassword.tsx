import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scale, Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEmailSent(true);
      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-hero">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center shadow-gold">
            <Scale className="w-5 h-5 text-slate-900" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold">Ethos Legis Firma</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Legal Services
            </span>
          </div>
        </Link>

        <div className="glass-card rounded-2xl p-8">
          {emailSent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="font-display text-2xl font-bold mb-2">Check Your Email</h1>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold mb-2">Forgot Password?</h1>
              <p className="text-muted-foreground mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant="gold" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-center text-muted-foreground mt-6">
                <Link to="/login" className="text-accent font-medium hover:underline flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
