import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Scale, 
  Target, 
  Heart, 
  Users, 
  Award,
  ArrowRight,
  Linkedin,
  Mail
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for perfection in every document, every interaction, every outcome."
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "Honesty and transparency guide all our actions and client relationships."
  },
  {
    icon: Users,
    title: "Accessibility",
    description: "Making professional legal services available to everyone, not just the few."
  },
  {
    icon: Award,
    title: "Innovation",
    description: "Leveraging technology to improve legal services without compromising quality."
  }
];

const team = [
  {
    name: "Alexandra Chen",
    role: "Founder & CEO",
    bio: "Former BigLaw partner with 15+ years of experience. Harvard Law School.",
    avatar: "AC"
  },
  {
    name: "Michael Roberts",
    role: "Chief Legal Officer",
    bio: "Former General Counsel at Fortune 500 company. Stanford Law School.",
    avatar: "MR"
  },
  {
    name: "Sarah Johnson",
    role: "Head of AI & Technology",
    bio: "PhD in Machine Learning from MIT. Previously led AI at LegalTech startup.",
    avatar: "SJ"
  },
  {
    name: "David Kim",
    role: "Director of Client Success",
    bio: "10+ years in legal operations. Expert in client experience and process optimization.",
    avatar: "DK"
  }
];

const stats = [
  { value: "10,000+", label: "Clients Served" },
  { value: "50,000+", label: "Documents Created" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "50+", label: "Legal Experts" }
];

const About = () => {
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
              About Us
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mt-3 mb-6">
              Reimagining Legal Services for the{" "}
              <span className="text-gradient-gold">Modern Era</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We combine cutting-edge AI technology with expert legal knowledge 
              to make professional legal services accessible, affordable, and efficient.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                LexCounsel was founded with a simple yet ambitious mission: to democratize 
                access to high-quality legal services. We believe that everyone deserves 
                professional legal assistance, regardless of their budget or background.
              </p>
              <p className="text-muted-foreground mb-8">
                By combining advanced AI technology with the expertise of experienced attorneys, 
                we've created a platform that delivers fast, accurate, and affordable legal 
                documents without sacrificing the quality you expect from top-tier law firms.
              </p>
              <Button variant="navy" asChild>
                <Link to="/services">
                  Explore Our Services
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8"
            >
              <Scale className="w-24 h-24 mx-auto text-accent/20 mb-6" />
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-4 rounded-2xl bg-muted/50">
                    <div className="font-display text-3xl font-bold text-gradient-gold mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 mb-4">
              What We Stand For
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-navy-dark" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              Our Team
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3 mb-4">
              Meet the Leadership
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our team combines decades of legal expertise with cutting-edge technology skills.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center group"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-navy flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                  {member.avatar}
                </div>
                <h3 className="font-display text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-accent mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href="#" className="text-muted-foreground hover:text-accent">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-accent">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Join Thousands of Satisfied Clients
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Experience the future of legal services. Get started today.
            </p>
            <Button variant="gold" size="xl" asChild>
              <Link to="/services">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
