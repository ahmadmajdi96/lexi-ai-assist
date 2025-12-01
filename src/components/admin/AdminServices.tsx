import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, Loader2, DollarSign, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServices, useServiceCategories } from "@/hooks/useServices";
import { useCreateService, useUpdateService } from "@/hooks/useAdmin";

export const AdminServices = () => {
  const { data: services, isLoading } = useServices();
  const { data: categories } = useServiceCategories();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category_id: "",
    turnaround_days: "3",
    features: "",
  });

  const filteredServices = services?.filter((service: any) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    const features = formData.features.split("\n").filter(f => f.trim());
    await createService.mutateAsync({
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description,
      price: parseInt(formData.price) * 100,
      category_id: formData.category_id || undefined,
      turnaround_days: parseInt(formData.turnaround_days),
      features,
    });
    setIsCreateOpen(false);
    setFormData({ name: "", slug: "", description: "", price: "", category_id: "", turnaround_days: "3", features: "" });
  };

  const handleUpdate = async () => {
    if (!editingService) return;
    const features = formData.features.split("\n").filter(f => f.trim());
    await updateService.mutateAsync({
      id: editingService.id,
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price) * 100,
      category_id: formData.category_id || null,
      turnaround_days: parseInt(formData.turnaround_days),
      features,
    });
    setEditingService(null);
  };

  const openEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description || "",
      price: String(service.price / 100),
      category_id: service.category_id || "",
      turnaround_days: String(service.turnaround_days || 3),
      features: (service.features || []).join("\n"),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage legal services and pricing.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="gold">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Service Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., LLC Formation"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Service description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (USD)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="299"
                  />
                </div>
                <div>
                  <Label>Turnaround (days)</Label>
                  <Input
                    type="number"
                    value={formData.turnaround_days}
                    onChange={(e) => setFormData({ ...formData, turnaround_days: e.target.value })}
                    placeholder="3"
                  />
                </div>
              </div>
              <div>
                <Label>Category</Label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select category</option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Features (one per line)</Label>
                <Textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  rows={4}
                />
              </div>
              <Button 
                variant="gold" 
                className="w-full" 
                onClick={handleCreate}
                disabled={createService.isPending}
              >
                {createService.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices?.map((service: any, index: number) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {service.category?.name || "Uncategorized"}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(service)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {service.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-bold text-foreground">${(service.price / 100).toFixed(0)}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {service.turnaround_days} days
                </div>
              </div>

              {service.is_popular && (
                <Badge className="mt-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 border-0">
                  Popular
                </Badge>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingService} onOpenChange={(open) => !open && setEditingService(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Service Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price (USD)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <Label>Turnaround (days)</Label>
                <Input
                  type="number"
                  value={formData.turnaround_days}
                  onChange={(e) => setFormData({ ...formData, turnaround_days: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Features (one per line)</Label>
              <Textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                rows={4}
              />
            </div>
            <Button 
              variant="gold" 
              className="w-full" 
              onClick={handleUpdate}
              disabled={updateService.isPending}
            >
              {updateService.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
