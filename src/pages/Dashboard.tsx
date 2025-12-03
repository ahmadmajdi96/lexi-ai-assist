import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  MessageSquare, 
  ArrowRight,
  Bell,
  Settings,
  LogOut,
  Scale,
  HelpCircle,
  Loader2,
  Check,
  ShoppingBag,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { usePurchases } from "@/hooks/usePurchases";
import { useServices, Service } from "@/hooks/useServices";
import { useToast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/hooks/useAdmin";
import { ServicePurchaseModal } from "@/components/services/ServicePurchaseModal";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  intake_pending: "bg-amber-500/20 text-amber-600",
  ai_drafting: "bg-blue-500/20 text-blue-600",
  lawyer_review: "bg-purple-500/20 text-purple-600",
  client_review: "bg-accent/20 text-accent",
  completed: "bg-green-500/20 text-green-600",
  cancelled: "bg-destructive/20 text-destructive",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  intake_pending: "Intake Pending",
  ai_drafting: "AI Drafting",
  lawyer_review: "Lawyer Review",
  client_review: "Your Review",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusProgress: Record<string, number> = {
  draft: 10,
  intake_pending: 25,
  ai_drafting: 50,
  lawyer_review: 75,
  client_review: 90,
  completed: 100,
  cancelled: 0,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { data: purchases, isLoading: purchasesLoading } = usePurchases();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { toast } = useToast();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (!adminLoading && isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      toast({
        title: "Payment Successful!",
        description: "Your service has been purchased. Complete your intake form to get started.",
      });
    }
  }, [searchParams, toast]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) return null;

  const firstName = user.user_metadata?.first_name || user.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-slate-900" />
              </div>
              <span className="font-display text-xl font-bold">Ethos Legis Firma</span>
            </Link>

            <div className="flex items-center gap-4">
              <button 
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => toast({ title: "Notifications", description: "No new notifications" })}
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
              </button>
              <button 
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={() => toast({ title: "Settings", description: "Settings page coming soon!" })}
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold mb-2">Welcome back, {firstName}</h1>
          <p className="text-muted-foreground">Manage your legal services and browse new offerings.</p>
        </motion.div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="my-services" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="my-services" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              My Services
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Browse Services
            </TabsTrigger>
          </TabsList>

          {/* My Services Tab */}
          <TabsContent value="my-services">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Active Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-semibold">Your Services</h2>
                </div>

                {purchasesLoading ? (
                  <div className="glass-card rounded-2xl p-12 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                  </div>
                ) : purchases && purchases.length > 0 ? (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="glass-card rounded-2xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold mb-1">{purchase.service?.name || "Service"}</h3>
                            <Badge className={statusColors[purchase.status]}>
                              {statusLabels[purchase.status] || purchase.status}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(purchase.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{statusProgress[purchase.status]}%</span>
                          </div>
                          <Progress value={statusProgress[purchase.status]} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {purchase.amount_paid
                              ? `Paid: $${(purchase.amount_paid / 100).toFixed(2)}`
                              : "Payment pending"}
                          </span>
                          <Button 
                            variant="navy" 
                            size="sm"
                            onClick={() => navigate(`/purchase/${purchase.id}`)}
                          >
                            View Details <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No services yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get started by purchasing your first legal service.
                    </p>
                    <Button 
                      variant="gold"
                      onClick={() => {
                        const tabsList = document.querySelector('[value="browse"]') as HTMLButtonElement;
                        tabsList?.click();
                      }}
                    >
                      Browse Services
                    </Button>
                  </div>
                )}
              </motion.div>

              {/* Right Sidebar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-6"
              >
                {/* AI Assistant Card */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Legal Assistant</h3>
                      <p className="text-xs text-muted-foreground">Ask questions anytime</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get instant answers to your legal questions from our AI assistant.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.dispatchEvent(new CustomEvent('openAIChat'))}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Open Chat
                  </Button>
                </div>

                {/* Quick Links */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    <Link
                      to="/how-it-works"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <HelpCircle className="w-5 h-5 text-accent" />
                      <span className="text-sm">How It Works</span>
                    </Link>
                    <Link
                      to="/contact"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-accent" />
                      <span className="text-sm">Contact Support</span>
                    </Link>
                    <Link
                      to="/faqs"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <FileText className="w-5 h-5 text-accent" />
                      <span className="text-sm">FAQs</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Browse Services Tab */}
          <TabsContent value="browse">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <h2 className="font-display text-xl font-semibold mb-2">Available Services</h2>
                <p className="text-muted-foreground">Select a service to purchase and complete the intake form.</p>
              </div>

              {servicesLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services?.map((service) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() => setSelectedService(service)}
                    >
                      <div className="h-full glass-card rounded-2xl p-6 hover:shadow-lg transition-all relative border-2 border-transparent hover:border-accent/30">
                        {service.is_popular && (
                          <Badge className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 border-0">
                            Popular
                          </Badge>
                        )}

                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-slate-900" />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {service.turnaround_days} {service.turnaround_days === 1 ? "day" : "days"}
                          </span>
                        </div>

                        <h3 className="font-display text-lg font-semibold mb-2">
                          {service.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {service.description}
                        </p>

                        {/* Features Preview */}
                        <ul className="space-y-1 mb-4">
                          {service.features.slice(0, 3).map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-xs">
                              <Check className="w-3 h-3 text-accent" />
                              <span className="text-muted-foreground truncate">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Price */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent">
                            ${(service.price / 100).toFixed(0)}
                          </span>
                          <Button variant="navy" size="sm">
                            Get Service
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Service Purchase Modal with Intake Form */}
      <ServicePurchaseModal
        service={selectedService}
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
};

export default Dashboard;
