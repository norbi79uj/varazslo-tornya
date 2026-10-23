# SNES-falu és környék – tényleges teszteredmények

**Dátum:** 2026. október 23. **Fejlesztési ág:** `feat/snes-falu-kornyek`.

| Ellenőrzés                                                                      | Eredmény                                |
| ------------------------------------------------------------------------------- | --------------------------------------- |
| Logikai és hangkezelési tesztek, `npm test`                                     | **23/23 sikeres**, 0 hibás, 0 kihagyott |
| Chromium, `npm run test:browser`                                                | **9/9 sikeres**, 0 hibás, 0 kihagyott   |
| Firefox ESR, `npm run test:firefox`                                             | **8/8 sikeres**, 0 hibás, 0 kihagyott   |
| Az utolsó grafikai hibakezelési módosítás célzott Chromium-ellenőrzése          | **1/1 sikeres**                         |
| JavaScript szintaxis és `git diff --check`                                      | Sikeres                                 |
| Grafikai atlasz és koordináták megismételt újraépítése, SHA-256 összehasonlítás | Azonos kimenetek                        |
| Nyolc játékállapot képernyőképeinek elkészítése és vizuális megtekintése        | Sikeres                                 |

Környezet: Debian 13, Node.js 24.19.0, Python 3.12.14, Chromium **154.0.8037.57**, Firefox ESR **153.5.1**, Playwright **1.58.2**, Puppeteer Core **25.16.0**. A böngészők ténylegesen, headless módban futottak, helyi HTTP-szerverről.

## Mit végzett el a böngészős teszt?

**Mindkét böngészőben:**

1. Indítás, tényleges játékrajzolás; Boros, Ilona, Áron, Márton, Réka és Dénes párbeszédei; elégtelen arany elutasítása; kard- és italvásárlás; gyógyulás; növénygyűjtés és egyszeri falusi jutalom; oldal-újratöltés utáni visszatöltés.
2. WASD és nyilak; falu–rét–erdő határátlépés mindkét irányban; kardcsapásokkal ellenfél legyőzése; TP/arany jóváírás; gyógyital; ellenféltől sebződés és vereség; visszatérés a faluba helyes aranyveszteséggel.
3. Teljes mentési küldetés: zárt kapu, Márton megbízása, Dénes kiszabadítása, visszatérés, jutalompengéje, szintlépés, Tövisúr valódi kardcsapásokkal történő legyőzése, győzelem és a nyitott kapu állapotának mentése.
4. Kunyhóba belépés, napló, szekrény első és második kézi vizsgálata, retesz/félretolás, pince; felirat; zárt láda; hibás rúnasorrend nullázása; helyes sorrend; egyszeri medál/arany/ital; belső helyszín visszatöltése és kijutás.
5. Hang ki/be, sérült mentés kezelése, új játék megerősítése és megszakítása, mobilméretű nézet túlcsordulás nélkül.
6. A helyi PNG-atlasz sikeres HTTP-betöltése; 74 sprite/csempe, megfelelő forrásméretek és több mint húsz ténylegesen megrajzolt szín ellenőrzése a Canvas-pufferből. A teljes Firefox-futásban **0 alkalmazásból érkező JavaScript-futáshiba és 0 külső erőforráskérés** volt.
7. Mind a **kilenc falusi ajtó** be- és kilépése, belső helyszín mentése és oldal-újratöltés utáni folytatása; kovács belső párbeszéde; bútorütközés; napló nélkül a szekrény nem nyit rejtekutat. Firefoxban a bélelt mellény tényleges megvásárlása, helyes aranylevonása és +1 maximális életereje is lefutott.
8. Víznél megálló mozgás; a fahídon tényleges átsétálás; hangerő és visszaállítása; zárt kapunál mozgáskorlát, legyőzött főellenfélnél a kapuküszöb tényleges átlépése és megőrzése. Firefoxban a főellenfél-zene saját hangfrekvenciáinak ellenőrzése is lefutott.

**További Chromium-ellenőrzések:**

- CSS és JavaScript HTTP-betöltése, a Canvas `pixelated` megjelenítési stílusa.
- A PNG szándékosan megszakított letöltése látható hibaüzenetet és tiltott indítást eredményez. R és Betöltés sem tudja elrejteni vagy megkerülni ezt az állapotot; nincs geometriai helyettesítő pálya.
- Házfal ütközése és a mentett pozíció ellenőrzése.
- **Érintéses emuláció:** valódi böngészős touchStart/touchEnd eseménnyel nyomva tartott iránygomb ténylegesen mozgatja a lovagot; E-gomb érintésével Réka párbeszéde nyílik meg.
- Teljes felszerelésű 5. szint, **11/11 életerő**, 390 × 844-es nézet: nincs vízszintes túlcsordulás.

A tesztek a hosszú sétákat mentési ellenőrzőpontokkal rövidítik. A tényleges műveletek a felületen, billentyűkkel vagy érintéssel történnek; a motor közvetlen függvényeit a böngészős forgatókönyvek nem hívják. A nyitott kapu önálló mozgástesztje kész végállapotot használ, a főellenfél legyőzése külön, teljes küldetéses forgatókönyvben valódi harccal történik. Ez nem egyetlen, megszakítás nélkül kézzel végigjátszott útvonal mérése.

## A 23 logikai ellenőrzés

A motor- és hangtesztek lefedik az irányított támadást és várakozási időt, egyszeri jutalmakat és távoli újraéledést, 1–5. szintet, épület/pályahatárt, párbeszéd alatti szünetet, árakat és pénzhiányt, mellényt és teljes életerőn el nem fogyó italokat, növényküldetést, mentési küldetést és főellenfél-pajzsot, végleges győzelmet, a szekrény automatikus jelzésének hiányát, naplófüggést, rúnarejtvényt, vereséget, teljes mentési kört, sérült/tiltott tárhelyet, hibás koordináták és tárgyadatok elutasítását, víz/híd/szikla ütközést, kilenc ajtó visszaútját és belső mentését, **korábbi v1 mentés migrációját**, kapuküszöböt, hiányzó/függő hangkimenetet, három eltérő zenetémát, hangerőt és némítást.

## Vizuális ellenőrzés

Az `npm run screenshots` nyolc valódi játékállapotot rögzített: falu, déli falu, patak/híd, erdő, sziklás magaslat, kunyhó, pince, kovácsműhely. A képeket megtekintve ellenőriztem a felismerhető fákat, házakat, karaktereket, vízfolyást, hidat, bútorokat, tárgyakat, kamerát és közös pixelméretet/palettát.

A kimenetek helye `artifacts/previews/`, nem a Gitbe kerülő játékkód részei. A játékhoz használt PNG és az összes szerkeszthető grafikai forrás viszont verziókezelt. A képernyőképekből nem következtettünk emberi hangszórós meghallgatásra vagy fizikai mobilkészülékes működésre.

## Firefox-hangteszt környezete és korlátok

A Playwright saját Firefox-letöltését a proxy korábban blokkolta. A valódi Firefox ESR a Debian aláírt csomagindexei alapján letöltött csomagból került a tesztgép `/tmp` könyvtárába. Aláírás- és TLS-ellenőrzést nem kapcsoltunk ki.

A felhőkonténerben nincs fizikai hangkártya és tiltott a felhasználói névterek létrehozása. A teszt saját Firefox-profilja engedélyezi a Web Audio automatizált lejátszását; az AudioContext helyi, virtuális PulseAudio-kimenetre játszik. Kizárólag a tesztfolyamatnak kellett konténerbeli sandbox-beállításokat módosítania. Ezek nem részei a játék működésének és nem állítják át a felhasználó böngészőjét.

A ténylegesen sikeres parancs az előkészített tesztgépen:

```sh
FIREFOX_PATH=/tmp/smaragd-firefox/runtime/usr/lib/firefox-esr/firefox-esr \
XDG_CONFIG_HOME=/tmp/smaragd-firefox/config \
XDG_CACHE_HOME=/tmp/smaragd-firefox/cache \
MOZ_DISABLE_CONTENT_SANDBOX=1 \
MOZ_DISABLE_UTILITY_SANDBOX=1 \
FIREFOX_CONTAINER_AUDIO=1 \
PULSE_SERVER=unix:/tmp/smaragd-pulse/run/native \
npm run test:firefox
```

Ellenőriztük a működő AudioContextet és a külön falusi, erdei és főellenfél-oszcillátorsorokat. **Fizikai hangszórós meghallgatás és valódi mobiltelefonos próba nem történt.** A mobilvezérlést Chromium érintéses emulációja ellenőrizte. Az `index.html` közvetlen `file://` indítását nem állítjuk támogatottnak; a kért egyszerű helyi webszerveres indítás működik.

## Javítások a tesztek alapján

- Az alsó házsor előtt túl szűk volt a járható sáv; a házakat beljebb helyeztem. Mind a kilenc ajtó mentése/belépése/kilépése utána sikeres.
- A titkos szekrény korábban napló nélkül is elmozdítható volt; az új kérés szerint ez most naplóhoz és kézi vizsgálathoz kötött.
- Hiányzó grafika mellett az újrakezdés és visszatöltés most sem kerülheti meg a betöltési hibát.
- A korábbi mentések új bútorba vagy vízbe kerülő pozícióját biztonságos helyre migráljuk, tárgyvesztés nélkül.

## GitHub

A felhasználó jóváhagyása után a `feat/snes-falu-kornyek` ágat feltöltöttük GitHubra. A visszaolvasott távoli ág a jóváhagyott `1ac7a98d2970893c3cf0b8154dd3d2cd3ff6fdc0` játékverzióra mutatott. A távoli commit fájlfájában ellenőriztük az `index.html`, a JavaScript-modulok, az atlasz PNG és koordinátajegyzéke, az `ASSET_CREDITS.md`, a README és e tesztjelentés jelenlétét. A `main`, `feat/browser-knight-game` és `feat/smaragdvolgy` ágak változatlanok. Ez a dokumentációs frissítés a sikeres feltöltés tényét rögzíti; a tesztelt játékkód nem változott.
