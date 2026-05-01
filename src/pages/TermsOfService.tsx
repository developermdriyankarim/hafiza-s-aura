import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto prose prose-gray">
      <h1 className="text-5xl font-display text-gray-900 mb-12 italic underline decoration-gold/20 underline-offset-8 text-center not-prose">Terms of Service</h1>
      
      <p className="lead font-medium text-gray-600">
        By engaging with Hafiza's Aura, you agree to the following terms that govern our artisan-client relationship.
      </p>

      <h2 className="font-display text-2xl text-gray-900 mt-12">1. Authenticity & Craftsmanship</h2>
      <p>
        Every piece displayed in our gallery is handcrafted. Minor variations in stone hue or metal texture are hallmarks of authentic craftsmanship and do not constitute defects.
      </p>

      <h2 className="font-display text-2xl text-gray-900 mt-12">2. Pricing & Payments</h2>
      <p>
        All valuations are in Bangladeshi Taka (BDT). We reserve the right to refine prices based on raw material fluctuations. Payments must be cleared before the artisan begins the final refinement of your order.
      </p>

      <h2 className="font-display text-2xl text-gray-900 mt-12">3. Intellectual Property</h2>
      <p>
        The designs, imagery, and "Aura" branding are the exclusive property of Hafiza's Aura. Unauthorized reproduction of our heritage designs is strictly prohibited.
      </p>

      <h2 className="font-display text-2xl text-gray-900 mt-12">4. Limitation of Liability</h2>
      <p>
        While we strive for perfection, Hafiza's Aura is not liable for indirect or incidental damages arising from the use of our artifacts or digital platform.
      </p>

      <h2 className="font-display text-2xl text-gray-900 mt-12">5. Bespoke Orders</h2>
      <p>
        Bespoke session deposits are non-refundable once the design phase has commenced. Final approval of the artifact design is required before production.
      </p>

      <div className="mt-16 pt-8 border-t border-gray-100 text-[10px] text-gray-400 font-black uppercase tracking-widest text-center">
        Agreement Version: 2.1 | Effective Since: artisan Launch
      </div>
    </div>
  );
};

export default TermsOfService;
