import React, { useState, useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Layers, Loader2 } from 'lucide-react';
import { CONTACT_INFO, Language } from '../data/villaData';

const LEONARDO_COORDS = { lat: 45.336938, lng: 13.588688 }; // Plus Code: 8FQM8HPQ+QF (8HPQ+QF Bužinija, Hrvaška)

const GOOGLE_MAPS_DIRECT_URL = `https://www.google.com/maps/search/?api=1&query=${LEONARDO_COORDS.lat},${LEONARDO_COORDS.lng}`;
const GOOGLE_MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LEONARDO_COORDS.lat},${LEONARDO_COORDS.lng}`;

const MAP_LABELS: Record<
  Language,
  {
    sectionTitle: string;
    directionsBtn: string;
    openMapBtn: string;
    mapView: string;
    satelliteView: string;
    markerHint: string;
    infoSubtitle: string;
    loadingText: string;
    fallbackNote: string;
  }
> = {
  sl: {
    sectionTitle: 'Lokacija na zemljevidu',
    directionsBtn: 'Navodila za pot',
    openMapBtn: 'Odpri v Google Zemljevidih',
    mapView: 'Zemljevid',
    satelliteView: 'Satelit',
    markerHint: 'Paolija 16a · 2,5 km od Novigrada',
    infoSubtitle: 'Zasebna vila z ogrevanim bazenom in oljčnim nasadom',
    loadingText: 'Nalaganje zemljevida …',
    fallbackNote: 'Za interaktivna navodila do posestva odprite lokacijo neposredno v Google Zemljevidih.',
  },
  en: {
    sectionTitle: 'Location on Map',
    directionsBtn: 'Get Directions',
    openMapBtn: 'Open in Google Maps',
    mapView: 'Map',
    satelliteView: 'Satellite',
    markerHint: 'Paolija 16a · 2.5 km from Novigrad',
    infoSubtitle: 'Private villa with heated pool and olive grove',
    loadingText: 'Loading map…',
    fallbackNote: 'Open our location directly in Google Maps for turn-by-turn directions.',
  },
  de: {
    sectionTitle: 'Lage auf der Karte',
    directionsBtn: 'Route planen',
    openMapBtn: 'In Google Maps öffnen',
    mapView: 'Karte',
    satelliteView: 'Satellit',
    markerHint: 'Paolija 16a · 2,5 km nach Novigrad',
    infoSubtitle: 'Private Villa mit beheiztem Pool und Olivenhain',
    loadingText: 'Karte wird geladen…',
    fallbackNote: 'Öffnen Sie den Standort direkt in Google Maps für eine detaillierte Wegbeschreibung.',
  },
  hr: {
    sectionTitle: 'Lokacija na karti',
    directionsBtn: 'Upute za dolazak',
    openMapBtn: 'Otvori u Google Kartama',
    mapView: 'Karta',
    satelliteView: 'Satelit',
    markerHint: 'Paolija 16a · 2,5 km od Novigrada',
    infoSubtitle: 'Privatna vila s grijanim bazenom i maslinikom',
    loadingText: 'Učitavanje karte…',
    fallbackNote: 'Otvorite lokaciju izravno u Google Kartama za upute za dolazak.',
  },
};

interface LeonardoLocationMapProps {
  lang: Language;
}

const MapContent: React.FC<{
  lang: Language;
  mapTypeId: 'roadmap' | 'hybrid';
  hasQuotaError: boolean;
}> = ({ lang, mapTypeId, hasQuotaError }) => {
  const status = useApiLoadingStatus();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const t = MAP_LABELS[lang];
  const displayAddress = lang === 'sl' || lang === 'hr' ? CONTACT_INFO.address : CONTACT_INFO.addressInternational;

  const handleMarkerClick = useCallback(() => {
    setInfoOpen((prev) => !prev);
  }, []);

  if (
    hasQuotaError ||
    status === APILoadingStatus.FAILED ||
    status === APILoadingStatus.AUTH_FAILURE
  ) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EFECE4]">
        <div className="w-10 h-10 rounded-full bg-[#3A4F37]/12 border border-[#3A4F37]/25 text-[#3A4F37] flex items-center justify-center mb-3">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="font-serif text-lg font-semibold text-[#1E251F]">Leonardo House</div>
        <div className="text-xs sm:text-sm text-[#3D463B] mt-1">{displayAddress}</div>
        <div className="font-mono text-[11px] text-[#6B7466] mt-0.5 tabular-nums">
          {CONTACT_INFO.coordinates}
        </div>
        <p className="text-xs text-[#5C645A] mt-2 max-w-sm">{t.fallbackNote}</p>
        <a
          href={GOOGLE_MAPS_DIRECT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#3A4F37] hover:bg-[#2E402B] text-[#FAF8F4] text-xs font-medium transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{t.openMapBtn}</span>
        </a>
      </div>
    );
  }

  return (
    <>
      {status !== APILoadingStatus.LOADED && (
        <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-[#EFECE4]/90 text-xs text-[#5C645A]">
          <Loader2 className="w-4 h-4 animate-spin text-[#3A4F37]" />
          <span>{t.loadingText}</span>
        </div>
      )}

      <GoogleMap
        mapId="DEMO_MAP_ID"
        mapTypeId={mapTypeId}
        defaultCenter={LEONARDO_COORDS}
        defaultZoom={14}
        gestureHandling="cooperative"
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={true}
        zoomControl={true}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        <AdvancedMarker
          ref={markerRef}
          position={LEONARDO_COORDS}
          title="Leonardo House"
          onClick={handleMarkerClick}
        >
          <div className="flex flex-col items-center cursor-pointer group select-none">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F4] border border-[#3A4F37]/45 shadow-[0_6px_16px_rgba(30,37,31,0.22)] group-hover:border-[#3A4F37] transition-transform duration-200 group-hover:-translate-y-0.5">
              <span className="w-2 h-2 rounded-full bg-[#3A4F37] shrink-0" />
              <span className="font-serif text-xs font-semibold text-[#1E251F] whitespace-nowrap">
                Leonardo House
              </span>
            </div>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#3A4F37] -mt-px" />
          </div>
        </AdvancedMarker>

        {infoOpen && marker && (
          <InfoWindow
            anchor={marker}
            maxWidth={250}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div className="p-0.5 text-[#1E251F] font-sans">
              <div className="font-serif text-sm font-semibold text-[#1E251F]">
                Leonardo House
              </div>
              <p className="text-[11px] text-[#5C645A] mt-0.5 leading-snug">
                {t.infoSubtitle}
              </p>
              <div className="text-xs font-medium text-[#2C352B] mt-1.5">
                {displayAddress}
              </div>
              <a
                href={GOOGLE_MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#3A4F37] hover:underline"
              >
                <Navigation className="w-3 h-3" />
                <span>{t.directionsBtn}</span>
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  );
};

export const LeonardoLocationMap: React.FC<LeonardoLocationMapProps> = ({ lang }) => {
  const mapHostRef = React.useRef<HTMLDivElement | null>(null);
  const runtimeMapsKey =
    typeof window !== 'undefined'
      ? (window as unknown as { __LEONARDO_CONFIG__?: { googleMapsApiKey?: string } })
          .__LEONARDO_CONFIG__?.googleMapsApiKey
      : undefined;
  const apiKey =
    (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ||
    runtimeMapsKey ||
    undefined;
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [hasQuotaError, setHasQuotaError] = useState<boolean>(false);
  const [shouldLoadMap, setShouldLoadMap] = useState<boolean>(false);

  useEffect(() => {
    const onQuotaExceeded = () => setHasQuotaError(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  useEffect(() => {
    if (!apiKey || shouldLoadMap) return;
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
  }, [apiKey, shouldLoadMap]);

  const t = MAP_LABELS[lang];
  const displayAddress = lang === 'sl' || lang === 'hr' ? CONTACT_INFO.address : CONTACT_INFO.addressInternational;

  return (
    <div ref={mapHostRef} className="mt-6 pt-6 border-t border-[#E5DFD3]">
      {/* Compact Map Controls Row */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-end gap-2.5 sm:gap-2 mb-3">
        {apiKey && !hasQuotaError && (
          <div
            role="group"
            aria-label={t.sectionTitle}
            className="grid grid-cols-2 sm:inline-flex w-full sm:w-auto items-center p-1 sm:p-0.5 rounded-xl sm:rounded-lg bg-[#EFECE4] border border-[#DFD7C8]"
          >
            <button
              type="button"
              onClick={() => setMapTypeId('roadmap')}
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
              onClick={() => setMapTypeId('hybrid')}
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
        )}

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

      {/* Explicit-Height Map Container matching card aesthetics */}
      <div className="relative w-full h-[230px] sm:h-[260px] rounded-xl overflow-hidden border border-[#DCD4C6] bg-[#EFECE4] shadow-[0_6px_18px_rgba(30,37,31,0.06)]">
        {apiKey ? (
          shouldLoadMap ? (
            <APIProvider apiKey={apiKey} language={lang} region="HR">
              <MapContent
                lang={lang}
                mapTypeId={mapTypeId}
                hasQuotaError={hasQuotaError}
              />
            </APIProvider>
          ) : (
            <div className="w-full h-full flex items-center justify-center gap-2 bg-[#EFECE4] text-xs text-[#5C645A]">
              <MapPin className="w-4 h-4 text-[#3A4F37]" />
              <span>Leonardo House · {t.markerHint}</span>
            </div>
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EFECE4]">
            <div className="w-10 h-10 rounded-full bg-[#3A4F37]/12 border border-[#3A4F37]/25 text-[#3A4F37] flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="font-serif text-lg font-semibold text-[#1E251F]">Leonardo House</div>
            <div className="text-xs sm:text-sm text-[#3D463B] mt-1">{displayAddress}</div>
            <div className="font-mono text-[11px] text-[#6B7466] mt-0.5 tabular-nums">
              {CONTACT_INFO.coordinates}
            </div>
            <p className="text-xs text-[#5C645A] mt-2 max-w-sm">{t.fallbackNote}</p>
            <a
              href={GOOGLE_MAPS_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#3A4F37] hover:bg-[#2E402B] text-[#FAF8F4] text-xs font-medium transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{t.openMapBtn}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
