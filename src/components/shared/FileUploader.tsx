import { useState, useRef } from "react";
import { Upload, X, FileText, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadedFile {
  name: string;
  size: number;
  url: string;
  path: string;
}

interface FileUploaderProps {
  bucket: string;
  folder: string;
  onUploadComplete: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string;
  className?: string;
}

export const FileUploader = ({
  bucket,
  folder,
  onUploadComplete,
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedTypes = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png",
  className = "",
}: FileUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    
    // Validate file count
    if (uploadedFiles.length + fileList.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    // Validate file sizes
    const maxBytes = maxSizeMB * 1024 * 1024;
    const oversizedFiles = fileList.filter(f => f.size > maxBytes);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const newUploaded: UploadedFile[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        newUploaded.push({
          name: file.name,
          size: file.size,
          url: publicUrl,
          path: fileName,
        });

        setUploadProgress(((i + 1) / fileList.length) * 100);
      } catch (error: any) {
        console.error("Upload error:", error);
        toast({
          title: "Upload failed",
          description: error.message || `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }

    if (newUploaded.length > 0) {
      const allFiles = [...uploadedFiles, ...newUploaded];
      setUploadedFiles(allFiles);
      onUploadComplete(allFiles);
      toast({
        title: "Files uploaded",
        description: `${newUploaded.length} file(s) uploaded successfully`,
      });
    }

    setUploading(false);
    setUploadProgress(0);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = async (index: number) => {
    const file = uploadedFiles[index];
    
    try {
      await supabase.storage.from(bucket).remove([file.path]);
      
      const newFiles = uploadedFiles.filter((_, i) => i !== index);
      setUploadedFiles(newFiles);
      onUploadComplete(newFiles);
      
      toast({ title: "File removed" });
    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div 
        className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-accent/50 transition-colors cursor-pointer bg-muted/30"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || uploadedFiles.length >= maxFiles}
        />
        
        {uploading ? (
          <div className="space-y-3">
            <Loader2 className="w-10 h-10 mx-auto text-accent animate-spin" />
            <p className="text-sm text-muted-foreground">Uploading files...</p>
            <Progress value={uploadProgress} className="max-w-xs mx-auto" />
          </div>
        ) : (
          <>
            <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-accent" />
            </div>
            <p className="font-medium mb-1">Click to upload files</p>
            <p className="text-sm text-muted-foreground">
              Max {maxSizeMB}MB per file • {acceptedTypes.replace(/\./g, "").toUpperCase()}
            </p>
          </>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Uploaded ({uploadedFiles.length}/{maxFiles})
          </p>
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
