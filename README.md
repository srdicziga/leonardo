# Leonardo House (`nova.leonardo-house.com`)

Spletna predstavitev posesti **Leonardo House** v Bužiniji pri Novigradu (React + Vite + Tailwind CSS + Express/PHP Airbnb sinhronizacija koledarja).

---

## 1. Prenos kode na GitHub

V korenski mapi projekta zaženite:

```bash
git init
git add .
git commit -m "Priprava spletne strani Leonardo House za produkcijo"
git branch -M main
git remote add origin https://github.com/VAS_UPORABNIK/leonardo-house.git
git push -u origin main
```

Datoteka `.gitignore` samodejno izključi `node_modules/`, `dist/`, `server.js`, `.env*` in interne delovne mape.

---

## 2. Ustvarjanje poddomene v cPanelu

1. Prijavite se v **cPanel** vašega gostovanja.
2. Odprite **Domains** -> **Create A New Domain**.
3. Vnesite: `nova.leonardo-house.com`.
4. Odkljukajte *"Share document root"* in pustite pot npr. `/home/UPORABNIK/nova.leonardo-house.com`.
5. V **SSL/TLS Status** zaženite **Run AutoSSL**, da poddomena dobi veljaven HTTPS certifikat.

---

## 3. Namestitev na cPanel (izberite enega od dveh načinov)

### Način A: Klasično cPanel gostovanje (Apache + PHP — najenostavnejše)

Projekt vključuje `public/.htaccess` in `public/api/airbnb-calendar.php`, ki se ob gradnji samodejno prekopirata v `dist/`. Tako delujejo SPA poti, preusmeritev na HTTPS in živa sinhronizacija z Airbnb koledarjem brez potrebe po Node.js strežniku.

1. Na svojem računalniku zaženite:
   ```bash
   npm install
   npm run build
   ```
2. Odprite mapo `dist/`.
3. V cPanelu odprite **File Manager** -> pojdite v korensko mapo poddomene (`nova.leonardo-house.com`).
4. V zgornjem desnem kotu **Settings** vključite **"Show Hidden Files (dotfiles)"**, da boste videli `.htaccess`.
5. Naložite **celotno vsebino** mape `dist/` (datoteke `index.html`, `.htaccess` ter mapi `assets/`, `images/`, `api/`) neposredno v mapo `nova.leonardo-house.com`.
6. Odprite `https://nova.leonardo-house.com` in preverite delovanje strani ter koledarja.

---

### Način B: cPanel "Setup Node.js App" + Git™ Version Control

Če vaše gostovanje podpira Node.js aplikacije:

1. V cPanelu odprite **Git™ Version Control** -> **Create**, vnesite URL vašega GitHub repozitorija in pot npr. `/home/UPORABNIK/repositories/leonardo-house`.
2. Odprite **Setup Node.js App** -> **Create Application**:
   - **Node.js version**: 20.x ali novejši
   - **Application mode**: `Production`
   - **Application root**: pot do repozitorija
   - **Application URL**: `nova.leonardo-house.com`
   - **Application startup file**: `server.js`
3. V terminalu / prek gumba **Run NPM Install** namestite pakete in zgradite produkcijsko različico:
   ```bash
   npm install
   npm run build
   ```
4. Ponovno zaženite aplikacijo v cPanelu (**Restart**).

*(Opomba: če želite avtomatsko kopiranje prek `.cpanel.yml`, v datoteki `.cpanel.yml` zamenjajte `UPORABNIK` z vašim cPanel uporabniškim imenom.)*
