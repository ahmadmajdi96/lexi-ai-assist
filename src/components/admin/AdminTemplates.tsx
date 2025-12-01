import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Edit, Trash2, Loader2, FileText } from "lucide-react";
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
import { useTemplates, useCreateTemplate, useJurisdictions } from "@/hooks/useAdmin";

export const AdminTemplates = () => {
  const { data: templates, isLoading } = useTemplates();
  const { data: jurisdictions } = useJurisdictions();
  const createTemplate = useCreateTemplate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    content: "",
    jurisdiction: "",
  });

  const filteredTemplates = templates?.filter((template: any) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async () => {
    await createTemplate.mutateAsync({
      name: formData.name,
      category: formData.category,
      content: formData.content,
      jurisdiction: formData.jurisdiction || undefined,
    });
    setIsCreateOpen(false);
    setFormData({ name: "", category: "", content: "", jurisdiction: "" });
  };

  const categories = ["Contract", "Agreement", "NDA", "Employment", "Corporate", "Real Estate", "Other"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Manage document templates for AI drafting.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button variant="gold">
              <Plus className="w-4 h-4 mr-2" />
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Template Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Standard NDA Template"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Jurisdiction</Label>
                  <select
                    value={formData.jurisdiction}
                    onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select jurisdiction</option>
                    {jurisdictions?.map((j: any) => (
                      <option key={j.id} value={j.code}>{j.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label>Template Content</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter template content with placeholders like {{party_name}}, {{date}}, etc."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              <Button 
                variant="gold" 
                className="w-full" 
                onClick={handleCreate}
                disabled={createTemplate.isPending || !formData.name || !formData.category || !formData.content}
              >
                {createTemplate.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : filteredTemplates && filteredTemplates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template: any, index: number) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold mb-2">{template.name}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{template.category}</Badge>
                {template.jurisdiction && (
                  <Badge className="bg-blue-500/20 text-blue-600">
                    {template.jurisdiction}
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {template.content.slice(0, 150)}...
              </p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                <span>Created {new Date(template.created_at).toLocaleDateString()}</span>
                <Badge variant={template.is_active ? "default" : "secondary"}>
                  {template.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No templates created yet</p>
          <Button variant="gold" className="mt-4" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Template
          </Button>
        </div>
      )}
    </div>
  );
};
