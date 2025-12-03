import { motion } from "framer-motion";
import { ArrowLeft, Loader2, User, Building2, FileText, Shield, CreditCard, Check, Mail, Phone, MapPin, Calendar, Clock, Paperclip } from "lucide-react";
import { IntakeFormData, URGENCY_LEVELS } from "./IntakeFormTypes";

interface Service {
  id: string;
  name: string;
  price: number;
  turnaround_days: number | null;
  category?: {
    name: string;
  } | null;
}

interface ReviewStepProps {
  data: IntakeFormData;
  service: Service;
  onBack: () => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

export const ReviewStep = ({ data, service, onBack, onSubmit, isProcessing }: ReviewStepProps) => {
  const isIndividual = data.clientType === "individual";
  const clientInfo = isIndividual ? data.individual : data.business;
  const urgencyLabel = URGENCY_LEVELS.find(u => u.value === data.legalMatter.urgencyLevel)?.label || "Standard";

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 }
    })
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 flex items-center justify-center"
        >
          <Check className="w-8 h-8 text-navy-900" />
        </motion.div>
        <motion.h3 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold mb-2"
        >
          Review Your Order
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm"
        >
          Please verify all information before proceeding to checkout
        </motion.p>
      </div>

      <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
        {/* Service Summary */}
        <motion.div 
          custom={0} 
          variants={sectionVariants} 
          initial="hidden" 
          animate="visible"
          className="p-4 rounded-xl bg-gradient-to-r from-navy-900 to-navy-800 text-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-gold-400 font-medium">
                {service.category?.name || "Legal Service"}
              </span>
              <h4 className="font-semibold text-lg mt-1">{service.name}</h4>
              {service.turnaround_days && (
                <p className="text-sm text-white/70 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  {service.turnaround_days} business days delivery
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs text-white/70">Total</span>
              <p className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                ${(service.price / 100).toFixed(0)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Client Information */}
        <motion.div 
          custom={1} 
          variants={sectionVariants} 
          initial="hidden" 
          animate="visible"
          className="p-4 rounded-xl border border-border bg-card"
        >
          <div className="flex items-center gap-2 mb-3">
            {isIndividual ? (
              <User className="w-4 h-4 text-gold-500" />
            ) : (
              <Building2 className="w-4 h-4 text-gold-500" />
            )}
            <h4 className="font-semibold text-sm">
              {isIndividual ? "Personal Information" : "Business Information"}
            </h4>
          </div>

          {isIndividual ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">Full Name</span>
                <p className="font-medium">{data.individual.firstName} {data.individual.lastName}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </span>
                <p className="font-medium truncate">{data.individual.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone
                </span>
                <p className="font-medium">{data.individual.phone}</p>
              </div>
              {data.individual.dateOfBirth && (
                <div>
                  <span className="text-muted-foreground text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date of Birth
                  </span>
                  <p className="font-medium">{data.individual.dateOfBirth}</p>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Address
                </span>
                <p className="font-medium">
                  {data.individual.address}, {data.individual.city}, {data.individual.state} {data.individual.zipCode}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="col-span-2">
                <span className="text-muted-foreground text-xs">Business Name</span>
                <p className="font-medium">{data.business.businessName}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Business Type</span>
                <p className="font-medium">{data.business.businessType}</p>
              </div>
              {data.business.ein && (
                <div>
                  <span className="text-muted-foreground text-xs">EIN</span>
                  <p className="font-medium">{data.business.ein}</p>
                </div>
              )}
              <div className="col-span-2">
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Business Address
                </span>
                <p className="font-medium">
                  {data.business.businessAddress}, {data.business.businessCity}, {data.business.businessState} {data.business.businessZipCode}
                </p>
              </div>
              <div className="col-span-2 pt-2 border-t border-border">
                <span className="text-muted-foreground text-xs">Authorized Representative</span>
                <p className="font-medium">
                  {data.business.authorizedRepName}
                  {data.business.authorizedRepTitle && ` (${data.business.authorizedRepTitle})`}
                </p>
                <p className="text-muted-foreground">{data.business.authorizedRepEmail}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Legal Matter */}
        <motion.div 
          custom={2} 
          variants={sectionVariants} 
          initial="hidden" 
          animate="visible"
          className="p-4 rounded-xl border border-border bg-card"
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-gold-500" />
            <h4 className="font-semibold text-sm">Legal Matter Details</h4>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Description</span>
              <p className="font-medium line-clamp-3">{data.legalMatter.matterDescription}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-muted-foreground text-xs">Urgency</span>
                <p className="font-medium">{urgencyLabel}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Communication</span>
                <p className="font-medium capitalize">{data.legalMatter.preferredCommunication}</p>
              </div>
            </div>
            {data.legalMatter.opposingParty && (
              <div>
                <span className="text-muted-foreground text-xs">Opposing Party</span>
                <p className="font-medium">{data.legalMatter.opposingParty}</p>
              </div>
            )}
            {data.legalMatter.relevantDates && (
              <div>
                <span className="text-muted-foreground text-xs">Important Dates</span>
                <p className="font-medium">{data.legalMatter.relevantDates}</p>
              </div>
            )}
            {data.legalMatter.uploadedFiles && data.legalMatter.uploadedFiles.length > 0 && (
              <div className="pt-2 border-t border-border">
                <span className="text-muted-foreground text-xs flex items-center gap-1 mb-2">
                  <Paperclip className="w-3 h-3" /> Attached Documents ({data.legalMatter.uploadedFiles.length})
                </span>
                <div className="space-y-1.5">
                  {data.legalMatter.uploadedFiles.map((file) => (
                    <div key={file.path} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <FileText className="w-4 h-4 text-gold-500 shrink-0" />
                      <span className="text-sm truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div 
          custom={3} 
          variants={sectionVariants} 
          initial="hidden" 
          animate="visible"
          className="grid grid-cols-2 gap-3"
        >
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Shield className="w-5 h-5 text-accent" />
            <span className="text-xs">Secure & Encrypted</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <CreditCard className="w-5 h-5 text-accent" />
            <span className="text-xs">Money-back Guarantee</span>
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 py-3 px-6 border border-border hover:bg-muted rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Edit
        </motion.button>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onSubmit}
          disabled={isProcessing}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 disabled:from-gold-500/70 disabled:to-gold-400/70 text-navy-900 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-gold-500/20"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Proceed to Payment
            </>
          )}
        </motion.button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        By proceeding, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};
