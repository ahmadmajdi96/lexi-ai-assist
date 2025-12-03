import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, Check, FileText, ExternalLink } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useToast } from "@/hooks/use-toast";

interface DocumentViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    name: string;
    content?: string | null;
    file_path?: string | null;
    document_type?: string;
    status?: string | null;
    version?: number | null;
    created_at?: string;
  } | null;
}

export const DocumentViewerDialog = ({ isOpen, onClose, document }: DocumentViewerDialogProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const handleCopy = async () => {
    if (document.content) {
      await navigator.clipboard.writeText(document.content);
      setCopied(true);
      toast({ title: "Copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (document.file_path) {
      window.open(document.file_path, "_blank");
    } else if (document.content) {
      const blob = new Blob([document.content], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = `${document.name}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <DialogTitle className="text-xl">{document.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  {document.document_type && (
                    <Badge variant="outline">{document.document_type}</Badge>
                  )}
                  {document.status && (
                    <Badge 
                      variant="outline"
                      className={document.status === "approved" ? "border-green-500 text-green-600" : ""}
                    >
                      {document.status}
                    </Badge>
                  )}
                  {document.version && (
                    <span className="text-xs">v{document.version}</span>
                  )}
                </DialogDescription>
              </div>
            </div>
            <div className="flex gap-2">
              {document.content && (
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              )}
              <Button variant="gold" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] mt-4">
          {document.file_path && !document.content ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                This is an uploaded file. Click below to open or download.
              </p>
              <Button variant="outline" asChild>
                <a href={document.file_path} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open File
                </a>
              </Button>
            </div>
          ) : document.content ? (
            <div className="p-6 bg-muted/30 rounded-xl border border-border">
              <MarkdownRenderer content={document.content} />
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No content available
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
