import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Trash2,
  Download,
  Search,
  Building,
  FileSpreadsheet,
  File,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  useCompanyFiles,
  useUploadCompanyFile,
  useDeleteCompanyFile,
} from "@/hooks/useCompanyFiles";
import { useServices } from "@/hooks/useServices";
import { supabase } from "@/integrations/supabase/client";

const categoryLabels: Record<string, string> = {
  company_identity: "Company Identity",
  service_template: "Service Template",
  legal_reference: "Legal Reference",
  general: "General",
};

const categoryColors: Record<string, string> = {
  company_identity: "bg-blue-500/20 text-blue-600",
  service_template: "bg-purple-500/20 text-purple-600",
  legal_reference: "bg-amber-500/20 text-amber-600",
  general: "bg-muted text-muted-foreground",
};

export const AdminCompanyFiles = () => {
  const { data: files, isLoading } = useCompanyFiles();
  const { data: services } = useServices();
  const uploadFile = useUploadCompanyFile();
  const deleteFile = useDeleteCompanyFile();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("company_identity");
  const [uploadServiceId, setUploadServiceId] = useState<string>("");
  const [uploadDescription, setUploadDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = files?.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || file.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadFile.mutateAsync({
      file,
      category: uploadCategory,
      serviceId: uploadServiceId || undefined,
      description: uploadDescription || undefined,
    });

    setIsUploadOpen(false);
    setUploadDescription("");
    setUploadServiceId("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = async (file: { file_path: string; name: string }) => {
    const { data } = supabase.storage
      .from("company-files")
      .getPublicUrl(file.file_path);
    window.open(data.publicUrl, "_blank");
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string | null) => {
    if (type?.includes("spreadsheet") || type?.includes("csv"))
      return <FileSpreadsheet className="w-5 h-5" />;
    if (type?.includes("document") || type?.includes("word"))
      return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Company Files</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage company identity files, templates, and references.
          </p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button variant="gold">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Company File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company_identity">
                      Company Identity
                    </SelectItem>
                    <SelectItem value="service_template">
                      Service Template
                    </SelectItem>
                    <SelectItem value="legal_reference">
                      Legal Reference
                    </SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {uploadCategory === "service_template" && (
                <div className="space-y-2">
                  <Label>Associated Service (Optional)</Label>
                  <Select
                    value={uploadServiceId}
                    onValueChange={setUploadServiceId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services?.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Brief description of the file..."
                />
              </div>

              <div className="space-y-2">
                <Label>File (CSV, DOC, DOCX, PDF, TXT)</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.doc,.docx,.pdf,.txt,.xls,.xlsx"
                  onChange={handleFileUpload}
                  disabled={uploadFile.isPending}
                />
              </div>

              {uploadFile.isPending && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="company_identity">Company Identity</SelectItem>
            <SelectItem value="service_template">Service Template</SelectItem>
            <SelectItem value="legal_reference">Legal Reference</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Files Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : filteredFiles && filteredFiles.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        {getFileIcon(file.file_type)}
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        {file.description && (
                          <p className="text-xs text-muted-foreground">
                            {file.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={categoryColors[file.category]}>
                      {categoryLabels[file.category] || file.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFileSize(file.file_size)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(file.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteFile.mutate(file)}
                        disabled={deleteFile.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No files uploaded yet</h3>
            <p className="text-sm text-muted-foreground">
              Upload company files to use with AI and services.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
