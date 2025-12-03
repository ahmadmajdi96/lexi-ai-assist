import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <Layout>
      <section className="py-20 bg-gradient-hero">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="font-display text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-6">
              By accessing and using Ethos Legis Firma's services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">2. Description of Services</h2>
            <p className="text-muted-foreground mb-6">
              Ethos Legis Firma provides AI-powered legal document preparation services combined with attorney review. 
              Our services include but are not limited to contract drafting, business formation documents, 
              and legal consultation assistance.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">3. Not Legal Advice</h2>
            <p className="text-muted-foreground mb-6">
              The information provided through our platform is for general informational purposes only. 
              While our documents are reviewed by licensed attorneys, our platform does not provide legal advice 
              and should not be relied upon as such. For specific legal matters, please consult with a qualified attorney.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">4. User Responsibilities</h2>
            <p className="text-muted-foreground mb-6">
              You are responsible for providing accurate information when using our services. 
              You agree to keep your account credentials secure and notify us immediately of any unauthorized access.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">5. Payment Terms</h2>
            <p className="text-muted-foreground mb-6">
              All prices are listed in USD. Payment is required at the time of purchase. 
              We offer refunds within 7 days of purchase if work has not begun on your document.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground mb-6">
              Documents created through our service are owned by you, the client. 
              However, the underlying templates and technology remain the property of Ethos Legis Firma.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-6">
              Ethos Legis Firma shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of our services.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us at legal@ethoslegis.com.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
