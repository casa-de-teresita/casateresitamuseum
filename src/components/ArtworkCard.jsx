// src/components/ArtworkCard.jsx - WITH MEDIA BADGES
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, MapPin, ExternalLink, Youtube, Music } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import QRCodeDisplay from './QRCodeDisplay';

const ArtworkCard = ({ artwork }) => {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Category icons/colors
  const categoryStyles = {
    Painting: 'bg-red-100 text-red-800',
    Sculpture: 'bg-blue-100 text-blue-800',
    Piano: 'bg-purple-100 text-purple-800',
    Furniture: 'bg-amber-100 text-amber-800',
    Document: 'bg-green-100 text-green-800',
    Textile: 'bg-pink-100 text-pink-800',
    Activity: 'bg-orange-100 text-orange-800',
    Viewpoint: 'bg-cyan-100 text-cyan-800',
    'Stained Glass Art': 'bg-indigo-100 text-indigo-800'
  };

  const handleImageError = (e) => {
    console.error('❌ Image failed to load:', artwork.image);
    console.error('   Full URL:', e.target.src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', artwork.image);
  };
  
  // ✅ Check if artwork has media
  const hasYoutube = artwork.youtube && artwork.youtube.includes('youtu');
  const hasSpotify = artwork.spotify && artwork.spotify.includes('spotify');
  
  return (
    <>
      {/* Card */}
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
        {/* Image - Cliquable vers la page de détail */}
        <Link 
          to={`/museum/${artwork.slug}`} 
          className="block relative aspect-square overflow-hidden bg-gray-100"
        >
          {!imageError ? (
            <img 
              src={artwork.image} 
              alt={artwork.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-center p-4">
                <span className="text-gray-500 text-sm">Image not found</span>
                <p className="text-xs text-gray-400 mt-2 break-all">{artwork.image}</p>
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyles[artwork.category] || 'bg-gray-100 text-gray-800'}`}>
              {artwork.category}
            </span>
          </div>

          {/* ✅ Media Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {hasYoutube && (
              <div className="bg-red-600 text-white p-2 rounded-full shadow-lg" title="Has video">
                <Youtube className="h-4 w-4" />
              </div>
            )}
            {hasSpotify && (
              <div className="bg-green-600 text-white p-2 rounded-full shadow-lg" title="Has audio">
                <Music className="h-4 w-4" />
              </div>
            )}
          </div>
        </Link>
        
        {/* Content */}
        <div className="p-4">
          <Link to={`/museum/${artwork.slug}`}>
            <h3 className="text-xl font-bold text-[#2D5A4A] mb-1 group-hover:text-[#A85C32] transition-colors">
              {artwork.title}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm mb-2">
            {artwork.artist} · {artwork.year}
          </p>
          <div className="flex items-center justify-between">
            
            {/* Boutons d'action */}
            <div className="flex gap-2">
              <Link
                to={`/museum/${artwork.slug}`}
                className="text-[#A85C32] hover:text-[#8B4926] transition-colors p-2 rounded-lg hover:bg-[#F8F5F2]"
                title="View details"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setShowModal(true)}
                className="text-[#2D5A4A] hover:text-[#1F3D32] transition-colors p-2 rounded-lg hover:bg-[#F8F5F2]"
                title="Quick preview"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal - Quick Preview */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="sticky top-4 right-4 float-right bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
            
            {/* Modal Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image */}
                <div className="space-y-4">
                  {!imageError ? (
                    <img 
                      src={artwork.image} 
                      alt={artwork.title}
                      className="w-full rounded-lg shadow-lg"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full aspect-square rounded-lg shadow-lg bg-gray-200 flex items-center justify-center">
                      <div className="text-center p-8">
                        <span className="text-gray-500">Image not available</span>
                        <p className="text-xs text-gray-400 mt-2 break-all">{artwork.image}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* QR Code */}
                  {artwork.qrCode && (
                    <QRCodeDisplay 
                      url={artwork.qrCode} 
                      title={artwork.title}
                    />
                  )}
                </div>
                
                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${categoryStyles[artwork.category]}`}>
                      {artwork.category}
                    </span>

                    {/* ✅ Media Indicators in Modal */}
                    {(hasYoutube || hasSpotify) && (
                      <div className="flex gap-2 mb-4">
                        {hasYoutube && (
                          <div className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                            <Youtube className="h-3 w-3" />
                            <span>Video</span>
                          </div>
                        )}
                        {hasSpotify && (
                          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                            <Music className="h-3 w-3" />
                            <span>Audio</span>
                          </div>
                        )}
                      </div>
                    )}

                    <h2 
                      className="text-3xl font-bold text-[#2D5A4A] mb-2"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {artwork.title}
                    </h2>
                    <p className="text-xl text-gray-600 mb-4">
                      {artwork.artist} · {artwork.year}
                    </p>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <ReactMarkdown>{artwork.body}</ReactMarkdown>
                  </div>

                  {/* Link to full page */}
                  <Link
                    to={`/museum/${artwork.slug}`}
                    className="block w-full mt-6 bg-[#A85C32] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#8B4926] transition-colors"
                    onClick={() => setShowModal(false)}
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtworkCard;