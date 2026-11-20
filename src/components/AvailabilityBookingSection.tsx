import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Check, Mail, Phone, MapPin, MessageCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { CONTACT_INFO, Language } from '../data/villaData';
import { AmenityAnimatedIcon } from './AmenityAnimatedIcon';
import { LeonardoLocationMap } from './LeonardoLocationMap';

function generateSecurityCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface AvailabilityBookingSectionProps {
  lang: Language;
  onOpenLegalModal: (type: 'privacy' | 'cookies') => void;
}

interface AirbnbDayInfo {
  available: boolean;
  availableForCheckin: boolean;
  availableForCheckout: boolean;
  minNights: number;
}

// Baseline Airbnb unavailable ranges for room 561522208362347922 (used immediately before live sync completes)
const FALLBACK_BOOKED_RANGES: [string, string][] = [
  ['2026-01-01', '2028-04-30'],
  ['2028-11-07', '2028-11-21'],
];

function isFallbackDateBooked(dateIso: string): boolean {
  return FALLBACK_BOOKED_RANGES.some(([start, end]) => dateIso >= start && dateIso <= end);
}

function formatIsoDate(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

const MONTH_NAMES: Record<Language, string[]> = {
  sl: ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  hr: ['Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj', 'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'],
};

const DAY_NAMES: Record<Language, string[]> = {
  sl: ['Po', 'To', 'Sr', 'Če', 'Pe', 'So', 'Ne'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  hr: ['Po', 'Ut', 'Sr', 'Če', 'Pe', 'Su', 'Ne'],
};

export const AvailabilityBookingSection: React.FC<AvailabilityBookingSectionProps> = ({
  lang,
  onOpenLegalModal,
}) => {
  // Default calendar view to the current month of today
  const todayIso = useMemo(() => {
    const now = new Date();
    return formatIsoDate(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [baseMonth, setBaseMonth] = useState<{ year: number; month: number }>(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [persons, setPersons] = useState<string>('4');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [gdprAccepted, setGdprAccepted] = useState<boolean>(true);
  const [securityCode, setSecurityCode] = useState<string>(() => generateSecurityCode());
  const [securityInput, setSecurityInput] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const refreshSecurityCode = useCallback(() => {
    setSecurityCode(generateSecurityCode());
    setSecurityInput('');
  }, []);

  const isHumanVerified = useMemo(
    () => securityInput.trim().toUpperCase() === securityCode,
    [securityInput, securityCode]
  );

  // Live Airbnb calendar synchronization state
  const [airbnbDays, setAirbnbDays] = useState<Record<string, AirbnbDayInfo> | null>(null);
  const [isSyncingCalendar, setIsSyncingCalendar] = useState<boolean>(false);

  const syncAirbnbCalendar = useCallback(async (forceRefresh = false) => {
    setIsSyncingCalendar(true);
    try {
      const res = await fetch(`/api/airbnb-calendar${forceRefresh ? '?refresh=1' : ''}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data && (data.ok ?? true) && data.days && Object.keys(data.days).length > 0) {
        setAirbnbDays(data.days);
      }
    } catch {
      // Silently fallback to baseline ranges if offline
    } finally {
      setIsSyncingCalendar(false);
    }
  }, []);

  useEffect(() => {
    syncAirbnbCalendar(false);
    // Automatically refresh availability from Airbnb every 2 minutes & when window regains focus
    const interval = setInterval(() => {
      syncAirbnbCalendar(false);
    }, 120 * 1000);
    const onFocus = () => syncAirbnbCalendar(false);
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [syncAirbnbCalendar]);

  const isDateUnavailable = useCallback(
    (iso: string): boolean => {
      if (iso < todayIso) return true;
      if (airbnbDays && iso in airbnbDays) {
        return !airbnbDays[iso].available;
      }
      return isFallbackDateBooked(iso);
    },
    [airbnbDays, todayIso]
  );

  const hasUnavailableInRange = useCallback(
    (startIso: string, endIso: string): boolean => {
      const cur = new Date(startIso + 'T00:00:00');
      const end = new Date(endIso + 'T00:00:00');
      while (cur < end) {
        const iso = formatIsoDate(cur.getFullYear(), cur.getMonth(), cur.getDate());
        if (isDateUnavailable(iso)) return true;
        cur.setDate(cur.getDate() + 1);
      }
      return false;
    },
    [isDateUnavailable]
  );

  const labels = {
    sl: {
      heading: 'Rezervacija & Kontakt',
      subhead:
        'Ne odlašajte z vprašanjem ali rezervacijo. V koledarju si lahko pogledate, kateri datumi so že rezervirani in kateri prosti. V primeru, da imate kakršnokoli drugo željo, jo prosim dopišite v opombo.',
      interactiveTab: 'Interaktivni izbor datumov',
      liveSyncTab: 'Izvirni RentalBell koledar',
      availableLegend: 'Prosto',
      bookedLegend: 'Zasedeno',
      selectedLegend: 'Izbrani termin',
      clearDates: 'Ponastavi datume',
      nightsLabel: 'nočitev',
      dateFromLabel: 'Prihod (Po 15:00)',
      dateToLabel: 'Odhod (Pred 10:00)',
      personsLabel: 'Število oseb (Max. 6)',
      personUnit: 'oseb',
      nameLabel: 'Ime in priimek *',
      namePlaceholder: 'npr. Ana Novak',
      emailLabel: 'E-naslov *',
      emailPlaceholder: 'ana.novak@primer.si',
      phoneLabel: 'Telefonska številka (neobvezno)',
      phonePlaceholder: '+386 31 ...',
      commentLabel: 'Opomba ali posebne želje',
      commentPlaceholder: 'Želimo otroško posteljico, degustacijo domačega oljčnega olja, poznejši prihod ...',
      gdprPrefix: 'Obvestilo GDPR: Z uporabo tega obrazca se strinjate in soglašate s hranjenjem vaših osebnih podatkov za namen odgovora na povpraševanje. Več v',
      gdprLink: 'Politiki zasebnosti',
      submitBtn: 'Pošlji povpraševanje',
      thankYouTitle: 'Hvala za vaše povpraševanje!',
      thankYouDesc: 'Odgovorili vam bomo v najkrajšem možnem času. Spodaj lahko povpraševanje neposredno pošljete tudi prek WhatsAppa ali e-pošte.',
      sendWhatsappNow: 'Pošlji prek WhatsAppa',
      sendEmailNow: 'Odpri v e-poštnem odjemalcu',
      newInquiryBtn: 'Novo povpraševanje',
      contactCardTitle: 'Neposredni kontaktni podatki',
      locationLabel: 'Naslov nastanitve',
      phone1Label: 'Telefon & Sporočila (EN, SI, HR, DE)',
      phone2Label: 'Hrvaška številka (HR)',
      emailContactLabel: 'Elektronska pošta',
      errMissingFields: 'Prosimo, vnesite ime, veljaven e-naslov ter datuma prihoda in odhoda.',
      errGdpr: 'Prosimo, potrdite soglasje za obdelavo podatkov (GDPR).',
      errDateOrder: 'Datum odhoda mora biti po datumu prihoda.',
      securityTitle: 'Varnostno preverjanje (Nisem robot) *',
      securityPlaceholder: 'Prepišite šifro',
      securityVerified: 'Potrjeno — niste robot',
      securityRefresh: 'Nova varnostna šifra',
      errCaptcha: 'Prosimo, pravilno prepišite varnostno šifro (preverjanje »Nisem robot«).',
    },
    en: {
      heading: 'Availability & Contact',
      subhead:
        'Do not hesitate to ask us a question or make a reservation. Check the calendar to see which dates are available. If you have any special requests, please include them in the note.',
      interactiveTab: 'Interactive Date Picker',
      liveSyncTab: 'Live RentalBell Calendar',
      availableLegend: 'Available',
      bookedLegend: 'Unavailable',
      selectedLegend: 'Selected Stay',
      clearDates: 'Reset dates',
      nightsLabel: 'nights',
      dateFromLabel: 'Date from (After 15:00)',
      dateToLabel: 'Date to (Before 10:00)',
      personsLabel: 'Persons (Max. 6)',
      personUnit: 'guests',
      nameLabel: 'Full Name *',
      namePlaceholder: 'e.g. Rebecca Smith',
      emailLabel: 'Email Address *',
      emailPlaceholder: 'rebecca@example.com',
      phoneLabel: 'Phone Number (optional)',
      phonePlaceholder: '+44 ...',
      commentLabel: 'Comment / Special Requests',
      commentPlaceholder: 'Request a baby crib, homemade olive oil tasting, arrival time details...',
      gdprPrefix: 'GDPR Notice: By submitting this form you agree to the processing of your personal data to respond to your booking inquiry. Read more in our',
      gdprLink: 'Privacy Policy',
      submitBtn: 'Send Inquiry',
      thankYouTitle: 'Thank you for your inquiry!',
      thankYouDesc: 'We will get back to you as soon as possible. You can also send your inquiry directly via WhatsApp or email below.',
      sendWhatsappNow: 'Send via WhatsApp',
      sendEmailNow: 'Open in Email Client',
      newInquiryBtn: 'Back to Form',
      contactCardTitle: 'Direct Contact Details',
      locationLabel: 'Property Address',
      phone1Label: 'Primary Phone (EN, SI, HR, DE)',
      phone2Label: 'Croatian Phone (HR)',
      emailContactLabel: 'Email Address',
      errMissingFields: 'Please enter your name, a valid email address, and check-in/check-out dates.',
      errGdpr: 'Please accept the privacy notice to submit your inquiry.',
      errDateOrder: 'Check-out date must be after the check-in date.',
      securityTitle: 'Security Check (I am not a robot) *',
      securityPlaceholder: 'Enter code',
      securityVerified: 'Verified — not a robot',
      securityRefresh: 'Generate new code',
      errCaptcha: 'Please enter the correct security code ("I am not a robot" verification).',
    },
    de: {
      heading: 'Verfügbarkeit & Kontakt',
      subhead:
        'Zögern Sie nicht, uns eine Frage zu stellen oder eine Reservierung vorzunehmen. Im Kalender sehen Sie freie und belegte Termine. Besondere Wünsche können Sie gerne im Kommentarfeld vermerken.',
      interactiveTab: 'Interaktive Datumsauswahl',
      liveSyncTab: 'RentalBell Belegungskalender',
      availableLegend: 'Verfügbar',
      bookedLegend: 'Belegt',
      selectedLegend: 'Ihre Auswahl',
      clearDates: 'Daten zurücksetzen',
      nightsLabel: 'Nächte',
      dateFromLabel: 'Anreise (Ab 15:00 Uhr)',
      dateToLabel: 'Abreise (Vor 10:00 Uhr)',
      personsLabel: 'Personen (Max. 6)',
      personUnit: 'Gäste',
      nameLabel: 'Vor- und Nachname *',
      namePlaceholder: 'z. B. Thomas Müller',
      emailLabel: 'E-Mail-Adresse *',
      emailPlaceholder: 'thomas@beispiel.de',
      phoneLabel: 'Telefonnummer (optional)',
      phonePlaceholder: '+49 ...',
      commentLabel: 'Anmerkung / Sonderwünsche',
      commentPlaceholder: 'Babybett gewünscht, Olivenöl-Verkostung, geplante Ankunftszeit ...',
      gdprPrefix: 'DSGVO-Hinweis: Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Angaben zur Beantwortung Ihrer Anfrage zu. Details in der',
      gdprLink: 'Datenschutzerklärung',
      submitBtn: 'Anfrage senden',
      thankYouTitle: 'Vielen Dank für Ihre Anfrage!',
      thankYouDesc: 'Wir melden uns schnellstmöglich bei Ihnen. Sie können Ihre Anfrage auch direkt per WhatsApp oder E-Mail senden.',
      sendWhatsappNow: 'Per WhatsApp senden',
      sendEmailNow: 'Im E-Mail-Programm öffnen',
      newInquiryBtn: 'Neue Anfrage',
      contactCardTitle: 'Direkte Kontaktdaten',
      locationLabel: 'Adresse der Unterkunft',
      phone1Label: 'Telefon & Messenger (EN, SI, HR, DE)',
      phone2Label: 'Kroatische Nummer (HR)',
      emailContactLabel: 'E-Mail-Adresse',
      errMissingFields: 'Bitte geben Sie Ihren Namen, eine gültige E-Mail-Adresse sowie An- und Abreisedatum ein.',
      errGdpr: 'Bitte bestätigen Sie den Datenschutzhinweis.',
      errDateOrder: 'Das Abreisedatum muss nach dem Anreisedatum liegen.',
      securityTitle: 'Sicherheitsprüfung (Ich bin kein Roboter) *',
      securityPlaceholder: 'Code eingeben',
      securityVerified: 'Bestätigt — kein Roboter',
      securityRefresh: 'Neuen Code generieren',
      errCaptcha: 'Bitte geben Sie den richtigen Sicherheitscode ein („Ich bin kein Roboter“).',
    },
    hr: {
      heading: 'Rezervacija i kontakt',
      subhead:
        'Slobodno nam postavite pitanje ili rezervirajte svoj boravak. U kalendaru možete provjeriti koji su datumi slobodni. Sve dodatne želje upišite u napomenu.',
      interactiveTab: 'Interaktivni odabir datuma',
      liveSyncTab: 'Izvorni RentalBell kalendar',
      availableLegend: 'Slobodno',
      bookedLegend: 'Zauzeto',
      selectedLegend: 'Odabrani termin',
      clearDates: 'Poništi datume',
      nightsLabel: 'noćenja',
      dateFromLabel: 'Dolazak (Poslije 15:00)',
      dateToLabel: 'Odlazak (Prije 10:00)',
      personsLabel: 'Broj osoba (Maks. 6)',
      personUnit: 'osoba',
      nameLabel: 'Ime i prezime *',
      namePlaceholder: 'npr. Ivan Horvat',
      emailLabel: 'E-mail adresa *',
      emailPlaceholder: 'ivan@primjer.hr',
      phoneLabel: 'Broj telefona (neobavezno)',
      phonePlaceholder: '+385 91 ...',
      commentLabel: 'Napomena ili posebne želje',
      commentPlaceholder: 'Dječji krevetić, degustacija domaćeg maslinovog ulja...',
      gdprPrefix: 'GDPR obavijest: Korištenjem ovog obrasca slažete se s obradom osobnih podataka u svrhu odgovora na upit. Više u',
      gdprLink: 'Politici privatnosti',
      submitBtn: 'Pošalji upit',
      thankYouTitle: 'Hvala na vašem upitu!',
      thankYouDesc: 'Odgovorit ćemo vam u najkraćem mogućem roku. Upit možete poslati i izravno putem WhatsAppa ili e-maila.',
      sendWhatsappNow: 'Pošalji putem WhatsAppa',
      sendEmailNow: 'Otvori u e-mail klijentu',
      newInquiryBtn: 'Novi upit',
      contactCardTitle: 'Izravni kontakt podaci',
      locationLabel: 'Adresa objekta',
      phone1Label: 'Telefon (EN, SI, HR, DE)',
      phone2Label: 'Hrvatski broj (HR)',
      emailContactLabel: 'E-mail adresa',
      errMissingFields: 'Molimo unesite ime, ispravnu e-mail adresu te datume dolaska i odlaska.',
      errGdpr: 'Molimo potvrdite privolu za obradu podataka.',
      errDateOrder: 'Datum odlaska mora biti nakon datuma dolaska.',
      securityTitle: 'Sigurnosna provjera (Nisam robot) *',
      securityPlaceholder: 'Prepišite kod',
      securityVerified: 'Potvrđeno — niste robot',
      securityRefresh: 'Novi sigurnosni kod',
      errCaptcha: 'Molimo unesite točan sigurnosni kod (provjera „Nisam robot”).',
    },
  }[lang];

  const nightsCount = useMemo(() => {
    if (!dateFrom || !dateTo) return 0;
    const d1 = new Date(dateFrom);
    const d2 = new Date(dateTo);
    const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [dateFrom, dateTo]);

  const handleDayClick = (iso: string) => {
    if (isDateUnavailable(iso)) return;
    if (!dateFrom || (dateFrom && dateTo)) {
      setDateFrom(iso);
      setDateTo('');
    } else if (iso > dateFrom) {
      if (hasUnavailableInRange(dateFrom, iso)) {
        setDateFrom(iso);
        setDateTo('');
      } else {
        setDateTo(iso);
      }
    } else {
      setDateFrom(iso);
      setDateTo('');
    }
  };

  const shiftMonth = (delta: number) => {
    setBaseMonth((prev) => {
      const nextDate = new Date(prev.year, prev.month + delta, 1);
      return { year: nextDate.getFullYear(), month: nextDate.getMonth() };
    });
  };

  const monthsToRender = useMemo(() => {
    const m1 = { year: baseMonth.year, month: baseMonth.month };
    const d2 = new Date(baseMonth.year, baseMonth.month + 1, 1);
    const m2 = { year: d2.getFullYear(), month: d2.getMonth() };
    return [m1, m2];
  }, [baseMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Honeypot anti-bot trap
    if (honeypot.trim() !== '') {
      return;
    }

    if (!fullName.trim() || !email.trim() || !email.includes('@') || !dateFrom || !dateTo) {
      setFormError(labels.errMissingFields);
      return;
    }
    if (dateTo <= dateFrom) {
      setFormError(labels.errDateOrder);
      return;
    }
    if (!isHumanVerified) {
      setFormError(labels.errCaptcha);
      refreshSecurityCode();
      return;
    }
    if (!gdprAccepted) {
      setFormError(labels.errGdpr);
      return;
    }

    setSubmitted(true);
  };

  const inquirySummaryText = encodeURIComponent(
    `Pozdravljeni, Leonardo House!\n\nŽelim poslati povpraševanje za bivanje:\n- Prihod: ${dateFrom}\n- Odhod: ${dateTo} (${nightsCount} nočitev)\n- Število oseb: ${persons}\n- Ime: ${fullName}\n- E-naslov: ${email}${phone ? `\n- Telefon: ${phone}` : ''}${comment ? `\n- Opomba: ${comment}` : ''}\n\nHvala in lep pozdrav!`
  );

  return (
    <section id="contact" className="relative overflow-hidden py-20 lg:py-28 border-t border-[#E5DFD3] bg-[#F4F0E8]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(58,79,55,0.06),transparent_52%)]"
      />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#1E251F] leading-[1.15]">
            {labels.heading}
          </h2>
          <div aria-hidden="true" className="w-14 h-0.5 bg-[#3A4F37] rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 7 Columns: Unified Calendar + Direct Contact Info Module */}
          <div className="lg:col-span-7 bg-[#FAF8F4] border border-[#E2DBD0] border-t-2 border-t-[#3A4F37] rounded-2xl p-6 sm:p-8 shadow-[0_12px_34px_rgba(30,37,31,0.06)] flex flex-col">
            {/* Calendar Section */}
            <div>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {monthsToRender.map(({ year, month }) => {
                    const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const cells: (number | null)[] = [
                      ...Array(firstDayOfWeek).fill(null),
                      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
                    ];

                    return (
                      <div key={`${year}-${month}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-serif text-xl font-semibold text-[#1E251F]">
                            {MONTH_NAMES[lang][month]}{' '}
                            <span className="font-mono text-sm font-normal text-[#5C645A] tabular-nums">
                              {year}
                            </span>
                          </h3>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {DAY_NAMES[lang].map((d) => (
                            <span key={d} className="text-[11px] font-medium text-[#6E766B] py-1">
                              {d}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {cells.map((day, idx) => {
                            if (!day) {
                              return <div key={`empty-${idx}`} className="h-9" />;
                            }
                            const iso = formatIsoDate(year, month, day);
                            const booked = isDateUnavailable(iso);
                            const isToday = iso === todayIso;
                            const isStart = iso === dateFrom;
                            const isEnd = iso === dateTo;
                            const isInRange = dateFrom && dateTo && iso > dateFrom && iso < dateTo;

                            return (
                              <button
                                key={iso}
                                type="button"
                                disabled={booked}
                                onClick={() => handleDayClick(iso)}
                                className={`h-9 rounded-md font-mono text-xs tabular-nums transition-colors flex items-center justify-center cursor-pointer ${
                                  booked
                                    ? 'bg-[#DFD3BE] text-[#786D59] line-through cursor-not-allowed'
                                    : isStart || isEnd
                                      ? 'bg-[#3A4F37] text-[#FAF8F4] font-semibold'
                                      : isInRange
                                        ? 'bg-[#DCE3D8] text-[#1E251F]'
                                        : isToday
                                          ? 'ring-1 ring-[#3A4F37] bg-[#EFECE4] text-[#1E251F] font-semibold hover:bg-[#EAE5D9]'
                                          : 'hover:bg-[#EAE5D9] text-[#1E251F]'
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend & Selected Summary */}
                <div className="mt-6 pt-5 border-t border-[#E5DFD3] flex flex-wrap items-center justify-between gap-4 text-xs text-[#5C645A]">
                  <div className="flex flex-wrap items-center gap-5">
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-xs border border-[#CFC7B8] bg-[#FAF8F4] inline-block" />
                      {labels.availableLegend}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-xs bg-[#DFD3BE] inline-block" />
                      {labels.bookedLegend}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-xs bg-[#3A4F37] inline-block" />
                      {labels.selectedLegend}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-auto">
                    {(dateFrom || dateTo) && (
                      <button
                        type="button"
                        onClick={() => {
                          setDateFrom('');
                          setDateTo('');
                        }}
                        className="text-xs font-medium text-[#3A4F37] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {labels.clearDates}
                      </button>
                    )}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => shiftMonth(-1)}
                        aria-label="Prejšnji mesec"
                        className="p-2 rounded-lg border border-[#DCD4C6] text-[#2C352B] hover:bg-[#EFECE4] transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => shiftMonth(1)}
                        aria-label="Naslednji mesec"
                        className="p-2 rounded-lg border border-[#DCD4C6] text-[#2C352B] hover:bg-[#EFECE4] transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Google Map Showing Leonardo House Location */}
            <LeonardoLocationMap lang={lang} />

            {/* Direct Host Contact Section (Bottom of Unified Card) */}
            <div className="mt-6 pt-6 border-t border-[#E5DFD3]">
              <h3 className="font-serif text-2xl font-semibold text-[#1E251F] mb-5">
                {labels.contactCardTitle}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-[#3A4F37] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-[#6B7466]">{labels.locationLabel}</div>
                    <div className="text-sm font-medium text-[#1E251F] mt-0.5">
                      {CONTACT_INFO.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="w-5 h-5 text-[#3A4F37] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-[#6B7466]">{labels.emailContactLabel}</div>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-sm font-medium text-[#1E251F] hover:text-[#3A4F37] transition-colors mt-0.5 block"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#3A4F37] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-[#6B7466]">{labels.phone1Label}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2.5">
                      <a
                        href={`tel:${CONTACT_INFO.phoneMainHref}`}
                        className="text-sm font-mono font-medium text-[#1E251F] hover:text-[#3A4F37] transition-colors tabular-nums"
                      >
                        {CONTACT_INFO.phoneMainDisplay}
                      </a>
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={CONTACT_INFO.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`WhatsApp (${CONTACT_INFO.phoneMainDisplay})`}
                          title="WhatsApp"
                          className="group inline-flex items-center justify-center rounded-md transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A4F37]"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-[22px] h-[22px]"
                            aria-hidden="true"
                          >
                            <rect
                              x="0.5"
                              y="0.5"
                              width="23"
                              height="23"
                              rx="5.5"
                              className="fill-[#EAE4D7] stroke-[#D5CDBE] group-hover:fill-[#3A4F37] group-hover:stroke-[#3A4F37] transition-colors duration-200"
                              strokeWidth="1"
                            />
                            <path
                              fill="none"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                              className="stroke-[#3A4F37] group-hover:stroke-[#FAF8F4] transition-colors duration-200"
                              d="M12 4.8a7.1 7.1 0 0 0-6.15 10.67L4.95 19.05l3.66-.95A7.1 7.1 0 1 0 12 4.8z"
                            />
                            <path
                              className="fill-[#3A4F37] group-hover:fill-[#FAF8F4] transition-colors duration-200"
                              d="M9.6 8.85c-.17-.38-.35-.39-.51-.4h-.44c-.15 0-.4.06-.61.29-.21.23-.8.78-.8 1.9 0 1.13.82 2.22.94 2.37.11.15 1.58 2.53 3.91 3.44 1.94.76 2.33.61 2.75.57.42-.04 1.36-.55 1.55-1.09.19-.54.19-1 .13-1.09-.06-.09-.21-.15-.44-.27-.23-.11-1.36-.67-1.57-.75-.21-.07-.36-.11-.52.12-.15.23-.59.75-.73.9-.13.15-.27.17-.5.06-.23-.11-.97-.36-1.85-1.14-.68-.61-1.15-1.36-1.28-1.59-.13-.23-.01-.36.1-.47.1-.11.23-.27.35-.4.11-.14.15-.23.23-.39.07-.15.04-.29-.02-.4-.06-.12-.5-1.24-.7-1.66z"
                            />
                          </svg>
                        </a>
                        <a
                          href={CONTACT_INFO.viberUrl}
                          aria-label={`Viber (${CONTACT_INFO.phoneMainDisplay})`}
                          title="Viber"
                          className="group inline-flex items-center justify-center rounded-md transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A4F37]"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-[22px] h-[22px]"
                            aria-hidden="true"
                          >
                            <rect
                              x="0.5"
                              y="0.5"
                              width="23"
                              height="23"
                              rx="5.5"
                              className="fill-[#EAE4D7] stroke-[#D5CDBE] group-hover:fill-[#3A4F37] group-hover:stroke-[#3A4F37] transition-colors duration-200"
                              strokeWidth="1"
                            />
                            <path
                              className="fill-[#3A4F37] group-hover:fill-[#FAF8F4] transition-colors duration-200"
                              d="M8.6 6.4c-.3-.35-.72-.42-1.1-.22-.85.44-1.45 1.24-1.52 2.18-.12 1.65.62 3.74 2.38 5.9 1.76 2.16 3.82 3.32 5.74 3.5.94.09 1.84-.36 2.42-1.1.28-.36.28-.8-.02-1.14l-1.58-1.4c-.34-.3-.82-.32-1.18-.05l-.66.5c-.22.17-.52.18-.76.03a7.9 7.9 0 0 1-2.55-2.52c-.15-.24-.14-.55.03-.77l.5-.66c.27-.36.25-.84-.05-1.18L8.6 6.4z"
                            />
                            <path
                              fill="none"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              className="stroke-[#3A4F37] group-hover:stroke-[#FAF8F4] transition-colors duration-200"
                              d="M13.5 8.5a2.6 2.6 0 0 1 2.2 2.2M13.6 5.9a5.2 5.2 0 0 1 4.6 4.6"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-[#3A4F37] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-[#6B7466]">{labels.phone2Label}</div>
                    <a
                      href={`tel:${CONTACT_INFO.phoneCroHref}`}
                      className="text-sm font-mono font-medium text-[#1E251F] hover:text-[#3A4F37] transition-colors mt-0.5 block tabular-nums"
                    >
                      {CONTACT_INFO.phoneCroDisplay}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Inquiry Form */}
          <div className="lg:col-span-5 bg-[#FAF8F4] border border-[#E2DBD0] border-t-2 border-t-[#3A4F37] rounded-2xl p-6 sm:p-8 shadow-[0_12px_34px_rgba(30,37,31,0.06)]">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD3]">
                  <div className="flex items-center gap-3.5">
                    <AmenityAnimatedIcon groupId="booking" />
                    <h3 className="font-serif text-2xl font-semibold text-[#1E251F]">
                      Leonardo House
                    </h3>
                  </div>
                  {nightsCount > 0 && (
                    <span className="font-mono text-xs text-[#3A4F37] font-medium tabular-nums">
                      {nightsCount} {labels.nightsLabel}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date-from" className="block text-xs font-medium text-[#3D463B] mb-1.5">
                      {labels.dateFromLabel}
                    </label>
                    <input
                      id="date-from"
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CDBE] bg-white font-mono text-xs text-[#1E251F] tabular-nums focus:outline-none focus:border-[#3A4F37]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="date-to" className="block text-xs font-medium text-[#3D463B] mb-1.5">
                      {labels.dateToLabel}
                    </label>
                    <input
                      id="date-to"
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CDBE] bg-white font-mono text-xs text-[#1E251F] tabular-nums focus:outline-none focus:border-[#3A4F37]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#3D463B] mb-1.5">
                    {labels.personsLabel}
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {['1', '2', '3', '4', '5', '6'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPersons(num)}
                        className={`py-2 rounded-lg font-mono text-xs font-medium tabular-nums border transition-colors ${
                          persons === num
                            ? 'bg-[#3A4F37] text-[#FAF8F4] border-[#3A4F37]'
                            : 'bg-white text-[#2C352B] border-[#D5CDBE] hover:bg-[#EFECE4]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="guest-name" className="block text-xs font-medium text-[#3D463B] mb-1.5">
                    {labels.nameLabel}
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={labels.namePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CDBE] bg-white text-sm text-[#1E251F] placeholder:text-[#9AA097] focus:outline-none focus:border-[#3A4F37]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="guest-email" className="block text-xs font-medium text-[#3D463B] mb-1.5">
                      {labels.emailLabel}
                    </label>
                    <input
                      id="guest-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={labels.emailPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CDBE] bg-white text-sm text-[#1E251F] placeholder:text-[#9AA097] focus:outline-none focus:border-[#3A4F37]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="guest-phone" className="block text-xs font-medium text-[#3D463B] mb-1.5">
                      {labels.phoneLabel}
                    </label>
                    <input
                      id="guest-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={labels.phonePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CDBE] bg-white text-sm font-mono text-[#1E251F] placeholder:text-[#9AA097] tabular-nums focus:outline-none focus:border-[#3A4F37]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="guest-comment" className="block text-xs font-medium text-[#3D463B] mb-1.5">
                    {labels.commentLabel}
                  </label>
                  <textarea
                    id="guest-comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={labels.commentPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5CDBE] bg-white text-sm text-[#1E251F] placeholder:text-[#9AA097] focus:outline-none focus:border-[#3A4F37]"
                  />
                </div>

                {/* Hidden Honeypot Field for Bot Protection */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website-url">Website</label>
                  <input
                    id="website-url"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Anti-Bot Security Code Verification ("Nisem robot") */}
                <div className="p-3.5 rounded-xl bg-[#F4F0E8] border border-[#DFD7C8] space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="security-code-input"
                      className="flex items-center gap-1.5 text-xs font-medium text-[#2E382F]"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#3A4F37] shrink-0" />
                      <span>{labels.securityTitle}</span>
                    </label>
                    {isHumanVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2F5229]">
                        <Check className="w-3.5 h-3.5" />
                        {labels.securityVerified}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Stylized SVG Security Code Badge */}
                    <div
                      aria-label="Varnostna šifra"
                      className="relative flex items-center justify-center px-3 py-2 rounded-lg bg-[#EAE4D7] border border-[#CFC6B4] select-none shrink-0 overflow-hidden"
                    >
                      <svg
                        width="108"
                        height="28"
                        viewBox="0 0 108 28"
                        className="overflow-visible"
                        aria-hidden="true"
                      >
                        {/* Subtle security wave lines */}
                        <path
                          d="M2 8 Q 28 2, 54 10 T 106 6"
                          fill="none"
                          stroke="#8A967E"
                          strokeWidth="1"
                          opacity="0.55"
                        />
                        <path
                          d="M2 21 Q 32 26, 58 16 T 106 22"
                          fill="none"
                          stroke="#7C6F56"
                          strokeWidth="1"
                          opacity="0.45"
                        />
                        {securityCode.split('').map((char, idx) => {
                          const x = 14 + idx * 19;
                          const y = idx % 2 === 0 ? 19 : 21;
                          const rotate = idx % 2 === 0 ? -7 + idx * 2 : 6 - idx * 2;
                          return (
                            <text
                              key={`${idx}-${char}`}
                              x={x}
                              y={y}
                              transform={`rotate(${rotate} ${x} ${y - 5})`}
                              fill="#1E251F"
                              fontFamily="monospace"
                              fontSize="16"
                              fontWeight="700"
                              letterSpacing="2"
                            >
                              {char}
                            </text>
                          );
                        })}
                      </svg>
                    </div>

                    <button
                      type="button"
                      onClick={refreshSecurityCode}
                      aria-label={labels.securityRefresh}
                      title={labels.securityRefresh}
                      className="p-2 rounded-lg border border-[#D5CDBE] bg-white text-[#3D463B] hover:bg-[#EFECE4] transition-colors cursor-pointer shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    <input
                      id="security-code-input"
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      maxLength={6}
                      value={securityInput}
                      onChange={(e) => setSecurityInput(e.target.value.toUpperCase())}
                      placeholder={labels.securityPlaceholder}
                      className={`w-full px-3 py-2 rounded-lg border bg-white font-mono text-xs uppercase tracking-widest text-[#1E251F] placeholder:text-[#9AA097] placeholder:tracking-normal placeholder:normal-case focus:outline-none transition-colors ${
                        isHumanVerified
                          ? 'border-[#3A4F37] bg-[#F3F7F1]'
                          : 'border-[#D5CDBE] focus:border-[#3A4F37]'
                      }`}
                      required
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2.5 text-xs text-[#5C645A] leading-relaxed cursor-pointer">
                  <input
                    type="checkbox"
                    checked={gdprAccepted}
                    onChange={(e) => setGdprAccepted(e.target.checked)}
                    className="mt-1 accent-[#3A4F37] rounded-xs"
                  />
                  <span>
                    {labels.gdprPrefix}{' '}
                    <button
                      type="button"
                      onClick={() => onOpenLegalModal('privacy')}
                      className="underline text-[#2C352B] hover:text-[#3A4F37] font-medium"
                    >
                      {labels.gdprLink}
                    </button>
                    .
                  </span>
                </label>

                {formError && (
                  <div className="p-3 rounded-lg bg-[#FDF2F0] border border-[#E6B8B0] text-xs text-[#8C2D19]">
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-lg bg-[#3A4F37] hover:bg-[#2E402B] text-[#FAF8F4] text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {labels.submitBtn}
                </button>
              </form>
            ) : (
              <div className="py-6 space-y-6">
                <div className="w-11 h-11 rounded-full bg-[#DCE5D8] text-[#2F422B] flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-[#1E251F]">
                    {labels.thankYouTitle}
                  </h3>
                  <p className="mt-2 text-sm text-[#4A5348] leading-relaxed">
                    {labels.thankYouDesc}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F4F0E8] border border-[#E2DBD0] text-xs space-y-1.5 font-mono text-[#2C352B] tabular-nums">
                  <div>{labels.dateFromLabel}: {dateFrom}</div>
                  <div>{labels.dateToLabel}: {dateTo} ({nightsCount} {labels.nightsLabel})</div>
                  <div>{labels.personsLabel}: {persons}</div>
                  <div>{fullName} · {email}</div>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={`https://wa.me/38631751297?text=${inquirySummaryText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#3A4F37] hover:bg-[#2E402B] text-[#FAF8F4] text-xs font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {labels.sendWhatsappNow}
                  </a>
                  <a
                    href={`mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(`Povpraševanje Leonardo House (${dateFrom} – ${dateTo})`)}&body=${inquirySummaryText}`}
                    className="w-full py-2.5 px-4 rounded-lg border border-[#CFC7B8] hover:bg-[#EFECE4] text-[#1E251F] text-xs font-medium flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Mail className="w-4 h-4" />
                    {labels.sendEmailNow}
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    refreshSecurityCode();
                  }}
                  className="text-xs font-medium text-[#5C645A] hover:text-[#1E251F] underline"
                >
                  {labels.newInquiryBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
