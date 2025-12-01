import { motion } from "framer-motion";
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAllPurchases, useAllUsers } from "@/hooks/useAdmin";
import { useServices } from "@/hooks/useServices";

export const AdminOverview = () => {
  const { data: purchases } = useAllPurchases();
  const { data: users } = useAllUsers();
  const { data: services } = useServices();

  // Calculate stats
  const totalRevenue = purchases?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0;
  const totalOrders = purchases?.length || 0;
  const totalUsers = users?.length || 0;
  const activeServices = services?.length || 0;

  const pendingOrders = purchases?.filter(p => 
    ["intake_pending", "ai_drafting", "lawyer_review", "client_review"].includes(p.status)
  ).length || 0;

  const completedOrders = purchases?.filter(p => p.status === "completed").length || 0;

  const recentOrders = purchases?.slice(0, 5) || [];

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${(totalRevenue / 100).toLocaleString()}`,
      change: "+12.5%",
      positive: true,
      icon: DollarSign,
      color: "from-emerald-500 to-green-400",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      change: "+8.2%",
      positive: true,
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-400",
    },
    {
      label: "Total Users",
      value: totalUsers.toString(),
      change: "+15.3%",
      positive: true,
      icon: Users,
      color: "from-purple-500 to-pink-400",
    },
    {
      label: "Active Services",
      value: activeServices.toString(),
      change: "0%",
      positive: true,
      icon: TrendingUp,
      color: "from-amber-500 to-yellow-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.positive ? "text-emerald-500" : "text-red-500"}`}>
                {stat.positive ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Order Status Overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="font-display text-xl font-semibold mb-6">Order Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-amber-500/10">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>Pending Orders</span>
              </div>
              <span className="text-2xl font-bold text-amber-500">{pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>Completed Orders</span>
              </div>
              <span className="text-2xl font-bold text-emerald-500">{completedOrders}</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                <span>Total Orders</span>
              </div>
              <span className="text-2xl font-bold text-blue-500">{totalOrders}</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="font-display text-xl font-semibold mb-6">Recent Orders</h2>
          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">{order.service?.name || "Service"}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.profile?.email || "Unknown user"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      ${((order.amount_paid || 0) / 100).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {order.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No orders yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
