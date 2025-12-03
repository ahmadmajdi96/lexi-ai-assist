import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndividualInfo, US_STATES, ID_TYPES } from "./IntakeFormTypes";

interface IndividualInfoStepProps {
  data: IndividualInfo;
  onChange: (data: IndividualInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export const IndividualInfoStep = ({ data, onChange, onNext, onBack }: IndividualInfoStepProps) => {
  const updateField = (field: keyof IndividualInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isValid = data.firstName && data.lastName && data.email && data.phone && data.address && data.city && data.state && data.zipCode;

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
          Personal Information
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm"
        >
          Please provide your contact and identification details
        </motion.p>
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible">
            <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="John"
              className="mt-1.5"
            />
          </motion.div>
          <motion.div custom={1} variants={inputVariants} initial="hidden" animate="visible">
            <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Doe"
              className="mt-1.5"
            />
          </motion.div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div custom={2} variants={inputVariants} initial="hidden" animate="visible">
            <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john@example.com"
              className="mt-1.5"
            />
          </motion.div>
          <motion.div custom={3} variants={inputVariants} initial="hidden" animate="visible">
            <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="(555) 123-4567"
              className="mt-1.5"
            />
          </motion.div>
        </div>

        {/* Date of Birth */}
        <motion.div custom={4} variants={inputVariants} initial="hidden" animate="visible">
          <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => updateField("dateOfBirth", e.target.value)}
            className="mt-1.5"
          />
        </motion.div>

        {/* Address */}
        <motion.div custom={5} variants={inputVariants} initial="hidden" animate="visible">
          <Label htmlFor="address" className="text-sm font-medium">Street Address *</Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="123 Main Street, Apt 4B"
            className="mt-1.5"
          />
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          <motion.div custom={6} variants={inputVariants} initial="hidden" animate="visible">
            <Label htmlFor="city" className="text-sm font-medium">City *</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="New York"
              className="mt-1.5"
            />
          </motion.div>
          <motion.div custom={7} variants={inputVariants} initial="hidden" animate="visible">
            <Label htmlFor="state" className="text-sm font-medium">State *</Label>
            <Select value={data.state} onValueChange={(value) => updateField("state", value)}>
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
          <motion.div custom={8} variants={inputVariants} initial="hidden" animate="visible">
            <Label htmlFor="zipCode" className="text-sm font-medium">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={data.zipCode}
              onChange={(e) => updateField("zipCode", e.target.value)}
              placeholder="10001"
              className="mt-1.5"
            />
          </motion.div>
        </div>

        {/* ID Information */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Identification (Optional but recommended)</p>
          <div className="grid grid-cols-2 gap-4">
            <motion.div custom={9} variants={inputVariants} initial="hidden" animate="visible">
              <Label htmlFor="idType" className="text-sm font-medium">ID Type</Label>
              <Select value={data.idType} onValueChange={(value) => updateField("idType", value)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  {ID_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div custom={10} variants={inputVariants} initial="hidden" animate="visible">
              <Label htmlFor="idNumber" className="text-sm font-medium">ID Number</Label>
              <Input
                id="idNumber"
                value={data.idNumber}
                onChange={(e) => updateField("idNumber", e.target.value)}
                placeholder="ID number"
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
