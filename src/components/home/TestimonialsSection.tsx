import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Founder, GreenTech Solutions",
    avatar: "SM",
    content: "LexCounsel helped us set up our LLC in record time. The AI-generated documents were comprehensive, and the lawyer review gave us peace of mind. Highly recommended!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "CEO, DataFlow Inc.",
    avatar: "MC",
    content: "We've used their contract drafting service multiple times. The turnaround is impressive, and the quality rivals traditional law firms at a fraction of the cost.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "HR Director, Nexus Corp",
    avatar: "ER",
    content: "Their employment law services transformed our HR documentation. The AI assistant helped us understand complex clauses, and the final documents were perfect.",
    rating: 5,
  },
];

export function TestimonialsSection() {
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
            Testimonials
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied clients who trust LexCounsel 
            for their legal needs.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="glass-card rounded-2xl p-6 h-full">
                {/* Quote Icon */}
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center">
                  <Quote className="w-5 h-5 text-navy-dark" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4 pt-2">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-gradient-navy flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
