import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Scale, Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signUp, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false
  });

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/dashboard");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.terms) {
      toast({
        title: "Terms required",
        description: "Please accept the terms and conditions.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      first_name: formData.firstName,
      last_name: formData.lastName,
    });

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Account created!",
      description: "Welcome to Ethos Legis Firma. Let's get started.",
    });

    navigate("/dashboard");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Branding */}
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
            Join Ethos Legis Firma
          </h2>
          <p className="text-primary-foreground/80">
            Get access to professional legal services powered by AI. 
            Fast, affordable, and reliable.
          </p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-8"
        >
          {/* Logo */}
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

          <h1 className="font-display text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-8">
            Join thousands of clients getting professional legal help.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    className="pl-10"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

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
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+1 (234) 567-890"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.terms}
                onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
              />
              <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
              </Label>
            </div>

            <Button type="submit" variant="gold" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
