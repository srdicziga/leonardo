import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { COOKIE_TABLE, CONTACT_INFO } from '../data/villaData';

interface LegalModalsProps {
  activeModal: 'privacy' | 'cookies' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (activeModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, onClose]);

  if (!activeModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#FAF8F4] border border-[#DCD4C6] rounded-2xl p-6 sm:p-8 text-[#1E251F] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD3] sticky top-0 bg-[#FAF8F4] z-10">
          <h3 className="font-serif text-2xl font-semibold">
            {activeModal === 'privacy' ? 'Politika zasebnosti — Leonardo House' : 'Spletni piškotki — Leonardo House'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zapri"
            className="p-2 rounded-lg text-[#4A5348] hover:bg-[#EFECE4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeModal === 'privacy' ? (
          <div className="mt-5 space-y-4 text-sm text-[#3D463B] leading-relaxed">
            <p>
              <strong>Upravljavec osebnih podatkov:</strong> Leonardo House, {CONTACT_INFO.address} ({CONTACT_INFO.email}, tel. {CONTACT_INFO.phoneMainDisplay}).
            </p>
            <p>
              <strong>Namen obdelave osebnih podatkov:</strong> Osebne podatke, ki nam jih posredujete prek kontaktnega oziroma rezervacijskega obrazca (ime in priimek, elektronski naslov, telefonska številka, termin prihoda in odhoda, število oseb ter opombe), obdelujemo izključno za namen priprave ponudbe, odgovora na vaše povpraševanje in izvedbe rezervacije nastanitve v Leonardo House.
            </p>
            <p>
              <strong>Pravice posameznika:</strong> Leonardo House posamezniku na njegovo zahtevo v skladu z veljavno zakonodajo omogoča vpogled, popravek, izbris ali omejitev obdelave osebnih podatkov, preklic privolitve (brez vpliva na zakonitost obdelave pred preklicem) ter podaja informacije o pravici do pritožbe pri pristojnem nadzornem organu.
            </p>
            <p>
              <strong>Rok hrambe in varnost:</strong> Leonardo House se zavezuje, da bo na zahteve posameznika odgovoril brez nepotrebnega odlašanja, najkasneje v zakonsko predpisanih rokih, in podatkov ne bo posredoval nepooblaščenim tretjim osebam.
            </p>
            <p className="text-xs text-[#6B7466] pt-2 border-t border-[#E5DFD3]">
              Ta politika zasebnosti je bila posodobljena 25. novembra 2023.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-5 text-sm text-[#3D463B] leading-relaxed">
            <p>
              Da bi vam olajšali uporabo naše spletne strani in jo naredili bolj prijetno, uporabljamo piškotke. Piškotki so majhne podatkovne enote, ki nam omogočajo razumevanje delovanja strani, prikaz koledarja zasedenosti in shranjevanje izbrane jezikovne različice.
            </p>

            <div className="overflow-x-auto border border-[#E2DBD0] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EFECE4] text-[#1E251F] border-b border-[#E2DBD0]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Ime piškotka</th>
                    <th className="py-2.5 px-3 font-semibold">Namen</th>
                    <th className="py-2.5 px-3 font-semibold">Čas hrambe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD3]">
                  {COOKIE_TABLE.map((c) => (
                    <tr key={c.name}>
                      <td className="py-2.5 px-3 font-mono text-[#2C352B]">{c.name}</td>
                      <td className="py-2.5 px-3">{c.purpose}</td>
                      <td className="py-2.5 px-3 font-mono tabular-nums">{c.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 text-xs text-[#5C645A]">
              <p>
                <strong>Obvezni piškotki:</strong> Nujni za premikanje po spletni strani in delovanje obrazca za povpraševanje.
              </p>
              <p>
                <strong>Izvedbeni in funkcionalni piškotki:</strong> Omogočajo zapomnitev izbranega jezika ter anonimno analitiko obiska.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
