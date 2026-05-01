import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto prose prose-gray">
      <h1 className="text-5xl font-display text-gray-900 mb-12 italic underline decoration-gold/20 underline-offset-8 text-center not-prose">Privacy Policy</h1>
      
      <p className="lead font-medium text-gray-600">
        At Hafiza's Aura, we respect the privacy of our valued patrons. This policy outlines how we protect and manage the information you entrust to us.
      </p>

      <h2 className="font-display text-2xl text-gray-900 mt-12">1. Data Collection</h2>
      <p>
        We collect only the essential information required to curate your experience:
      </p>
      <ul>
        <li>Identification: Full name, delivery address, and contact numbers.</li>
        <li>Transactional: Purchase history and payment confirmations (managed through secure gateways).</li>
        <li>Digital: IP addresses and browsing preferences to refine our digital gallery.</li>
      </ul>

      <h2 className="font-display text-2xl text-gray-900 mt-12">2. Use of Information</h2>
      <p>
        Your data is used strictly for:
      </p>
      <ul>
        <li>Order fulfillment and artisan crafting updates.</li>
        <li>Aura membership communication and bespoke session scheduling.</li>
        <li>Security monitoring to prevent fraudulent activities in the vault.</li>
      </ul>

      <h2 className="font-display text-2xl text-gray-900 mt-12">3. Protection of Data</h2>
      <p>
        We employ industry-standard encryption and secure servers to house your heritage records. Your personal information is never sold or traded to third-party entities for marketing purposes.
      </p>

      <h2 className="font-display text-2xl text-gray-900 mt-12">4. Your Rights</h2>
      <p>
        You reserve the right to access, modify, or request the deletion of your personal aura data from our records at any time by contacting our support team.
      </p>

      <div className="mt-16 pt-8 border-t border-gray-100 text-[10px] text-gray-400 font-black uppercase tracking-widest text-center">
        Last Updated: {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
