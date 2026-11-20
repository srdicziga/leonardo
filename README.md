# Leonardo House (`nova.leonardo-house.com`)

Spletna predstavitev posesti **Leonardo House** v Bužiniji pri Novigradu (React + Vite + Tailwind CSS + PHP/Express sinhronizacija Airbnb koledarja + Google Maps).

Projekt je pripravljen tako, da ga **neposredno iz Google AI Studia** potisnete (*commit / push*) v svoj GitHub repozitorij, nato pa ga prek **cPanel → Git™ Version Control** z enim klikom namestite na poddomeno **`nova.leonardo-house.com`**.

---

## 1. Neposreden Commit iz AI Studia na GitHub

V repozitorij sta vključeni tako izvorna koda (`src/`, `public/`, `server.ts`) kot tudi sveže zgrajena produkcijska različica v mapi `dist/` (vključno z `.htaccess`, `api/airbnb-calendar.php` in `runtime-config.js`), brez vgrajenih tajnih ključev:

1. V Google AI Studiu kliknite ikono za **GitHub** (Save / Commit to GitHub) in izberite ali ustvarite repozitorij (npr. `leonardo-house`).
2. Potrdite commit in push na vejo `main`.
3. Če projekt urejate tudi lokalno:
   ```bash
   git add .
   git commit -m "Posodobitev spletne strani Leonardo House"
   git push origin main
   ```

---

## 2. Ustvarjanje poddomene v cPanelu

1. Prijavite se v **cPanel** vašega gostovanja.
2. Odprite **Domains** → **Create A New Domain**.
3. Vnesite domeno: `nova.leonardo-house.com`.
4. **Odkljukajte** *"Share document root"* in pustite privzeto pot `/home/VAS_UPORABNIK/nova.leonardo-house.com` (na to pot kaže `.cpanel.yml`).
5. Po ustvarjanju v **SSL/TLS Status** kliknite **Run AutoSSL**, da poddomena dobi veljaven HTTPS certifikat.

---

## 3. Povezava prek cPanel Git™ Version Control

1. V cPanelu odprite **Git™ Version Control** → **Create**.
2. Vnesite:
   - **Clone URL**: URL vašega GitHub repozitorija (npr. `https://github.com/VAS_UPORABNIK/leonardo-house.git` ali SSH, če je repozitorij zaseben).
   - **Repository Path**: `/home/VAS_UPORABNIK/repositories/leonardo-house`
   - **Repository Name**: `leonardo-house`
3. Kliknite **Create**.
4. Pri ustvarjenem repozitoriju kliknite **Manage** → zavihek **Pull or Deploy**:
   - Če je gumb **Update from Remote** aktiven, kliknite nanj (da potegnete zadnje spremembe).
   - Kliknite **Deploy HEAD Commit**.
5. Datoteka `.cpanel.yml` bo samodejno prekopirala celotno vsebino `dist/` (vključno z `.htaccess` in `/api/airbnb-calendar.php`) v `/home/VAS_UPORABNIK/nova.leonardo-house.com/`.

*(Opomba: Če ima vaša poddomena v cPanelu nastavljen drugačen Document Root, npr. `public_html/nova.leonardo-house.com`, v datoteki `.cpanel.yml` prilagodite vrstico `DEPLOYPATH`.)*

---

## 4. Vklop Google Maps na produkcijski poddomeni (opcijsko)

Zaradi varnosti in pravil GitHuba ključ Google Maps API ni zapisan v kodi repozitorija. Če želite, da na `nova.leonardo-house.com` prikazuje interaktivni zemljevid (sicer se prikaže nadomestni okvirček z naslovom in gumbom za Google Zemljevide):

1. V Google Cloud Console ustvarite API ključ z vklopljenim **Maps JavaScript API** in ga omejite z **HTTP referrer** na `https://nova.leonardo-house.com/*`.
2. V cPanelu odprite **File Manager** → mapo poddomene `nova.leonardo-house.com`.
3. Uredite datoteko `runtime-config.js` in vstavite svoj ključ:
   ```js
   window.__LEONARDO_CONFIG__ = window.__LEONARDO_CONFIG__ || {
     googleMapsApiKey: 'VAS_OMEJEN_GOOGLE_MAPS_KLJUC',
   };
   ```
4. Pri prihodnjih posodobitvah prek **Deploy HEAD Commit** skripta `.cpanel.yml` samodejno ohrani vašo nastavljeno datoteko `runtime-config.js`.
