// src/components/CookieConsent.tsx
import { useState, useEffect } from 'react';
import * as analytics from '../utils/analytics';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    
    if (!consent) {
      // Pas de consentement enregistré → Afficher la bannière
      setShowBanner(true);
      
      // ✅ IMPORTANT: Activer GA par défaut (opt-out plutôt que opt-in)
      // Conforme RGPD si utilisateur peut refuser
      analytics.setGAEnabled(true);
      console.log('🍪 GA enabled by default (user can decline)');
      
    } else if (consent === 'accepted') {
      analytics.setGAEnabled(true);
      console.log('🍪 GA enabled (user accepted)');
      
    } else {
      // consent === 'declined'
      analytics.setGAEnabled(false);
      console.log('🍪 GA disabled (user declined)');
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    analytics.setGAEnabled(true);
    analytics.trackEvent('cookie_consent', { action: 'accept' });
    setShowBanner(false);
    console.log('✅ User accepted cookies');
  };

  const declineCookies = () => {
    localStorage.setItem('cookie_consent', 'declined');
    analytics.setGAEnabled(false);
    analytics.trackEvent('cookie_consent', { action: 'decline' });
    setShowBanner(false);
    console.log('❌ User declined cookies');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2D5A4A] text-white p-4 shadow-2xl z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            We use cookies to improve your experience and analyze site traffic. 
            By clicking "Accept", you consent to our use of cookies.
            <a href="/privacy" className="underline ml-1 hover:text-[#C4A96A]">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-semibold"
          >
            Decline
          </button>
          <button
            onClick={acceptCookies}
            className="px-6 py-2 bg-[#C4A96A] hover:bg-[#A85C32] text-[#1a1a1a] rounded-lg transition-colors text-sm font-semibold"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}