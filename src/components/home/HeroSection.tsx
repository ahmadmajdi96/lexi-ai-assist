import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "10K+", label: "Clients Served" },
  { value: "98%", label: "Success Rate" },
  { value: "24/7", label: "AI Support" },
  { value: "50+", label: "Legal Experts" },
];

const features = [
  { icon: Shield, text: "Secure & Confidential" },
  { icon: Clock, text: "Fast Turnaround" },
  { icon: Award, text: "Expert Lawyers" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">AI-Powered Legal Services</span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Legal Excellence,{" "}
              <span className="text-gradient-gold">Simplified</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Get professional legal services with the power of AI. From contract drafting 
              to legal consultation, we make law accessible, affordable, and efficient.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Button variant="hero" size="xl" asChild>
                <Link to="/services">
                  Explore Services
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6">
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="w-4 h-4 text-accent" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card rounded-3xl p-8 lg:p-10">
              <h3 className="font-display text-2xl font-semibold mb-8 text-center">
                Trusted by Thousands
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center p-4 rounded-2xl bg-muted/50"
                  >
                    <div className="font-display text-3xl lg:text-4xl font-bold text-gradient-gold mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              
              {/* Testimonial Preview */}
              <div className="mt-8 pt-8 border-t border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-navy-dark font-semibold">
                    JD
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground italic mb-2">
                      "Ethos Legis Firma transformed how we handle legal matters. Fast, professional, 
                      and incredibly efficient."
                    </p>
                    <p className="text-sm font-medium">John Davis</p>
                    <p className="text-xs text-muted-foreground">CEO, TechStart Inc.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-gold rounded-2xl shadow-gold flex items-center justify-center"
            >
              <Shield className="w-10 h-10 text-navy-dark" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
