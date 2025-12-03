import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  User,
  Upload,
  Sparkles,
  Check,
  RefreshCw,
  Download,
  MessageSquare,
  Loader2,
  AlertCircle,
  Eye,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { DocumentViewerDialog } from "@/components/shared/DocumentViewerDialog";
import { AIChatMessage } from "@/components/shared/AIChatMessage";
import { FileUploader } from "@/components/shared/FileUploader";

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

const AdminOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPromptFeedback, setAiPromptFeedback] = useState("");
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [editedDraft, setEditedDraft] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<any>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Fetch purchase details
  const { data: purchase, isLoading: purchaseLoading } = useQuery({
    queryKey: ["admin-purchase", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          service:services(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;

      // Fetch profile separately
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user_id)
        .single();

      return { ...data, profile };
    },
    enabled: !!id && !!isAdmin,
  });

  // Fetch service documents
  const { data: documents } = useQuery({
    queryKey: ["admin-service-documents", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_documents")
        .select("*")
        .eq("purchase_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch messages
  const { data: messages } = useQuery({
    queryKey: ["admin-purchase-messages", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_messages")
        .select("*")
        .eq("purchase_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  type ServiceStatus = "draft" | "intake_pending" | "ai_drafting" | "lawyer_review" | "client_review" | "completed" | "cancelled";

  // Update purchase status mutation
  const updateStatus = useMutation({
    mutationFn: async (status: ServiceStatus) => {
      const { data, error } = await supabase
        .from("purchases")
        .update({ 
          status,
          completed_at: status === "completed" ? new Date().toISOString() : null
        })
        .eq("id", id)
        .select();

      if (error) throw error;
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-purchase", id] });
      toast({ title: "Status updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    },
  });

  // Update AI draft mutation
  const updateDraft = useMutation({
    mutationFn: async (ai_draft: string) => {
      const { data, error } = await supabase
        .from("purchases")
        .update({ ai_draft })
        .eq("id", id)
        .select();

      if (error) throw error;
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-purchase", id] });
      toast({ title: "Draft saved successfully" });
    },
  });

  // Create service document mutation
  const createDocument = useMutation({
    mutationFn: async (doc: { name: string; content?: string; file_path?: string; document_type: string; status: string }) => {
      const { data, error } = await supabase
        .from("service_documents")
        .insert({
          ...doc,
          purchase_id: id,
          user_id: purchase?.user_id,
        })
        .select();

      if (error) throw error;
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-documents", id] });
      toast({ title: "Document created successfully" });
    },
  });

  useEffect(() => {
    if (!authLoading && !adminLoading && (!user || !isAdmin)) {
      navigate("/admin");
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  useEffect(() => {
    if (purchase?.ai_draft) {
      setEditedDraft(purchase.ai_draft);
    }
  }, [purchase?.ai_draft]);

  const handleGenerateAI = async (feedback?: string) => {
    if (!purchase) return;

    setIsGenerating(true);
    setShowFeedbackDialog(false);

    try {
      const response = await supabase.functions.invoke("generate-document", {
        body: {
          purchaseId: id,
          serviceName: purchase.service?.name,
          intakeData: purchase.intake_data,
          feedback: feedback || undefined,
          previousDraft: feedback ? editedDraft : undefined,
        },
      });

      if (response.error) throw response.error;

      if (response.data?.document) {
        await updateDraft.mutateAsync(response.data.document);
        setEditedDraft(response.data.document);
        await updateStatus.mutateAsync("lawyer_review");
        toast({ title: "Document generated successfully!" });
      }
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast({
        title: "Error generating document",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveDocument = async () => {
    if (!editedDraft) return;

    try {
      // Save the final draft
      await updateDraft.mutateAsync(editedDraft);

      // Create final document record
      await createDocument.mutateAsync({
        name: `${purchase?.service?.name || "Document"} - Final`,
        content: editedDraft,
        document_type: "final",
        status: "approved",
      });

      // Update status to client review
      await updateStatus.mutateAsync("client_review");

      toast({ title: "Document approved and sent to client!" });
    } catch (error: any) {
      toast({
        title: "Error approving document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCompleteOrder = async () => {
    try {
      await updateStatus.mutateAsync("completed");
      toast({ title: "Order marked as completed!" });
    } catch (error: any) {
      toast({
        title: "Error completing order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !purchase) return;

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("intake-documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("intake-documents")
        .getPublicUrl(fileName);

      await createDocument.mutateAsync({
        name: file.name,
        file_path: publicUrl,
        document_type: "final",
        status: "approved",
      });

      await updateStatus.mutateAsync("client_review");

      toast({ title: "Document uploaded and sent to client!" });
    } catch (error: any) {
      toast({
        title: "Error uploading document",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (authLoading || adminLoading || purchaseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
          <h2 className="font-semibold mb-2">Order Not Found</h2>
          <Button variant="outline" onClick={() => navigate("/admin")}>
            Go to Admin Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const intakeData = purchase.intake_data as any || {};

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">Order Details</h1>
          <p className="text-sm text-muted-foreground">
            Order ID: {purchase.id.slice(0, 8)}...
          </p>
        </div>
        <Select
          value={purchase.status}
          onValueChange={(value: ServiceStatus) => updateStatus.mutate(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
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

      {/* Order Summary */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-lg">{purchase.service?.name || "Unknown"}</p>
            <p className="text-sm text-muted-foreground">${((purchase.amount_paid || 0) / 100).toFixed(0)} paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Client</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-lg">
              {purchase.profile?.first_name} {purchase.profile?.last_name}
            </p>
            <p className="text-sm text-muted-foreground">{purchase.profile?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`${statusColors[purchase.status]} text-sm px-3 py-1`}>
              {statusLabels[purchase.status]}
            </Badge>
            <p className="text-sm text-muted-foreground mt-2">
              Created: {new Date(purchase.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="intake" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="intake" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Intake Data
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="ai-draft" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Draft
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Messages
          </TabsTrigger>
        </TabsList>

        {/* Intake Data Tab */}
        <TabsContent value="intake">
          <Card>
            <CardHeader>
              <CardTitle>Client Intake Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Client Type */}
              {intakeData.clientType && (
                <div>
                  <h3 className="font-semibold mb-2">Client Type</h3>
                  <Badge variant="outline" className="text-sm">
                    {intakeData.clientType === "individual" ? "Individual" : "Business"}
                  </Badge>
                </div>
              )}

              {/* Individual Info */}
              {intakeData.individualInfo && (
                <div>
                  <h3 className="font-semibold mb-2">Individual Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{intakeData.individualInfo.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{intakeData.individualInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{intakeData.individualInfo.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{intakeData.individualInfo.address || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Info */}
              {intakeData.businessInfo && (
                <div>
                  <h3 className="font-semibold mb-2">Business Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Company Name</p>
                      <p className="font-medium">{intakeData.businessInfo.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Business Type</p>
                      <p className="font-medium">{intakeData.businessInfo.businessType || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Person</p>
                      <p className="font-medium">{intakeData.businessInfo.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Email</p>
                      <p className="font-medium">{intakeData.businessInfo.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Phone</p>
                      <p className="font-medium">{intakeData.businessInfo.contactPhone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Registration Number</p>
                      <p className="font-medium">{intakeData.businessInfo.registrationNumber || "N/A"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Business Address</p>
                      <p className="font-medium">{intakeData.businessInfo.businessAddress || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Legal Matter */}
              {intakeData.legalMatter && (
                <div>
                  <h3 className="font-semibold mb-2">Legal Matter Details</h3>
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Jurisdiction</p>
                        <p className="font-medium">{intakeData.legalMatter.jurisdiction}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Urgency Level</p>
                        <Badge variant="outline">{intakeData.legalMatter.urgencyLevel || "Normal"}</Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="font-medium whitespace-pre-wrap">{intakeData.legalMatter.description}</p>
                    </div>
                    {intakeData.legalMatter.additionalNotes && (
                      <div>
                        <p className="text-sm text-muted-foreground">Additional Notes</p>
                        <p className="font-medium">{intakeData.legalMatter.additionalNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Uploaded Files */}
              {intakeData.legalMatter?.uploadedFiles && intakeData.legalMatter.uploadedFiles.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Uploaded Documents</h3>
                  <div className="space-y-2">
                    {intakeData.legalMatter.uploadedFiles.map((file: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-accent" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(intakeData).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                  <p>No intake data submitted yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Service Documents</CardTitle>
              <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              {documents && documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50 hover:border-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-md">
                          <FileText className="w-6 h-6 text-slate-900" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Badge variant="outline" className="text-xs">{doc.document_type}</Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${doc.status === "approved" ? "border-green-500 text-green-600 bg-green-500/10" : ""}`}
                            >
                              {doc.status}
                            </Badge>
                            <span className="text-xs">v{doc.version}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setViewingDocument(doc)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        {doc.file_path && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.file_path} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No documents yet. Generate or upload documents.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Draft Tab */}
        <TabsContent value="ai-draft">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-muted/50 to-background border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <CardTitle>AI Document Generator</CardTitle>
                  <p className="text-sm text-muted-foreground">Powered by advanced AI</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleGenerateAI()}
                  disabled={isGenerating || Object.keys(intakeData).length === 0}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {editedDraft ? "Regenerate" : "Generate"}
                </Button>
                {editedDraft && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShowFeedbackDialog(true)}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Request Changes
                    </Button>
                    <Button
                      variant="gold"
                      onClick={handleApproveDocument}
                      disabled={isGenerating}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve & Send
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {Object.keys(intakeData).length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Client must complete intake form before generating documents.</p>
                </div>
              ) : editedDraft ? (
                <div className="relative">
                  {/* Preview/Edit Toggle */}
                  <Tabs defaultValue="preview" className="w-full">
                    <div className="flex items-center justify-between px-6 py-3 border-b bg-muted/30">
                      <TabsList className="h-8">
                        <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
                        <TabsTrigger value="edit" className="text-xs">Edit</TabsTrigger>
                      </TabsList>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateDraft.mutate(editedDraft)}
                        disabled={updateDraft.isPending}
                      >
                        {updateDraft.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Draft"}
                      </Button>
                    </div>
                    <TabsContent value="preview" className="m-0">
                      <ScrollArea className="h-[500px]">
                        <div className="p-6">
                          <div className="prose prose-sm max-w-none bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm border">
                            <MarkdownRenderer content={editedDraft} />
                          </div>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="edit" className="m-0">
                      <Textarea
                        value={editedDraft}
                        onChange={(e) => setEditedDraft(e.target.value)}
                        className="min-h-[500px] font-mono text-sm border-0 rounded-none focus-visible:ring-0"
                        placeholder="AI generated document will appear here..."
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-400/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-10 h-10 text-amber-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Ready to Generate</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Click "Generate" to create a professional document based on the client's intake data.
                  </p>
                  <Button onClick={() => handleGenerateAI()} disabled={isGenerating}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Client Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[450px]">
                <div className="p-6">
                  {messages && messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <AIChatMessage
                          key={msg.id}
                          role={msg.role as "user" | "assistant"}
                          content={msg.content}
                          timestamp={msg.created_at}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">No messages yet.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      {purchase.status === "client_review" && (
        <div className="fixed bottom-6 right-6">
          <Button
            variant="gold"
            size="lg"
            onClick={handleCompleteOrder}
            className="shadow-lg"
          >
            <Check className="w-5 h-5 mr-2" />
            Mark as Completed
          </Button>
        </div>
      )}

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request AI Changes</DialogTitle>
            <DialogDescription>
              Describe the changes you want the AI to make to the document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={aiPromptFeedback}
              onChange={(e) => setAiPromptFeedback(e.target.value)}
              placeholder="e.g., Make the language more formal, add a confidentiality clause, update the payment terms..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleGenerateAI(aiPromptFeedback)}
              disabled={!aiPromptFeedback.trim()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a file to attach to this order.
            </DialogDescription>
          </DialogHeader>
          <FileUploader
            bucket="intake-documents"
            folder={`orders/${id}`}
            maxFiles={5}
            maxSizeMB={10}
            onUploadComplete={async (files) => {
              if (files.length > 0) {
                const latestFile = files[files.length - 1];
                await createDocument.mutateAsync({
                  name: latestFile.name,
                  file_path: latestFile.url,
                  document_type: "uploaded",
                  status: "pending",
                });
                setShowUploadDialog(false);
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      <DocumentViewerDialog
        isOpen={!!viewingDocument}
        onClose={() => setViewingDocument(null)}
        document={viewingDocument}
      />
    </div>
  );
};

export default AdminOrderDetails;
