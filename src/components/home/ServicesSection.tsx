import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  Building2, 
  Users, 
  Lightbulb, 
  Home, 
  Scale,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: FileText,
    title: "Contract Drafting",
    description: "AI-powered contract creation with lawyer review. NDAs, agreements, and more.",
    price: "From $199",
    popular: true,
  },
  {
    icon: Building2,
    title: "Business Formation",
    description: "LLC, Corporation, or Partnership setup with all necessary documentation.",
    price: "From $399",
    popular: false,
  },
  {
    icon: Users,
    title: "Employment Law",
    description: "Employment contracts, policies, and workplace compliance documents.",
    price: "From $299",
    popular: false,
  },
  {
    icon: Lightbulb,
    title: "Intellectual Property",
    description: "Trademark registration, copyright protection, and IP strategy.",
    price: "From $499",
    popular: false,
  },
  {
    icon: Home,
    title: "Real Estate",
    description: "Purchase agreements, lease contracts, and property documentation.",
    price: "From $349",
    popular: false,
  },
  {
    icon: Scale,
    title: "Legal Consultation",
    description: "One-on-one consultation with experienced attorneys for any legal matter.",
    price: "From $150/hr",
    popular: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ServicesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Legal Services for Every Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From startups to enterprises, we provide comprehensive legal solutions 
            powered by AI and backed by experienced attorneys.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="h-full glass-card rounded-2xl p-6 hover-lift cursor-pointer">
                {service.popular && (
                  <div className="absolute -top-3 right-6">
                    <span className="bg-gradient-gold text-navy-dark text-xs font-semibold px-3 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                
                <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-navy-dark" />
                </div>
                
                <h3 className="font-display text-xl font-semibold mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="font-semibold text-accent">{service.price}</span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="navy" size="lg" asChild>
            <Link to="/services">
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
