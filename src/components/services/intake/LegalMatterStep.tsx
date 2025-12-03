import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Clock, Zap, AlertTriangle, Upload, X, FileText, Loader2, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LegalMatterInfo, URGENCY_LEVELS, UploadedFile, ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILES } from "./IntakeFormTypes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LegalMatterStepProps {
  data: LegalMatterInfo;
  onChange: (data: LegalMatterInfo) => void;
  serviceName: string;
  onNext: () => void;
  onBack: () => void;
}

export const LegalMatterStep = ({ data, onChange, serviceName, onNext, onBack }: LegalMatterStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const updateField = (field: keyof LegalMatterInfo, value: string | boolean | UploadedFile[]) => {
    onChange({ ...data, [field]: value });
  };

  const isValid = data.matterDescription.length >= 20;

  const urgencyIcons = {
    standard: Clock,
    priority: Zap,
    urgent: AlertTriangle
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (data.uploadedFiles.length + files.length > MAX_FILES) {
      toast({
        title: "Too many files",
        description: `You can upload a maximum of ${MAX_FILES} files.`,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    const newFiles: UploadedFile[] = [];

    for (const file of Array.from(files)) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type. Please upload PDF, DOC, DOCX, JPG, PNG, or WEBP files.`,
          variant: "destructive"
        });
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 10MB limit.`,
          variant: "destructive"
        });
        continue;
      }

      try {
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filePath = `${user?.id}/${timestamp}_${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("intake-documents")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        newFiles.push({
          name: file.name,
          path: filePath,
          size: file.size,
          type: file.type
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}. Please try again.`,
          variant: "destructive"
        });
      }
    }

    if (newFiles.length > 0) {
      updateField("uploadedFiles", [...data.uploadedFiles, ...newFiles]);
      updateField("hasExistingDocuments", true);
      toast({
        title: "Files uploaded",
        description: `${newFiles.length} file(s) uploaded successfully.`
      });
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = async (fileToRemove: UploadedFile) => {
    try {
      await supabase.storage
        .from("intake-documents")
        .remove([fileToRemove.path]);

      const updatedFiles = data.uploadedFiles.filter(f => f.path !== fileToRemove.path);
      updateField("uploadedFiles", updatedFiles);
      
      if (updatedFiles.length === 0) {
        updateField("hasExistingDocuments", false);
      }

      toast({
        title: "File removed",
        description: `${fileToRemove.name} has been removed.`
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to remove file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 }
    })
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <motion.h3 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold mb-2"
        >
          Legal Matter Details
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm"
        >
          Tell us about your legal needs for <span className="text-gold-500 font-medium">{serviceName}</span>
        </motion.p>
      </div>

      <div className="space-y-5 max-h-[50vh] overflow-y-auto px-1 pb-4">
        {/* Matter Description */}
        <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
          <Label htmlFor="matterDescription" className="text-sm font-medium">
            Describe Your Legal Matter *
          </Label>
          <Textarea
            id="matterDescription"
            value={data.matterDescription}
            onChange={(e) => updateField("matterDescription", e.target.value)}
            placeholder="Please provide a detailed description of your legal needs, including any relevant background information..."
            className="mt-1.5 min-h-[120px] resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {data.matterDescription.length}/20 minimum characters
          </p>
        </motion.div>

        {/* Document Upload */}
        <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
          <Label className="text-sm font-medium mb-3 block">Upload Relevant Documents</Label>
          <div 
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
              isUploading ? "border-gold-500 bg-gold-500/5" : "border-border hover:border-gold-500/50 hover:bg-muted/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <div 
                className="flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gold-500" />
                </div>
                <p className="text-sm font-medium">Click to upload documents</p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOC, DOCX, JPG, PNG • Max {MAX_FILES} files • 10MB each
                </p>
              </div>
            )}
          </div>

          {/* Uploaded Files List */}
          <AnimatePresence>
            {data.uploadedFiles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2"
              >
                {data.uploadedFiles.map((file) => (
                  <motion.div
                    key={file.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gold-500/10 border border-gold-500/30 group hover:bg-gold-500/15 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-gold-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <span className="text-xs text-gold-500 font-medium px-2 py-0.5 bg-gold-500/20 rounded-full">
                      Uploaded
                    </span>
                    <button
                      onClick={() => handleRemoveFile(file)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Urgency Level */}
        <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible">
          <Label className="text-sm font-medium mb-3 block">Urgency Level</Label>
          <div className="grid grid-cols-3 gap-3">
            {URGENCY_LEVELS.map((level) => {
              const Icon = urgencyIcons[level.value as keyof typeof urgencyIcons];
              const isSelected = data.urgencyLevel === level.value;
              
              return (
                <button
                  key={level.value}
                  onClick={() => updateField("urgencyLevel", level.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                    isSelected
                      ? "border-gold-500 bg-gold-500/15 shadow-md shadow-gold-500/20 ring-2 ring-gold-500/30"
                      : "border-border hover:border-gold-500/50 hover:bg-muted/50 hover:shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <span className="block text-[10px] text-gold-500 font-bold uppercase tracking-wider mb-1">Selected</span>
                  )}
                  <Icon className={`w-5 h-5 mx-auto mb-1 transition-colors ${isSelected ? "text-gold-500" : "text-muted-foreground"}`} />
                  <p className={`text-sm font-medium ${isSelected ? "text-gold-500" : ""}`}>{level.label}</p>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Opposing Party */}
        <motion.div custom={3} variants={inputVariants} initial="hidden" animate="visible">
          <Label htmlFor="opposingParty" className="text-sm font-medium">
            Opposing Party (if applicable)
          </Label>
          <Input
            id="opposingParty"
            value={data.opposingParty}
            onChange={(e) => updateField("opposingParty", e.target.value)}
            placeholder="Name of other party involved, if any"
            className="mt-1.5"
          />
        </motion.div>

        {/* Relevant Dates */}
        <motion.div custom={4} variants={inputVariants} initial="hidden" animate="visible">
          <Label htmlFor="relevantDates" className="text-sm font-medium">
            Important Dates or Deadlines
          </Label>
          <Input
            id="relevantDates"
            value={data.relevantDates}
            onChange={(e) => updateField("relevantDates", e.target.value)}
            placeholder="e.g., Contract expires on Dec 31, 2024"
            className="mt-1.5"
          />
        </motion.div>

        {/* Additional Notes */}
        <motion.div custom={5} variants={inputVariants} initial="hidden" animate="visible">
          <Label htmlFor="additionalNotes" className="text-sm font-medium">
            Additional Notes
          </Label>
          <Textarea
            id="additionalNotes"
            value={data.additionalNotes}
            onChange={(e) => updateField("additionalNotes", e.target.value)}
            placeholder="Any other information that might be helpful..."
            className="mt-1.5 min-h-[80px] resize-none"
          />
        </motion.div>

        {/* Preferred Communication */}
        <motion.div custom={6} variants={inputVariants} initial="hidden" animate="visible">
          <Label className="text-sm font-medium mb-3 block">Preferred Communication Method</Label>
          <div className="flex gap-3">
            {["email", "phone", "both"].map((method) => {
              const isSelected = data.preferredCommunication === method;
              return (
                <button
                  key={method}
                  onClick={() => updateField("preferredCommunication", method)}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 capitalize text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                    isSelected
                      ? "border-gold-500 bg-gold-500/15 text-gold-500 font-semibold shadow-md shadow-gold-500/20 ring-2 ring-gold-500/30"
                      : "border-border hover:border-gold-500/50 hover:bg-muted/50 hover:shadow-sm"
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 mx-auto mb-1" />}
                  {method}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onBack}
          className="flex-1 py-3.5 px-6 border-2 border-border hover:bg-muted hover:border-gold-500/50 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 py-3.5 px-6 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 disabled:bg-muted disabled:from-muted disabled:to-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-navy-900 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-gold-500/20 disabled:shadow-none active:scale-[0.98]"
        >
          Review Order
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
