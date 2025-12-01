import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Globe, Shield, Database, Bell, Loader2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSystemSettings, useUpdateSystemSetting, useJurisdictions } from "@/hooks/useAdmin";

export const AdminSettings = () => {
  const { data: settings, isLoading } = useSystemSettings();
  const { data: jurisdictions } = useJurisdictions();
  const updateSetting = useUpdateSystemSetting();

  const getSetting = (key: string): any => {
    const setting = settings?.find((s: any) => s.key === key);
    return setting?.value ?? null;
  };

  const getFileTypes = (): string[] => {
    const value = getSetting("allowed_file_types");
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // If not valid JSON, try to extract words
        return value.replace(/[\[\]]/g, "").split(/[,\s]+/).filter(Boolean);
      }
    }
    return ["pdf", "doc", "docx", "txt"];
  };

  const handleToggle = (key: string, currentValue: any) => {
    const newValue = currentValue === true || currentValue === "true" ? false : true;
    updateSetting.mutate({ key, value: newValue });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure system-wide settings and preferences.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">General Settings</h2>
              <p className="text-sm text-muted-foreground">Basic system configuration</p>
            </div>
          </div>

          {/* AI Enabled */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">AI Features</p>
              <p className="text-xs text-muted-foreground">Enable AI-powered features across the platform</p>
            </div>
            <Switch
              checked={getSetting("ai_enabled") === true || getSetting("ai_enabled") === "true"}
              onCheckedChange={() => handleToggle("ai_enabled", getSetting("ai_enabled"))}
            />
          </div>

          {/* Max File Size */}
          <div>
            <Label>Max File Upload Size (MB)</Label>
            <Input
              type="number"
              value={String(getSetting("max_file_size_mb") ?? "10")}
              className="mt-2"
              disabled
            />
            <p className="text-xs text-muted-foreground mt-1">
              Maximum allowed file size for document uploads
            </p>
          </div>

          {/* Allowed File Types */}
          <div>
            <Label>Allowed File Types</Label>
            <div className="mt-2 p-3 rounded-lg bg-muted/50">
              <div className="flex flex-wrap gap-2">
                {getFileTypes().map((type: string) => (
                  <span key={type} className="px-2 py-1 rounded bg-background text-xs font-mono">
                    .{type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Jurisdictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Jurisdictions</h2>
              <p className="text-sm text-muted-foreground">Manage supported legal jurisdictions</p>
            </div>
          </div>

          <div className="space-y-2">
            {jurisdictions?.map((jurisdiction: any) => (
              <div
                key={jurisdiction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium text-sm">{jurisdiction.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{jurisdiction.code}</p>
                </div>
                <Switch checked={jurisdiction.is_active} disabled />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-orange-400 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Security</h2>
              <p className="text-sm text-muted-foreground">Security and access control</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Require 2FA for admin accounts</p>
              </div>
              <Switch disabled />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Session Timeout</p>
                <p className="text-xs text-muted-foreground">Auto logout after inactivity</p>
              </div>
              <span className="text-sm text-muted-foreground">30 min</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Audit Logging</p>
                <p className="text-xs text-muted-foreground">Log all admin actions</p>
              </div>
              <Switch checked disabled />
            </div>
          </div>
        </motion.div>

        {/* Database Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Database</h2>
              <p className="text-sm text-muted-foreground">Database information</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-medium">PostgreSQL (Supabase)</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Status</span>
              <span className="text-green-500 font-medium">Connected</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Region</span>
              <span className="font-medium">Auto</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
