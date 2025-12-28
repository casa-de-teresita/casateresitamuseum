// src/components/PracticalInfo.jsx
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';


const PracticalInfo = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#F8F5F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-12 w-12 text-[#A85C32]" />
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#2D5A4A] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.faq.title}
          </h2>
          <p className="text-xl text-gray-600">{t.faq.subtitle}</p>
        </div>

        <div className="space-y-4">
          {t.faq.items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#F8F5F2] transition-colors"
              >
                <h3 className="font-bold text-lg text-[#2D5A4A] pr-4">
                  {item.q}
                </h3>
                <ChevronDown
                  className={`h-6 w-6 text-[#A85C32] flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 pb-5' : 'max-h-0'
                }`}
              >
                <p className="text-gray-700 leading-relaxed border-t border-gray-200 pt-4">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-[#2D5A4A] to-[#A85C32] p-8 rounded-xl text-white text-center">
          <p className="text-lg mb-4">
            {t.faq.subtitle}
          </p>
          <p className="text-sm opacity-90">
            For Bolivian guests: 13% IVA included in final billing at checkout
          </p>
        </div>
      </div>
    </section>
  );
};

export default PracticalInfo;