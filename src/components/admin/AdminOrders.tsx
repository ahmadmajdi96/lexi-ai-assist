import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Loader2, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAllPurchases } from "@/hooks/useAdmin";

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
  client_review: "Client Review",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const AdminOrders = () => {
  const { data: purchases, isLoading } = useAllPurchases();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredPurchases = purchases?.filter((purchase: any) => {
    const matchesSearch =
      purchase.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all service orders.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="intake_pending">Intake Pending</SelectItem>
            <SelectItem value="ai_drafting">AI Drafting</SelectItem>
            <SelectItem value="lawyer_review">Lawyer Review</SelectItem>
            <SelectItem value="client_review">Client Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases?.map((purchase: any) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-mono text-sm">
                    {purchase.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">
                    {purchase.service?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {purchase.profile?.first_name && purchase.profile?.last_name
                          ? `${purchase.profile.first_name} ${purchase.profile.last_name}`
                          : "No name"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {purchase.profile?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    ${((purchase.amount_paid || 0) / 100).toFixed(0)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[purchase.status]}>
                      {statusLabels[purchase.status] || purchase.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(purchase.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {!isLoading && filteredPurchases?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No orders found
          </div>
        )}
      </motion.div>
    </div>
  );
};
