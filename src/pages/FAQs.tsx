import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does LexCounsel work?",
    answer: "LexCounsel combines AI technology with expert attorney review to create legal documents. You select a service, complete our smart intake form, our AI generates a draft, and then a licensed attorney reviews it before delivery."
  },
  {
    question: "Are the documents created by AI legally valid?",
    answer: "Yes! All documents are reviewed by licensed attorneys before delivery. The AI helps create accurate initial drafts quickly, and human attorneys ensure everything meets legal standards and is customized to your specific needs."
  },
  {
    question: "How long does it take to receive my documents?",
    answer: "Most services are completed within 2-5 business days. Simple documents like NDAs may be ready within 24 hours, while more complex services like business formation may take longer."
  },
  {
    question: "What if I need changes to my document?",
    answer: "We offer revisions as part of our service. After receiving your document, you can request changes through your client portal, and our team will update the document accordingly."
  },
  {
    question: "Is my information secure?",
    answer: "Absolutely. We use bank-level encryption to protect your data. All communications are confidential, and attorney-client privilege protections apply to our attorney-reviewed services."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer full refunds within 7 days of purchase if work has not begun on your document. If work has started, we'll work with you to resolve any concerns."
  },
  {
    question: "Can I speak with an attorney directly?",
    answer: "Yes, for complex matters or if you have specific legal questions, you can upgrade to consultation services where you'll have direct access to our legal team."
  },
  {
    question: "What states/jurisdictions do you serve?",
    answer: "We serve all 50 US states. Our attorneys are knowledgeable about jurisdiction-specific requirements and will ensure your documents comply with local laws."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover) through our secure payment processor, Stripe."
  },
  {
    question: "Can I use the AI chat assistant for legal advice?",
    answer: "The AI assistant provides general legal information and can help answer questions about our services and legal concepts. For specific legal advice about your situation, we recommend our attorney consultation services."
  }
];

const FAQs = () => {
  return (
    <Layout>
      <section className="py-20 bg-gradient-hero">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              FAQs
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mt-3 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our legal services.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AccordionItem value={`item-${index}`} className="glass-card rounded-xl px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>
    </Layout>
  );
};

export default FAQs;
