# Leonardo House (`nova.leonardo-house.com`)

Spletna predstavitev posesti **Leonardo House** v Bužiniji pri Novigradu (React + Vite + Tailwind CSS + PHP/Express sinhronizacija Airbnb koledarja + Google Maps).

Projekt je nastavljen tako, da ob vsakem prenosu (*commit / push*) iz **Google AI Studia** na GitHub:
1. **GitHub Actions** (`.github/workflows/deploy.yml`) samodejno zgradi in posodobi mapo **`dist/`** na GitHubu.
2. **cPanel Git™ Version Control** (`.cpanel.yml`) namesti vsebino `dist/` neposredno v `/home/leonardohouse/nova.leonardo-house.com/`.

---

## 1. Commit iz AI Studia na GitHub

1. V Google AI Studiu kliknite **Save / Commit to GitHub** in potisnite projekt v svoj GitHub repozitorij (veja `main`).
2. Na GitHubu odprite zavihek **Actions**: workflow **Build dist & Auto-Refresh cPanel** se bo zagnal samodejno, zgradil aplikacijo in ustvaril/posodobil mapo **`dist/`** v repozitoriju.

*(Opomba: če workflow na GitHubu javi napako pri pushu, v GitHub repozitoriju pod **Settings → Actions → General → Workflow permissions** preverite, da je izbrano **Read and write permissions**.)*

---

## 2. Ustvarjanje poddomene v cPanelu

1. Prijavite se v **cPanel** (`leonardohouse`).
2. Odprite **Domains → Create A New Domain**.
3. Vnesite: `nova.leonardo-house.com`.
4. **Odkljukajte** *"Share document root"* in potrdite privzeto pot `/home/leonardohouse/nova.leonardo-house.com` (ta je že nastavljena v `.cpanel.yml`).
5. V **SSL/TLS Status** zaženite **Run AutoSSL** za veljaven HTTPS certifikat.

---

## 3. Povezava cPanel Git™ Version Control

1. V cPanelu odprite **Git™ Version Control → Create**.
2. Vnesite:
   - **Clone URL**: URL vašega GitHub repozitorija
   - **Repository Path**: `/home/leonardohouse/repositories/leonardo-house` *(ali ime vašega repozitorija)*
   - **Repository Name**: `leonardo-house`
3. Kliknite **Create**.
4. Ob prvi nastavitvi (ko GitHub Actions že ustvari mapo `dist/`) kliknite **Manage → Pull or Deploy → Update from Remote** in nato **Deploy HEAD Commit**.

---

## 4. Popolnoma samodejno osveževanje strani na cPanelu ob vsakem pushu na GitHub

Da se bo stran na `nova.leonardo-house.com` po vsakem commitu v GitHub **samodejno osvežila brez prijave v cPanel**:

1. V **cPanelu** odprite **Security → Manage API Tokens → Create**:
   - Vnesite ime žetona (npr. `github-deploy`) in kliknite **Create**, nato skopirajte ustvarjeni žeton.
2. Na **GitHubu** v vašem repozitoriju odprite **Settings → Secrets and variables → Actions → New repository secret** in dodajte:
   - `CPANEL_HOST`: naslov vašega cPanela brez `https://` in brez vrat (npr. `cpanel.vase-gostovanje.si`)
   - `CPANEL_USER`: `leonardohouse`
   - `CPANEL_API_TOKEN`: skopirani cPanel API žeton
   - *(Opcijsko)* `CPANEL_REPO_ROOT`: polna pot do repozitorija na cPanelu, če ni `/home/leonardohouse/repositories/<ime-repozitorija>`

Od takrat naprej bo vsak commit iz AI Studia na GitHub samodejno zgradil `dist/`, potegnil spremembe v cPanel in zagnal `.cpanel.yml` za osvežitev poddomene `nova.leonardo-house.com`.

---

## 5. Vklop interaktivnega Google Maps na poddomeni (opcijsko)

Zaradi varnosti in pravil GitHuba ključ Google Maps API ni zapisan v kodi repozitorija:

1. V Google Cloud Console ustvarite API ključ za **Maps JavaScript API** z omejitvijo HTTP referrer na `https://nova.leonardo-house.com/*`.
2. V cPanel **File Manager** v mapi `/home/leonardohouse/nova.leonardo-house.com/` uredite datoteko `runtime-config.js` in vnesite ključ:
   ```js
   window.__LEONARDO_CONFIG__ = window.__LEONARDO_CONFIG__ || {
     googleMapsApiKey: 'VAS_OMEJEN_GOOGLE_MAPS_KLJUC',
   };
   ```
3. Skripta `.cpanel.yml` to datoteko ob vseh nadaljnjih samodejnih osvežitvah ohrani nedotaknjeno.
