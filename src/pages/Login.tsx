import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Scale, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });

    setIsLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center shadow-gold">
              <Scale className="w-5 h-5 text-navy-dark" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold">LexCounsel</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Legal Services
              </span>
            </div>
          </Link>

          <h1 className="font-display text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to access your client portal and manage your legal matters.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.remember}
                onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })}
              />
              <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            <Button type="submit" variant="gold" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-navy-dark/30 border-t-navy-dark rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent font-medium hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-accent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] bg-accent rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative text-center max-w-md"
        >
          <Scale className="w-24 h-24 mx-auto text-accent mb-8" />
          <h2 className="font-display text-3xl font-bold text-primary-foreground mb-4">
            Your Legal Partner
          </h2>
          <p className="text-primary-foreground/80">
            Access your documents, communicate with your lawyer, and track your 
            legal matters all in one place.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
