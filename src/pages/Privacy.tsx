import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";

const Privacy = () => {
  return (
    <Layout>
      <section className="py-20 bg-gradient-hero">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="font-display text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground mb-6">
              We collect information you provide directly to us, such as your name, email address, 
              phone number, and the information you provide when using our legal services. 
              We also collect usage data and device information automatically.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-6">
              We use the information we collect to provide and improve our services, 
              communicate with you, process your transactions, and ensure the security of our platform.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="text-muted-foreground mb-6">
              We do not sell your personal information. We may share your information with 
              service providers who assist us in operating our platform, attorneys who review your documents, 
              and when required by law.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="text-muted-foreground mb-6">
              We implement industry-standard security measures to protect your information, 
              including encryption, secure servers, and regular security audits. 
              Attorney-client communications are treated with strict confidentiality.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground mb-6">
              You have the right to access, correct, or delete your personal information. 
              You may also opt out of marketing communications at any time.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
            <p className="text-muted-foreground mb-6">
              We use cookies and similar technologies to improve your experience on our platform. 
              You can control cookie preferences through your browser settings.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground mb-6">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. 
              Your documents are securely stored and accessible through your account.
            </p>

            <h2 className="font-display text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p className="text-muted-foreground">
              For privacy-related inquiries, please contact us at privacy@ethoslegis.com.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
