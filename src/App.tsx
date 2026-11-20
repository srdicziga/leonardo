import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Maximize2,
  Phone,
  Mail,
  Check,
  Sun,
  Trees,
  ArrowUp,
  CalendarCheck,
  KeyRound,
  BedDouble,
  Bath,
  Waves,
} from 'lucide-react';
import {
  AMENITY_GROUPS,
  CONTACT_INFO,
  GALLERY_ITEMS,
  GalleryItem,
  GUEST_REVIEWS,
  HOUSE_RULES,
  Language,
} from './data/villaData';
import { ResilientImage } from './components/ResilientImage';
import { AvailabilityBookingSection } from './components/AvailabilityBookingSection';
import { LegalModals } from './components/LegalModals';
import { OliveBranchScrollBg } from './components/OliveBranchScrollBg';
import { AmenityAnimatedIcon } from './components/AmenityAnimatedIcon';
import { FeatureAnimatedIcon } from './components/FeatureAnimatedIcon';
import { CardHoverOliveBorder } from './components/CardHoverOliveBorder';

const HERO_SLIDES = [
  {
    src: '/images/villa/Leonardo_house.jpeg',
    caption: {
      sl: 'Zasebno posestvo Leonardo House z ogrevanim bazenom v Bužiniji pri Novigradu',
      en: 'Private Leonardo House estate with heated pool in Bužinija near Novigrad',
      de: 'Privates Anwesen Leonardo House mit beheiztem Pool in Bužinija bei Novigrad',
      hr: 'Privatno imanje Leonardo House s grijanim bazenom u Bužiniji kraj Novigrada',
    },
  },
  {
    src: '/images/villa/pool_wide_view.jpg',
    caption: {
      sl: 'Ogrevan zunanji bazen s sončno ploščadjo, ležalniki in zunanjo prho',
      en: 'Heated outdoor swimming pool with sun loungers and outdoor shower',
      de: 'Beheizter Außenpool mit Sonnenliegen und erfrischender Außendusche',
      hr: 'Grijani vanjski bazen s ležaljkama i vanjskim tušem',
    },
  },
  {
    src: '/images/villa/pool_evening.jpg',
    caption: {
      sl: 'Mirni istrski večeri ob osvetljenem bazenu in pokriti terasi',
      en: 'Tranquil Istrian evenings beside the illuminated pool and covered terrace',
      de: 'Ruhige istrische Abende am beleuchteten Pool und der überdachten Terrasse',
      hr: 'Mirne istarske večeri uz osvijetljeni bazen i natkrivenu terasu',
    },
  },
];

const UI_COPY = {
  sl: {
    navEstate: 'O posestvu',
    navServices: 'Storitve',
    navGallery: 'Galerija',
    navContact: 'Kontakt',
    ctaBook: 'Rezerviraj termin',
    heroKicker: 'Paolija 16a, Bužinija · Novigrad, Istra · Zasebno posestvo',
    heroTitle: 'Dobrodošli v raju med oljkami v srcu Novigrada',
    heroSubtitle: 'Doživite razkošje in mir v naši izvrstni hiši v Novigradu.',
    heroBody:
      'Zavita v zasebnem raju, naša čudovita posest z dvema ločenima hiškama ponuja popolno kombinacijo udobja in sproščujočega mediteranskega sloga za nepozabne počitnice. Zasidrana v mirnem naselju Bužinija pri Novigradu omogoča hiter dostop do Jadranskega morja, Istralandije in slikovitega Motovuna, hkrati pa zagotavlja osamljeno zatočišče med oljkami in figami.',
    heroPrimaryCta: 'Preveri proste termine',
    heroSecondaryCta: 'Razišči galerijo',
    metrics: [
      { value: '1.000 m²', label: 'Velikost ograjene parcele' },
      { value: '78 m²', label: 'Bivalna površina hiš' },
      { value: '2 hiški', label: 'Ločeni enoti za zasebnost' },
      { value: '3 spalnice', label: 'Za največ 6 gostov' },
      { value: '2 kopalnici', label: 'Sodobni kopalnici + zunanji tuš' },
      { value: '2,5 km', label: 'Do središča Novigrada in morja' },
    ],
    storyHeading: 'Posestvo & Dve ločeni hiški',
    storyLead:
      'Vila obsega dve ločeni hiški na popolnoma ograjeni 1.000 m² veliki parceli, kar zagotavlja popolno zasebnost in udobje za družine, pare ali skupine do 6 oseb.',
    houseTabs: {
      house1: 'Velika hiša',
      house2: 'Manjša hiška',
      estate: 'Bazen, Terasa & Oljčnik',
    },
    featuresList: [
      {
        num: '01.',
        title: 'Ogrevani zunanji bazen in zunanja prha',
        desc: 'Potopite se v popolno sprostitev z našim solarno ogrevanim zunanjim bazenom. Lenarite na udobnih ležalnikih pod senčnikoma ali se osvežite pod soncem s prijetno zunanjo prho tik ob bazenu.',
        img: '/images/villa/pool_sunnyday.jpg',
        meta: 'Sezonsko ogrevan bazen · Ležalniki in senčnika · Zunanja prha',
      },
      {
        num: '02.',
        title: 'Dve ločeni hiški za popolno zasebnost',
        desc: 'Prva, večja hiška ponuja dve udobni spalnici, popolnoma opremljeno kuhinjo s kavnim aparatom in pomivalnim strojem, sodobno kopalnico z brezplačnim pralnim strojem ter svetel dnevni prostor. Druga, manjša hiška vključuje lastno spalnico, mali hladilnik, mikrovalovno pečico, TV in lastno kopalnico.',
        img: '/images/villa/house_outside.jpg',
        meta: '3 spalnice · 2 kopalnici · Klimatizirano · Brezplačen Wi-Fi',
      },
      {
        num: '03.',
        title: 'Pokrita terasa in zunanji kamin na drva',
        desc: 'Sprostite svojega notranega kuharja z zunanjim kaminom na drva za žar, idealnim za pristne mediteranske obroke na prostem. Zberite se okoli velike mize pod pokrito teraso ali uživajte v jutranji kavi ob manjši mizici s počivalniki.',
        img: '/images/villa/outside_table.jpg',
        meta: 'Pokrita letna jedilnica · Kamin na drva · Jutranji kotiček za kavo',
      },
      {
        num: '04.',
        title: 'Lasten oljčni nasad in degustacija olja',
        desc: 'Odkrijte čarovnijo lastnega oljčnega nasada in nasada fig, kjer vsako leto ročno obiramo oljke in ustvarjamo izvrstno domače oljčno olje. Gostom z veseljem omogočimo degustacijo našega domačega olja.',
        img: '/images/villa/olive_trees.jpg',
        meta: 'Domače oljčno olje · Nasad oljk in fig · Avtentična Istra',
      },
      {
        num: '05.',
        title: 'Udobje za družine in otroški kotiček',
        desc: 'Razveselite otroke z velikim trampolinom in posebnim igralnim prostorom z otroško mizico in stoli na ograjeni zelenici. Na voljo so tudi otroška posteljica, potovalna posteljica Pack ’n Play in stol za hranjenje.',
        img: '/images/villa/kids_trampoline.jpg',
        meta: 'Velik trampolin · Otroška mizica · Ograjeno varno dvorišče',
      },
      {
        num: '06.',
        title: 'Pokrito parkirišče in izhodišče za raziskovanje Istre',
        desc: 'Znotraj ograjenega posestva je na voljo brezplačno pokrito parkirišče v senci. V le nekaj minutah vožnje dosežete ribiško pristaniče v Novigradu, plaže z nepozabnimi sončnimi zahodi, vodni park Istralandia in srednjeveški Motovun.',
        img: '/images/villa/car_parking_shade.jpg',
        meta: 'Pokrito parkirišče · 2,5 km Novigrad · Bližina Istralandije in Motovuna',
      },
    ],
    featuresTitle: 'Zakaj izbrati Leonardo House',
    featuresSubhead:
      'Odkrijte utrinke našega istrskega posestva – od sončnih dni ob ogrevanem bazenu in dveh zasebnih hišk med oljkami do večerov pod pokrito teraso.',
    featuresHint: 'Izberite prednost za podroben pregled in fotografijo',
    servicesHeading: 'Storitve, Oprema & Lokacija',
    amenitiesTitle: 'Oprema in ugodnosti posestva',
    locationTitle: 'Lokacija in oddaljenosti',
    servicesHostBoxTitle: 'Osebni sprejem gostiteljev ob prihodu',
    servicesHostBoxText:
      'Naše goste bomo prisrčno sprejeli, predali ključe, razkazali objekt in jih prepustili, da uživajo v svojih nepozabnih trenutkih. Prav tako bomo gostom pustili kontakt, tako da nas bodo lahko kadarkoli kontaktirali za kakršnekoli informacije.',
    servicesHostHighlights: 'Pozdravi vas gostitelj · Dovoljena so dolgotrajna bivanja · Celotna nastanitev je 100 % zasebna',
    houseRulesTitle: 'Hišna pravila med bivanjem',
    houseRulesSubhead:
      'Pregled ključnih pravil in priporočil za prijetno, mirno ter brezskrbno bivanje v obeh hiškah in na posestvu.',
    galleryHeading: 'Galerija',
    gallerySubhead:
      'Preglejte izvirne fotografije obeh hišk, ogrevanega bazena, pokrite terase z žarom, oljčnega nasada in otroškega igrišča. Kliknite na fotografijo za celozaslonski ogled.',
    galleryCategories: {
      pool: 'Bazen',
      house1: 'Hiška 1',
      house2: 'Hiška 2',
      courtyard: 'Dvorišče',
      kids: 'Za otroke',
    },
    reviewsHeading: 'Mnenja gostov',
    reviewsSubhead:
      'Resnični vtisi družin in parov iz Slovenije, Velike Britanije, ZDA, Hrvaške in od drugod, ki so preživeli svoj dopust v Leonardo House.',
    footerTagline:
      'Zasebna mediteranska vila z dvema ločenima hiškama, ogrevanim bazenom in lastnim oljčnim nasadom v Bužiniji pri Novigradu.',
    footerNavTitle: 'Navigacija',
    footerLegalTitle: 'Pravne informacije',
    privacyPolicyBtn: 'Politika zasebnosti',
    cookiePolicyBtn: 'Spletni piškotki',
    backToTop: 'Na vrh strani',
  },
  en: {
    navEstate: 'The Estate',
    navServices: 'Services',
    navGallery: 'Gallery',
    navContact: 'Contact',
    ctaBook: 'Book Your Stay',
    heroKicker: 'Paolija 16a, Bužinija · Novigrad, Istria · Private Villa Estate',
    heroTitle: 'Welcome to paradise among the olive trees in Novigrad',
    heroSubtitle: 'Experience luxury and tranquility in our exquisite house in Croatia.',
    heroBody:
      'Nestled in a private paradise, our villa comprises two separate houses offering the ideal blend of comfort and Mediterranean serenity. Anchored in the heart of Novigrad (Bužinija), it provides easy access to the Adriatic coast, Istralandia, and hilltop Motovun while offering a secluded sanctuary surrounded by olive and fig trees.',
    heroPrimaryCta: 'Check Availability & Book',
    heroSecondaryCta: 'Explore Gallery (32 Photos)',
    metrics: [
      { value: '1,000 m²', label: 'Fenced Private Lot' },
      { value: '78 m²', label: 'Interior Living Space' },
      { value: '2 Houses', label: 'Separate Units for Privacy' },
      { value: '3 Bedrooms', label: 'Accommodates up to 6 Guests' },
      { value: '2 Bathrooms', label: 'Full Baths + Outdoor Shower' },
      { value: '2.5 km', label: 'To Novigrad Center & Sea' },
    ],
    storyHeading: 'The Estate & Two Separate Houses',
    storyLead:
      'The villa comprises two distinct houses on a 1,000 m² gated plot, ensuring privacy and convenience for families, multi-generational stays, or friends traveling together.',
    houseTabs: {
      house1: 'Bigger House',
      house2: 'Smaller House',
      estate: 'Heated Pool, Terrace & Olive Grove',
    },
    featuresList: [
      {
        num: '01.',
        title: 'Heated Swimming Pool & Outdoor Shower',
        desc: 'Dive into pure relaxation with our solar-heated outdoor swimming pool. Lounge by the poolside on comfortable beds under sun umbrellas or take a refreshing outdoor shower under the Istrian sun.',
        img: '/images/villa/pool_sunnyday.jpg',
        meta: 'Heated Outdoor Pool · Sun Loungers & Umbrellas · Poolside Shower',
      },
      {
        num: '02.',
        title: 'Two Separate Houses for Complete Privacy',
        desc: 'The first house boasts two cozy bedrooms, a fully equipped kitchen with a coffee maker and dishwasher, a modern bathroom with a washing machine, and a stylish living room. The second house features its own bedroom, mini fridge, microwave, TV, and private bathroom.',
        img: '/images/villa/house_outside.jpg',
        meta: '3 Bedrooms · 2 Bathrooms · Air Conditioning · Free Wi-Fi',
      },
      {
        num: '03.',
        title: 'Outdoor Delights & Wood-Burning BBQ Terrace',
        desc: 'Unleash your inner chef with our traditional wood-burning BBQ fireplace. Gather around the large shaded table on the covered terrace for shared meals, or enjoy morning coffee at the smaller lounge table.',
        img: '/images/villa/outside_table.jpg',
        meta: 'Covered Dining Terrace · Wood-Burning Fireplace · Morning Coffee Spot',
      },
      {
        num: '04.',
        title: 'Estate Olive Grove & Homemade Olive Oil Tasting',
        desc: 'Discover the charm of our villa’s own olive grove and fig trees, where we harvest olives annually to create exquisite homemade olive oil. Guests are warmly invited to taste our estate olive oil.',
        img: '/images/villa/olive_trees.jpg',
        meta: 'Annual Olive Harvest · Homemade Olive Oil Tasting · Authentic Istria',
      },
      {
        num: '05.',
        title: 'Family-Friendly Amenities & Children’s Play Area',
        desc: 'Keep the kids entertained with a garden trampoline and a dedicated play area complete with a children’s table and chairs. A baby crib, Pack ’n Play travel crib, and high chair are also available.',
        img: '/images/villa/kids_trampoline.jpg',
        meta: 'Garden Trampoline · Kids’ Table & Chairs · Fenced Lawn',
      },
      {
        num: '06.',
        title: 'Covered Parking & Prime Novigrad Location',
        desc: 'Complimentary covered parking is provided inside the gated property. You are just 2.5 km from Novigrad’s charming fishing harbour and beaches, and minutes from Aquapark Istralandia and medieval Motovun.',
        img: '/images/villa/car_parking_shade.jpg',
        meta: 'Free Covered Parking · 2.5 km to Novigrad · Near Istralandia & Motovun',
      },
    ],
    featuresTitle: 'Why Choose Leonardo House',
    featuresSubhead:
      'Explore authentic glimpses of our Istrian estate—from sunlit afternoons by the heated pool and two private houses among olive trees to warm evenings on the covered terrace.',
    featuresHint: 'Select a highlight to explore photos and details',
    servicesHeading: 'Services, Amenities & Location',
    amenitiesTitle: 'Estate Amenities & Comforts',
    locationTitle: 'Location & Nearby Distances',
    servicesHostBoxTitle: 'Warm Personal Welcome by Your Hosts',
    servicesHostBoxText:
      'We will warmly welcome our guests, hand over the keys, show them around the property, and let them enjoy their unforgettable moments. Additionally, we provide guests with direct contact information so they can reach out to us at any time.',
    servicesHostHighlights: 'Host greets you in person · Long-term stays allowed · 100% Private property',
    houseRulesTitle: 'House Rules During Your Stay',
    houseRulesSubhead:
      'Essential guidelines for a peaceful, comfortable, and carefree stay across both houses and the estate.',
    galleryHeading: 'Gallery',
    gallerySubhead:
      'Browse authentic photography of the bigger house, smaller house, heated pool, covered terrace, olive grove, and children’s play area. Click any image for fullscreen view.',
    galleryCategories: {
      pool: 'Pool',
      house1: 'Bigger House',
      house2: 'Smaller House',
      courtyard: 'Courtyard',
      kids: 'Kids',
    },
    reviewsHeading: 'What Our Guests Say',
    reviewsSubhead:
      'Read authentic experiences from families and travelers who stayed with Vlado and his wife at Leonardo House.',
    footerTagline:
      'A private Mediterranean sanctuary with two separate houses, a heated swimming pool, and an estate olive grove in Bužinija, Novigrad.',
    footerNavTitle: 'Navigation',
    footerLegalTitle: 'Legal Information',
    privacyPolicyBtn: 'Privacy Policy',
    cookiePolicyBtn: 'Cookie Policy',
    backToTop: 'Back to top',
  },
  de: {
    navEstate: 'Das Anwesen',
    navServices: 'Ausstattung',
    navGallery: 'Galerie',
    navContact: 'Kontakt',
    ctaBook: 'Jetzt anfragen',
    heroKicker: 'Paolija 16a, Bužinija · Novigrad, Istrien · Privates Villenanwesen',
    heroTitle: 'Willkommen im Paradies zwischen den Olivenbäumen',
    heroSubtitle: 'Erleben Sie Ruhe und mediterranen Komfort in unserem Haus in Novigrad.',
    heroBody:
      'Eingebettet in ein privates Paradies bietet unser Anwesen mit zwei separaten Häusern die ideale Kombination aus Komfort und Entspannung. Im Herzen von Novigrad (Bužinija) gelegen, erreichen Sie schnell die Adriaküste, Istralandia und Motovun und genießen zugleich absolute Ruhe im eigenen Olivenhain.',
    heroPrimaryCta: 'Verfügbarkeit prüfen',
    heroSecondaryCta: 'Galerie ansehen (32 Fotos)',
    metrics: [
      { value: '1.000 m²', label: 'Eingezäuntes Grundstück' },
      { value: '78 m²', label: 'Wohnfläche der Häuser' },
      { value: '2 Häuser', label: 'Separate Einheiten' },
      { value: '3 Schlafzimmer', label: 'Für bis zu 6 Gäste' },
      { value: '2 Badezimmer', label: 'Plus Außendusche am Pool' },
      { value: '2,5 km', label: 'Bis Novigrad Zentrum & Meer' },
    ],
    storyHeading: 'Das Anwesen & Zwei separate Häuser',
    storyLead:
      'Die Villa besteht aus zwei separaten Häusern auf einem 1.000 m² großen eingezäunten Grundstück – ideal für Familien oder befreundete Paare.',
    houseTabs: {
      house1: 'Großes Haus',
      house2: 'Kleineres Haus',
      estate: 'Pool, Terrasse & Olivenhain',
    },
    featuresList: [
      {
        num: '01.',
        title: 'Beheizter Außenpool & Außendusche',
        desc: 'Entspannen Sie an unserem solarbeheizten Außenpool mit Sonnenliegen und Sonnenschirmen oder erfrischen Sie sich unter der Außendusche direkt neben dem Pool.',
        img: '/images/villa/pool_sunnyday.jpg',
        meta: 'Beheizter Pool · Sonnenliegen & Schirme · Außendusche',
      },
      {
        num: '02.',
        title: 'Zwei separate Häuser für volle Privatsphäre',
        desc: 'Das größere Haus verfügt über zwei Schlafzimmer, eine voll ausgestattete Küche mit Kaffeemaschine und Geschirrspüler, ein modernes Bad mit Waschmaschine und ein Wohnzimmer. Das kleinere Haus bietet ein Schlafzimmer, Minikühlschrank, Mikrowelle, TV und ein eigenes Bad.',
        img: '/images/villa/house_outside.jpg',
        meta: '3 Schlafzimmer · 2 Bäder · Klimaanlage · Kostenloses WLAN',
      },
      {
        num: '03.',
        title: 'Überdachte Terrasse & Außenkamin mit Holzgrill',
        desc: 'Genießen Sie gemeinsame Mahlzeiten am großen Tisch auf der überdachten Terrasse mit traditionellem Holzgrill oder Ihren Morgenkaffee in der gemütlichen Lounge-Ecke.',
        img: '/images/villa/outside_table.jpg',
        meta: 'Überdachte Terrasse · Holzgrill · Kaffeeecke',
      },
      {
        num: '04.',
        title: 'Eigener Olivenhain & Olivenöl-Verkostung',
        desc: 'Auf dem Grundstück befindet sich unser eigener Olivenhain. Gerne bieten wir unseren Gästen eine Verkostung unseres hausgemachten Olivenöls an.',
        img: '/images/villa/olive_trees.jpg',
        meta: 'Hausgemachtes Olivenöl · Oliven- & Feigenbäume',
      },
      {
        num: '05.',
        title: 'Familienfreundliche Ausstattung & Spielbereich',
        desc: 'Für Kinder stehen ein großes Trampolin sowie ein kleiner Tisch mit Stühlen bereit. Babybett, Reisebett und Hochstuhl sind ebenfalls verfügbar.',
        img: '/images/villa/kids_trampoline.jpg',
        meta: 'Trampolin · Kindertisch · Eingezäunter Garten',
      },
      {
        num: '06.',
        title: 'Überdachter Parkplatz & Nähe zu Novigrad',
        desc: 'Ein kostenloser überdachter Parkplatz befindet sich direkt auf dem Grundstück. In wenigen Minuten erreichen Sie den Fischerhafen von Novigrad, Strände, Istralandia und Motovun.',
        img: '/images/villa/car_parking_shade.jpg',
        meta: 'Überdachter Parkplatz · 2,5 km nach Novigrad',
      },
    ],
    featuresTitle: 'Warum Leonardo House wählen',
    featuresSubhead:
      'Entdecken Sie authentische Eindrücke unseres istrischen Anwesens – vom beheizten Pool und zwei privaten Häusern unter Olivenbäumen bis hin zu Abenden auf der überdachten Terrasse.',
    featuresHint: 'Wählen Sie ein Highlight für Fotos und Details',
    servicesHeading: 'Ausstattung, Service & Lage',
    amenitiesTitle: 'Ausstattung & Komfort',
    locationTitle: 'Lage & Entfernungen',
    servicesHostBoxTitle: 'Herzlicher Empfang durch Ihre Gastgeber',
    servicesHostBoxText:
      'Wir empfangen unsere Gäste persönlich, übergeben die Schlüssel, zeigen das gesamte Anwesen und stehen während des Aufenthalts jederzeit gerne für Fragen zur Verfügung.',
    servicesHostHighlights: 'Persönlicher Empfang · Langzeitaufenthalte erlaubt · 100 % Privatgrundstück',
    houseRulesTitle: 'Hausregeln während des Aufenthalts',
    houseRulesSubhead:
      'Wichtige Hinweise für einen ruhigen, angenehmen und unbeschwerten Aufenthalt auf dem gesamten Anwesen.',
    galleryHeading: 'Galerie',
    gallerySubhead:
      'Entdecken Sie alle Originalfotos von Haus 1, Haus 2, dem beheizten Pool, der Terrasse und dem Olivenhain.',
    galleryCategories: {
      pool: 'Pool',
      house1: 'Haus 1',
      house2: 'Haus 2',
      courtyard: 'Garten',
      kids: 'Für Kinder',
    },
    reviewsHeading: 'Gästestimmen',
    reviewsSubhead:
      'Authentische Erfahrungsberichte von Familien und Paaren, die ihren Urlaub im Leonardo House verbracht haben.',
    footerTagline:
      'Privates mediterranes Ferienanwesen mit zwei Häusern, beheiztem Pool und eigenem Olivenhain in Bužinija bei Novigrad.',
    footerNavTitle: 'Navigation',
    footerLegalTitle: 'Rechtliches',
    privacyPolicyBtn: 'Datenschutzerklärung',
    cookiePolicyBtn: 'Cookie-Richtlinie',
    backToTop: 'Nach oben',
  },
  hr: {
    navEstate: 'O imanju',
    navServices: 'Usluge',
    navGallery: 'Galerija',
    navContact: 'Kontakt',
    ctaBook: 'Rezerviraj termin',
    heroKicker: 'Paolija 16a, Bužinija · Novigrad, Istra · Privatno imanje',
    heroTitle: 'Dobrodošli u raj među maslinama u srcu Novigrada',
    heroSubtitle: 'Doživite luksuz i mir u našoj prekrasnoj kući u Novigradu.',
    heroBody:
      'Smještena u privatnom raju, naša vila s dvije odvojene kućice pruža savršen spoj udobnosti i opuštajućeg mediteranskog stila. U mirnom naselju Bužinija kraj Novigrada nudi brz pristup Jadranskom moru, Istralandiji i Motovunu, uz potpuni mir među maslinama i smokvama.',
    heroPrimaryCta: 'Provjeri slobodne termine',
    heroSecondaryCta: 'Pregledaj galeriju (32 fotografije)',
    metrics: [
      { value: '1.000 m²', label: 'Ograđena privatna parcela' },
      { value: '78 m²', label: 'Stambena površina kuća' },
      { value: '2 kućice', label: 'Odvojene jedinice za privatnost' },
      { value: '3 spavaće sobe', label: 'Za najviše 6 gostiju' },
      { value: '2 kupaonice', label: 'Plus vanjski tuš uz bazen' },
      { value: '2,5 km', label: 'Do centra Novigrada i mora' },
    ],
    storyHeading: 'Imanje i dvije odvojene kućice',
    storyLead:
      'Vila se sastoji od dvije odvojene kućice na potpuno ograđenoj parceli od 1.000 m², što jamči privatnost i udobnost za obitelji ili grupe do 6 osoba.',
    houseTabs: {
      house1: 'Velika kuća',
      house2: 'Manja kućica',
      estate: 'Bazen, Terasa i Maslinik',
    },
    featuresList: [
      {
        num: '01.',
        title: 'Grijani vanjski bazen i vanjski tuš',
        desc: 'Zaronite u potpunu relaksaciju uz naš grijani vanjski bazen. Opustite se na udobnim ležaljkama pod suncobranima ili se osvježite pod vanjskim tušem uz bazen.',
        img: '/images/villa/pool_sunnyday.jpg',
        meta: 'Grijani bazen · Ležaljke i suncobrani · Vanjski tuš',
      },
      {
        num: '02.',
        title: 'Dvije odvojene kućice za potpunu privatnost',
        desc: 'Veća kućica nudi dvije spavaće sobe, potpuno opremljenu kuhinju s aparatom za kavu i perilicom posuđa, modernu kupaonicu s perilicom rublja te dnevni boravak. Manja kućica ima vlastitu spavaću sobu, mali hladnjak, mikrovalnu pećnicu, TV i kupaonicu.',
        img: '/images/villa/house_outside.jpg',
        meta: '3 spavaće sobe · 2 kupaonice · Klima-uređaj · Besplatan Wi-Fi',
      },
      {
        num: '03.',
        title: 'Natkrivena terasa i vanjski kamin na drva',
        desc: 'Pripremite ukusna jela na vanjskom roštilju na drva, okupite se oko velikog stola na natkrivenoj terasi ili uživajte u jutarnjoj kavi u kutku za odmor.',
        img: '/images/villa/outside_table.jpg',
        meta: 'Natkrivena terasa · Kamin na drva · Kutak za jutarnju kavu',
      },
      {
        num: '04.',
        title: 'Vlastiti maslinik i degustacija maslinovog ulja',
        desc: 'Na imanju se nalazi vlastiti maslinik u kojem svake godine beremo masline i proizvodimo domaće ekstra djevičansko maslinovo ulje uz mogućnost degustacije.',
        img: '/images/villa/olive_trees.jpg',
        meta: 'Domaće maslinovo ulje · Nasad maslina i smokava',
      },
      {
        num: '05.',
        title: 'Sadržaji za obitelji i dječje igralište',
        desc: 'Razveselite djecu trampolinom i dječjim stolićem sa stolicama u ograđenom vrtu. Dostupni su i dječji krevetić, putni krevetić te hranilica.',
        img: '/images/villa/kids_trampoline.jpg',
        meta: 'Trampolin · Dječji stolić · Ograđeno dvorište',
      },
      {
        num: '06.',
        title: 'Natkriveni parking i blizina Novigrada',
        desc: 'Unutar ograđenog imanja osiguran je besplatan natkriveni parking. Udaljeni ste samo 2,5 km od centra Novigrada i plaža te nekoliko minuta vožnje od Istralandije i Motovuna.',
        img: '/images/villa/car_parking_shade.jpg',
        meta: 'Natkriveno parkiralište · 2,5 km do Novigrada',
      },
    ],
    featuresTitle: 'Zašto odabrati Leonardo House',
    featuresSubhead:
      'Otkrijte prizore našeg istarskog imanja – od sunčanih dana uz grijani bazen i dviju privatnih kućica među maslinama do večeri na natkrivenoj terasi.',
    featuresHint: 'Odaberite prednost za fotografije i detalje',
    servicesHeading: 'Usluge, oprema i lokacija',
    amenitiesTitle: 'Oprema i sadržaji imanja',
    locationTitle: 'Lokacija i udaljenosti',
    servicesHostBoxTitle: 'Srdačan osobni doček domaćina',
    servicesHostBoxText:
      'Naše ćemo goste srdačno dočekati, predati ključeve, pokazati im objekt i prepustiti ih uživanju u nezaboravnom odmoru, uz stalno dostupan kontakt za sve informacije.',
    servicesHostHighlights: 'Domaćin vas osobno dočekuje · Dozvoljeni duži boravci · 100 % privatni objekt',
    houseRulesTitle: 'Kućni red tijekom boravka',
    houseRulesSubhead:
      'Osnovne smjernice za ugodan, miran i bezbrižan boravak u obje kućice i na cijelom imanju.',
    galleryHeading: 'Galerija',
    gallerySubhead:
      'Pregledajte autentične fotografije obje kućice, grijanog bazena, natkrivene terase, maslinika i dječjeg igrališta.',
    galleryCategories: {
      pool: 'Bazen',
      house1: 'Kućica 1',
      house2: 'Kućica 2',
      courtyard: 'Dvorište',
      kids: 'Za djecu',
    },
    reviewsHeading: 'Recenzije gostiju',
    reviewsSubhead:
      'Stvarni dojmovi obitelji i parova iz Slovenije, Velike Britanije, SAD-a, Hrvatske i drugih zemalja koji su proveli svoj odmor u Leonardo Houseu.',
    footerTagline:
      'Privatna mediteranska vila s dvije odvojene kućice, grijanim bazenom i vlastitim maslinikom u Bužiniji kraj Novigrada.',
    footerNavTitle: 'Navigacija',
    footerLegalTitle: 'Pravne informacije',
    privacyPolicyBtn: 'Politika privatnosti',
    cookiePolicyBtn: 'Internetski kolačići',
    backToTop: 'Na vrh stranice',
  },
};

const FEATURE_GALLERIES: {
  img: string;
  title: Record<Language, string>;
  desc: Record<Language, string>;
}[][] = [
  // 01. Ogrevan zunanji bazen in zunanji tuš
  [
    {
      img: '/images/villa/pool_sunnyday.jpg',
      title: { sl: 'Ogrevan bazen', en: 'Heated Pool', de: 'Beheizter Pool', hr: 'Grijani bazen' },
      desc: {
        sl: 'Kristalno čist bazen s prijetno temperaturo vode.',
        en: 'Crystal-clear pool with pleasant heated water.',
        de: 'Kristallklarer Pool mit angenehm beheiztem Wasser.',
        hr: 'Kristalno čist bazen s ugodnom temperaturom vode.',
      },
    },
    {
      img: '/images/villa/pool_lounge.jpg',
      title: { sl: 'Ležalniki in senčniki', en: 'Loungers & Umbrellas', de: 'Liegen & Schirme', hr: 'Ležaljke i suncobrani' },
      desc: {
        sl: 'Štirje udobni ležalniki v senci senčnikov.',
        en: 'Four comfortable sunbeds beneath wide umbrellas.',
        de: 'Vier bequeme Sonnenliegen im Schatten der Schirme.',
        hr: 'Četiri udobne ležaljke u hladu suncobrana.',
      },
    },
    {
      img: '/images/villa/pool_evening.jpg',
      title: { sl: 'Večerna osvetlitev', en: 'Evening Illumination', de: 'Abendbeleuchtung', hr: 'Večernja rasvjeta' },
      desc: {
        sl: 'Romantično osvetljen bazen ob istrskem somraku.',
        en: 'Illuminated poolside ambiance at Istrian dusk.',
        de: 'Stimmungsvoll beleuchteter Pool am Abend.',
        hr: 'Romantično osvijetljen bazen u istarski sumrak.',
      },
    },
    {
      img: '/images/villa/shower_by_the_pool.jpg',
      title: { sl: 'Zunanji tuš', en: 'Outdoor Shower', de: 'Außendusche', hr: 'Vanjski tuš' },
      desc: {
        sl: 'Osvežitev pod zunanjim tušem tik ob bazenu.',
        en: 'Refreshing outdoor shower right beside the pool.',
        de: 'Erfrischende Außendusche direkt neben dem Pool.',
        hr: 'Osvježenje pod vanjskim tušem uz sam bazen.',
      },
    },
    {
      img: '/images/villa/pool_towel.jpg',
      title: { sl: 'Brisače in sprostitev', en: 'Pool Towels & Calm', de: 'Badetücher & Ruhe', hr: 'Ručnici i opuštanje' },
      desc: {
        sl: 'Pripravljene brisače za brezskrbne sončne dni.',
        en: 'Fresh towels waiting for effortless sunny afternoons.',
        de: 'Frische Badetücher für entspannte Sonnentage.',
        hr: 'Svježi ručnici za bezbrižne sunčane dane.',
      },
    },
  ],
  // 02. Dve ločeni hiški za popolno zasebnost
  [
    {
      img: '/images/villa/house_outside.jpg',
      title: { sl: 'Glavna hiška (Hiška 1)', en: 'Main House (House 1)', de: 'Haupthaus (Haus 1)', hr: 'Glavna kućica (Kuća 1)' },
      desc: {
        sl: 'Prostorna glavna enota z dvema spalnicama in dnevno sobo.',
        en: 'Spacious primary unit with two bedrooms and living room.',
        de: 'Geräumiges Haupthaus mit zwei Schlafzimmern.',
        hr: 'Prostrana glavna jedinica s dvije spavaće sobe.',
      },
    },
    {
      img: '/images/villa/living_room.jpg',
      title: { sl: 'Dnevni prostor', en: 'Living Lounge', de: 'Wohnbereich', hr: 'Dnevni boravak' },
      desc: {
        sl: 'Svetel klimatiziran dnevni del s sedežno garnituro.',
        en: 'Bright air-conditioned lounge with comfortable sofa.',
        de: 'Heller klimatisierter Wohnbereich mit Sofa.',
        hr: 'Svijetao klimatizirani dnevni prostor sa sjedećom garniturom.',
      },
    },
    {
      img: '/images/villa/kitchen.jpg',
      title: { sl: 'Opremljena kuhinja', en: 'Equipped Kitchen', de: 'Moderne Küche', hr: 'Opremljena kuhinja' },
      desc: {
        sl: 'Sodobna kuhinja s pomivalnim strojem in kavnim aparatom.',
        en: 'Full kitchen with dishwasher and coffee maker.',
        de: 'Voll ausgestattete Küche mit Geschirrspüler.',
        hr: 'Moderna kuhinja s perilicom posuđa i aparatom za kavu.',
      },
    },
    {
      img: '/images/villa/bedroom.jpg',
      title: { sl: 'Spalnica v Hiški 1', en: 'House 1 Bedroom', de: 'Schlafzimmer Haus 1', hr: 'Spavaća soba Kuća 1' },
      desc: {
        sl: 'Mirna spalnica z udobno posteljo in svežo posteljnino.',
        en: 'Quiet bedroom with fresh crisp linens.',
        de: 'Ruhiges Schlafzimmer mit frischer Bettwäsche.',
        hr: 'Mirna spavaća soba sa svježom posteljinom.',
      },
    },
    {
      img: '/images/villa/small_house.jpg',
      title: { sl: 'Ločena Hiška 2', en: 'Separate House 2', de: 'Separates Haus 2', hr: 'Odvojena Kućica 2' },
      desc: {
        sl: 'Samostojna druga hiška za popolno zasebnost.',
        en: 'Standalone second cottage for extra privacy.',
        de: 'Eigenständiges zweites Haus für volle Privatsphäre.',
        hr: 'Samostalna druga kućica za potpunu privatnost.',
      },
    },
  ],
  // 03. Pokrita terasa in zunanji kamin na drva
  [
    {
      img: '/images/villa/outside_table.jpg',
      title: { sl: 'Pokrita terasa', en: 'Covered Terrace', de: 'Überdachte Terrasse', hr: 'Natkrivena terasa' },
      desc: {
        sl: 'Velika jedilna miza v prijetni senci ob bazenu.',
        en: 'Large shaded dining table beside the pool.',
        de: 'Großer schattiger Esstisch neben dem Pool.',
        hr: 'Veliki blagovaonski stol u ugodnom hladu.',
      },
    },
    {
      img: '/images/villa/bbq.jpg',
      title: { sl: 'Kamin na drva', en: 'Wood-Burning BBQ', de: 'Holzgrill & Kamin', hr: 'Kamin na drva' },
      desc: {
        sl: 'Tradicionalen zunanji žar na drva za poletne večerje.',
        en: 'Traditional wood-fired grill for evening feasts.',
        de: 'Traditioneller Holzgrill für laue Sommerabende.',
        hr: 'Tradicionalni vanjski roštilj na drva.',
      },
    },
    {
      img: '/images/villa/terrace_table.jpg',
      title: { sl: 'Prostor za druženje', en: 'Outdoor Dining', de: 'Essbereich im Freien', hr: 'Blagovaonica na otvorenom' },
      desc: {
        sl: 'Udoben kotiček za skupna kosila na svežem zraku.',
        en: 'Welcoming spot for open-air family meals.',
        de: 'Gemütlicher Platz für gemeinsame Mahlzeiten.',
        hr: 'Ugodno mjesto za zajedničke obroke na otvorenom.',
      },
    },
    {
      img: '/images/villa/coffee_by_the_pool.jpg',
      title: { sl: 'Jutranja kava', en: 'Morning Coffee Spot', de: 'Morgenkaffee-Ecke', hr: 'Kutak za jutarnju kavu' },
      desc: {
        sl: 'Manjša mizica ob bazenu za mirna poletna jutra.',
        en: 'Intimate lounge table for calm sunny mornings.',
        de: 'Kleiner Loungetisch für entspannte Morgenstunden.',
        hr: 'Manji stolić uz bazen za mirna jutra.',
      },
    },
    {
      img: '/images/villa/terrace.jpg',
      title: { sl: 'Zaseben vrt in terasa', en: 'Garden Terrace', de: 'Gartenterrasse', hr: 'Vrtna terasa' },
      desc: {
        sl: 'Tlakovana terasa obdana z mediteranskim rastlinjem.',
        en: 'Stone terrace surrounded by Mediterranean greenery.',
        de: 'Steinterrasse umgeben von mediterranem Grün.',
        hr: 'Kamena terasa okružena mediteranskim biljem.',
      },
    },
  ],
  // 04. Lasten oljčni nasad in degustacija oljčnega olja
  [
    {
      img: '/images/villa/olive_trees.jpg',
      title: { sl: 'Lasten oljčni nasad', en: 'Estate Olive Grove', de: 'Eigener Olivenhain', hr: 'Vlastiti maslinik' },
      desc: {
        sl: 'Starejše istrske oljke in smokve na ograjenem posestvu.',
        en: 'Mature Istrian olive and fig trees on the estate.',
        de: 'Istrische Oliven- und Feigenbäume auf dem Grundstück.',
        hr: 'Istarske masline i smokve na ograđenom imanju.',
      },
    },
    {
      img: '/images/villa/view_of_the_yard.jpg',
      title: { sl: 'Pogled skozi oljke', en: 'View Through Olives', de: 'Blick durch Oliven', hr: 'Pogled kroz masline' },
      desc: {
        sl: 'Zeleno zatočišče s pogledom na bazen in obe hiški.',
        en: 'Lush sanctuary framing the pool and both houses.',
        de: 'Grüne Oase mit Blick auf Pool und Häuser.',
        hr: 'Zelena oaza s pogledom na bazen i kućice.',
      },
    },
    {
      img: '/images/villa/wine_and_glasses.jpg',
      title: { sl: 'Degustacija domačih dobrot', en: 'Olive Oil & Wine', de: 'Öl- & Weinverkostung', hr: 'Degustacija domaćeg ulja' },
      desc: {
        sl: 'Možnost pokušine domačega ekstra deviškega oljčnega olja.',
        en: 'Complimentary tasting of homemade estate olive oil.',
        de: 'Verkostung unseres hausgemachten Olivenöls.',
        hr: 'Degustacija domaćeg ekstra djevičanskog maslinovog ulja.',
      },
    },
    {
      img: '/images/villa/flower_bed.jpg',
      title: { sl: 'Urejena mediteranska greda', en: 'Mediterranean Blooms', de: 'Mediterrane Blüten', hr: 'Mediteransko cvijeće' },
      desc: {
        sl: 'Dišeča sivka, rože in skrbno negovan vrt.',
        en: 'Fragrant lavender, flowers, and manicured greenery.',
        de: 'Duftender Lavendel und liebevoll gepflegte Beete.',
        hr: 'Mirisna lavanda, cvijeće i njegovan vrt.',
      },
    },
    {
      img: '/images/villa/statue.jpg',
      title: { sl: 'Detajli na vrtu', en: 'Garden Details', de: 'Gartendetails', hr: 'Detalji u vrtu' },
      desc: {
        sl: 'Skrbno izbrani elementi, ki ustvarjajo toplino doma.',
        en: 'Thoughtful touches lending warmth across the yard.',
        de: 'Liebevolle Details im gesamten Gartenbereich.',
        hr: 'Pažljivo odabrani detalji za toplinu dvorišta.',
      },
    },
  ],
  // 05. Vsebine za družine in otroško igrišče
  [
    {
      img: '/images/villa/kids_trampoline.jpg',
      title: { sl: 'Vrtni trampolin', en: 'Garden Trampoline', de: 'Gartentrampolin', hr: 'Vrtni trampolin' },
      desc: {
        sl: 'Varna zabava na velikem trampolinu na zelenici.',
        en: 'Safe outdoor fun on the large lawn trampoline.',
        de: 'Sicherer Spielspaß auf dem großen Trampolin.',
        hr: 'Sigurna zabava na velikom vrtnom trampolinu.',
      },
    },
    {
      img: '/images/villa/kids_table.jpg',
      title: { sl: 'Otroški kotiček', en: 'Kids’ Play Corner', de: 'Kinderspielecke', hr: 'Dječji kutak' },
      desc: {
        sl: 'Otroška mizica s stoli v prijetni senci ob igrišču.',
        en: 'Children’s table and chairs in a shaded corner.',
        de: 'Kleiner Kindertisch mit Stühlen im Schatten.',
        hr: 'Dječji stolić sa stolicama u ugodnom hladu.',
      },
    },
    {
      img: '/images/villa/trampoline_and_pool.jpg',
      title: { sl: 'Bližina bazena', en: 'Pool & Play View', de: 'Pool & Spielbereich', hr: 'Blizina bazena' },
      desc: {
        sl: 'Starši lahko sproščeno spremljajo igro kar z ležalnika.',
        en: 'Easy supervision right from the poolside loungers.',
        de: 'Spielbereich direkt im Blickfeld der Sonnenliegen.',
        hr: 'Pregledna zona za igru uz same ležaljke.',
      },
    },
    {
      img: '/images/villa/flowers_and_kids.jpg',
      title: { sl: 'Ograjena zelenica', en: 'Fenced Lawn', de: 'Eingezäunte Wiese', hr: 'Ograđena travnata površina' },
      desc: {
        sl: 'Popolnoma ograjena parcela za brezskrbno igro.',
        en: 'Fully fenced garden for carefree family holidays.',
        de: 'Komplett eingezäuntes Grundstück für sicheres Spielen.',
        hr: 'Potpuno ograđeno dvorište za bezbrižan boravak.',
      },
    },
    {
      img: '/images/villa/swing_chair_by_the_pool.jpg',
      title: { sl: 'Viseči počivalnik', en: 'Hanging Swing Chair', de: 'Hängesessel', hr: 'Viseća fotelja' },
      desc: {
        sl: 'Priljubljen kotiček za branje in oddih v senci.',
        en: 'Favorite reading and lounging spot by the garden.',
        de: 'Beliebter Platz zum Lesen und Entspannen.',
        hr: 'Omiljeno mjesto za čitanje i odmor u hladu.',
      },
    },
  ],
  // 06. Pokrito parkirišče in bližina Novigrada
  [
    {
      img: '/images/villa/car_parking_shade.jpg',
      title: { sl: 'Pokrito parkirišče', en: 'Covered Parking', de: 'Überdachter Parkplatz', hr: 'Natkriveno parkiralište' },
      desc: {
        sl: 'Brezplačno senčno parkirišče znotraj ograjenega dvorišča.',
        en: 'Free shaded parking right inside the gated lot.',
        de: 'Kostenloser Schattenparkplatz auf dem Grundstück.',
        hr: 'Besplatan natkriveni parking unutar dvorišta.',
      },
    },
    {
      img: '/images/villa/car_parking.jpg',
      title: { sl: 'Varno dvorišče', en: 'Gated Driveway', de: 'Gesicherte Einfahrt', hr: 'Siguran prilaz' },
      desc: {
        sl: 'Enostaven dostop in dovolj prostora za več vozil.',
        en: 'Easy gated access with space for multiple cars.',
        de: 'Bequeme Zufahrt mit Platz für mehrere Fahrzeuge.',
        hr: 'Jednostavan pristup s dovoljno mjesta za vozila.',
      },
    },
    {
      img: '/images/villa/house_entrance.jpg',
      title: { sl: 'Vhod v posestvo', en: 'Villa Entrance', de: 'Eingang zur Villa', hr: 'Ulaz na imanje' },
      desc: {
        sl: 'Dobrodošli v mirni Bužiniji le 2,5 km od Novigrada.',
        en: 'Quiet Bužinija location just 2.5 km from Novigrad.',
        de: 'Ruhige Lage in Bužinija, nur 2,5 km nach Novigrad.',
        hr: 'Mirna lokacija u Bužiniji samo 2,5 km od Novigrada.',
      },
    },
    {
      img: '/images/villa/Leonardo_house.jpeg',
      title: { sl: 'Večerni mir Istre', en: 'Istrian Serenity', de: 'Istrische Ruhe', hr: 'Istarski mir' },
      desc: {
        sl: 'Hiter dostop do plaž, Istralandije in Motovuna.',
        en: 'Minutes from Adriatic beaches, Istralandia, and Motovun.',
        de: 'Nur wenige Minuten zu Stränden, Istralandia und Motovun.',
        hr: 'Nekoliko minuta do plaža, Istralandije i Motovuna.',
      },
    },
  ],
];
const METRIC_ICONS = [Trees, Maximize2, KeyRound, BedDouble, Bath, Waves];
const HOUSE1_PHOTOS = [
  { src: '/images/villa/opt/kitchen.jpg', alt: 'Kuhinja v veliki hiši' },
  { src: '/images/villa/opt/bedroom.jpg', alt: 'Spalnica v veliki hiši' },
  { src: '/images/villa/opt/living_room.jpg', alt: 'Dnevni prostor v veliki hiši' },
  { src: '/images/villa/opt/bathroom.jpg', alt: 'Kopalnica v veliki hiši' },
  { src: '/images/villa/opt/bedroom_towels.jpg', alt: 'Udobje in pripravljene brisače' },
  { src: '/images/villa/opt/bedroom_closet.jpg', alt: 'Druga spalnica in garderobni prostor' },
  { src: '/images/villa/opt/kitchen_appliances.jpg', alt: 'Kavni kotiček in kuhinjski aparati' },
  { src: '/images/villa/opt/house_entrance.jpg', alt: 'Vhod v glavno hiško' },
];
const ESTATE_PHOTOS = [
  { src: '/images/villa/opt/pool_wide_view.jpg', alt: 'Ogrevan bazen' },
  { src: '/images/villa/opt/outside_table.jpg', alt: 'Pokrita terasa z mizo' },
  { src: '/images/villa/opt/olive_trees.jpg', alt: 'Nasad oljk' },
  { src: '/images/villa/opt/bbq.jpg', alt: 'Zunanji žar na drva' },
  { src: '/images/villa/opt/kids_table.jpg', alt: 'Otroška mizica s stoli v senci' },
  { src: '/images/villa/opt/trampoline_and_pool.jpg', alt: 'Družinski raj ob bazenu' },
];

const HOUSE2_PHOTOS = [
  { src: '/images/villa/opt/small_house.jpg', alt: 'Notranjost manjše hiške' },
  { src: '/images/villa/opt/small_house_bed.jpg', alt: 'Spalnica v manjši hiški' },
  { src: '/images/villa/opt/small_house_bathroom.jpg', alt: 'Kopalnica v manjši hiški' },
  { src: '/images/villa/opt/terrace.jpg', alt: 'Terasa in vrt ob manjši hiški' },
];

const AIRBNB_FEATURED_GALLERY: GalleryItem[] = [
  {
    id: 'airbnb-pool-main',
    src: '/images/villa/pool_with_chairs.jpg',
    category: 'pool',
    title: {
      sl: 'Ogrevan zunanji bazen s sončno ploščadjo in teraso',
      en: 'Heated Outdoor Pool with Sun Loungers & Covered Terrace',
      de: 'Beheizter Außenpool mit Sonnenliegen & überdachter Terrasse',
      hr: 'Grijani vanjski bazen s ležaljkama i natkrivenom terasom',
    },
    subtitle: {
      sl: 'Sončna ploščad z ležalniki, senčniki in pokrito teraso v ozadju',
      en: 'Sun deck with loungers, umbrellas, and the shaded dining terrace',
      de: 'Sonnendeck mit Liegen, Schirmen und der schattigen Terrasse',
      hr: 'Sunčalište s ležaljkama, suncobranima i natkrivenom terasom',
    },
  },
  {
    id: 'airbnb-pool-evening',
    src: '/images/villa/pool_evening.jpg',
    category: 'pool',
    title: {
      sl: 'Večerni pogled na osvetljen bazen skozi oljke',
      en: 'Evening Pool View Framed by Olive Trees',
      de: 'Abendblick auf den beleuchteten Pool zwischen Olivenbäumen',
      hr: 'Večernji pogled na osvijetljeni bazen kroz masline',
    },
    subtitle: {
      sl: 'Čaroben istrski somrak ob visečem počivalniku in bazenu',
      en: 'Golden Istrian dusk overlooking the hanging cocoon chair and pool',
      de: 'Istrische Abenddämmerung am Hängesessel und beleuchteten Pool',
      hr: 'Istarski sumrak uz viseću fotelju i osvijetljeni bazen',
    },
  },
  {
    id: 'airbnb-living-room',
    src: '/images/villa/living_room.jpg',
    category: 'house1',
    title: {
      sl: 'Svetel dnevni prostor in sodobna kuhinja v Hiški 1',
      en: 'Bright Living Room & Modern Kitchen in House 1',
      de: 'Heller Wohnbereich & moderne Küche in Haus 1',
      hr: 'Svijetao dnevni boravak i moderna kuhinja u Kući 1',
    },
    subtitle: {
      sl: 'Klimatiziran bivalni del s sedežno garnituro in polno opremljeno kuhinjo',
      en: 'Air-conditioned living space with sofa lounge and fully equipped kitchen',
      de: 'Klimatisierter Wohnraum mit Schlafsofa und voll ausgestatteter Küche',
      hr: 'Klimatizirani dnevni prostor sa sjedećom garniturom i potpuno opremljenom kuhinjom',
    },
  },
  {
    id: 'airbnb-yard-view',
    src: '/images/villa/view_of_the_yard.jpg',
    category: 'courtyard',
    title: {
      sl: 'Pogled na posestvo in bazen iz sence oljčnega nasada',
      en: 'Estate & Pool View from the Shade of the Olive Grove',
      de: 'Blick auf Anwesen und Pool aus dem Schatten des Olivenhains',
      hr: 'Pogled na imanje i bazen iz hlada maslinika',
    },
    subtitle: {
      sl: '1.000 m² ograjenega mediteranskega vrta z oljkami, cvetjem in figami',
      en: '1,000 m² fenced Mediterranean garden with olives, flowers, and figs',
      de: '1.000 m² eingezäunter mediterraner Garten mit Oliven und Feigen',
      hr: '1.000 m² ograđenog mediteranskog vrta s maslinama i smokvama',
    },
  },
  {
    id: 'airbnb-pool-towel',
    src: '/images/villa/pool_towel.jpg',
    category: 'pool',
    title: {
      sl: 'Sivka, sveže brisače in brezskrbno poležavanje ob bazenu',
      en: 'Fresh Pool Towels, Fragrant Lavender & Pure Relaxation',
      de: 'Frische Poolhandtücher, Lavendelduft & pure Entspannung',
      hr: 'Svježi ručnici, mirisna lavanda i opuštanje uz bazen',
    },
    subtitle: {
      sl: 'Pripravljene brisače za bazen in istrska sivka za popoln oddih',
      en: 'Plush pool towels and local Istrian lavender prepared for your stay',
      de: 'Bereitgestellte Badetücher und istrischer Lavendel für Ihren Urlaub',
      hr: 'Pripremljeni ručnici za bazen i istarska lavanda za potpuni odmor',
    },
  },
];

function EstatePhotoCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="group relative rounded-xl overflow-hidden h-40 sm:h-56 border border-[#E2DBD0] bg-[#EAE4D7]">
      <ResilientImage
        src={src}
        alt={alt}
        width={768}
        height={512}
        containerClassName="w-full h-full"
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"
      />
      {/* Inset clockwise drawing white border lines */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-3">
        <span className="absolute top-0 left-0 right-0 h-px bg-white/95 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out delay-0 group-hover:delay-0" />
        <span className="absolute top-0 right-0 bottom-0 w-px bg-white/95 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-200 ease-out delay-0 group-hover:delay-100" />
        <span className="absolute bottom-0 left-0 right-0 h-px bg-white/95 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out delay-0 group-hover:delay-200" />
        <span className="absolute top-0 left-0 bottom-0 w-px bg-white/95 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-200 ease-out delay-0 group-hover:delay-300" />
      </div>
      {/* Centered small-caps title overlay */}
      <div className="pointer-events-none absolute inset-5 flex items-center justify-center text-center opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out delay-0 group-hover:delay-100">
        <span className="font-serif small-caps text-sm sm:text-base tracking-[0.14em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)] leading-snug">
          {alt}
        </span>
      </div>
    </div>
  );
}

function MobileEstateUnitCard({
  indexLabel,
  title,
  description,
  specs,
  photos,
}: {
  indexLabel: string;
  title: string;
  description: string;
  specs: Array<{ label: string; value: string }>;
  photos: Array<{ src: string; alt: string }>;
}) {
  const [slideIdx, setSlideIdx] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const targetSlideRef = useRef<number | null>(null);
  const lockUntilRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    const el = sliderRef.current;
    if (!el || el.clientWidth === 0) return;
    const target = targetSlideRef.current;
    if (target !== null) {
      const arrived = Math.abs(el.scrollLeft - target * el.clientWidth) <= 2;
      if (!arrived && Date.now() < lockUntilRef.current) {
        return;
      }
      targetSlideRef.current = null;
    }
    const nextIdx = Math.max(
      0,
      Math.min(photos.length - 1, Math.round(el.scrollLeft / el.clientWidth))
    );
    setSlideIdx((prev) => (prev === nextIdx ? prev : nextIdx));
  }, [photos.length]);

  const scrollToSlide = useCallback(
    (targetIdx: number) => {
      const el = sliderRef.current;
      if (!el || el.clientWidth === 0) return;
      const clamped = Math.max(0, Math.min(photos.length - 1, targetIdx));
      targetSlideRef.current = clamped;
      lockUntilRef.current = Date.now() + 700;
      setSlideIdx(clamped);
      el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
    },
    [photos.length]
  );

  const currentPhoto = photos[slideIdx] ?? photos[0];

  return (
    <article className="bg-[#F4F0E8] border border-[#E2DBD0] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(30,37,31,0.04)]">
      {/* Swipeable 16:10 Photo Gallery at top of card */}
      <div className="relative w-full aspect-[16/10] bg-[#EAE4D7] overflow-hidden">
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          onTouchStart={() => {
            targetSlideRef.current = null;
          }}
          className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo) => (
            <div key={photo.src} className="w-full h-full shrink-0 snap-start relative">
              <ResilientImage
                src={photo.src}
                variant="card"
                loading="eager"
                alt={photo.alt}
                width={768}
                height={480}
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Bottom Scrim for Caption & Progress Bars */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#141A13]/75 via-[#141A13]/25 to-transparent"
        />

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollToSlide(slideIdx - 1)}
              disabled={slideIdx === 0}
              aria-label="Prejšnja fotografija"
              className={`absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#141A13]/45 backdrop-blur-xs text-white flex items-center justify-center transition-opacity ${
                slideIdx === 0 ? 'opacity-30 cursor-default' : 'opacity-90 active:scale-95'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSlide(slideIdx + 1)}
              disabled={slideIdx >= photos.length - 1}
              aria-label="Naslednja fotografija"
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#141A13]/45 backdrop-blur-xs text-white flex items-center justify-center transition-opacity ${
                slideIdx >= photos.length - 1 ? 'opacity-30 cursor-default' : 'opacity-90 active:scale-95'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Active Photo Label + Counter + Bars */}
        <div className="pointer-events-none absolute inset-x-3.5 bottom-5 z-20 flex items-center justify-between gap-2 text-white">
          <span className="text-xs font-medium tracking-wide truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {currentPhoto?.alt}
          </span>
          <span className="text-[11px] font-medium tabular-nums text-white/90 shrink-0 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {slideIdx + 1} / {photos.length}
          </span>
        </div>

        {photos.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
            {photos.map((photo, pIdx) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => scrollToSlide(pIdx)}
                aria-label={`Fotografija ${pIdx + 1} od ${photos.length}`}
                className={`h-[3px] rounded-full transition-all duration-200 ${
                  pIdx === slideIdx ? 'w-7 bg-[#FAF8F4]' : 'w-4 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Body: Title, Description & 2x2 Key Specs */}
      <div className="p-4 sm:p-6">
        <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-[#7C7567]">
          {indexLabel}
        </div>
        <h3 className="mt-1 font-serif text-[22px] sm:text-2xl font-semibold text-[#1E251F] leading-snug">
          {title}
        </h3>
        <p className="mt-2 text-sm text-[#4A5348] leading-relaxed">{description}</p>

        <div className="mt-4 pt-3.5 border-t border-[#E2DBD0] grid grid-cols-2 gap-x-3.5 gap-y-2.5 text-xs text-[#3D463B]">
          {specs.map((spec) => (
            <div key={spec.label}>
              <div className="font-semibold text-[#1E251F]">{spec.label}</div>
              <div className="mt-0.5 text-[#5C645A] leading-snug">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

const HOUSE_TAB_KEYS = ['house1', 'house2', 'estate'] as const;
type HouseTabKey = (typeof HOUSE_TAB_KEYS)[number];

export default function App() {
  const [lang, setLang] = useState<Language>('sl');
  const [heroSlideIdx, setHeroSlideIdx] = useState<number>(0);
  const [activeHouseTab, setActiveHouseTab] = useState<HouseTabKey>('house1');
  const [activeFeatureIdx, setActiveFeatureIdx] = useState<number>(0);
  const [mobileActiveFeatureIdx, setMobileActiveFeatureIdx] = useState<number | null>(0);
  const [mobileFeatureSlideIdx, setMobileFeatureSlideIdx] = useState<number>(0);
  const mobileFeatureSliderRef = useRef<HTMLDivElement | null>(null);
  const mobileFeatureTargetSlideRef = useRef<number | null>(null);
  const mobileFeatureLockUntilRef = useRef<number>(0);
  const mobileFeatureCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [gallerySlideIdx, setGallerySlideIdx] = useState<number>(0);
  const [reviewStartIndex, setReviewStartIndex] = useState<number>(0);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [legalModal, setLegalModal] = useState<'privacy' | 'cookies' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState<boolean>(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const featureSliderRef = useRef<HTMLDivElement | null>(null);
  const [featureCanScrollPrev, setFeatureCanScrollPrev] = useState<boolean>(false);
  const [featureCanScrollNext, setFeatureCanScrollNext] = useState<boolean>(true);
  const [activeFeatureSlideIdx, setActiveFeatureSlideIdx] = useState<number>(0);
  const [isDraggingFeature, setIsDraggingFeature] = useState<boolean>(false);
  const featureDragRef = useRef<{ active: boolean; startX: number; startScrollLeft: number }>({
    active: false,
    startX: 0,
    startScrollLeft: 0,
  });

  const reviewsSliderRef = useRef<HTMLDivElement | null>(null);
  const reviewSlidePosRef = useRef<number>(0);
  const reviewAnimFrameRef = useRef<number | null>(null);
  const [isReviewsPaused, setIsReviewsPaused] = useState<boolean>(false);

  const updateFeatureScrollState = useCallback(() => {
    const el = featureSliderRef.current;
    if (!el) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    setFeatureCanScrollPrev(el.scrollLeft > 8);
    setFeatureCanScrollNext(el.scrollLeft < maxScroll - 8);
    if (el.clientWidth > 0) {
      setActiveFeatureSlideIdx(Math.round(el.scrollLeft / el.clientWidth));
    }
  }, []);

  useEffect(() => {
    const el = featureSliderRef.current;
    if (el) {
      el.scrollTo({ left: 0, behavior: 'auto' });
    }
    setActiveFeatureSlideIdx(0);
    updateFeatureScrollState();
  }, [activeFeatureIdx, updateFeatureScrollState]);

  useEffect(() => {
    updateFeatureScrollState();
    window.addEventListener('resize', updateFeatureScrollState);
    return () => window.removeEventListener('resize', updateFeatureScrollState);
  }, [updateFeatureScrollState]);

  const scrollFeatureSlider = (direction: -1 | 1) => {
    const el = featureSliderRef.current;
    if (!el || el.clientWidth === 0) return;
    const totalSlides = el.children.length;
    if (totalSlides === 0) return;
    const currentIdx = Math.round(el.scrollLeft / el.clientWidth);
    const nextIdx = Math.max(0, Math.min(totalSlides - 1, currentIdx + direction));
    el.scrollTo({ left: nextIdx * el.clientWidth, behavior: 'smooth' });
  };

  const scrollToFeatureSlide = (index: number) => {
    const el = featureSliderRef.current;
    if (!el || el.clientWidth === 0) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
  };

  const handleMobileFeatureToggle = useCallback(
    (idx: number) => {
      if (mobileActiveFeatureIdx === idx) {
        setMobileActiveFeatureIdx(null);
        return;
      }
      const prevWasAbove = mobileActiveFeatureIdx !== null && mobileActiveFeatureIdx < idx;
      mobileFeatureTargetSlideRef.current = null;
      setMobileActiveFeatureIdx(idx);
      setActiveFeatureIdx(idx);
      setMobileFeatureSlideIdx(0);

      requestAnimationFrame(() => {
        if (mobileFeatureSliderRef.current) {
          mobileFeatureSliderRef.current.scrollTo({ left: 0, behavior: 'auto' });
        }
        if (prevWasAbove) {
          requestAnimationFrame(() => {
            const cardEl = mobileFeatureCardRefs.current[idx];
            if (cardEl) {
              const rect = cardEl.getBoundingClientRect();
              if (rect.top < 78) {
                window.scrollBy({ top: rect.top - 84, behavior: 'smooth' });
              }
            }
          });
        }
      });
    },
    [mobileActiveFeatureIdx]
  );

  const handleMobileFeatureSliderScroll = useCallback(() => {
    const el = mobileFeatureSliderRef.current;
    if (!el || el.clientWidth === 0) return;
    const target = mobileFeatureTargetSlideRef.current;
    if (target !== null) {
      const arrived = Math.abs(el.scrollLeft - target * el.clientWidth) <= 2;
      if (!arrived && Date.now() < mobileFeatureLockUntilRef.current) {
        return;
      }
      mobileFeatureTargetSlideRef.current = null;
    }
    const nextIdx = Math.max(
      0,
      Math.min(el.children.length - 1, Math.round(el.scrollLeft / el.clientWidth))
    );
    setMobileFeatureSlideIdx((prev) => (prev === nextIdx ? prev : nextIdx));
  }, []);

  const scrollMobileFeatureSlide = useCallback((targetIdx: number) => {
    const el = mobileFeatureSliderRef.current;
    if (!el || el.clientWidth === 0) return;
    const total = el.children.length;
    if (total === 0) return;
    const clamped = Math.max(0, Math.min(total - 1, targetIdx));
    mobileFeatureTargetSlideRef.current = clamped;
    mobileFeatureLockUntilRef.current = Date.now() + 700;
    setMobileFeatureSlideIdx(clamped);
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  }, []);

  const handleFeatureMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const el = featureSliderRef.current;
    if (!el) return;
    featureDragRef.current = {
      active: true,
      startX: e.pageX,
      startScrollLeft: el.scrollLeft,
    };
    setIsDraggingFeature(true);
  };

  const handleFeatureMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!featureDragRef.current.active) return;
    const el = featureSliderRef.current;
    if (!el) return;
    e.preventDefault();
    const dx = e.pageX - featureDragRef.current.startX;
    el.scrollLeft = featureDragRef.current.startScrollLeft - dx;
  };

  const handleFeatureDragEnd = useCallback(() => {
    if (!featureDragRef.current.active) return;
    featureDragRef.current.active = false;
    setIsDraggingFeature(false);
    const el = featureSliderRef.current;
    if (!el || el.clientWidth === 0) return;
    const w = el.clientWidth;
    const delta = el.scrollLeft - featureDragRef.current.startScrollLeft;
    const startIdx = Math.round(featureDragRef.current.startScrollLeft / w);
    let targetIdx = Math.round(el.scrollLeft / w);
    if (Math.abs(delta) > w * 0.12 && targetIdx === startIdx) {
      targetIdx = startIdx + (delta > 0 ? 1 : -1);
    }
    targetIdx = Math.max(0, Math.min(el.children.length - 1, targetIdx));
    el.scrollTo({ left: targetIdx * w, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!isDraggingFeature) return;
    window.addEventListener('mouseup', handleFeatureDragEnd);
    return () => window.removeEventListener('mouseup', handleFeatureDragEnd);
  }, [isDraggingFeature, handleFeatureDragEnd]);

  const getReviewStepWidth = useCallback((el: HTMLDivElement) => {
    const first = el.children[0] as HTMLElement | undefined;
    const second = el.children[1] as HTMLElement | undefined;
    if (first && second) {
      return second.offsetLeft - first.offsetLeft;
    }
    return el.clientWidth;
  }, []);

  const animateReviewScrollTo = useCallback(
    (el: HTMLDivElement, targetLeft: number, onDone?: () => void) => {
      if (reviewAnimFrameRef.current !== null) {
        cancelAnimationFrame(reviewAnimFrameRef.current);
        reviewAnimFrameRef.current = null;
      }

      const startLeft = el.scrollLeft;
      const duration = 950;
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        el.scrollLeft = startLeft + (targetLeft - startLeft) * eased;

        if (progress < 1) {
          reviewAnimFrameRef.current = requestAnimationFrame(animate);
        } else {
          reviewAnimFrameRef.current = null;
          onDone?.();
        }
      };

      reviewAnimFrameRef.current = requestAnimationFrame(animate);
    },
    []
  );

  const stepReviewSlider = useCallback(
    (direction: -1 | 1) => {
      const el = reviewsSliderRef.current;
      const total = GUEST_REVIEWS.length;
      if (!el || el.clientWidth === 0 || total === 0) return;

      const stepW = getReviewStepWidth(el);
      let currentPos = reviewSlidePosRef.current;

      if (direction === 1 && currentPos >= total) {
        currentPos = 0;
        el.scrollLeft = 0;
      } else if (direction === -1 && currentPos <= 0) {
        currentPos = total;
        el.scrollLeft = total * stepW;
      }

      const nextPos = currentPos + direction;
      reviewSlidePosRef.current = nextPos;
      setReviewStartIndex(nextPos % total);

      animateReviewScrollTo(el, nextPos * stepW, () => {
        if (nextPos >= total) {
          el.scrollLeft = 0;
          reviewSlidePosRef.current = 0;
        }
      });
    },
    [animateReviewScrollTo, getReviewStepWidth]
  );

  const goToReviewSlide = useCallback(
    (targetIdx: number) => {
      const el = reviewsSliderRef.current;
      const total = GUEST_REVIEWS.length;
      if (!el || el.clientWidth === 0 || total === 0) return;

      const stepW = getReviewStepWidth(el);
      const clampedIdx = ((targetIdx % total) + total) % total;
      reviewSlidePosRef.current = clampedIdx;
      setReviewStartIndex(clampedIdx);
      animateReviewScrollTo(el, clampedIdx * stepW);
    },
    [animateReviewScrollTo, getReviewStepWidth]
  );

  useEffect(() => {
    if (isReviewsPaused) return;
    const timer = window.setInterval(() => {
      stepReviewSlider(1);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [isReviewsPaused, stepReviewSlider]);

  useEffect(() => {
    const syncReviewsResize = () => {
      const el = reviewsSliderRef.current;
      if (!el || el.clientWidth === 0) return;
      const stepW = getReviewStepWidth(el);
      el.scrollLeft = (reviewSlidePosRef.current % GUEST_REVIEWS.length) * stepW;
    };
    window.addEventListener('resize', syncReviewsResize);
    return () => {
      window.removeEventListener('resize', syncReviewsResize);
      if (reviewAnimFrameRef.current !== null) {
        cancelAnimationFrame(reviewAnimFrameRef.current);
      }
    };
  }, [getReviewStepWidth]);

  const copy = UI_COPY[lang];
  const activeFeatureGallery = FEATURE_GALLERIES[activeFeatureIdx] ?? FEATURE_GALLERIES[0];

  const allGalleryItems = useMemo(
    () => [
      ...AIRBNB_FEATURED_GALLERY,
      ...GALLERY_ITEMS.filter(
        (item) => !AIRBNB_FEATURED_GALLERY.some((featured) => featured.src === item.src)
      ),
    ],
    []
  );

  // Show Back-to-Top button after scrolling past the hero header
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 420);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-close mobile menu on desktop breakpoint resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for Google Maps Platform quota exhaustion event
  useEffect(() => {
    const handleQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Keyboard navigation for Lightbox & Mobile Menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxItem) setLightboxItem(null);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      } else if (lightboxItem) {
        if (e.key === 'ArrowRight') {
          const idx = allGalleryItems.findIndex((i) => i.id === lightboxItem.id);
          if (idx !== -1) {
            const nextIdx = (idx + 1) % allGalleryItems.length;
            setLightboxItem(allGalleryItems[nextIdx]);
            setGallerySlideIdx(nextIdx);
          }
        } else if (e.key === 'ArrowLeft') {
          const idx = allGalleryItems.findIndex((i) => i.id === lightboxItem.id);
          if (idx !== -1) {
            const prevIdx = (idx - 1 + allGalleryItems.length) % allGalleryItems.length;
            setLightboxItem(allGalleryItems[prevIdx]);
            setGallerySlideIdx(prevIdx);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem, mobileMenuOpen]);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#1E251F] overflow-x-clip">
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      {/* TOP BAR CONTRACT: Strictly 3 zones */}
      <header className="sticky top-0 z-40 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#E5DFD3]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-2 sm:gap-4 lg:gap-6 px-3.5 sm:px-6 lg:px-10 py-2 sm:py-2.5">
          {/* Zone 1: Original Leonardo House logo enhanced for crispness and clarity */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              if (window.location.hash) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
              }
            }}
            aria-label="Leonardo House"
            className="inline-flex items-center whitespace-nowrap shrink-0 py-0.5 focus:outline-none min-w-0"
          >
            <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
              <defs>
                <filter id="lh-crisp-logo" colorInterpolationFilters="sRGB">
                  <feConvolveMatrix
                    order="3 3"
                    kernelMatrix="0 -0.18 0 -0.18 1.72 -0.18 0 -0.18 0"
                    preserveAlpha="true"
                  />
                </filter>
              </defs>
            </svg>
            <img
              src="/images/villa/LH_logo_hd.png"
              alt="Leonardo House"
              referrerPolicy="no-referrer"
              className="h-11 sm:h-13 lg:h-14 w-auto max-w-[160px] sm:max-w-none object-contain select-none logo-crisp"
            />
          </a>

          {/* Zone 2: Desktop Navigation Links (hidden on mobile and tablet < lg) */}
          <nav className="hidden lg:flex items-center gap-9 font-logo-sans text-[12.5px] font-normal uppercase tracking-[0.16em] text-[#3F483E]">
            {[
              { href: '#estate', label: copy.navEstate },
              { href: '#services', label: copy.navServices },
              { href: '#contact', label: copy.navContact },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative py-1.5 font-normal text-[#3F483E] hover:text-[#1E251F] focus-visible:outline-none focus-visible:text-[#1E251F] transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] rounded-full bg-[#3A4F37] origin-center scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 ease-out"
                />
              </a>
            ))}
          </nav>

          {/* Zone 3: Language Selector + Primary CTA Action + Mobile/Tablet Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="inline-flex items-center gap-0.5 p-0.5 sm:p-1 h-8 sm:h-9 bg-[#EFECE4] border border-[#E2DBD0] rounded-lg">
              {(['sl', 'en', 'de', 'hr'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  aria-label={`Jezik ${l.toUpperCase()}`}
                  className={`h-full px-2 sm:px-2.5 flex items-center text-[11px] sm:text-xs font-semibold uppercase rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    lang === l
                      ? 'bg-[#FAF8F4] text-[#1E251F] shadow-xs'
                      : 'text-[#5C645A] hover:text-[#1E251F]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hidden sm:inline-flex items-center gap-1.5 h-8 sm:h-9 px-3.5 text-xs font-medium text-[#2C352B] bg-[#FAF8F4] border border-[#D5CDBE] rounded-lg hover:bg-[#EFECE4] hover:border-[#3A4F37]/50 hover:text-[#1E251F] transition-colors whitespace-nowrap shrink-0"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#3A4F37] shrink-0" aria-hidden="true" />
              <span>{copy.ctaBook}</span>
            </a>

            {/* Mobile & Tablet Hamburger Toggle Button (< lg) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Zapri meni' : 'Odpri meni'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden h-8 sm:h-9 w-8 sm:w-9 rounded-lg text-[#1E251F] bg-[#FAF8F4] hover:bg-[#EFECE4] border border-[#E2DBD0] transition-colors cursor-pointer focus:outline-none flex items-center justify-center shrink-0"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E251F]" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E251F]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Dropdown Navigation Drawer (< lg) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E5DFD3] bg-[#FAF8F4]/98 backdrop-blur-xl shadow-2xl transition-all duration-300">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-4 flex flex-col gap-3">
              {/* Navigation links */}
              <nav className="flex flex-col gap-1">
                {[
                  { href: '#estate', label: copy.navEstate },
                  { href: '#services', label: copy.navServices },
                  { href: '#contact', label: copy.navContact },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-sm sm:text-base font-medium text-[#2E382F] hover:bg-[#EFECE4] active:bg-[#E2DBD0] transition-colors"
                  >
                    <span>{item.label}</span>
                    <span className="text-[#6E7D5E] text-sm">→</span>
                  </a>
                ))}
              </nav>

              {/* Primary CTA inside drawer on compact mobile (< sm) */}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="sm:hidden w-full py-2.5 px-4 rounded-xl bg-[#3A4F37] hover:bg-[#2E402B] text-[#FAF8F4] text-xs font-medium text-center transition-colors shadow-xs"
              >
                {copy.ctaBook}
              </a>

              {/* Direct Quick Contact Buttons */}
              <div className="pt-3 border-t border-[#E5DFD3] flex flex-wrap items-center gap-2">
                <a
                  href={`tel:${CONTACT_INFO.phoneMainHref}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 min-w-[150px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#D5CDBE] bg-white/70 text-xs font-medium text-[#1E251F] hover:bg-[#EFECE4] transition-colors whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5 text-[#3A4F37] shrink-0" />
                  <span>{CONTACT_INFO.phoneMainDisplay}</span>
                </a>
                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl border border-[#3A4F37]/30 bg-[#3A4F37]/10 text-xs font-medium text-[#3A4F37] hover:bg-[#3A4F37]/20 transition-colors whitespace-nowrap"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* FULL-SCREEN EDGE-TO-EDGE HERO PHOTOGRAPH */}
        <section
          ref={heroRef}
          className="relative w-full min-h-[calc(100vh-76px)] flex flex-col justify-between overflow-hidden bg-[#1E251F]"
        >
          {/* Full-bleed background photograph */}
          <div className="absolute inset-0">
            <ResilientImage
              src={HERO_SLIDES[heroSlideIdx].src}
              alt={HERO_SLIDES[heroSlideIdx].caption[lang]}
              loading="eager"
              containerClassName="w-full h-full"
              className="w-full h-full object-cover object-[center_52%] brightness-[1.02] contrast-[1.04] saturate-[1.03] transition-all duration-300"
            />
            {/* Subtle radial vignette for crisp white typography while keeping the villa & pool vivid */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(12,18,12,0.44)_0%,rgba(12,18,12,0.16)_52%,transparent_80%)] pointer-events-none" />
          </div>

          {/* Centered Classical Editorial Title, Ornamental Flourish & Subtitle */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
            <h1 className="inline-flex flex-col items-end text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.58)]">
              <span className="font-script font-normal text-[clamp(3.75rem,8.4vw,6.85rem)] leading-[0.95] tracking-[0.01em] pr-1">
                Leonardo
              </span>
              <span className="font-logo-sans font-normal text-sm sm:text-base md:text-lg uppercase tracking-[0.34em] text-white/95 -mt-1.5 sm:-mt-2.5 pr-1">
                HOUSE
              </span>
            </h1>

            {/* Symmetrical Classical Botanical Flourish Divider */}
            <svg
              viewBox="0 0 280 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-52 sm:w-64 h-auto my-3.5 sm:my-4 text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.55)]"
            >
              {/* Left scrolled stem */}
              <path
                d="M14 12C11.5 12 10 13.8 11.2 15.2C12.3 16.4 14.5 15.4 14.2 13.6C13.9 12.1 12.2 11.8 10 12H112C116 12 118.5 10.2 120.5 8.5C121.8 7.4 123.5 8 123 9.4C122.4 10.9 119.5 12 115 12"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Right mirrored scrolled stem */}
              <path
                d="M266 12C268.5 12 270 13.8 268.8 15.2C267.7 16.4 265.5 15.4 265.8 13.6C266.1 12.1 267.8 11.8 270 12H168C164 12 161.5 10.2 159.5 8.5C158.2 7.4 156.5 8 157 9.4C157.6 10.9 160.5 12 165 12"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Centered botanical fleuron / blossom */}
              <path
                d="M140 5.5C142.2 8.4 143 11.2 140 14.2C137 11.2 137.8 8.4 140 5.5Z"
                fill="currentColor"
              />
              <path
                d="M139.2 14.2C135.8 13.8 133.2 11.6 132.4 8.8C135.6 9.3 138 11.4 139.2 14.2Z"
                fill="currentColor"
              />
              <path
                d="M140.8 14.2C144.2 13.8 146.8 11.6 147.6 8.8C144.4 9.3 142 11.4 140.8 14.2Z"
                fill="currentColor"
              />
              <circle cx="140" cy="17.2" r="1.3" fill="currentColor" />
              <circle cx="127.5" cy="12" r="1.2" fill="currentColor" />
              <circle cx="152.5" cy="12" r="1.2" fill="currentColor" />
            </svg>

            <p className="font-serif small-caps font-normal text-sm sm:text-base md:text-[17px] tracking-[0.18em] text-white/95 max-w-2xl leading-relaxed drop-shadow-[0_1px_12px_rgba(0,0,0,0.6)]">
              {copy.heroTitle}
            </p>
          </div>

          {/* Bottom Bar inside Fullscreen Hero: Slide Controls */}
          <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-10 pb-6 sm:pb-8 flex flex-wrap items-end justify-end gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setHeroSlideIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                }
                aria-label="Prejšnja fotografija"
                className="p-2.5 rounded-lg bg-[#141C10]/65 hover:bg-[#141C10]/85 text-white border border-white/20 backdrop-blur-md transition-colors cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setHeroSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length)}
                aria-label="Naslednja fotografija"
                className="p-2.5 rounded-lg bg-[#141C10]/65 hover:bg-[#141C10]/85 text-white border border-white/20 backdrop-blur-md transition-colors cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* POST-HERO CONTENT WRAPPER WITH SCROLL-DRIVEN OLIVE LINE-ART BACKGROUND */}
        <div className="relative overflow-x-clip">
          <OliveBranchScrollBg heroRef={heroRef} />

          {/* INTRODUCTORY SHOWCASE & FULL-WIDTH SPECIFICATIONS BAR */}
          <section className="relative overflow-hidden py-14 lg:py-16 bg-[#FAF8F4]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <p className="font-calligraphy italic font-medium text-xl sm:text-[23px] lg:text-[25px] text-[#283227] leading-[1.6] tracking-[0.01em]">
                {copy.heroBody}
              </p>
            </div>

            <div className="relative bg-white border border-[#E5DDD0] border-t-2 border-t-[#C9BA7B]/85 rounded-xl px-4 py-6 sm:px-6 lg:px-4 lg:py-8 shadow-[0_14px_40px_rgba(30,37,31,0.035)] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-4 lg:gap-0">
              {copy.metrics.map((metric, idx) => {
                const MetricIcon = METRIC_ICONS[idx] ?? Sun;
                return (
                  <div
                    key={metric.label}
                    className="group relative flex flex-col items-center text-center px-2 lg:px-4 transition-colors"
                  >
                    {idx < copy.metrics.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="hidden lg:block absolute right-0 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-[#DDD3BE] to-transparent"
                      />
                    )}
                    <MetricIcon
                      className="w-[18px] h-[18px] text-[#9A804B] group-hover:text-[#3A4F37] transition-colors duration-300"
                      strokeWidth={1.3}
                      aria-hidden="true"
                    />
                    <span
                      aria-hidden="true"
                      className="w-5 h-px bg-[#C9BA7B]/75 my-2.5 group-hover:w-8 group-hover:bg-[#3A4F37]/60 transition-all duration-300"
                    />
                    <div className="font-serif text-xl sm:text-[23px] lg:text-[25px] font-medium text-[#1E251F] tracking-[-0.01em] leading-none tabular-nums">
                      {metric.value}
                    </div>
                    <div className="mt-2 text-[11px] sm:text-xs font-normal text-[#5C645A] leading-relaxed max-w-[17ch]">
                      {metric.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 01: ESTATE & TWO SEPARATE HOUSES */}
        <section id="estate" className="relative overflow-hidden py-14 sm:py-18 lg:py-28 bg-[#FAF8F4]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(58,79,55,0.055),transparent_42%)]"
          />

          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
            <div className="max-w-3xl mb-7 sm:mb-10">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#1E251F] leading-[1.15]">
                {copy.storyHeading}
              </h2>
              <div aria-hidden="true" className="w-14 h-0.5 bg-[#3A4F37] rounded-full mt-4" />
            </div>

            {/* Mobile & Tablet (< lg): Dedicated Vertical Cards with Swipeable 16:10 Photo Galleries */}
            <div className="lg:hidden space-y-5">
              <MobileEstateUnitCard
                indexLabel="01 / 03"
                title={copy.houseTabs.house1}
                description={
                  lang === 'sl'
                    ? 'Glavna hiška ponuja dve udobni spalnici z zatemnitvenimi senčili in komarniki, popolnoma opremljeno kuhinjo (pomivalni stroj, električni štedilnik, pečica, velik hladilnik z zamrzovalnikom, kavni aparat, grelnik vode, toaster), prijeten dnevni prostor s TV-jem ter sodobno kopalnico z brezplačnim pralnim strojem.'
                    : 'The main house features two comfortable bedrooms with room-darkening shades and mosquito nets, a fully equipped kitchen (dishwasher, oven, electric stove, full fridge/freezer, coffee maker, kettle, toaster), a stylish living and dining area with TV, and a modern bathroom with a free washing machine.'
                }
                specs={[
                  { label: 'Spalnici', value: '2 ločeni spalnici z omarami in posteljnino' },
                  { label: 'Kuhinja & Dnevna soba', value: 'Pomivalni stroj, pečica, kavni aparat, klima' },
                  { label: 'Kopalnica & Pralnica', value: 'Tuš, pralni stroj, sušilnik za lase, brisače' },
                  { label: 'Zunanji izhod', value: 'Neposreden dostop na pokrito teraso z žarom' },
                ]}
                photos={HOUSE1_PHOTOS.slice(0, 4)}
              />

              <MobileEstateUnitCard
                indexLabel="02 / 03"
                title={copy.houseTabs.house2}
                description={
                  lang === 'sl'
                    ? 'Druga, manjša hiška stoji ločeno ob bazenu in nudi popolno zasebnost za par, starejše starše ali prijatelje. Vključuje udobno zakonsko posteljo, priročen kotiček z malim hladilnikom, mikrovalovno pečico in TV-jem ter lastno sodobno kopalnico s tušem in WC-jem.'
                    : 'The second, smaller house stands separately beside the pool, offering complete privacy for a couple, grandparents, or friends. It includes a comfortable double bed, a convenient kitchenette corner with a mini refrigerator, microwave, and TV, plus its own private bathroom.'
                }
                specs={[
                  { label: 'Spalni del', value: 'Udobna zakonska postelja, sveža posteljnina' },
                  { label: 'Oprema v sobi', value: 'Mali hladilnik, mikrovalovna pečica, TV, Wi-Fi' },
                  { label: 'Lastna kopalnica', value: 'Zasebni tuš, WC, topla voda in brisače' },
                  { label: 'Položaj', value: 'Korak stran od ogrevanega bazena in oljčnika' },
                ]}
                photos={HOUSE2_PHOTOS}
              />

              <MobileEstateUnitCard
                indexLabel="03 / 03"
                title={copy.houseTabs.estate}
                description={
                  lang === 'sl'
                    ? 'Osrednji del posestva predstavlja solarno ogrevan zunanji bazen z ležalniki, senčnikoma in zunanjo prho. Ob hiši se razprostira pokrita terasa z veliko jedilno mizo in kaminom na drva, celotno posest pa obdajajo oljke, fige, cvetlične grede ter otroško igrišče s trampolinom.'
                    : 'At the heart of the estate lies the solar-heated outdoor pool with sunbeds, umbrellas, and an outdoor shower. Beside the main house is a covered terrace with a large dining table and wood-burning fireplace, surrounded by olive trees, figs, and a children’s play lawn.'
                }
                specs={[
                  { label: 'Ogrevan bazen', value: 'Sezonsko ogrevan, ležalniki, senčnika, zunanji tuš' },
                  { label: 'Pokrita terasa & BBQ', value: 'Velika miza, kamin na drva, viseči počivalnik' },
                  { label: 'Oljčni nasad', value: 'Možnost degustacije domačega oljčnega olja' },
                  { label: 'Pokrito parkirišče', value: 'Varno parkiranje v senci znotraj ograje' },
                ]}
                photos={ESTATE_PHOTOS.slice(0, 4)}
              />
            </div>

            {/* Desktop (>= lg): Unchanged Interactive Two-House & Estate Tabbed Explorer */}
            <div id="houses" className="hidden lg:block bg-[#F4F0E8] border border-[#E2DBD0] rounded-2xl p-6 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E2DBD0]">
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1.5 bg-[#E8E2D5] border border-[#DDD4C4] rounded-xl">
                  {HOUSE_TAB_KEYS.map((tabKey) => (
                    <button
                      key={tabKey}
                      type="button"
                      onClick={() => setActiveHouseTab(tabKey)}
                      className={`w-full px-5 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-[15px] font-medium rounded-lg transition-all text-center whitespace-nowrap cursor-pointer ${
                        activeHouseTab === tabKey
                          ? 'bg-[#FAF8F4] text-[#1E251F] shadow-[0_4px_14px_rgba(30,37,31,0.08)] border border-[#DDD4C4]/80'
                          : 'text-[#4E574C] hover:text-[#1E251F] hover:bg-[#FAF8F4]/45 border border-transparent'
                      }`}
                    >
                      {copy.houseTabs[tabKey]}
                    </button>
                  ))}
                </div>
              </div>

              {activeHouseTab === 'house1' && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E251F]">
                        {copy.houseTabs.house1}
                      </h3>
                      <p className="mt-3 text-sm sm:text-base text-[#4A5348] leading-relaxed">
                        {lang === 'sl'
                          ? 'Glavna hiška ponuja dve udobni spalnici z zatemnitvenimi senčili in komarniki, popolnoma opremljeno kuhinjo (pomivalni stroj, električni štedilnik, pečica, velik hladilnik z zamrzovalnikom, kavni aparat, grelnik vode, toaster), prijeten dnevni prostor s TV-jem ter sodobno kopalnico z brezplačnim pralnim strojem.'
                          : 'The main house features two comfortable bedrooms with room-darkening shades and mosquito nets, a fully equipped kitchen (dishwasher, oven, electric stove, full fridge/freezer, coffee maker, kettle, toaster), a stylish living and dining area with TV, and a modern bathroom with a free washing machine.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E2DBD0] grid grid-cols-2 gap-4 text-xs text-[#3D463B]">
                      <div>
                        <div className="font-semibold text-[#1E251F]">Spalnici</div>
                        <div className="mt-0.5 text-[#5C645A]">2 ločeni spalnici z omarami in posteljnino</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1E251F]">Kuhinja & Dnevna soba</div>
                        <div className="mt-0.5 text-[#5C645A]">Pomivalni stroj, pečica, kavni aparat, klima</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1E251F]">Kopalnica & Pralnica</div>
                        <div className="mt-0.5 text-[#5C645A]">Tuš, pralni stroj, sušilnik za lase, brisače</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1E251F]">Zunanji izhod</div>
                        <div className="mt-0.5 text-[#5C645A]">Neposreden dostop na pokrito teraso z žarom</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                    {HOUSE1_PHOTOS.slice(0, 4).map((photo) => (
                      <EstatePhotoCard key={photo.src} src={photo.src} alt={photo.alt} />
                    ))}
                  </div>
                </div>
              )}

              {activeHouseTab === 'house2' && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E251F]">
                        {copy.houseTabs.house2}
                      </h3>
                      <p className="mt-3 text-sm sm:text-base text-[#4A5348] leading-relaxed">
                        {lang === 'sl'
                          ? 'Druga, manjša hiška stoji ločeno ob bazenu in nudi popolno zasebnost za par, starejše starše ali prijatelje. Vključuje udobno zakonsko posteljo, priročen kotiček z malim hladilnikom, mikrovalovno pečico in TV-jem ter lastno sodobno kopalnico s tušem in WC-jem.'
                          : 'The second, smaller house stands separately beside the pool, offering complete privacy for a couple, grandparents, or friends. It includes a comfortable double bed, a convenient kitchenette corner with a mini refrigerator, microwave, and TV, plus its own private bathroom.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E2DBD0] grid grid-cols-2 gap-4 text-xs text-[#3D463B]">
                      <div>
                        <div className="font-semibold text-[#1E251F]">Spalni del</div>
                        <div className="mt-0.5 text-[#5C645A]">Udobna zakonska postelja, sveža posteljnina</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1E251F]">Oprema v sobi</div>
                        <div className="mt-0.5 text-[#5C645A]">Mali hladilnik, mikrovalovna pečica, TV, Wi-Fi</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1E251F]">Lastna kopalnica</div>
                        <div className="mt-0.5 text-[#5C645A]">Zasebni tuš, WC, topla voda in brisače</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1E251F]">Položaj</div>
                        <div className="mt-0.5 text-[#5C645A]">Korak stran od ogrevanega bazena in oljčnika</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                    {HOUSE2_PHOTOS.map((photo) => (
                      <EstatePhotoCard key={photo.src} src={photo.src} alt={photo.alt} />
                    ))}
                  </div>
                </div>
              )}

              {activeHouseTab === 'estate' && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1E251F]">
                        {copy.houseTabs.estate}
                      </h3>
                      <p className="mt-3 text-sm sm:text-base text-[#4A5348] leading-relaxed">
                        {lang === 'sl'
                          ? 'Osrednji del posestva predstavlja solarno ogrevan zunanji bazen z ležalniki, senčnikoma in zunanjo prho. Ob hiši se razprostira pokrita terasa z veliko jedilno mizo in kaminom na drva, celotno posest pa obdajajo oljke, fige, cvetlične grede ter otroško igrišče s trampolinom.'
                          : 'At the heart of the estate lies the solar-heated outdoor pool with sunbeds, umbrellas, and an outdoor shower. Beside the main house is a covered terrace with a large dining table and wood-burning fireplace, surrounded by olive trees, figs, and a children’s play lawn.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E2DBD0] grid grid-cols-2 gap-4 text-xs text-[#3D463B]">
                      <div>
                        <div className="font-semibold text-[#1E251F]">Ogrevan bazen</div>
                        <div className="mt-0.5 text-[#5C645A]">Sezonsko ogrevan, ležalniki, senčnika, zunanji tuš</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1E251F]">Pokrita terasa & BBQ</div>
                        <div className="mt-0.5 text-[#5C645A]">Velika miza, kamin na drva, viseči počivalnik</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1E251F]">Oljčni nasad</div>
                        <div className="mt-0.5 text-[#5C645A]">Možnost degustacije domačega oljčnega olja</div>
                      </div>
                      <div>
                        <div className="font-semibold text-[#1E251F]">Pokrito parkirišče</div>
                        <div className="mt-0.5 text-[#5C645A]">Varno parkiranje v senci znotraj ograje</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                    {ESTATE_PHOTOS.slice(0, 4).map((photo) => (
                      <EstatePhotoCard key={photo.src} src={photo.src} alt={photo.alt} />
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* SECTION: WHY CHOOSE LEONARDO HOUSE — FULL-HEIGHT EDITORIAL SPLIT */}
        <section id="why-leonardo" className="relative z-10 overflow-hidden border-t border-[#E2DACB] bg-gradient-to-br from-[#EFEAE0] via-[#EAE3D5] to-[#F3EDE2]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(196,174,114,0.16),transparent_55%),radial-gradient(ellipse_at_85%_85%,rgba(154,128,75,0.10),transparent_52%)]"
          />

          {/* Mobile & Tablet (< lg): Inline Accordion with Swipeable Photo Gallery & Readable Captions */}
          <div className="lg:hidden relative z-10 px-5 sm:px-8 py-14 sm:py-16">
            <div className="mb-7">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1E251F] leading-[1.15]">
                {copy.featuresTitle}
              </h2>
              <div aria-hidden="true" className="w-14 h-0.5 bg-[#9A804B] rounded-full mt-4" />
            </div>

            <div className="flex flex-col gap-3">
              {copy.featuresList.map((feat, idx) => {
                const isExpanded = idx === mobileActiveFeatureIdx;
                const gallery = FEATURE_GALLERIES[idx] ?? FEATURE_GALLERIES[0];

                return (
                  <div
                    key={feat.num}
                    ref={(el) => {
                      mobileFeatureCardRefs.current[idx] = el;
                    }}
                    className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                      isExpanded
                        ? 'bg-[#FAF8F4] border-[#9A804B] shadow-[0_10px_28px_rgba(30,37,31,0.08)]'
                        : 'bg-[#FAF8F4] border-[#DDD4C4]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleMobileFeatureToggle(idx)}
                      aria-expanded={isExpanded}
                      className="w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-2.5 cursor-pointer focus:outline-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-[46px] h-[46px] flex items-center justify-center shrink-0 transition-colors ${
                            isExpanded ? 'text-[#9A804B]' : 'text-[#3A4F37]/85'
                          }`}
                        >
                          <FeatureAnimatedIcon index={idx} isActive={isExpanded} />
                        </span>
                        <span
                          className={`font-serif text-[15px] sm:text-base leading-snug ${
                            isExpanded ? 'font-semibold text-[#1E251F]' : 'font-normal text-[#3D453B]'
                          }`}
                        >
                          {feat.title}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90 text-[#9A804B]' : 'text-[#8B867C]'
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {isExpanded && (
                      <div className="border-t border-[#E5DEC9]">
                        {/* Swipeable Inline Photo Slider */}
                        <div className="relative w-full aspect-[16/10] bg-[#EAE4D7] overflow-hidden">
                          <div
                            ref={mobileFeatureSliderRef}
                            onScroll={handleMobileFeatureSliderScroll}
                            onTouchStart={() => {
                              mobileFeatureTargetSlideRef.current = null;
                            }}
                            className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                          >
                            {gallery.map((slide) => (
                              <div key={slide.img} className="w-full h-full shrink-0 snap-start relative">
                                <ResilientImage
                                  src={slide.img.replace('/images/villa/', '/images/villa/lightbox/')}
                                  variant="full"
                                  loading="eager"
                                  alt={slide.title[lang]}
                                  width={960}
                                  height={600}
                                  containerClassName="w-full h-full"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>

                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#141A13]/45 to-transparent"
                          />

                          {gallery.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={() => scrollMobileFeatureSlide(mobileFeatureSlideIdx - 1)}
                                disabled={mobileFeatureSlideIdx === 0}
                                aria-label="Prejšnja slika"
                                className={`absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#141A13]/45 backdrop-blur-xs text-white flex items-center justify-center transition-opacity ${
                                  mobileFeatureSlideIdx === 0 ? 'opacity-30 cursor-default' : 'opacity-90 active:scale-95'
                                }`}
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => scrollMobileFeatureSlide(mobileFeatureSlideIdx + 1)}
                                disabled={mobileFeatureSlideIdx >= gallery.length - 1}
                                aria-label="Naslednja slika"
                                className={`absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#141A13]/45 backdrop-blur-xs text-white flex items-center justify-center transition-opacity ${
                                  mobileFeatureSlideIdx >= gallery.length - 1
                                    ? 'opacity-30 cursor-default'
                                    : 'opacity-90 active:scale-95'
                                }`}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>

                              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                                {gallery.map((slide, sIdx) => (
                                  <button
                                    key={slide.img}
                                    type="button"
                                    onClick={() => scrollMobileFeatureSlide(sIdx)}
                                    aria-label={`Slika ${sIdx + 1} od ${gallery.length}`}
                                    className={`h-[3px] rounded-full transition-all duration-200 ${
                                      sIdx === mobileFeatureSlideIdx ? 'w-7 bg-[#FAF8F4]' : 'w-4 bg-white/50'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Directly Readable Caption & Description on Touch Devices (constant height, zero flicker) */}
                        <div className="px-4 py-3.5 bg-[#FAF8F4]">
                          <div className="grid">
                            {gallery.map((slide, sIdx) => {
                              const isCurrentSlide = sIdx === mobileFeatureSlideIdx;
                              return (
                                <div
                                  key={slide.img}
                                  aria-hidden={!isCurrentSlide}
                                  className={`col-start-1 row-start-1 ${
                                    isCurrentSlide
                                      ? 'opacity-100 visible'
                                      : 'opacity-0 invisible pointer-events-none select-none'
                                  }`}
                                >
                                  <div className="flex items-baseline justify-between gap-2">
                                    <h3 className="font-serif text-base font-semibold text-[#1E251F] leading-snug">
                                      {slide.title[lang]}
                                    </h3>
                                    <span className="text-[11px] font-medium tabular-nums text-[#7C7567] shrink-0">
                                      {sIdx + 1} / {gallery.length}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs sm:text-sm text-[#4A5348] leading-relaxed">
                                    {slide.desc[lang]}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                          <p className="mt-2.5 pt-2.5 border-t border-[#ECE5D8] text-xs text-[#61695E] leading-relaxed">
                            {feat.desc}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop (>= lg): Unchanged Full-Height Editorial Split */}
          <div className="hidden lg:flex relative z-10 w-full flex-row items-stretch">
            {/* Left Half (~45%): Shifted Further Left & Flush-Aligned Title, Subtitle + Feature Strips */}
            <div className="relative z-20 w-full lg:w-[45%] px-6 sm:px-10 lg:pl-12 xl:pl-20 2xl:pl-28 lg:pr-10 xl:pr-14 py-16 lg:py-24 flex flex-col justify-center">
              <div className="mb-7">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] xl:text-[42px] font-semibold text-[#1E251F] leading-[1.15]">
                  {copy.featuresTitle}
                </h2>
                <div aria-hidden="true" className="w-14 h-0.5 bg-[#9A804B] rounded-full mt-4" />
              </div>

              <div className="flex flex-col gap-1.5">
                {copy.featuresList.map((feat, idx) => {
                  const isActive = idx === activeFeatureIdx;
                  return (
                    <button
                      key={feat.num}
                      type="button"
                      onClick={() => setActiveFeatureIdx(idx)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`group w-full text-left px-3.5 py-2 rounded-xl border transition-all duration-200 flex items-center justify-between gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9A804B] ${
                        isActive
                          ? 'bg-[#FAF8F4] border-[#9A804B] shadow-[0_8px_22px_rgba(30,37,31,0.07)]'
                          : 'bg-[#FAF8F4] border-[#DDD4C4] hover:bg-white hover:border-[#C4B79E]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-[52px] h-[52px] flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? 'text-[#9A804B]'
                              : 'text-[#3A4F37]/80 group-hover:text-[#9A804B]'
                          }`}
                        >
                          <FeatureAnimatedIcon index={idx} isActive={isActive} />
                        </span>
                        <div
                          className={`font-serif text-sm sm:text-[15px] font-normal leading-snug truncate transition-colors ${
                            isActive ? 'text-[#1E251F]' : 'text-[#3D453B]'
                          }`}
                        >
                          {feat.title}
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                          isActive
                            ? 'text-[#9A804B] translate-x-0.5'
                            : 'text-[#8B867C] group-hover:text-[#9A804B]'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Half (~55%): Edge-to-Edge Full-Height Single-Photo Slider (Zero Border Radius) */}
            <div className="w-full lg:w-[55%] relative min-h-[340px] sm:min-h-[420px] lg:min-h-0">
              <div className="relative w-full h-[340px] sm:h-[420px] lg:h-full lg:absolute lg:inset-0">
                <button
                  type="button"
                  onClick={() => scrollFeatureSlider(-1)}
                  disabled={!featureCanScrollPrev}
                  aria-label="Prejšnja slika prednosti"
                  className={`group/arrow absolute left-8 sm:left-11 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border backdrop-blur-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D5C37E] ${
                    featureCanScrollPrev
                      ? 'bg-[#141A13]/25 hover:bg-[#141A13]/55 border-white/25 hover:border-white/55 text-white/85 hover:text-white opacity-80 hover:opacity-100 cursor-pointer'
                      : 'bg-[#141A13]/12 border-white/10 text-white/40 opacity-35 cursor-default'
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-200 ${
                      featureCanScrollPrev ? 'group-hover/arrow:-translate-x-0.5' : ''
                    }`}
                  >
                    <path
                      d="M15 5 L8 12 L15 19"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => scrollFeatureSlider(1)}
                  disabled={!featureCanScrollNext}
                  aria-label="Naslednja slika prednosti"
                  className={`group/arrow absolute right-8 sm:right-11 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border backdrop-blur-xs transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D5C37E] ${
                    featureCanScrollNext
                      ? 'bg-[#141A13]/25 hover:bg-[#141A13]/55 border-white/25 hover:border-white/55 text-white/85 hover:text-white opacity-80 hover:opacity-100 cursor-pointer'
                      : 'bg-[#141A13]/12 border-white/10 text-white/40 opacity-35 cursor-default'
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-transform duration-200 ${
                      featureCanScrollNext ? 'group-hover/arrow:translate-x-0.5' : ''
                    }`}
                  >
                    <path
                      d="M9 5 L16 12 L9 19"
                      stroke="currentColor"
                      strokeWidth={1.75}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  ref={featureSliderRef}
                  onScroll={updateFeatureScrollState}
                  onMouseDown={handleFeatureMouseDown}
                  onMouseMove={handleFeatureMouseMove}
                  onMouseUp={handleFeatureDragEnd}
                  onMouseLeave={handleFeatureDragEnd}
                  onDragStart={(e) => e.preventDefault()}
                  className={`w-full h-full grid grid-flow-col auto-cols-[100%] gap-0 overflow-x-auto select-none [&_img]:pointer-events-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                    isDraggingFeature
                      ? 'cursor-grabbing scroll-auto snap-none'
                      : 'cursor-grab scroll-smooth snap-x snap-mandatory'
                  }`}
                >
                  {activeFeatureGallery.map((slide) => (
                    <div
                      key={slide.img}
                      tabIndex={0}
                      className="group relative w-full h-full snap-start rounded-none overflow-hidden bg-[#EAE4D7] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#9A804B]"
                    >
                      <ResilientImage
                        src={slide.img.replace('/images/villa/', '/images/villa/lightbox/')}
                        variant="full"
                        alt={slide.title[lang]}
                        width={1280}
                        height={854}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover sepia-[0.14] saturate-[1.06] contrast-[0.98] transition-all duration-500 ease-out group-hover:scale-[1.04] group-hover:sepia-0 group-hover:saturate-100 group-hover:contrast-100 group-focus-within:scale-[1.04] group-focus-within:sepia-0"
                      />

                      {/* Gentle warm Mediterranean film tint before hover */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#6B542F]/20 via-[#D5C37E]/12 to-[#3A4F37]/10 opacity-100 group-hover:opacity-0 group-focus-within:opacity-0 transition-opacity duration-300"
                      />

                      {/* Subtle bottom scrim so slide progress bars stay crisp */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#141A13]/45 to-transparent"
                      />

                      {/* Dark backdrop on hover for crisp caption readability */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-[#141A13]/58 group-focus-within:bg-[#141A13]/58 transition-colors duration-300"
                      />

                      {/* Inset clockwise drawing white border lines */}
                      <div aria-hidden="true" className="pointer-events-none absolute inset-5 sm:inset-7 z-10">
                        <span className="absolute top-0 left-0 right-0 h-px bg-white/95 origin-left scale-x-0 group-hover:scale-x-100 group-focus-within:scale-x-100 transition-transform duration-200 ease-out delay-0 group-hover:delay-0" />
                        <span className="absolute top-0 right-0 bottom-0 w-px bg-white/95 origin-top scale-y-0 group-hover:scale-y-100 group-focus-within:scale-y-100 transition-transform duration-200 ease-out delay-0 group-hover:delay-100" />
                        <span className="absolute bottom-0 left-0 right-0 h-px bg-white/95 origin-right scale-x-0 group-hover:scale-x-100 group-focus-within:scale-x-100 transition-transform duration-200 ease-out delay-0 group-hover:delay-200" />
                        <span className="absolute top-0 left-0 bottom-0 w-px bg-white/95 origin-bottom scale-y-0 group-hover:scale-y-100 group-focus-within:scale-y-100 transition-transform duration-200 ease-out delay-0 group-hover:delay-300" />
                      </div>

                      {/* Centered short title + concise description on hover */}
                      <div className="pointer-events-none absolute inset-8 sm:inset-12 px-14 sm:px-20 z-20 flex flex-col items-center justify-center text-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-300 ease-out delay-0 group-hover:delay-100">
                        <h3 className="font-serif small-caps text-lg sm:text-2xl font-medium tracking-[0.08em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)] leading-snug">
                          {slide.title[lang]}
                        </h3>
                        <span aria-hidden="true" className="w-10 h-px bg-[#D5C37E]/85 my-3" />
                        <p className="text-xs sm:text-sm text-white/95 leading-relaxed max-w-md drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]">
                          {slide.desc[lang]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {activeFeatureGallery.length > 1 && (
                  <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                    {activeFeatureGallery.map((slide, sIdx) => {
                      const isCurrent = sIdx === activeFeatureSlideIdx;
                      return (
                        <button
                          key={slide.img}
                          type="button"
                          onClick={() => scrollToFeatureSlide(sIdx)}
                          aria-label={`Slika ${sIdx + 1} od ${activeFeatureGallery.length}`}
                          aria-current={isCurrent ? 'true' : undefined}
                          className={`h-[3px] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D5C37E] ${
                            isCurrent
                              ? 'w-10 bg-[#FAF8F4] shadow-[0_1px_4px_rgba(0,0,0,0.5)]'
                              : 'w-6 bg-white/45 hover:bg-white/80'
                          }`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 02: COMPLETE SERVICES, AMENITIES & HOUSE RULES */}
        <section id="services" className="relative overflow-hidden py-20 lg:py-28 border-t border-[#E5DFD3] bg-[#FAF8F4]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.85),transparent_60%)]"
          />

          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
            <div className="max-w-3xl mb-8">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-semibold text-[#1E251F] leading-[1.15]">
                {copy.servicesHeading}
              </h2>
              <div aria-hidden="true" className="w-14 h-0.5 bg-[#3A4F37] rounded-full mt-4" />
            </div>

            {/* Complete Categorized Amenities Grid (All 4 Categories Visible at Once) */}
            <div className="mb-14">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5 items-stretch">
                {AMENITY_GROUPS.map((group) => (
                  <article
                    key={group.id}
                    className="group relative h-full bg-white border border-[#E4DDD0] rounded-2xl p-5 flex flex-col shadow-[0_8px_22px_rgba(30,37,31,0.035)] hover:shadow-[0_14px_32px_rgba(30,37,31,0.075)] transition-shadow duration-300"
                  >
                    <CardHoverOliveBorder borderRadius={16} strokeWidth={2} />

                    <div className="flex flex-col items-start gap-2.5 pb-3.5 border-b border-[#E6DFD1] xl:min-h-[132px]">
                      <AmenityAnimatedIcon groupId={group.id} />
                      <div className="min-w-0">
                        <h4 className="font-serif text-lg sm:text-[19px] font-semibold text-[#1E251F] leading-snug">
                          {group.title[lang]}
                        </h4>
                      </div>
                    </div>

                    <ul className="mt-2.5 divide-y divide-[#EFE9DC] flex-1">
                      {group.items.map((item) => (
                        <li
                          key={item.label.sl}
                          className="py-2 first:pt-1.5 last:pb-0 flex items-start gap-2.5"
                        >
                          <span className="mt-0.5 w-4 h-4 rounded-full bg-[#3A4F37]/10 text-[#3A4F37] flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[2.5]" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-[13px] font-medium text-[#1E251F] leading-snug">
                              {item.label[lang]}
                            </div>
                            <div className="text-[11.5px] text-[#565E54] leading-snug mt-0.5">
                              {item.value[lang]}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 pt-3 border-t border-[#E6DFD1] flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#9A804B] shrink-0"
                      />
                      <p className="text-xs text-[#4E574C] leading-relaxed">
                        {group.subtitle[lang]}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Property Location & Nearby Distances (5 cols) + House Rules (7 cols, wider, equal height) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
              {/* Location & Distances */}
              <div className="lg:col-span-5 bg-white border border-[#E4DDD0] rounded-2xl p-6 sm:p-7 shadow-[0_6px_24px_rgba(30,37,31,0.04)] flex flex-col justify-between h-full">
                <div className="flex items-center gap-3.5 pb-4 border-b border-[#E2DBD0]">
                  <span className="inline-flex items-center justify-center shrink-0">
                    <AmenityAnimatedIcon groupId="location" />
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1E251F]">
                    {copy.locationTitle}
                  </h3>
                </div>

                <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 flex-1 content-center">
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-[#787F75]">Lokacija / Naslov</div>
                    <div className="mt-1.5 text-sm sm:text-[15px] font-medium text-[#1E251F]">
                      Paolija 16a, 52466 Bužinija
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-[#787F75]">Center Novigrada</div>
                    <div className="mt-1.5 font-mono text-sm sm:text-[15px] font-medium text-[#1E251F] tabular-nums">
                      2,5 km
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-[#787F75]">Aquapark Istralandia</div>
                    <div className="mt-1.5 font-mono text-sm sm:text-[15px] font-medium text-[#1E251F] tabular-nums">
                      5,5 km (7 min)
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.12em] text-[#787F75]">Srednjeveški Motovun</div>
                    <div className="mt-1.5 font-mono text-sm sm:text-[15px] font-medium text-[#1E251F] tabular-nums">
                      28 km (25 min)
                    </div>
                  </div>
                </div>
              </div>

              {/* House Rules (Wider module, equal height, preserved dark olive & gold palette) */}
              <div className="group relative lg:col-span-7 flex flex-col justify-between h-full p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#32442F] via-[#293827] to-[#212E1F] border border-[#43583F] shadow-[inset_0_2px_0_0_#C9BA7B,0_18px_42px_rgba(24,33,22,0.22)]">
                <CardHoverOliveBorder borderRadius={16} strokeWidth={2} color="#D5C37E" />
                <div className="flex items-center gap-3.5 pb-4 border-b border-white/12">
                  <AmenityAnimatedIcon groupId="house-rules" />
                  <div className="min-w-0">
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#FAF8F4]">
                      {copy.houseRulesTitle}
                    </h3>
                    <p className="text-xs text-[#D8DFD4]/85 mt-0.5 leading-relaxed">
                      {copy.houseRulesSubhead}
                    </p>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-7 gap-y-0.5 flex-1 content-center">
                  {HOUSE_RULES.map((rule) => (
                    <div
                      key={rule.label.sl}
                      className="py-2 border-b border-white/10 flex items-center justify-between gap-3 text-xs sm:text-[13px]"
                    >
                      <span className="text-[#D8DFD4]">{rule.label[lang]}</span>
                      <span className="font-mono text-xs font-medium text-[#FAF8F4] tabular-nums text-right shrink-0">
                        {rule.value[lang]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3.5 border-t border-white/15 flex items-center gap-2.5 text-xs text-[#D8DFD4]">
                  <KeyRound className="w-4 h-4 text-[#D5C37E] shrink-0" aria-hidden="true" />
                  <span>{copy.servicesHostHighlights}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 04: GUEST REVIEWS — THREE COMPACT MODULES VISIBLE + SLIDER */}
        <section id="reviews" className="relative overflow-hidden py-20 lg:py-28 border-t border-[#E2DACB] bg-gradient-to-br from-[#EFEAE0] via-[#EAE3D5] to-[#F3EDE2]">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
              <div className="max-w-2xl">
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1E251F] leading-[1.15]">
                  {copy.reviewsHeading}
                </h2>
                <div aria-hidden="true" className="w-14 h-0.5 bg-[#9A804B] rounded-full mt-4" />
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex items-center gap-1.5 mr-1">
                  {GUEST_REVIEWS.map((rev, idx) => {
                    const isCurrent = idx === reviewStartIndex % GUEST_REVIEWS.length;
                    return (
                      <button
                        key={rev.id}
                        type="button"
                        onClick={() => goToReviewSlide(idx)}
                        aria-label={`${rev.author} (${idx + 1}/${GUEST_REVIEWS.length})`}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          isCurrent
                            ? 'w-7 bg-[#3A4F37]'
                            : 'w-2 bg-[#C8BFB0] hover:bg-[#9A804B]'
                        }`}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => stepReviewSlider(-1)}
                  aria-label="Prejšnji komentar"
                  className="w-10 h-10 rounded-full border border-[#D5CCB9] bg-[#FAF8F4] hover:bg-[#3A4F37] hover:border-[#3A4F37] text-[#1E251F] hover:text-[#FAF8F4] flex items-center justify-center transition-colors cursor-pointer shadow-[0_4px_12px_rgba(30,37,31,0.06)]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => stepReviewSlider(1)}
                  aria-label="Naslednji komentar"
                  className="w-10 h-10 rounded-full bg-[#3A4F37] hover:bg-[#2C3D2A] text-[#FAF8F4] flex items-center justify-center transition-colors cursor-pointer shadow-[0_6px_16px_rgba(30,37,31,0.14)]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              onMouseEnter={() => setIsReviewsPaused(true)}
              onMouseLeave={() => setIsReviewsPaused(false)}
              onFocus={() => setIsReviewsPaused(true)}
              onBlur={() => setIsReviewsPaused(false)}
              className="relative"
            >
              <div
                ref={reviewsSliderRef}
                className="grid grid-flow-col auto-cols-[100%] md:auto-cols-[calc((100%-20px)/2)] lg:auto-cols-[calc((100%-40px)/3)] gap-5 overflow-x-hidden select-none py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {[...GUEST_REVIEWS, ...GUEST_REVIEWS.slice(0, 3)].map((reviewItem, rIdx) => (
                  <article
                    key={`${reviewItem.id}-${rIdx}`}
                    className="h-full flex flex-col justify-between p-5 rounded-2xl bg-[#FAF8F4] border border-[#DDD4C4] border-t-2 border-t-[#C9BA7B] shadow-[0_12px_28px_rgba(30,37,31,0.055)]"
                  >
                    <div>
                      {/* Editorial Metadata Row + Golden Serif Quote Mark */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#5C645A]">
                          <span className="font-semibold text-[#1E251F]">{reviewItem.author}</span>
                          <span aria-hidden="true">·</span>
                          <span>{reviewItem.country[lang]}</span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-[#E2DBD0] shadow-[0_1px_3px_rgba(30,37,31,0.06)]">
                            {reviewItem.source === 'airbnb.com' ? (
                              <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 shrink-0"
                                aria-label="Airbnb"
                                role="img"
                              >
                                <rect width="24" height="24" rx="5.5" fill="#FF385C" />
                                <g transform="translate(3 3.15) scale(0.75)" fill="none" stroke="#FFFFFF" strokeWidth="1.95" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 19.1c-1.45 1.5-3.05 2.4-4.55 2.4C4.95 21.5 3 19.6 3 17.1c0-1.35.5-2.75 1.55-4.8l3.55-6.9C9.3 3.1 10.45 2 12 2s2.7 1.1 3.9 3.4l3.55 6.9c1.05 2.05 1.55 3.45 1.55 4.8 0 2.5-1.95 4.4-4.45 4.4-1.5 0-3.1-.9-4.55-2.4z" />
                                  <path d="M12 19.1c-1.85-1.95-2.75-3.55-2.75-5.05 0-1.5 1.2-2.65 2.75-2.65s2.75 1.15 2.75 2.65c0 1.5-.9 3.1-2.75 5.05z" />
                                </g>
                              </svg>
                            ) : (
                              <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 shrink-0"
                                aria-label="Booking.com"
                                role="img"
                              >
                                <rect width="24" height="24" rx="5.5" fill="#003580" />
                                <path
                                  fill="#FFFFFF"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M5.85 5.8h4.9c2.25 0 3.7 1.15 3.7 3.05 0 1.25-.65 2.15-1.75 2.6 1.4.4 2.25 1.45 2.25 3 0 2.25-1.6 3.75-4.15 3.75H5.85V5.8zm2.65 2.2v2.65h2.05c1.0 0 1.6-.48 1.6-1.33 0-.85-.6-1.32-1.6-1.32H8.5zm0 4.85V16h2.35c1.15 0 1.85-.55 1.85-1.57 0-1.02-.7-1.58-1.85-1.58H8.5z"
                                />
                                <circle cx="17.25" cy="16.65" r="1.65" fill="#009FE3" />
                              </svg>
                            )}
                            <span className="font-mono text-[#1E251F] font-semibold tracking-tight">
                              {reviewItem.source}
                            </span>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums font-medium text-[#3A4F37]">{reviewItem.rating}</span>
                        </div>
                        <span
                          aria-hidden="true"
                          className="font-serif text-3xl leading-none text-[#C9BA7B] select-none -mt-1 shrink-0"
                        >
                          “
                        </span>
                      </div>

                      <h3 className="font-serif text-[17px] sm:text-lg font-semibold text-[#1E251F] leading-snug">
                        “{reviewItem.headline[lang]}”
                      </h3>

                      <p className="mt-2.5 text-[13px] sm:text-[13.5px] text-[#3D463B] leading-relaxed">
                        {reviewItem.quote[lang]}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E2DBD0] text-[11px] text-[#5C645A]">
                      {reviewItem.highlight[lang]}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 05: INTERACTIVE AVAILABILITY CALENDAR & INQUIRY FORM */}
        <AvailabilityBookingSection
          lang={lang}
          onOpenLegalModal={(type) => setLegalModal(type)}
        />
        </div>
      </main>

      {/* QUIET FOOTER */}
      <footer className="bg-[#1E251F] text-[#EAE4D7] border-t border-[#2E382F]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#2E382F]">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/images/villa/LH_logo.png"
                  alt="Leonardo House"
                  referrerPolicy="no-referrer"
                  className="h-10 w-auto object-contain brightness-110"
                />
                <span className="font-serif text-2xl font-semibold text-white tracking-tight">
                  Leonardo House
                </span>
              </div>
              <p className="text-sm font-serif text-[#C5CCC2] tracking-wide">
                {CONTACT_INFO.address}
              </p>
            </div>

            <div className="md:col-span-4 space-y-3 text-sm">
              <div className="text-xs font-semibold tracking-wide text-white uppercase">
                Kontakt
              </div>
              <div className="space-y-1.5 text-sm font-serif text-[#C5CCC2] tracking-wide">
                <div>
                  Tel (EN, SI, HR, DE):{' '}
                  <a href={`tel:${CONTACT_INFO.phoneMainHref}`} className="hover:text-white transition-colors">
                    {CONTACT_INFO.phoneMainDisplay}
                  </a>
                </div>
                <div>
                  Tel (HR):{' '}
                  <a href={`tel:${CONTACT_INFO.phoneCroHref}`} className="hover:text-white transition-colors">
                    {CONTACT_INFO.phoneCroDisplay}
                  </a>
                </div>
                <div>
                  E-pošta:{' '}
                  <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                </div>
                <div>
                  WhatsApp / Viber: {CONTACT_INFO.whatsappNumber}
                </div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-3 text-sm">
              <div className="text-xs font-semibold tracking-wide text-white uppercase">
                {copy.footerLegalTitle}
              </div>
              <div className="flex flex-col items-start gap-2 text-xs text-[#C5CCC2]">
                <button
                  type="button"
                  onClick={() => setLegalModal('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {copy.privacyPolicyBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setLegalModal('cookies')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {copy.cookiePolicyBtn}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-[#949E91]">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span>© 2023 – 2026 Leonardo House</span>
              <span aria-hidden="true">·</span>
              <span>
                Izdelava spletnih strani{' '}
                <a
                  href="https://webkat.si"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  webkat.si
                </a>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {(['sl', 'en', 'de', 'hr'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`uppercase font-mono text-xs cursor-pointer transition-colors ${
                    lang === l ? 'text-white font-semibold' : 'hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between text-white mb-3 gap-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-medium">
                  {lightboxItem.title[lang]}
                </h3>
                <p className="text-xs text-white/75 mt-0.5">
                  {lightboxItem.subtitle[lang]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                aria-label="Zapri celozaslonski pogled"
                className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full max-h-[72vh] rounded-xl overflow-hidden bg-[#121612] flex items-center justify-center border border-white/15 shadow-2xl">
              <img
                src={
                  lightboxItem.src === '/images/villa/DJI_0605.png'
                    ? '/images/villa/lightbox/DJI_0605.jpg'
                    : lightboxItem.src.startsWith('/images/villa/') &&
                        !lightboxItem.src.startsWith('/images/villa/lightbox/')
                      ? lightboxItem.src.replace('/images/villa/', '/images/villa/lightbox/')
                      : lightboxItem.src
                }
                alt={lightboxItem.title[lang]}
                width={1280}
                height={854}
                decoding="async"
                referrerPolicy="no-referrer"
                className="max-h-[72vh] w-auto max-w-full object-contain select-none"
              />

              <button
                type="button"
                onClick={() => {
                  const idx = allGalleryItems.findIndex((i) => i.id === lightboxItem.id);
                  if (idx !== -1) {
                    const prevIdx = (idx - 1 + allGalleryItems.length) % allGalleryItems.length;
                    setLightboxItem(allGalleryItems[prevIdx]);
                    setGallerySlideIdx(prevIdx);
                  }
                }}
                aria-label="Prejšnja slika"
                className="absolute left-3 p-3 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/15 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const idx = allGalleryItems.findIndex((i) => i.id === lightboxItem.id);
                  if (idx !== -1) {
                    const nextIdx = (idx + 1) % allGalleryItems.length;
                    setLightboxItem(allGalleryItems[nextIdx]);
                    setGallerySlideIdx(nextIdx);
                  }
                }}
                aria-label="Naslednja slika"
                className="absolute right-3 p-3 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/15 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full mt-3 flex items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {allGalleryItems.map((item, idx) => {
                const isSelected = item.id === lightboxItem.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setLightboxItem(item);
                      setGallerySlideIdx(idx);
                    }}
                    aria-label={item.title[lang]}
                    className={`relative rounded-lg overflow-hidden shrink-0 w-16 h-12 sm:w-20 sm:h-14 transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-white opacity-100'
                        : 'opacity-50 hover:opacity-85'
                    }`}
                  >
                    <img
                      src={item.src.replace('/images/villa/', '/images/villa/thumb/')}
                      alt={item.title[lang]}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BACK TO TOP BUTTON */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={copy.backToTop}
        className={`group fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-30 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F4]/95 hover:bg-[#3A4F37] text-[#1E251F] hover:text-[#FAF8F4] border border-[#D5CDBE] hover:border-[#3A4F37] backdrop-blur-md shadow-[0_8px_24px_rgba(30,37,31,0.14)] text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A4F37] ${
          showBackToTop && !lightboxItem && !legalModal
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-3.5 h-3.5 text-[#3A4F37] group-hover:text-[#FAF8F4] group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
        <span>{copy.backToTop}</span>
      </button>

      {/* LEGAL MODALS (PRIVACY POLICY & COOKIES) */}
      <LegalModals activeModal={legalModal} onClose={() => setLegalModal(null)} />
    </div>
  );
}
