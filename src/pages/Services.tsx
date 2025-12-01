import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Search,
  Loader2
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useServices, useServiceCategories } from "@/hooks/useServices";
import { useCreateCheckout } from "@/hooks/usePurchases";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ServicePurchaseModal } from "@/components/services/ServicePurchaseModal";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Building2,
  Users,
  Lightbulb,
  Home,
  Scale,
};

const Services = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: categories } = useServiceCategories();
  const createCheckout = useCreateCheckout();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);

  const filteredServices = services?.filter((service) => {
    const matchesCategory =
      selectedCategory === "all" || service.category?.slug === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesCategory && matchesSearch;
  });

  const handlePurchase = async (service: typeof services[0]) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in or create an account to purchase services.",
      });
      navigate("/login");
      return;
    }

    setPurchasingId(service.id);

    try {
      const result = await createCheckout.mutateAsync({
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
      });

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setPurchasingId(null);
    }
  };

  const allCategories = [
    { id: "all", name: "All Services", slug: "all" },
    ...(categories || []),
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
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
              {allCategories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    selectedCategory === category.slug
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
          {servicesLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices?.map((service, index) => {
                const IconComponent = iconMap[service.category?.icon || "FileText"] || FileText;
                
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="h-full glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow relative">
                      {service.is_popular && (
                        <Badge className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 border-0">
                          Popular
                        </Badge>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-slate-900" />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {service.turnaround_days} {service.turnaround_days === 1 ? "day" : "days"}
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-semibold mb-2">
                        {service.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {service.description}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2 mb-6">
                        {service.features.slice(0, 4).map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-accent" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">
                            ${(service.price / 100).toFixed(0)}
                          </span>
                        </div>
                        <Button
                          variant="navy"
                          size="sm"
                          onClick={() => setSelectedService(service)}
                        >
                          Get Started
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!servicesLoading && filteredServices?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Purchase Modal */}
      <ServicePurchaseModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />
    </Layout>
  );
};

export default Services;
