# Hatékony 3D felmérés

Önálló magyar ipari B2B oldal a `hatekony3dfelmeres.hu` domainre. A VPS-en a `site-8` könyvtárba kerül, és kizárólag a `8000`-es porton figyel. Nem használja a `site-1`, `site-6` vagy `site-7` folyamatát, adatát, sütijét vagy portját.

Fejlesztői gépen a munkamappa neve `site-8_newdew` lehet. Élesben a könyvtár neve `site-8`. A kettő ugyanaz az alkalmazás.

## Mit csinál

- Bemutatja a három feladatot: géptelepítés előkészítése, csarnok- és raktárátalakítás, gépészeti tér rekonstrukciója.
- Projektigényt fogad, SQLite fájlba menti, és e-mail értesítőt küld.
- Jelszóval védett nyilvántartást ad, CSV-exporttal.
- Nem számol árat, nem kezel fizetést, és nem köt szerződést.

## Követelmény

- Node.js 22.5 vagy újabb (a beépített `node:sqlite` miatt)
- Élesben nginx, amely a `hatekony3dfelmeres.hu` nevet a `127.0.0.1:8000` címre továbbítja

## Indítás fejlesztéshez

```bash
cp .env.example .env
npm install
npm run og
npm run dev
```

Az oldal: <http://127.0.0.1:8000>

A `.env` nem kerül verziókezelésbe. Titkot, SMTP-jelszót és admin jelszót csak oda írjon. Generálás:

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

Ha az `ADMIN_TOKEN` üres, a nyilvános oldal működik, az `/admin` viszont kikapcsolva marad.

Ha az `SMTP_HOST` üres, a projektigény ettől még rögzül. Az értesítő szövege a `data/outbox` mappába kerül. Élesben töltse ki az SMTP mezőket, a feladó cím legyen a `SMTP_FROM`, a címzett a `CONTACT_EMAIL`.

## Éles indítás systemd-vel

Ez az elsődleges út a VPS-en. A `deploy/hatekony3dfelmeres.service` sablon a `/srv/site-8` útvonalat feltételezi; cserélje a valódi `site-8` könyvtárra.

```bash
sudo useradd --system --home /srv/site-8 --shell /usr/sbin/nologin h3df-site8
sudo mkdir -p /srv/site-8
sudo rsync -a --exclude node_modules --exclude data ./ /srv/site-8/
cd /srv/site-8
npm ci --omit=dev
cp .env.example .env
# töltse ki a .env titkait, a SITE_URL legyen https://hatekony3dfelmeres.hu
sudo chown -R h3df-site8:h3df-site8 /srv/site-8
sudo cp deploy/hatekony3dfelmeres.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now hatekony3dfelmeres
```

A szolgáltatás `Restart=always` miatt magától újraindul. A unit a `HOST` és a `PORT` értékét `127.0.0.1` és `8000` értékre kényszeríti, akkor is, ha a `.env` mást mondana.

Napló:

```bash
journalctl -u hatekony3dfelmeres -f
```

Emellett az alkalmazás a `data/logs/app.log` fájlba is ír. A fájl a `site-8/data` alatt van, nem közös más site naplójával.

## Docker, ha nem systemd fut

A `docker-compose.yml` a konténert a hoszt `127.0.0.1:8000` címére köti. Bent a folyamat a `0.0.0.0:8000` címen figyel, hogy a porttovábbítás elérje. Kívülről továbbra is csak a localhost látszik.

Ne indítsa a systemd unitot és a konténert egyszerre: mindkettő a 8000-es portot kéri.

```bash
docker compose up -d --build
docker compose logs -f
```

A `data` könyvtár a konténeren kívül marad. Ha a `node` felhasználó nem tud írni bele, a könyvtár tulajdonosát a konténer felhasználójára kell állítani.

## Port

Az alkalmazás csak a `8000`-es porton indul. Ha a `PORT` nem 8000, leáll, és nem választ másikat. Ha a 8000 foglalt, kiírja a foglaló folyamatot, nem állítja le, és a döntésre vár.

## Reverse proxy

A kész vhost: `deploy/nginx/hatekony3dfelmeres.hu.conf`

A `hatekony3dfelmeres.hu` `location /` blokkja:

```nginx
proxy_pass http://127.0.0.1:8000;
```

Bekötés a többi vhost érintése nélkül:

```bash
sudo cp deploy/nginx/hatekony3dfelmeres.hu.conf /etc/nginx/sites-available/hatekony3dfelmeres.hu
sudo ln -s /etc/nginx/sites-available/hatekony3dfelmeres.hu /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Tanúsítvány:

```bash
sudo certbot --nginx -d hatekony3dfelmeres.hu -d www.hatekony3dfelmeres.hu
```

A fájlban a 443-as blokk kommentben készen áll, az upstream ott is `127.0.0.1:8000`. Éles `SITE_URL`: `https://hatekony3dfelmeres.hu`.

## Admin és export

Belépés: `/admin`, a jelszó az `ADMIN_TOKEN`. A süti neve `h3df_admin`, 12 óráig él, és csak ehhez a folyamathoz tartozik.

A lista státusza módosítható. Törlés előtt az azonosítót be kell gépelni. A CSV a szűrt listából készül, pontosvesszővel, UTF-8 jelöléssel. Az export útvonala: `/admin/export.csv`.

## Adat

Alapértelmezés: `DATABASE_URL=file:./data/leads.sqlite`, a `site-8` gyökeréhez képest. Ne mutasson másik site adatfájljára.

A projektigény mezői: beküldés időpontja, forrásdomain, forrás URL, campaign/UTM, cég neve, kapcsolattartó, e-mail, telefon, iparág, projekt típusa, helyszín, tervezett ütemezés, hozzáférési időablak, kért kimenet, koordinátarendszer, pontossági igény, fájlméret, megjegyzés, státusz.

## Környezeti változók

| Név | Szerep |
| --- | --- |
| `SITE_NAME` | A megjelenő név |
| `SITE_URL` | Kanonikus cím, élesben `https://hatekony3dfelmeres.hu` |
| `PORT` | Mindig `8000` |
| `HOST` | Éles folyamatnál `127.0.0.1`, konténerben `0.0.0.0` |
| `DATABASE_URL` | Saját SQLite fájl |
| `CONTACT_EMAIL` | Nyilvános cím és az értesítő címzettje |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Levélküldés |
| `ADMIN_TOKEN` | Az admin jelszava |
| `SESSION_SECRET` | A süti aláírása; ha üres, az `ADMIN_TOKEN` a titok |

## Ellenőrzés

```bash
npm test
curl -I http://127.0.0.1:8000/
curl http://127.0.0.1:8000/healthz
```

A `8000`-es port foglaltsága:

```bash
ss -ltnp 'sport = :8000'
```

Windowson: `netstat -ano -p tcp`, és a `LISTENING` vagy `FIGYEL` sorban a `:8000`.
