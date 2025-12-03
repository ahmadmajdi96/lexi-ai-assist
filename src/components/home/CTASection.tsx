import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Join thousands of businesses and individuals who trust Ethos Legis Firma 
            for their legal needs. Get started today with a free consultation.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="gold" size="xl" asChild>
              <Link to="/services">
                Browse Services
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button 
              variant="glass" 
              size="xl" 
              className="text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/contact">
                <MessageSquare className="w-5 h-5" />
                Contact Us
              </Link>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <a 
              href="tel:+1234567890" 
              className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>+1 (234) 567-890</span>
            </a>
            <a 
              href="mailto:contact@ethoslegis.com" 
              className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span>contact@ethoslegis.com</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
