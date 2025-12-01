import { motion } from "framer-motion";
import { Search, FileEdit, MessageSquare, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Choose Your Service",
    description: "Browse our catalog of legal services and select what you need. Clear pricing, no hidden fees.",
  },
  {
    icon: FileEdit,
    number: "02",
    title: "Complete Intake Form",
    description: "Answer simple questions about your specific situation. Our smart forms adapt to your needs.",
  },
  {
    icon: MessageSquare,
    number: "03",
    title: "AI Drafts Your Documents",
    description: "Our AI assistant creates customized legal documents based on your input and industry best practices.",
  },
  {
    icon: CheckCircle2,
    number: "04",
    title: "Lawyer Review & Delivery",
    description: "Expert attorneys review and finalize your documents. Sign electronically and you're done.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Simple Process, Exceptional Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get professional legal documents in four easy steps. 
            No complicated procedures, just straightforward service.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-center">
                  {/* Icon Container */}
                  <div className="relative inline-flex mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center shadow-card">
                      <step.icon className="w-8 h-8 text-accent" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center text-sm font-bold text-navy-dark">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
