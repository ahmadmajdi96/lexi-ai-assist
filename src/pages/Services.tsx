import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  Building2, 
  Users, 
  Lightbulb, 
  Home, 
  Scale,
  ArrowRight,
  Check,
  Filter,
  Search
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", name: "All Services" },
  { id: "contracts", name: "Contracts" },
  { id: "business", name: "Business" },
  { id: "employment", name: "Employment" },
  { id: "ip", name: "Intellectual Property" },
  { id: "realestate", name: "Real Estate" },
];

const services = [
  {
    id: "nda",
    icon: FileText,
    category: "contracts",
    title: "Non-Disclosure Agreement (NDA)",
    description: "Protect your confidential information with a professionally drafted NDA.",
    features: ["AI-generated draft", "Lawyer review", "E-signature ready", "Unlimited revisions"],
    price: 199,
    turnaround: "24 hours",
    popular: true,
  },
  {
    id: "service-agreement",
    icon: FileText,
    category: "contracts",
    title: "Service Agreement",
    description: "Comprehensive service contracts for freelancers and agencies.",
    features: ["Custom clauses", "Payment terms", "Liability protection", "Termination clauses"],
    price: 299,
    turnaround: "48 hours",
    popular: false,
  },
  {
    id: "llc-formation",
    icon: Building2,
    category: "business",
    title: "LLC Formation",
    description: "Complete LLC setup with articles of organization and operating agreement.",
    features: ["State filing", "EIN application", "Operating agreement", "Compliance guide"],
    price: 399,
    turnaround: "3-5 days",
    popular: true,
  },
  {
    id: "corporation",
    icon: Building2,
    category: "business",
    title: "Corporation Formation",
    description: "Incorporate your business with all necessary documentation.",
    features: ["Articles of incorporation", "Bylaws", "Stock certificates", "Board resolutions"],
    price: 599,
    turnaround: "5-7 days",
    popular: false,
  },
  {
    id: "employment-contract",
    icon: Users,
    category: "employment",
    title: "Employment Contract",
    description: "Comprehensive employment agreements for your team.",
    features: ["Job description", "Compensation details", "Benefits", "Non-compete clause"],
    price: 249,
    turnaround: "48 hours",
    popular: false,
  },
  {
    id: "employee-handbook",
    icon: Users,
    category: "employment",
    title: "Employee Handbook",
    description: "Complete employee handbook with policies and procedures.",
    features: ["Company policies", "HR procedures", "Compliance", "Code of conduct"],
    price: 499,
    turnaround: "5-7 days",
    popular: false,
  },
  {
    id: "trademark",
    icon: Lightbulb,
    category: "ip",
    title: "Trademark Registration",
    description: "Protect your brand with federal trademark registration.",
    features: ["Trademark search", "Application filing", "Office action response", "Registration"],
    price: 599,
    turnaround: "2-4 weeks",
    popular: true,
  },
  {
    id: "copyright",
    icon: Lightbulb,
    category: "ip",
    title: "Copyright Registration",
    description: "Register your creative works for legal protection.",
    features: ["Application prep", "Filing", "Certificate", "Infringement guidance"],
    price: 349,
    turnaround: "1-2 weeks",
    popular: false,
  },
  {
    id: "lease-agreement",
    icon: Home,
    category: "realestate",
    title: "Lease Agreement",
    description: "Residential or commercial lease agreements.",
    features: ["Customizable terms", "Security deposit", "Maintenance clauses", "Renewal options"],
    price: 299,
    turnaround: "48 hours",
    popular: false,
  },
  {
    id: "purchase-agreement",
    icon: Home,
    category: "realestate",
    title: "Real Estate Purchase Agreement",
    description: "Comprehensive purchase agreements for property transactions.",
    features: ["Contingencies", "Closing terms", "Title requirements", "Disclosure schedules"],
    price: 449,
    turnaround: "3-5 days",
    popular: false,
  },
  {
    id: "consultation",
    icon: Scale,
    category: "all",
    title: "Legal Consultation",
    description: "One-on-one consultation with an experienced attorney.",
    features: ["30-minute session", "Any legal topic", "Action plan", "Follow-up summary"],
    price: 150,
    turnaround: "Same day",
    popular: false,
  },
];

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Our Legal Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Professional legal services powered by AI and reviewed by expert attorneys. 
              Transparent pricing, fast turnaround.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-sm z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    selectedCategory === category.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="h-full glass-card rounded-2xl p-6 hover-lift relative">
                  {service.popular && (
                    <Badge className="absolute -top-3 right-6 bg-gradient-gold text-navy-dark border-0">
                      Popular
                    </Badge>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-navy-dark" />
                    </div>
                    <span className="text-sm text-muted-foreground">{service.turnaround}</span>
                  </div>

                  <h3 className="font-display text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-accent" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-2xl font-bold text-gradient-gold">${service.price}</span>
                      {service.id === "consultation" && <span className="text-sm text-muted-foreground">/hr</span>}
                    </div>
                    <Button variant="navy" size="sm" asChild>
                      <Link to={`/services/${service.id}`}>
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
