import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BusinessInfo, US_STATES, BUSINESS_TYPES } from "./IntakeFormTypes";

interface BusinessInfoStepProps {
  data: BusinessInfo;
  onChange: (data: BusinessInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export const BusinessInfoStep = ({ data, onChange, onNext, onBack }: BusinessInfoStepProps) => {
  const updateField = (field: keyof BusinessInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isValid = data.businessName && data.businessType && data.businessAddress && 
                  data.businessCity && data.businessState && data.businessZipCode && 
                  data.authorizedRepName && data.authorizedRepEmail;

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
          Business Information
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm"
        >
          Please provide your company details and authorized representative
        </motion.p>
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {/* Business Details */}
        <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
          <Label htmlFor="businessName" className="text-sm font-medium">Business Name *</Label>
          <Input
            id="businessName"
            value={data.businessName}
            onChange={(e) => updateField("businessName", e.target.value)}
            placeholder="Acme Corporation"
            className="mt-1.5"
          />
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
            <Label htmlFor="businessType" className="text-sm font-medium">Business Type *</Label>
            <Select value={data.businessType} onValueChange={(value) => updateField("businessType", value)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible">
            <Label htmlFor="ein" className="text-sm font-medium">EIN / Tax ID</Label>
            <Input
              id="ein"
              value={data.ein}
              onChange={(e) => updateField("ein", e.target.value)}
              placeholder="XX-XXXXXXX"
              className="mt-1.5"
            />
          </motion.div>
        </div>

        <motion.div custom={3} variants={inputVariants} initial="hidden" animate="visible">
          <Label htmlFor="stateOfIncorporation" className="text-sm font-medium">State of Incorporation</Label>
          <Select value={data.stateOfIncorporation} onValueChange={(value) => updateField("stateOfIncorporation", value)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Business Address */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Business Address</p>
          
          <motion.div custom={4} variants={inputVariants} initial="hidden" animate="visible" className="mb-4">
            <Label htmlFor="businessAddress" className="text-sm font-medium">Street Address *</Label>
            <Input
              id="businessAddress"
              value={data.businessAddress}
              onChange={(e) => updateField("businessAddress", e.target.value)}
              placeholder="456 Business Ave, Suite 100"
              className="mt-1.5"
            />
          </motion.div>

          <div className="grid grid-cols-3 gap-4">
            <motion.div custom={5} variants={inputVariants} initial="hidden" animate="visible">
              <Label htmlFor="businessCity" className="text-sm font-medium">City *</Label>
              <Input
                id="businessCity"
                value={data.businessCity}
                onChange={(e) => updateField("businessCity", e.target.value)}
                placeholder="San Francisco"
                className="mt-1.5"
              />
            </motion.div>
            <motion.div custom={6} variants={inputVariants} initial="hidden" animate="visible">
              <Label htmlFor="businessState" className="text-sm font-medium">State *</Label>
              <Select value={data.businessState} onValueChange={(value) => updateField("businessState", value)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div custom={7} variants={inputVariants} initial="hidden" animate="visible">
              <Label htmlFor="businessZipCode" className="text-sm font-medium">ZIP Code *</Label>
              <Input
                id="businessZipCode"
                value={data.businessZipCode}
                onChange={(e) => updateField("businessZipCode", e.target.value)}
                placeholder="94102"
                className="mt-1.5"
              />
            </motion.div>
          </div>
        </div>

        {/* Authorized Representative */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Authorized Representative</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <motion.div custom={8} variants={inputVariants} initial="hidden" animate="visible">
              <Label htmlFor="authorizedRepName" className="text-sm font-medium">Full Name *</Label>
              <Input
                id="authorizedRepName"
                value={data.authorizedRepName}
                onChange={(e) => updateField("authorizedRepName", e.target.value)}
                placeholder="Jane Smith"
                className="mt-1.5"
              />
            </motion.div>
            <motion.div custom={9} variants={inputVariants} initial="hidden" animate="visible">
              <Label htmlFor="authorizedRepTitle" className="text-sm font-medium">Title / Position</Label>
              <Input
                id="authorizedRepTitle"
                value={data.authorizedRepTitle}
                onChange={(e) => updateField("authorizedRepTitle", e.target.value)}
                placeholder="CEO"
                className="mt-1.5"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div custom={10} variants={inputVariants} initial="hidden" animate="visible">
              <Label htmlFor="authorizedRepEmail" className="text-sm font-medium">Email *</Label>
              <Input
                id="authorizedRepEmail"
                type="email"
                value={data.authorizedRepEmail}
                onChange={(e) => updateField("authorizedRepEmail", e.target.value)}
                placeholder="jane@acme.com"
                className="mt-1.5"
              />
            </motion.div>
            <motion.div custom={11} variants={inputVariants} initial="hidden" animate="visible">
              <Label htmlFor="authorizedRepPhone" className="text-sm font-medium">Phone</Label>
              <Input
                id="authorizedRepPhone"
                type="tel"
                value={data.authorizedRepPhone}
                onChange={(e) => updateField("authorizedRepPhone", e.target.value)}
                placeholder="(555) 987-6543"
                className="mt-1.5"
              />
            </motion.div>
          </div>
        </div>
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
          Continue
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
