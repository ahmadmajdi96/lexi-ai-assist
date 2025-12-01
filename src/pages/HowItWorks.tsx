import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Search, 
  FileEdit, 
  MessageSquare, 
  CheckCircle2,
  ArrowRight,
  Bot,
  Shield,
  Clock,
  Users,
  FileCheck,
  Sparkles
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Choose Your Service",
    description: "Browse our comprehensive catalog of legal services. Each service includes transparent pricing, estimated delivery time, and detailed scope of work.",
    details: [
      "Filter by category or search",
      "Compare service tiers",
      "See exactly what's included",
      "No hidden fees or surprises"
    ]
  },
  {
    number: "02",
    icon: FileEdit,
    title: "Complete Your Intake Form",
    description: "Our smart intake forms are designed to gather all necessary information efficiently. Answer questions specific to your service, and the form adapts based on your responses.",
    details: [
      "Service-specific questions",
      "Auto-save as you go",
      "Upload relevant documents",
      "Progress tracking"
    ]
  },
  {
    number: "03",
    icon: Bot,
    title: "AI Creates Your Draft",
    description: "Our advanced AI assistant analyzes your inputs and generates a customized legal document. Chat with the AI to clarify terms, request changes, or understand legal concepts.",
    details: [
      "Powered by advanced LLMs",
      "Industry-specific templates",
      "Jurisdiction-aware drafting",
      "Interactive chat assistance"
    ]
  },
  {
    number: "04",
    icon: Users,
    title: "Lawyer Review",
    description: "Every document is reviewed by a licensed attorney. They ensure accuracy, compliance, and that your specific needs are addressed.",
    details: [
      "Expert attorney review",
      "Compliance verification",
      "Custom recommendations",
      "Direct messaging available"
    ]
  },
  {
    number: "05",
    icon: FileCheck,
    title: "Sign & Deliver",
    description: "Review the final document, request any final changes, and sign electronically. Your completed documents are stored securely in your client portal.",
    details: [
      "E-signature integration",
      "Secure document storage",
      "Download anytime",
      "Version history"
    ]
  }
];

const benefits = [
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Most services completed within 24-48 hours"
  },
  {
    icon: Shield,
    title: "Secure & Confidential",
    description: "Bank-level encryption for all your data"
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Advanced technology for better accuracy"
  },
  {
    icon: Users,
    title: "Expert Review",
    description: "Every document reviewed by licensed attorneys"
  }
];

const HowItWorks = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              How It Works
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 mb-6">
              Legal Services Made{" "}
              <span className="text-gradient-gold">Simple</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              From selection to signature, our streamlined process combines AI efficiency 
              with expert legal oversight to deliver exceptional results.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/services">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-8 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground text-sm">{benefit.title}</p>
                  <p className="text-xs text-primary-foreground/70">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-6xl font-display font-bold text-gradient-gold">
                      {step.number}
                    </span>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-navy-dark" />
                    </div>
                  </div>
                  <h2 className="font-display text-3xl font-bold mb-4">
                    {step.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="glass-card rounded-3xl p-8 aspect-[4/3] flex items-center justify-center">
                    <step.icon className="w-32 h-32 text-accent/20" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 text-center"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ready to Experience the Future of Legal Services?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of satisfied clients who've simplified their legal needs with LexCounsel.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/services">
                  Browse Services
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/contact">Talk to Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;
