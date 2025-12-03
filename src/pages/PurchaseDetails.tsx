import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  Send,
  Clock,
  AlertCircle,
  Download,
  Scale,
  Loader2,
  Eye,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import {
  usePurchaseDetails,
  useServiceDocuments,
  usePurchaseMessages,
  useSendPurchaseMessage,
} from "@/hooks/usePurchaseDetails";
import { supabase } from "@/integrations/supabase/client";
import { AIChatMessage } from "@/components/shared/AIChatMessage";
import { DocumentViewerDialog } from "@/components/shared/DocumentViewerDialog";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";

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

const PurchaseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: purchase, isLoading: purchaseLoading } = usePurchaseDetails(id || "");
  const { data: documents, isLoading: docsLoading } = useServiceDocuments(id || "");
  const { data: messages, isLoading: messagesLoading } = usePurchaseMessages(id || "");
  const sendMessage = useSendPurchaseMessage();

  const [chatInput, setChatInput] = useState("");
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !id) return;

    const userMessage = chatInput.trim();
    setChatInput("");

    // Send user message
    await sendMessage.mutateAsync({
      purchaseId: id,
      content: userMessage,
      role: "user",
    });

    // Get AI response
    setIsAiResponding(true);
    try {
      const response = await supabase.functions.invoke("service-chat", {
        body: {
          purchaseId: id,
          message: userMessage,
          serviceContext: purchase?.service?.name,
        },
      });

      if (response.data?.response) {
        await sendMessage.mutateAsync({
          purchaseId: id,
          content: response.data.response,
          role: "assistant",
        });
      }
    } catch (error) {
      console.error("AI response error:", error);
    } finally {
      setIsAiResponding(false);
    }
  };

  if (authLoading || purchaseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user || !purchase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
          <h2 className="font-semibold mb-2">Purchase Not Found</h2>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center">
                  <Scale className="w-5 h-5 text-slate-900" />
                </div>
                <span className="font-display text-xl font-bold">Ethos Legis Firma</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold mb-2">
                {purchase.service?.name || "Legal Service"}
              </h1>
              <p className="text-muted-foreground">
                {purchase.service?.description || "Service details"}
              </p>
            </div>
            <Badge className={`${statusColors[purchase.status]} text-sm px-4 py-2`}>
              {statusLabels[purchase.status] || purchase.status}
            </Badge>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{statusProgress[purchase.status]}%</span>
            </div>
            <Progress value={statusProgress[purchase.status]} className="h-3" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Order Date</span>
              <p className="font-medium">
                {new Date(purchase.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Amount Paid</span>
              <p className="font-medium">
                {purchase.amount_paid
                  ? `$${(purchase.amount_paid / 100).toFixed(2)}`
                  : "Pending"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Due Date</span>
              <p className="font-medium">
                {purchase.due_date
                  ? new Date(purchase.due_date).toLocaleDateString()
                  : "TBD"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Turnaround</span>
              <p className="font-medium">
                {purchase.service?.turnaround_days || 2} business days
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs for Documents and Chat */}
        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="font-display text-xl font-semibold mb-4">
                Your Documents
              </h2>

              {docsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : documents && documents.length > 0 ? (
                <div className="space-y-4">
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
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                doc.status === "approved"
                                  ? "border-green-500 text-green-600 bg-green-500/10"
                                  : ""
                              }`}
                            >
                              {doc.status}
                            </Badge>
                            <span className="text-xs">v{doc.version}</span>
                            <span>•</span>
                            <span className="text-xs">
                              {new Date(doc.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {(doc.content || doc.file_path) && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setViewingDocument(doc)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        )}
                        {doc.status === "approved" && (
                          doc.file_path ? (
                            <Button variant="gold" size="sm" asChild>
                              <a href={doc.file_path} target="_blank" rel="noopener noreferrer" download>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          ) : doc.content ? (
                            <Button 
                              variant="gold" 
                              size="sm"
                              onClick={() => {
                                const blob = new Blob([doc.content || ''], { type: 'text/plain' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${doc.name}.txt`;
                                a.click();
                                window.URL.revokeObjectURL(url);
                              }}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          ) : null
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Documents in Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Your documents will appear here once generated. This usually
                    takes {purchase.service?.turnaround_days || 2} business days.
                  </p>
                </div>
              )}

              {/* AI Draft Preview */}
              {purchase.ai_draft && purchase.status === "client_review" && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-slate-900" />
                    </div>
                    <h3 className="font-semibold">Document Ready for Review</h3>
                  </div>
                  <ScrollArea className="h-96">
                    <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border shadow-sm">
                      <MarkdownRenderer content={purchase.ai_draft} />
                    </div>
                  </ScrollArea>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-border bg-gradient-to-r from-muted/50 to-background">
                <h2 className="font-display text-xl font-semibold">
                  Service Chat
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ask questions about your {purchase.service?.name || "service"}
                </p>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="p-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <AIChatMessage
                          key={msg.id}
                          role={msg.role as "user" | "assistant"}
                          content={msg.content}
                          timestamp={msg.created_at}
                        />
                      ))}
                      {isAiResponding && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-semibold mb-2">Start a Conversation</h3>
                        <p className="text-sm text-muted-foreground">
                          Ask questions about your service, contract details, or get
                          legal guidance.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about your service..."
                    className="resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || sendMessage.isPending || isAiResponding}
                    className="self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Document Viewer Dialog */}
      <DocumentViewerDialog
        isOpen={!!viewingDocument}
        onClose={() => setViewingDocument(null)}
        document={viewingDocument}
      />
    </div>
  );
};

export default PurchaseDetails;
