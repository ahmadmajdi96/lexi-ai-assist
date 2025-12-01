import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Plus,
  Bell,
  Settings,
  LogOut,
  Scale,
  CheckCircle2,
  HelpCircle,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const activeServices = [
  {
    id: 1,
    title: "LLC Formation",
    status: "in_progress",
    statusLabel: "AI Draft Ready",
    progress: 60,
    lastUpdate: "2 hours ago",
    nextAction: "Review AI Draft"
  },
  {
    id: 2,
    title: "Employment Contract",
    status: "review",
    statusLabel: "Lawyer Reviewing",
    progress: 80,
    lastUpdate: "Yesterday",
    nextAction: "Awaiting Review"
  },
  {
    id: 3,
    title: "NDA Agreement",
    status: "action_required",
    statusLabel: "Action Required",
    progress: 40,
    lastUpdate: "3 days ago",
    nextAction: "Complete Intake Form"
  }
];

const recentDocuments = [
  { id: 1, name: "LLC Operating Agreement Draft v2.pdf", date: "Dec 1, 2025" },
  { id: 2, name: "Employment Contract - John Smith.pdf", date: "Nov 28, 2025" },
  { id: 3, name: "NDA - TechCorp Initial.pdf", date: "Nov 25, 2025" }
];

const notifications = [
  { id: 1, message: "Your LLC draft is ready for review", time: "2 hours ago", unread: true },
  { id: 2, message: "Attorney Sarah assigned to your case", time: "Yesterday", unread: true },
  { id: 3, message: "Payment received - Invoice #1234", time: "3 days ago", unread: false }
];

const statusColors: Record<string, string> = {
  in_progress: "bg-accent/20 text-accent",
  review: "bg-blue-500/20 text-blue-600",
  action_required: "bg-destructive/20 text-destructive",
  completed: "bg-green-500/20 text-green-600"
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-navy-dark" />
              </div>
              <span className="font-display text-xl font-bold">LexCounsel</span>
            </Link>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
              </button>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Link>
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
          <h1 className="font-display text-3xl font-bold mb-2">Welcome back, John</h1>
          <p className="text-muted-foreground">Here's an overview of your legal matters.</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Button variant="gold" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
            <Link to="/services">
              <Plus className="w-5 h-5" />
              <span>New Service</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span>AI Assistant</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <Upload className="w-5 h-5" />
            <span>Upload Document</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            <span>Get Help</span>
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">Active Services</h2>
              <Link to="/my-services" className="text-sm text-accent hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {activeServices.map((service) => (
                <div key={service.id} className="glass-card rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold mb-1">{service.title}</h3>
                      <Badge className={statusColors[service.status]}>
                        {service.statusLabel}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{service.lastUpdate}</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{service.progress}%</span>
                    </div>
                    <Progress value={service.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      <span className="text-muted-foreground">Next: </span>
                      <span className="font-medium">{service.nextAction}</span>
                    </span>
                    <Button variant="navy" size="sm">
                      Continue <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Notifications */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold">Notifications</h2>
                <Badge variant="secondary">
                  {notifications.filter(n => n.unread).length} New
                </Badge>
              </div>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${notification.unread ? "bg-accent/10" : "bg-muted/50"}`}
                  >
                    <p className="text-sm mb-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Documents */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold">Recent Documents</h2>
                <Link to="/documents" className="text-sm text-accent hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <FileText className="w-5 h-5 text-accent mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
