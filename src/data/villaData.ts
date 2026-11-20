export type Language = 'sl' | 'en' | 'de' | 'hr';

export type GalleryCategory = 'pool' | 'house1' | 'house2' | 'courtyard' | 'kids';

export interface GalleryItem {
  id: string;
  src: string;
  category: GalleryCategory;
  featuredSpan?: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
}

export interface GuestReview {
  id: string;
  author: string;
  country: Record<Language, string>;
  source: 'booking.com' | 'airbnb.com';
  rating: string;
  headline: Record<Language, string>;
  quote: Record<Language, string>;
  highlight: Record<Language, string>;
}

export const CONTACT_INFO = {
  address: 'Paolija 16a, 52466 Bužinija (Novigrad), Hrvaška',
  addressInternational: 'Paolija 16a, 52466 Bužinija, Croatia',
  coordinates: '45.3292° N, 13.5864° E',
  phoneMainDisplay: '00 386 31 751 297',
  phoneMainHref: '+38631751297',
  phoneMainLanguages: 'EN, SI, HR, DE',
  phoneCroDisplay: '00 385 91 754 24 84',
  phoneCroHref: '+385917542484',
  phoneCroLanguages: 'HR',
  email: 'info@leonardo-house.com',
  whatsappNumber: '0038631751297',
  whatsappUrl: 'https://wa.me/38631751297',
  viberNumber: '0038631751297',
  viberUrl: 'viber://chat?number=%2B38631751297',
  rentalBellCalendarUrl: 'https://www.rentalbell.com/short-url/0f91b6',
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'pool-lounge',
    src: '/images/villa/pool_lounge.jpg',
    category: 'pool',
    title: {
      sl: 'Počivalniki in senčniki ob bazenu',
      en: 'Poolside Sun Loungers & Shade',
      de: 'Sonnenliegen & Sonnenschirme am Pool',
      hr: 'Ležaljke i suncobrani uz bazen',
    },
    subtitle: {
      sl: 'Brezskrbno poležavanje ob pogledu na oljke',
      en: 'Effortless lounging overlooking the olive grove',
      de: 'Entspanntes Sonnenbaden mit Blick auf die Olivenbäume',
      hr: 'Bezbrižno opuštanje uz pogled na masline',
    },
  },
  {
    id: 'drinks-by-pool',
    src: '/images/villa/drinks_by_the_pool.jpg',
    category: 'pool',
    title: {
      sl: 'Osvežilna pijača ob bazenu',
      en: 'Afternoon Refreshments by the Water',
      de: 'Erfrischungen am Pool',
      hr: 'Osvježenje uz bazen',
    },
    subtitle: {
      sl: 'Popoldanski oddih v tišini Bužinije',
      en: 'Peaceful afternoon moments in secluded Bužinija',
      de: 'Ruhige Nachmittagsstunden in Bužinija',
      hr: 'Mirni popodnevni trenuci u tišini Bužinije',
    },
  },
  {
    id: 'wine-and-glasses',
    src: '/images/villa/wine_and_glasses.jpg',
    category: 'courtyard',
    title: {
      sl: 'Istrska vinska tradicija',
      en: 'Istrian Wine & Olive Country',
      de: 'Istrische Weintradition',
      hr: 'Istarska vinska tradicija',
    },
    subtitle: {
      sl: 'Uživajte v vrhunskih lokalnih vinih v senci oljk',
      en: 'Savor local Istrian wines in the shade of the olive grove',
      de: 'Genießen Sie lokale istrische Weine im Schatten der Olivenbäume',
      hr: 'Uživajte u vrhunskim lokalnim vinima u hladu maslina',
    },
  },
  {
    id: 'coffee-by-pool',
    src: '/images/villa/coffee_by_the_pool.jpg',
    category: 'courtyard',
    title: {
      sl: 'Jutranja kava ob bazenu',
      en: 'Morning Coffee by the Pool',
      de: 'Morgenkaffee am Pool',
      hr: 'Jutarnja kava uz bazen',
    },
    subtitle: {
      sl: 'Manjša mizica z udobnimi počivalniki za mirna jutra',
      en: 'Intimate lounge table for slow, sunlit Mediterranean mornings',
      de: 'Kleiner Loungetisch für entspannte Morgenstunden',
      hr: 'Manji stolić s udobnim naslonjačima za mirna jutra',
    },
  },
  {
    id: 'swing-chair',
    src: '/images/villa/swing_chair.jpg',
    category: 'courtyard',
    title: {
      sl: 'Viseči počivalnik za branje in oddih',
      en: 'Hanging Cocoon Chair by the Garden',
      de: 'Hängesessel im Garten',
      hr: 'Viseća fotelja za čitanje i odmor',
    },
    subtitle: {
      sl: 'Kotiček za popoln odklop s knjigo',
      en: 'A quiet nook for reading and afternoon siestas',
      de: 'Ein ruhiger Platz zum Lesen und Entspannen',
      hr: 'Kutak za potpuno opuštanje uz knjigu',
    },
  },
  {
    id: 'view-of-yard',
    src: '/images/villa/view_of_the_yard.jpg',
    category: 'courtyard',
    title: {
      sl: 'Urejen mediteranski vrt z rožami in figami',
      en: 'Landscaped Mediterranean Courtyard & Fig Trees',
      de: 'Gepflegter mediterraner Garten mit Feigenbäumen',
      hr: 'Uređeni mediteranski vrt sa smokvama i cvijećem',
    },
    subtitle: {
      sl: 'Nasad oljk, fig in okrasnih sredozemskih rastlin',
      en: 'Surrounded by olive trees, figs, and fragrant ornamental shrubs',
      de: 'Umgeben von Olivenbäumen, Feigen und duftenden Ziersträuchern',
      hr: 'Okruženo maslinama, smokvama i ukrasnim mediteranskim biljem',
    },
  },
  {
    id: 'statue-garden',
    src: '/images/villa/statue.jpg',
    category: 'courtyard',
    title: {
      sl: 'Mediteranski detajli na vrtu',
      en: 'Mediterranean Garden Details',
      de: 'Mediterrane Gartendetails',
      hr: 'Mediteranski detalji u vrtu',
    },
    subtitle: {
      sl: 'Skrbno izbrani detajli, ki ustvarjajo toplino doma',
      en: 'Loving craftsmanship and care invested into every corner',
      de: 'Liebevolle Details in jeder Ecke des Gartens',
      hr: 'Pažljivo odabrani detalji koji stvaraju toplinu doma',
    },
  },
];

export const GUEST_REVIEWS: GuestReview[] = [
  {
    id: 'rebecca-uk',
    author: 'Rebecca',
    country: { sl: 'Velika Britanija', en: 'United Kingdom', de: 'Großbritannien', hr: 'Velika Britanija' },
    source: 'airbnb.com',
    rating: '5.0 / 5.0',
    headline: {
      sl: 'Čudovito in zasebno okolje ter izjemna gostoljubnost ob prihodu',
      en: 'Fantastic stay in a really beautiful and private olive grove setting',
      de: 'Fantastischer Aufenthalt in wunderschöner, privater Umgebung im Olivenhain',
      hr: 'Fantastičan boravak u prekrasnom i privatnom okruženju maslinika',
    },
    quote: {
      sl: 'Fantastično bivanje pri Vladu. Resnično čudovito in zasebno okolje. Bazen je čudovit, ugnezden v oljčnem nasadu, z veliko senčnega zunanjega prostora za uživanje. Nastanitev je zelo udobna, odlično opremljena in vzdrževana. Najboljše od vsega pa je, da Vlado in njegova žena ne bi mogla biti prijaznejša gostitelja — ob prihodu sta nas pričakala, nam vse razkazala in spekla okusno sirovo pito!',
      en: 'Fantastic stay at Vlado’s place. Really beautiful and private setting. Pool is fabulous, nestled in an olive grove. Plenty of shaded outdoor space to enjoy. Accommodation is really comfortable and well equipped and maintained. Best of all, Vlado and his wife couldn’t be nicer hosts. Meeting us on arrival to show us how everything worked, and making us a delicious cheese pie. So friendly and welcoming on our first trip to Croatia!',
      de: 'Fantastischer Aufenthalt bei Vlado. Wirklich schöne und private Lage. Der Pool ist fabelhaft, eingebettet in einen Olivenhain, mit viel schattigem Platz im Freien. Das Beste von allem: Vlado und seine Frau könnten keine netteren Gastgeber sein – sie empfingen uns bei der Ankunft mit einem köstlichen hausgemachten Käsekuchen!',
      hr: 'Fantastičan boravak kod Vlade. Zaista prekrasno i privatno okruženje. Bazen je divan, smješten u masliniku s puno hlada. Najbolje od svega, Vlado i njegova supruga ne mogu biti ljubazniji domaćini – dočekali su nas pri dolasku i ispekli nam ukusnu pitu sa sirom!',
    },
    highlight: {
      sl: 'Gostitelja Vlado in soproga · Domača sirova pita ob sprejemu',
      en: 'Hosts Vlado & Wife · Homemade Cheese Pie Welcome',
      de: 'Gastgeber Vlado & Frau · Hausgemachtes Gebäck zur Begrüßung',
      hr: 'Domaćini Vlado i supruga · Domaća pita od sira za dobrodošlicu',
    },
  },
  {
    id: 'zupancic-si',
    author: 'Zupančič',
    country: { sl: 'Slovenija', en: 'Slovenia', de: 'Slowenien', hr: 'Slovenija' },
    source: 'booking.com',
    rating: '10 / 10',
    headline: {
      sl: 'Čista 10-ka! Vrhunsko vzdrževana okolica in nasad oljk ter fig',
      en: 'A pure 10/10! Spotless cleanliness, fenced lot, and fig & olive grove',
      de: 'Eine glatte 10! Pool, Sauberkeit, eingezäuntes Grundstück mit Feigen und Oliven',
      hr: 'Čista desetka! Bazen, čistoća, ograđena parcela i nasad smokava i maslina',
    },
    quote: {
      sl: 'Čista 10-ka! Bazen, čistoča, ograjena parcela, nasad fig, oljk, ogromno rož in okrasnih grmov, lepo vzdrževana okolica, krasna in vrhunsko izkoriščena notranjost hišk.',
      en: 'A pure 10 out of 10! The pool, cleanliness, fenced plot, grove of figs and olives, abundance of flowers and ornamental shrubs, beautifully maintained surroundings, and a wonderful, superbly utilized interior of both houses.',
      de: 'Eine glatte 10! Der Pool, die Sauberkeit, das eingezäunte Grundstück, der Hain aus Feigen und Oliven, viele Blumen und Ziersträucher, die gepflegte Umgebung und die hervorragend genutzte Inneneinrichtung der Häuser.',
      hr: 'Čista 10-ka! Bazen, čistoća, ograđena parcela, nasad smokava, maslina, mnoštvo cvijeća i ukrasnog grmlja, lijepo održavana okućnica te krasna i vrhunsko iskorištena unutrašnjost kućica.',
    },
    highlight: {
      sl: 'Ograjena parcela 1.000 m² · Nasad fig in oljk',
      en: '1,000 m² Fenced Plot · Fig & Olive Grove',
      de: '1.000 m² eingezäuntes Grundstück · Feigen- & Olivenhain',
      hr: 'Ograđena parcela 1.000 m² · Nasad smokava i maslina',
    },
  },
  {
    id: 'sarah-uk',
    author: 'Sarah',
    country: { sl: 'Velika Britanija', en: 'United Kingdom', de: 'Großbritannien', hr: 'Velika Britanija' },
    source: 'airbnb.com',
    rating: '5.0 / 5.0',
    headline: {
      sl: 'Brezhibno čisto, dve ločeni stavbi in odlična izhodiščna točka za Istro',
      en: 'Spotlessly clean two-building layout, ideal base for exploring Novigrad & Istria',
      de: 'Makellos sauber, zwei separate Gebäude und idealer Ausgangspunkt für Istrien',
      hr: 'Besprijekorno čisto, dvije odvojene zgrade i izvrsna baza za istraživanje Istre',
    },
    quote: {
      sl: 'Prejeli smo prisrčno dobrodošlico z domačimi sirovimi pecivi in hladnim pivom. Bazen in vrt sta čudovita za sproščanje v toplem vremenu, kuhinja pa je zelo dobro opremljena. Očitno je, da je bilo v ta kraj vloženega veliko ljubezni in skrbi ter je brezhibno čisto. Nastanitev obsega dve stavbi — odlična izhodiščna točka za raziskovanje Novigrada s čudovitimi sončnimi zahodi in slikovitih istrskih mestec na gričih.',
      en: 'We received a lovely warm welcome with home made cheese pastries and cold beer which was much appreciated. The pool and garden are lovely for relaxing in the warm weather and the kitchen is very well equipped. It is obvious that a great deal of love and care has been invested into this place and it is spotlessly clean. The accommodation consists of two buildings... Novigrad is a small pretty town with a fishing harbour and some lovely spots for swimming and enjoying the amazing sunsets.',
      de: 'Wir wurden herzlich mit hausgemachtem Käsegebäck und kaltem Bier empfangen. Pool und Garten laden zum Entspannen ein und die Küche ist bestens ausgestattet. Man spürt in jedem Detail, wie viel Liebe und Sorgfalt hier investiert wurde – alles ist makellos sauber. Perfekter Ausgangspunkt für Novigrad und die istrischen Hügelstädtchen.',
      hr: 'Dočekala nas je topla dobrodošlica uz domaće pecivo sa sirom i hladno pivo. Bazen i vrt su divni za opuštanje, a kuhinja je vrhunski opremljena. Očito je da je u ovo mjesto uloženo puno ljubavi i pažnje te je besprijekorno čisto. Izvrsna baza za istraživanje Novigrada i istarskih gradića na brežuljcima.',
    },
    highlight: {
      sl: 'Brezhibna čistoča · 2 ločeni hiški · Bližina Novigrada',
      en: 'Spotless Cleanliness · Two Separate Buildings · Near Novigrad Harbour',
      de: 'Makellose Sauberkeit · 2 separate Häuser · Nahe Novigrad',
      hr: 'Besprijekorna čistoća · 2 odvojene kućice · Blizina Novigrada',
    },
  },
  {
    id: 'majda-si',
    author: 'Majda',
    country: { sl: 'Slovenija', en: 'Slovenia', de: 'Slowenien', hr: 'Slovenija' },
    source: 'booking.com',
    rating: '10 / 10',
    headline: {
      sl: 'Izjemno! Počitnice v hiši so presegle vsa naša pričakovanja',
      en: 'Exceptional! Unforgettable vacation that exceeded all our expectations',
      de: 'Außergewöhnlich! Ein unvergesslicher Urlaub, der alle Erwartungen übertroffen hat',
      hr: 'Izuzetan odmor koji je nadmašio sva naša očekivanja',
    },
    quote: {
      sl: 'Nepozaben dopust na čudoviti lokaciji! Gostoljubnost nevsiljivih gostiteljev je na zavidljivi ravni. Počitnice v hiši so presegle vsa naša pričakovanja; intimna lokacija, lep bazen, objekt je opremljen z vsemi potrebnimi vsebinami, ki jih morda potrebujete na dopustu. Vse, kar potrebujete, je na dosegu roke. Veselimo se vaše vrnitve!',
      en: 'Unforgettable vacation in a wonderful location! The hospitality of the unobtrusive hosts is at an enviable level. Holidays in the house exceeded all our expectations; intimate location, nice pool, the facility is equipped with all the necessary amenities you might need on vacation. Everything you need is within reach. We look forward to returning!',
      de: 'Unvergesslicher Urlaub in traumhafter Lage! Die Gastfreundschaft der unaufdringlichen Gastgeber ist bemerkenswert. Intime Lage, schöner Pool und komplett mit allem ausgestattet, was man im Urlaub braucht. Wir freuen uns schon auf das nächste Mal!',
      hr: 'Nezaboravan odmor na prekrasnoj lokaciji! Gostoljubivost ненаmetljivih domaćina je na zavidnoj razini. Odmor u kući nadmašio je sva naša očekivanja; intimna lokacija, lijep bazen i sve potrebno nadohvat ruke.',
    },
    highlight: {
      sl: 'Intimna lokacija · Popolna opremljenost',
      en: 'Intimate Secluded Location · Fully Equipped Sanctuary',
      de: 'Intime Lage · Vollständige Ausstattung',
      hr: 'Intimna lokacija · Potpuna opremljenost',
    },
  },
  {
    id: 'daniel-usa',
    author: 'Daniel',
    country: { sl: 'ZDA', en: 'United States', de: 'USA', hr: 'SAD' },
    source: 'airbnb.com',
    rating: '5.0 / 5.0',
    headline: {
      sl: 'že po eni uri bivanja smo načrtovali, kdaj se bomo vrnili',
      en: 'We began plotting how to get back here within an hour of checking in',
      de: 'Schon eine Stunde nach dem Check-in planten wir unsere Rückkehr',
      hr: 'Već sat vremena nakon prijave planirali smo povratak',
    },
    quote: {
      sl: 'Če gledate to nastanitev, jo rezervirajte. Ugnezdeni sredi dežele oljk in vina boste imeli čudovit dom z neverjetnim bazenom in najbolj čudovitimi gostitelji! Že v eni uri po prijavi smo začeli načrtovati, kako se bomo vrnili sem. Le 10 minut boste oddaljeni od jadranske obale, restavracij in trgovin, hkrati pa se boste lahko sprostili v mirnem in odmaknjenem okolju.',
      en: 'If you’re seeing this, book this home. Nestled in the midst of olive and wine country, you’ll have a beautiful home with an incredible pool and the most wonderful hosts! We began plotting how to get back here within an hour of checking in. You’ll be just 10 minutes from the Adriatic coast, restaurants, grocery, etc, but be able to relax and unwind in a quiet and secluded area.',
      de: 'Wenn Sie das hier sehen, buchen Sie dieses Haus. Mitten im Oliven- und Weinland erwartet Sie ein wunderschönes Zuhause mit einem unglaublichen Pool und den herzlichsten Gastgebern! Nur 10 Minuten von der Adriaküste und Restaurants entfernt, aber völlig ruhig gelegen.',
      hr: 'Ako ovo gledate, rezervirajte ovu kuću. Smješteni usred zemlje maslina i vina, imat ćete prekrasan dom s nevjerojatnim bazenom i najdivnijim domaćinima! Samo 10 minuta od jadranske obale, a u potpunom miru i tišini.',
    },
    highlight: {
      sl: 'Dežela oljk in vina · 10 min do jadranske obale',
      en: 'Olive & Wine Country · 10 Min from Adriatic Coast',
      de: 'Oliven- & Weinland · 10 Min. zur Adriaküste',
      hr: 'Zemlja maslina i vina · 10 min do jadranske obale',
    },
  },
  {
    id: 'matevz-si',
    author: 'Matevž',
    country: { sl: 'Slovenija', en: 'Slovenia', de: 'Slowenien', hr: 'Slovenija' },
    source: 'booking.com',
    rating: '10 / 10',
    headline: {
      sl: 'Odlično! Mirna in intimna lokacija, bazen je prava atrakcija za otroke',
      en: 'Excellent! Peaceful and intimate location, the pool is a real attraction for kids',
      de: 'Ausgezeichnet! Ruhige und intime Lage, der Pool ist ein Highlight für Kinder',
      hr: 'Odlično! Mirna i intimna lokacija, bazen je prava atrakcija za djecu',
    },
    quote: {
      sl: 'Odlično! Priporočam! Lokacija je mirna in intimna. Bazen je prava atrakcija za otroke. Priporočam vsem, ki bi radi uživali v miru in prijetnem okolju.',
      en: 'Excellent! I highly recommend it! The location is peaceful and intimate. The swimming pool is a true attraction for children. Recommended to everyone looking to enjoy peace and a pleasant environment.',
      de: 'Ausgezeichnet! Sehr empfehlenswert! Die Lage ist ruhig und privat. Der Pool ist eine echte Attraktion für Kinder. Ideal für alle, die Ruhe in angenehmer Umgebung suchen.',
      hr: 'Odlično! Preporučujem! Lokacija je mirna i intimna. Bazen je prava atrakcija za djecu. Preporučujem svima koji žele uživati u miru i ugodnom okruženju.',
    },
    highlight: {
      sl: 'Družinam prijazno · Mirna in intimna lokacija',
      en: 'Family-Friendly Pool · Peaceful Setting',
      de: 'Familienfreundlich · Ruhige Lage',
      hr: 'Prilagođeno obiteljima · Mirno okruženje',
    },
  },
  {
    id: 'william-perry-uk',
    author: 'William Perry',
    country: { sl: 'Velika Britanija', en: 'United Kingdom', de: 'Großbritannien', hr: 'Velika Britanija' },
    source: 'airbnb.com',
    rating: '5.0 / 5.0',
    headline: {
      sl: 'Mir, tišina, zanesljiv Wi-Fi, enostavno parkiranje in solarno ogrevan bazen',
      en: 'Peace and quiet, easy parking, reliable Wi-Fi, and the most thoughtful hosts',
      de: 'Ruhe und Frieden, einfaches Parken, zuverlässiges WLAN und aufmerksame Gastgeber',
      hr: 'Mir i tišina, jednostavno parkiranje, pouzdan Wi-Fi i najpažljiviji domaćini',
    },
    quote: {
      sl: 'Če si želite miru in tišine ter najbolj gostoljubnih in pozornih gostiteljev, rezervirajte Vladovo nastanitev. Vse je bilo čisto, parkiranje enostavno, Wi-Fi zanesljiv, bazen pa je solarno ogrevan. Toplo priporočam in zagotovo se še vrnemo!',
      en: 'If you want peace and quiet and the most welcoming and thoughtful hosts, you should book Vlado’s place. It was clean, parking easy, wifi reliable, the pool is solar heated... we’ll be sure to stay here again if we visit the area in warmer temperatures. Highly recommend!',
      de: 'Wer Ruhe und die herzlichsten Gastgeber sucht, sollte bei Vlado buchen. Alles war blitzsauber, das Parken einfach, das WLAN zuverlässig und der Pool solarbeheizt. Sehr zu empfehlen!',
      hr: 'Ako želite mir i tišinu te najsrdacnije domaćine, rezervirajte Vladin smještaj. Sve je bilo čisto, parkiranje jednostavno, Wi-Fi pouzdan, a bazen solarno grijan. Topla preporuka!',
    },
    highlight: {
      sl: 'Solarno ogrevan bazen · Zanesljiv Wi-Fi · Pokrito parkirišče',
      en: 'Solar-Heated Pool · Reliable Wi-Fi · Covered Parking',
      de: 'Solarbeheizter Pool · Zuverlässiges WLAN · Überdachter Parkplatz',
      hr: 'Solarno grijani bazen · Pouzdan Wi-Fi · Natkriveni parking',
    },
  },
  {
    id: 'anonimen-si',
    author: 'Gost iz Slovenije',
    country: { sl: 'Slovenija', en: 'Slovenia', de: 'Slowenien', hr: 'Slovenija' },
    source: 'booking.com',
    rating: '10 / 10',
    headline: {
      sl: 'Nepozaben dopust, krasna lokacija in popolna zasebnost',
      en: 'Unforgettable vacation, wonderful location, complete privacy and heated pool',
      de: 'Unvergesslicher Urlaub, tolle Lage, volle Privatsphäre und beheizter Pool',
      hr: 'Nezaboravan odmor, krasna lokacija, potpuna privatnost i grijani bazen',
    },
    quote: {
      sl: 'Nepozaben dopust, krasna lokacija. Same pohvale gostiteljem. Zasebnost, ogrevan bazen. V glavnem vse.',
      en: 'Unforgettable holiday, wonderful location. All praise to the hosts. Complete privacy, heated pool — essentially everything you could wish for.',
      de: 'Unvergesslicher Urlaub, wunderschöne Lage. Großes Lob an die Gastgeber. Privatsphäre, beheizter Pool – einfach alles perfekt.',
      hr: 'Nezaboravan odmor, krasna lokacija. Sve pohvale domaćinima. Privatnost, grijani bazen – ukratko sve.',
    },
    highlight: {
      sl: 'Popolna zasebnost · Ogrevan bazen',
      en: 'Complete Privacy · Heated Swimming Pool',
      de: 'Volle Privatsphäre · Beheizter Pool',
      hr: 'Potpuna privatnost · Grijani bazen',
    },
  },
];

export interface AmenityGroup {
  id: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  items: {
    label: Record<Language, string>;
    value: Record<Language, string>;
  }[];
}

export const AMENITY_GROUPS: AmenityGroup[] = [
  {
    id: 'outdoor',
    title: {
      sl: 'Na prostem & Vrt',
      en: 'Outdoor & Courtyard',
      de: 'Außenbereich & Garten',
      hr: 'Na otvorenom i vrt',
    },
    subtitle: {
      sl: '1.000 m² ograjene parcele z oljčnim nasadom',
      en: '1,000 m² fenced private plot with olive grove',
      de: '1.000 m² eingezäuntes Grundstück mit Olivenhain',
      hr: '1.000 m² ograđene parcele s maslinikom',
    },
    items: [
      {
        label: { sl: 'Zunanji bazen', en: 'Outdoor Pool', de: 'Außenpool', hr: 'Vanjski bazen' },
        value: {
          sl: 'Zaseben, sezonsko razpoložljiv, solarno ogrevan',
          en: 'Private, available seasonally, solar-heated',
          de: 'Privat, saisonal geöffnet, solarbeheizt',
          hr: 'Privatan, sezonski dostupan, solarno grijan',
        },
      },
      {
        label: { sl: 'Zunanja prha', en: 'Outdoor Shower', de: 'Außendusche', hr: 'Vanjski tuš' },
        value: {
          sl: 'Da — ob bazenu za osvežitev pod soncem',
          en: 'Available right next to the swimming pool',
          de: 'Direkt neben dem Pool vorhanden',
          hr: 'Dostupan tik uz bazen',
        },
      },
      {
        label: { sl: 'Terasa in obedovanje', en: 'Terrace & Al Fresco Dining', de: 'Terrasse & Essbereich', hr: 'Terasa i blagovanje' },
        value: {
          sl: 'Zasebna pokrita terasa z veliko mizo in počivalniki',
          en: 'Private covered terrace with large dining table & lounge chairs',
          de: 'Private überdachte Terrasse mit großem Esstisch & Lounge-Stühlen',
          hr: 'Privatna natkrivena terasa s velikim stolom i ležaljkama',
        },
      },
      {
        label: { sl: 'Žar / Kamin', en: 'BBQ Grill & Fireplace', de: 'Grill & Außenkamin', hr: 'Roštilj / Kamin' },
        value: {
          sl: 'Zunanji kamin na drva za peko na žaru',
          en: 'Traditional wood-burning fireplace & BBQ grill',
          de: 'Traditioneller Holzkohle-/Holzgrill auf der Terrasse',
          hr: 'Tradicionalni kamin na drva za roštilj',
        },
      },
      {
        label: { sl: 'Ležalniki in senčnika', en: 'Sun Loungers & Umbrellas', de: 'Sonnenliegen & Schirme', hr: 'Ležaljke i suncobrani' },
        value: {
          sl: 'Na voljo ob bazenu z brisačami',
          en: 'Available poolside with comfortable sunbeds',
          de: 'Am Pool verfügbar',
          hr: 'Dostupno uz bazen',
        },
      },
      {
        label: { sl: 'Parkirišče', en: 'Parking', de: 'Parkplatz', hr: 'Parkiralište' },
        value: {
          sl: 'Brezplačno pokrito parkirišče v sklopu prenočišča',
          en: 'Free covered parking on premises inside gated lot',
          de: 'Kostenloser überdachter Parkplatz auf dem Grundstück',
          hr: 'Besplatno natkriveno parkiralište u sklopu objekta',
        },
      },
      {
        label: { sl: 'Oljčni nasad', en: 'Private Olive Grove', de: 'Eigener Olivenhain', hr: 'Vlastiti maslinik' },
        value: {
          sl: 'Lasten nasad oljk in fig — možna degustacija domačega oljčnega olja',
          en: 'Estate olive grove — homemade extra virgin olive oil tasting available',
          de: 'Eigener Olivenhain — Verkostung von eigenem Olivenöl möglich',
          hr: 'Vlastiti maslinik — moguća degustacija domaćeg maslinovog ulja',
        },
      },
    ],
  },
  {
    id: 'kitchen',
    title: {
      sl: 'Kuhinja in jedilnica',
      en: 'Kitchen & Dining',
      de: 'Küche & Essbereich',
      hr: 'Kuhinja i blagovaonica',
    },
    subtitle: {
      sl: 'Polno opremljena kuhinja v Veliki hiši ter priročni kotiček v Manjši hiški',
      en: 'Full kitchen in the Big House plus kitchenette essentials in the Small House',
      de: 'Voll ausgestattete Küche im Großen Haus sowie Kochecke im Kleinen Haus',
      hr: 'Potpuno opremljena kuhinja u Velikoj kući i mini kuhinja u Manjoj kućici',
    },
    items: [
      {
        label: { sl: 'Hladilnik & Zamrzovalnik', en: 'Refrigerator & Freezer', de: 'Kühlschrank & Gefrierfach', hr: 'Hladnjak i zamrzivač' },
        value: {
          sl: 'Velik hladilnik z zamrzovalnikom (Hiška 1) + mini hladilnik (Hiška 2)',
          en: 'Full refrigerator & freezer (House 1) + mini fridge (House 2)',
          de: 'Großer Kühlschrank mit Gefrierfach + Minikühlschrank',
          hr: 'Veliki hladnjak sa zamrzivačem + mini hladnjak',
        },
      },
      {
        label: { sl: 'Kuhanje in peka', en: 'Stove, Oven & Microwave', de: 'Herd, Backofen & Mikrowelle', hr: 'Štednjak, pećnica i mikrovalna' },
        value: {
          sl: 'Električni štedilnik, pečica in mikrovalovna pečica',
          en: 'Electric stove, full oven, and microwave',
          de: 'Elektroherd, Backofen und Mikrowelle',
          hr: 'Električni štednjak, pećnica i mikrovalna pećnica',
        },
      },
      {
        label: { sl: 'Pomivalni stroj', en: 'Dishwasher', de: 'Geschirrspüler', hr: 'Perilica posuđa' },
        value: {
          sl: 'Da — na voljo v glavni kuhinji',
          en: 'Available in the main kitchen',
          de: 'Verfügbar in der Hauptküche',
          hr: 'Dostupna u glavnoj kuhinji',
        },
      },
      {
        label: { sl: 'Kavni aparat, grelnik & toaster', en: 'Coffee Maker, Kettle & Toaster', de: 'Kaffeemaschine, Wasserkocher & Toaster', hr: 'Aparat za kavu, kuhalo i toster' },
        value: {
          sl: 'Aparat za kavo, grelnik vode in toaster',
          en: 'Coffee maker, hot water kettle, and toaster included',
          de: 'Kaffeemaschine, Wasserkocher und Toaster vorhanden',
          hr: 'Aparat za kavu, kuhalo za vodu i toster',
        },
      },
      {
        label: { sl: 'Osnovna posoda in začimbe', en: 'Cooking Basics', de: 'Kochutensilien & Gewürze', hr: 'Osnovno posuđe i začini' },
        value: {
          sl: 'Lonci in ponve, oljčno olje, sol in poper',
          en: 'Pots and pans, oil, salt, and pepper',
          de: 'Töpfe und Pfannen, Öl, Salz und Pfeffer',
          hr: 'Lonci i tave, ulje, sol i papar',
        },
      },
      {
        label: { sl: 'Jedilni pribor in kozarci', en: 'Dishes, Silverware & Wine Glasses', de: 'Geschirr, Besteck & Weingläser', hr: 'Posuđe, pribor za jelo i čaše za vino' },
        value: {
          sl: 'Sklede, krožniki, skodelice, kozarci za vino in jedilna miza',
          en: 'Bowls, plates, cups, wine glasses, and dining table',
          de: 'Schüsseln, Teller, Tassen, Weingläser und Esstisch',
          hr: 'Zdjele, tanjuri, šalice, čaše za vino i blagovaonski stol',
        },
      },
    ],
  },
  {
    id: 'bedrooms-bathroom',
    title: {
      sl: 'Spalnice, kopalnici in pralnica',
      en: 'Bedrooms, Bathrooms & Laundry',
      de: 'Schlafzimmer, Bäder & Wäsche',
      hr: 'Spavaće sobe, kupaonice i praonica',
    },
    subtitle: {
      sl: '3 spalnice in 2 kopalnici z WC-jem (skupaj do 6 gostov)',
      en: '3 bedrooms and 2 full bathrooms across the two houses (up to 6 guests)',
      de: '3 Schlafzimmer und 2 Badezimmer in zwei Häusern (bis zu 6 Gäste)',
      hr: '3 spavaće sobe i 2 kupaonice s WC-om (do 6 gostiju)',
    },
    items: [
      {
        label: { sl: 'Osnovna oprema in posteljnina', en: 'Bed Linens & Essentials', de: 'Bettwäsche & Grundausstattung', hr: 'Posteljina i osnovna oprema' },
        value: {
          sl: 'Sveže brisače, rjuhe, dodatne blazine in odeje, milo in toaletni papir',
          en: 'Towels, bed sheets, extra pillows & blankets, soap, and toilet paper',
          de: 'Handtücher, Bettwäsche, zusätzliche Kissen & Decken, Seife und Toilettenpapier',
          hr: 'Ručnici, plahte, dodatni jastuci i pokrivači, sapun i toaletni papir',
        },
      },
      {
        label: { sl: 'Pralni stroj in nega perila', en: 'Washer, Iron & Drying Rack', de: 'Waschmaschine, Bügeleisen & Wäscheständer', hr: 'Perilica rublja, glačalo i sušilo' },
        value: {
          sl: 'Brezplačen pralni stroj v stavbi, likalnik in stojalo za sušenje perila',
          en: 'Free washer in building, iron, and drying rack for clothing',
          de: 'Kostenlose Waschmaschine im Haus, Bügeleisen und Wäscheständer',
          hr: 'Besplatna perilica rublja u objektu, glačalo i stalak za sušenje rublja',
        },
      },
      {
        label: { sl: 'Zatemnitev in zaščita pred insekti', en: 'Room-Darkening Shades & Mosquito Nets', de: 'Verdunkelung & Moskitonetze', hr: 'Zatamnjenje i mreže protiv komaraca' },
        value: {
          sl: 'Senčila za zatemnitev prostorov in mreže proti komarjem na oknih',
          en: 'Room-darkening shades and window mosquito nets fitted',
          de: 'Verdunkelungsrollos und Moskitonetze an den Fenstern',
          hr: 'Sjenila za zamračivanje prostora i mreže protiv komaraca',
        },
      },
      {
        label: { sl: 'Garderoba', en: 'Clothing Storage', de: 'Kleiderschrank', hr: 'Pohrana odjeće' },
        value: {
          sl: 'Prostorne omare za shranjevanje oblačil in obešalniki',
          en: 'Wardrobe closets and hangers in bedrooms',
          de: 'Kleiderschränke und Kleiderbügel',
          hr: 'Ormari za pohranu odjeće i vješalice',
        },
      },
      {
        label: { sl: 'Kopalniška oprema', en: 'Bathroom Amenities', de: 'Badezimmerausstattung', hr: 'Kupaonska oprema' },
        value: {
          sl: '2 kopalnici z WC-jem, sušilnik za lase, šampon, čistilna sredstva, topla voda',
          en: '2 full bathrooms, hair dryer, shampoo, cleaning products, plentiful hot water',
          de: '2 Bäder mit WC, Haartrockner, Shampoo, Reinigungsmittel, Warmwasser',
          hr: '2 kupaonice s WC-om, sušilo za kosu, šampon, sredstva za čišćenje, topla voda',
        },
      },
    ],
  },
  {
    id: 'family-comfort',
    title: {
      sl: 'Družina, klimatizacija in povezljivost',
      en: 'Family, Climate & Connectivity',
      de: 'Familie, Klima & Unterhaltung',
      hr: 'Obitelj, klimatizacija i povezivost',
    },
    subtitle: {
      sl: 'Brezskrbno bivanje v vseh letnih časih, prilagojeno družinam in otrokom',
      en: 'Year-round comfort and thoughtful amenities for families with children',
      de: 'Ganzjähriger Komfort und kinderfreundliche Ausstattung für Familien',
      hr: 'Cjelogodišnja udobnost i pažljivo prilagođeni sadržaji za obitelji s djecom',
    },
    items: [
      {
        label: { sl: 'Hlajenje in ogrevanje', en: 'Air Conditioning & Heating', de: 'Klimaanlage & Heizung', hr: 'Hlađenje i grijanje' },
        value: {
          sl: 'Stenska klimatska naprava za hlajenje in ogrevanje',
          en: 'Wall-mounted air conditioning and heating system',
          de: 'Wandklimaanlage zum Kühlen und Heizen',
          hr: 'Zidni klima-uređaj za hlađenje i grijanje',
        },
      },
      {
        label: { sl: 'Internet in zabava', en: 'Wi-Fi & Television', de: 'WLAN & TV', hr: 'Wi-Fi i TV' },
        value: {
          sl: 'Brezplačen zanesljiv Wi-Fi po celotni vili in TV v obeh hiškah',
          en: 'Complimentary reliable Wi-Fi throughout the villa and TV in both houses',
          de: 'Kostenloses, zuverlässiges WLAN auf dem gesamten Anwesen und TV',
          hr: 'Besplatan pouzdan Wi-Fi u cijeloj vili i TV u obje kućice',
        },
      },
      {
        label: { sl: 'Oprema za dojenčke in malčke', en: 'Crib, Travel Crib & High Chair', de: 'Babybett, Reisebett & Hochstuhl', hr: 'Dječji krevetić i hranilica' },
        value: {
          sl: 'Otroška posteljica (na zahtevo), Pack ’n Play potovalna posteljica in stol za hranjenje',
          en: 'Crib (available upon request), Pack ’n Play travel crib, and high chair',
          de: 'Babybett (auf Anfrage), Pack ’n Play Reisebett und Kinderhochstuhl',
          hr: 'Dječji krevetić (na zahtjev), Pack ’n Play putni krevetić i hranilica',
        },
      },
      {
        label: { sl: 'Otroška igrala na vrtu', en: 'Outdoor Kids’ Play Equipment', de: 'Kinderspielgeräte im Garten', hr: 'Dječja igrala u vrtu' },
        value: {
          sl: 'Velik trampolin in otroška mizica s stoli',
          en: 'Garden trampoline and dedicated kids’ table with chairs',
          de: 'Gartentrampolin sowie kleiner Kindertisch mit Stühlen',
          hr: 'Trampolin i dječji stolić sa stolicama',
        },
      },
      {
        label: { sl: 'Sprejem in dolgotrajna bivanja', en: 'Host Greeting & Long Stays', de: 'Persönlicher Empfang & Langzeitaufenthalte', hr: 'Doček domaćina i duži boravci' },
        value: {
          sl: 'Osebni sprejem gostitelja s predajo ključev · Dovoljena so dolgotrajna bivanja',
          en: 'Personal greeting and property tour by host · Long-term stays allowed',
          de: 'Persönlicher Empfang mit Schlüsselübergabe · Langzeitaufenthalte erlaubt',
          hr: 'Osobni doček domaćina s predajom ključeva · Dozvoljeni duži boravci',
        },
      },
    ],
  },
];

export const HOUSE_RULES = [
  {
    label: { sl: 'Prihod (Check-in)', en: 'Check-in', de: 'Check-in (Anreise)', hr: 'Prijava (Check-in)' },
    value: { sl: 'Po 15:00 (15:00 – 19:00)', en: 'From 15:00 to 19:00', de: 'Ab 15:00 Uhr (15:00 – 19:00)', hr: 'Od 15:00 do 19:00' },
  },
  {
    label: { sl: 'Odhod (Check-out)', en: 'Check-out', de: 'Check-out (Abreise)', hr: 'Odjava (Check-out)' },
    value: { sl: 'Pred 10:00 (06:00 – 10:00)', en: 'From 06:00 to 10:00', de: 'Vor 10:00 Uhr (06:00 – 10:00)', hr: 'Od 06:00 do 10:00' },
  },
  {
    label: { sl: 'Največje število gostov', en: 'Maximum Guests', de: 'Maximale Gästeanzahl', hr: 'Maksimalan broj gostiju' },
    value: { sl: '6 oseb', en: '6 guests', de: '6 Personen', hr: '6 osoba' },
  },
  {
    label: { sl: 'Čas za nočni mir in počitek', en: 'Quiet Hours', de: 'Nachtruhe', hr: 'Vrijeme noćnog mira' },
    value: { sl: '23:00 – 08:00', en: '23:00 – 08:00 (11:00 PM – 8:00 AM)', de: '23:00 – 08:00 Uhr', hr: '23:00 – 08:00' },
  },
  {
    label: { sl: 'Hišni ljubljenčki', en: 'Pets', de: 'Haustiere', hr: 'Kućni ljubimci' },
    value: { sl: 'Niso dovoljeni', en: 'Not allowed', de: 'Nicht erlaubt', hr: 'Nisu dozvoljeni' },
  },
  {
    label: { sl: 'Zabave in dogodki', en: 'Parties or Events', de: 'Partys oder Veranstaltungen', hr: 'Zabave i događanja' },
    value: { sl: 'Niso dovoljeni', en: 'Not allowed', de: 'Nicht erlaubt', hr: 'Nisu dozvoljeni' },
  },
  {
    label: { sl: 'Kajenje v notranjosti', en: 'Smoking Indoors', de: 'Rauchen im Haus', hr: 'Pušenje u zatvorenom' },
    value: { sl: 'Ni dovoljeno', en: 'Not allowed', de: 'Nicht erlaubt', hr: 'Nije dozvoljeno' },
  },
];

export const COOKIE_TABLE = [
  { name: 'PHPSESSID', purpose: 'Sistemski piškotek za delovanje seje', duration: 'Do zaprtja brskalnika', domain: 'leonardo-house.com' },
  { name: 'allowCookies', purpose: 'Shrani izbiro uporabnika glede piškotkov', duration: '2 leti', domain: 'leonardo-house.com' },
  { name: '_ga / _gat', purpose: 'Statistika ogledov spletne strani (Google Analytics)', duration: '10 min – 2 leti', domain: 'leonardo-house.com' },
  { name: 'NID / PREF / SID', purpose: 'Prikaz zemljevida in lokacije (Google Maps)', duration: '6 mesecev – 2 leti', domain: '.google.com' },
];
