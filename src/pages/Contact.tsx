import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  CheckCircle
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "contact@ethoslegis.com",
    href: "mailto:contact@ethoslegis.com"
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (234) 567-890",
    href: "tel:+1234567890"
  },
  {
    icon: MapPin,
    title: "Address",
    value: "123 Legal Avenue, New York, NY 10001",
    href: "#"
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "Mon - Fri: 9AM - 6PM EST",
    href: "#"
  }
];

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

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
              Contact Us
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mt-3 mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions? We're here to help. Reach out to us and we'll respond 
              within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h2 className="font-display text-2xl font-bold mb-6">
                Contact Information
              </h2>
              <p className="text-muted-foreground mb-8">
                Choose your preferred method to get in touch with our team.
              </p>

              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <item.icon className="w-5 h-5 text-navy-dark" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-muted-foreground text-sm">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* FAQ Link */}
              <div className="mt-12 p-6 glass-card rounded-2xl">
                <MessageSquare className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-display font-semibold mb-2">Have Questions?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check out our FAQ section for quick answers to common questions.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/faqs">View FAQs</a>
                </Button>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="glass-card rounded-3xl p-8 lg:p-12">
                <h2 className="font-display text-2xl font-bold mb-2">
                  Send Us a Message
                </h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (234) 567-890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your legal needs..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="gold" 
                    size="lg" 
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-navy-dark/30 border-t-navy-dark rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
