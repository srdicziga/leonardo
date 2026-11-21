import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Layers, Loader2 } from 'lucide-react';
import { Language } from '../data/villaData';

const LEONARDO_COORDS = { lat: 45.336938, lng: 13.588688 }; // Plus Code: 8FQM8HPQ+QF (8HPQ+QF Bužinija, Hrvaška)

const GOOGLE_MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LEONARDO_COORDS.lat},${LEONARDO_COORDS.lng}`;

const MAP_LABELS: Record<
  Language,
  {
    sectionTitle: string;
    directionsBtn: string;
    mapView: string;
    satelliteView: string;
    markerHint: string;
    loadingText: string;
    iframeTitle: string;
  }
> = {
  sl: {
    sectionTitle: 'Lokacija na zemljevidu',
    directionsBtn: 'Navodila za pot',
    mapView: 'Zemljevid',
    satelliteView: 'Satelit',
    markerHint: 'Paolija 16a · 2,5 km od Novigrada',
    loadingText: 'Nalaganje zemljevida …',
    iframeTitle: 'Lokacija Leonardo House na Google Zemljevidih',
  },
  en: {
    sectionTitle: 'Location on Map',
    directionsBtn: 'Get Directions',
    mapView: 'Map',
    satelliteView: 'Satellite',
    markerHint: 'Paolija 16a · 2.5 km from Novigrad',
    loadingText: 'Loading map…',
    iframeTitle: 'Leonardo House location on Google Maps',
  },
  de: {
    sectionTitle: 'Lage auf der Karte',
    directionsBtn: 'Route planen',
    mapView: 'Karte',
    satelliteView: 'Satellit',
    markerHint: 'Paolija 16a · 2,5 km nach Novigrad',
    loadingText: 'Karte wird geladen…',
    iframeTitle: 'Standort von Leonardo House auf Google Maps',
  },
  hr: {
    sectionTitle: 'Lokacija na karti',
    directionsBtn: 'Upute za dolazak',
    mapView: 'Karta',
    satelliteView: 'Satelit',
    markerHint: 'Paolija 16a · 2,5 km od Novigrada',
    loadingText: 'Učitavanje karte…',
    iframeTitle: 'Lokacija Leonardo House na Google Kartama',
  },
};

interface LeonardoLocationMapProps {
  lang: Language;
}

export const LeonardoLocationMap: React.FC<LeonardoLocationMapProps> = ({ lang }) => {
  const mapHostRef = React.useRef<HTMLDivElement | null>(null);
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [shouldLoadMap, setShouldLoadMap] = useState<boolean>(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (shouldLoadMap) return;
    const node = mapHostRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShouldLoadMap(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoadMap]);

  const t = MAP_LABELS[lang];
  const mapTypeParam = mapTypeId === 'hybrid' ? 'h' : 'm';
  const embedUrl = `https://maps.google.com/maps?q=${LEONARDO_COORDS.lat},${LEONARDO_COORDS.lng}&hl=${lang}&t=${mapTypeParam}&z=15&ie=UTF8&output=embed`;

  const handleMapTypeChange = (nextType: 'roadmap' | 'hybrid') => {
    if (nextType === mapTypeId) return;
    setIsIframeLoaded(false);
    setMapTypeId(nextType);
  };

  return (
    <div ref={mapHostRef} className="mt-6 pt-6 border-t border-[#E5DFD3]">
      {/* Compact Map Controls Row */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-end gap-2.5 sm:gap-2 mb-3">
        <div
          role="group"
          aria-label={t.sectionTitle}
          className="grid grid-cols-2 sm:inline-flex w-full sm:w-auto items-center p-1 sm:p-0.5 rounded-xl sm:rounded-lg bg-[#EFECE4] border border-[#DFD7C8]"
        >
          <button
            type="button"
            onClick={() => handleMapTypeChange('roadmap')}
            className={`inline-flex items-center justify-center px-3 sm:px-2.5 py-2 sm:py-1 rounded-lg sm:rounded-md text-xs sm:text-[11px] font-medium transition-colors cursor-pointer ${
              mapTypeId === 'roadmap'
                ? 'bg-[#FAF8F4] text-[#1E251F] shadow-xs'
                : 'text-[#5C645A] hover:text-[#1E251F]'
            }`}
          >
            {t.mapView}
          </button>
          <button
            type="button"
            onClick={() => handleMapTypeChange('hybrid')}
            className={`inline-flex items-center justify-center gap-1.5 sm:gap-1 px-3 sm:px-2.5 py-2 sm:py-1 rounded-lg sm:rounded-md text-xs sm:text-[11px] font-medium transition-colors cursor-pointer ${
              mapTypeId === 'hybrid'
                ? 'bg-[#FAF8F4] text-[#1E251F] shadow-xs'
                : 'text-[#5C645A] hover:text-[#1E251F]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-3 sm:h-3 shrink-0" />
            <span>{t.satelliteView}</span>
          </button>
        </div>

        <a
          href={GOOGLE_MAPS_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-1.5 px-4 sm:px-3 py-2.5 sm:py-1.5 rounded-xl sm:rounded-lg border border-[#D5CDBE] bg-[#EFECE4] hover:bg-[#3A4F37] text-[#1E251F] hover:text-[#FAF8F4] hover:border-[#3A4F37] text-xs font-medium transition-colors whitespace-nowrap shrink-0"
        >
          <Navigation className="w-3.5 h-3.5 shrink-0" />
          <span>{t.directionsBtn}</span>
        </a>
      </div>

      {/* Explicit-Height Keyless Google Maps Embed */}
      <div className="relative w-full h-[250px] sm:h-[280px] rounded-xl overflow-hidden border border-[#DCD4C6] bg-[#EFECE4] shadow-[0_6px_18px_rgba(30,37,31,0.06)]">
        {shouldLoadMap ? (
          <>
            {!isIframeLoaded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-[#EFECE4]/90 text-xs text-[#5C645A] pointer-events-none">
                <Loader2 className="w-4 h-4 animate-spin text-[#3A4F37]" />
                <span>{t.loadingText}</span>
              </div>
            )}
            <iframe
              key={`${lang}-${mapTypeParam}`}
              title={t.iframeTitle}
              src={embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              onLoad={() => setIsIframeLoaded(true)}
              className="w-full h-full border-0 block"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center gap-2 bg-[#EFECE4] text-xs text-[#5C645A]">
            <MapPin className="w-4 h-4 text-[#3A4F37]" />
            <span>Leonardo House · {t.markerHint}</span>
          </div>
        )}
      </div>
    </div>
  );
};
