import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Bot,
  ShoppingCart,
  FolderOpen,
  Scale,
  Activity,
  Globe,
  LogOut,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin, useAllPurchases, useAllUsers } from "@/hooks/useAdmin";
import { useServices } from "@/hooks/useServices";

// Import admin sections
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { AdminServices } from "@/components/admin/AdminServices";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminDocuments } from "@/components/admin/AdminDocuments";
import { AdminTemplates } from "@/components/admin/AdminTemplates";
import { AdminAIConfig } from "@/components/admin/AdminAIConfig";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { AdminCompanyFiles } from "@/components/admin/AdminCompanyFiles";

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "services", label: "Services", icon: Scale },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "company-files", label: "Company Files", icon: FolderOpen },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "templates", label: "Templates", icon: FolderOpen },
  { id: "ai-config", label: "AI Configuration", icon: Bot },
  { id: "settings", label: "Settings", icon: Settings },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { data: isAdmin, isLoading: adminCheckLoading } = useIsAdmin();
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminCheckLoading && isAdmin === false) {
      navigate("/dashboard");
    }
  }, [isAdmin, adminCheckLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || adminCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverview />;
      case "users":
        return <AdminUsers />;
      case "services":
        return <AdminServices />;
      case "orders":
        return <AdminOrders />;
      case "company-files":
        return <AdminCompanyFiles />;
      case "documents":
        return <AdminDocuments />;
      case "templates":
        return <AdminTemplates />;
      case "ai-config":
        return <AdminAIConfig />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <span className="font-display text-lg font-bold">Ethos Legis</span>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {activeSection === item.id && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-8"
        >
          {renderSection()}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
