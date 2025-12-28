// src/pages/HomePage.jsx
import Hero from '../components/Hero';
import GalleryPreview from '../components/GalleryPreview';
import RoomsPreview from '../components/RoomsPreview';
import UniqueExperience from '../components/UniqueExperience';
import TrustBadges from '../components/TrustBadges';
import Location from '../components/Location';
import PracticalInfo from '../components/PracticalInfo';
import FinalCta from '../components/FinalCta';

const HomePage = () => {
  return (
    <div>
      {/* 1. Hero Section - Captation Immédiate */}
      <Hero />

      {/* 2. L'Expérience Unique - Différenciation Profonde */}
      <UniqueExperience />

      {/* 3. Chambres & Tarifs - Transparence & Conversion */}
      <RoomsPreview />
      
      {/* 4. Galerie Immersive - Désir Émotionnel */}
      <GalleryPreview />
      
      {/* 5. Avis & Confiance - Preuve Sociale */}
      <TrustBadges />
      
      {/* 6. Localisation & Accès - Levée des Derniers Doutes */}
      <Location />
      
      {/* 7. FAQ & Règles - Clarté Pré-Réservation */}
      <PracticalInfo />
      
      {/* 8. CTA Final - Action & Contact */}
      <FinalCta />
    </div>
  );
};

export default HomePage;