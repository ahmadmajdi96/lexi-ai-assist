import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Save, Play, Loader2, Sparkles, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useAIConfigurations, useUpdateAIConfiguration } from "@/hooks/useAdmin";

const availableModels = [
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "google", description: "Fast and balanced" },
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "google", description: "Best for complex reasoning" },
  { id: "google/gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", provider: "google", description: "Fastest, most cost-effective" },
  { id: "openai/gpt-5", name: "GPT-5", provider: "openai", description: "Powerful all-rounder" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini", provider: "openai", description: "Cost-efficient GPT" },
];

export const AdminAIConfig = () => {
  const { data: configurations, isLoading } = useAIConfigurations();
  const updateConfig = useUpdateAIConfiguration();
  
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const [testPrompt, setTestPrompt] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const config = configurations?.[0];

  const handleSave = async () => {
    if (!editingConfig) return;
    await updateConfig.mutateAsync({
      id: editingConfig.id,
      model_name: editingConfig.model_name,
      temperature: editingConfig.temperature,
      max_tokens: editingConfig.max_tokens,
      system_prompt: editingConfig.system_prompt,
      is_active: editingConfig.is_active,
    });
  };

  const handleTest = async () => {
    if (!testPrompt) return;
    setIsTesting(true);
    setTestResponse("");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/legal-ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          message: testPrompt,
          context: "Testing AI configuration from admin panel",
        }),
      });

      const data = await response.json();
      setTestResponse(data.response || data.error || "No response received");
    } catch (error) {
      setTestResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const currentConfig = editingConfig || config;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">AI Configuration</h1>
        <p className="text-muted-foreground mt-1">
          Configure AI models and behavior for the legal assistant.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">{currentConfig?.name || "AI Configuration"}</h2>
              <Badge variant={currentConfig?.is_active ? "default" : "secondary"}>
                {currentConfig?.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <Label>AI Model</Label>
            <div className="grid gap-2 mt-2">
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setEditingConfig({ ...currentConfig, model_name: model.id })}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    currentConfig?.model_name === model.id
                      ? "border-accent bg-accent/10"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className={`w-4 h-4 ${currentConfig?.model_name === model.id ? "text-accent" : "text-muted-foreground"}`} />
                    <div className="text-left">
                      <p className="font-medium text-sm">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                    </div>
                  </div>
                  {currentConfig?.model_name === model.id && (
                    <Badge className="bg-accent text-accent-foreground">Selected</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Temperature</Label>
              <span className="text-sm text-muted-foreground">
                {currentConfig?.temperature || 0.7}
              </span>
            </div>
            <Slider
              value={[Number(currentConfig?.temperature || 0.7) * 100]}
              onValueChange={(value) => setEditingConfig({ ...currentConfig, temperature: value[0] / 100 })}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Lower = more focused, Higher = more creative
            </p>
          </div>

          {/* Max Tokens */}
          <div>
            <Label>Max Response Tokens</Label>
            <Input
              type="number"
              value={currentConfig?.max_tokens || 4096}
              onChange={(e) => setEditingConfig({ ...currentConfig, max_tokens: parseInt(e.target.value) })}
              className="mt-2"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Active Status</Label>
              <p className="text-xs text-muted-foreground">Enable or disable AI features</p>
            </div>
            <Switch
              checked={currentConfig?.is_active}
              onCheckedChange={(checked) => setEditingConfig({ ...currentConfig, is_active: checked })}
            />
          </div>

          {/* System Prompt */}
          <div>
            <Label>System Prompt</Label>
            <Textarea
              value={currentConfig?.system_prompt || ""}
              onChange={(e) => setEditingConfig({ ...currentConfig, system_prompt: e.target.value })}
              rows={6}
              className="mt-2 font-mono text-sm"
              placeholder="Define the AI assistant's behavior and personality..."
            />
          </div>

          {/* Save Button */}
          <Button
            variant="gold"
            className="w-full"
            onClick={handleSave}
            disabled={updateConfig.isPending || !editingConfig}
          >
            {updateConfig.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Configuration
          </Button>
        </motion.div>

        {/* Test Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
              <Settings2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Test AI</h2>
              <p className="text-sm text-muted-foreground">Try your configuration</p>
            </div>
          </div>

          {/* Test Input */}
          <div>
            <Label>Test Prompt</Label>
            <Textarea
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              rows={4}
              className="mt-2"
              placeholder="Enter a test question for the AI..."
            />
          </div>

          <Button
            variant="navy"
            className="w-full"
            onClick={handleTest}
            disabled={isTesting || !testPrompt}
          >
            {isTesting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Test AI Response
          </Button>

          {/* Response */}
          {testResponse && (
            <div>
              <Label>AI Response</Label>
              <div className="mt-2 p-4 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap">
                {testResponse}
              </div>
            </div>
          )}

          {/* Model Info */}
          <div className="p-4 rounded-lg border border-border">
            <h3 className="font-medium mb-3">Current Model Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model:</span>
                <span className="font-mono">{currentConfig?.model_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider:</span>
                <span>{currentConfig?.model_provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temperature:</span>
                <span>{currentConfig?.temperature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Tokens:</span>
                <span>{currentConfig?.max_tokens}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
