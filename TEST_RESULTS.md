# Három Kenney-csomag – tényleges teszteredmények

**Dátum:** 2026. október 23. **Ág:** `feat/kenney-graphics`. A működő `feat/snes-falu-kornyek` (`6003049`) és a már feltöltött Characters-mérföldkő (`f8497cd`) folytatása.

## Lefuttatott ellenőrzések

| Ellenőrzés                                                                            | Tényleges eredmény                                  |
| ------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `npm test`: motor, hang, grafikai források                                            | **27/27 sikeres**, 0 hibás, 0 kihagyott             |
| `npm run test:browser`: Chromium                                                      | **10/10 sikeres**, egy teljes futásban, 0 kihagyott |
| `npm run test:firefox`: valódi Firefox ESR, WebDriver BiDi                            | **8/8 sikeres**, 0 kihagyott                        |
| Három Kenney PNG, három licenc, három csempeleírás összevetése a feltöltött ZIP-ekkel | **Mind a kilenc fájl bájtazonos**                   |
| `npm run screenshots`: nyolc játékállapot                                             | Elkészültek és vizuálisan megtekintve               |
| JavaScript-szintaxis, `git diff --check`                                              | Sikeres                                             |

Környezet: Debian 13, Node.js 24.19.0, Python 3.12.14, Chromium **154.0.8037.57**, Firefox ESR **153.5.1**, Playwright **1.58.2**, Puppeteer Core **25.16.0**. Mindkét böngésző headless módban, helyi HTTP-szerverről futott. A végleges szekrény-illesztés után a teljes Chromium- és Firefox-sorozat ismét sikeresen lefutott; azóta játékkód nem változott.

## Mit teszteltünk mindkét böngészőben?

1. **Indítás és NPC-k:** tényleges Canvas-megjelenítés; Boros, Ilona, Áron, Márton, Réka és Dénes magyar párbeszédei. Elégtelen arany elutasítása, kard- és italvásárlás, helyes aranylevonás, fogadói gyógyulás, növénygyűjtés és egyszeri jutalom.
2. **Mozgás és harc:** WASD és nyilak, folyamatos falu–rét–erdő határátlépés mindkét irányban, kardcsapásokkal ellenfél legyőzése, TP/arany jóváírás, italhasználat, sebződés, vereség és falusi visszatérés.
3. **Fő küldetés:** Márton megbízása, Dénes kiszabadítása, visszatérés, szerény jutalompenge, szintlépés, Tövisúr tényleges kardcsapásokkal történő legyőzése és a kapu megnyitásának megőrzése. A nyitott kapuküszöb átlépését külön mozgási próba is ellenőrzi.
4. **Titkos pince:** belépés a kunyhóba, naplóolvasás, külön kézi szekrényvizsgálat és félretolás, lejutás, felirat, hibás rúnasorrend nullázása, helyes sorrend, egyszeri medál/arany/ital, belső mentés és visszaút. Napló nélkül a szekrény nem nyit átjárót.
5. **Mentés és ajtók:** mentés, oldal-újratöltés és folytatás; mind a kilenc falusi ajtó be- és kilépése a megfelelő visszatérési pontra, belső mentés, kovács párbeszéde bent, bútorütközés. Firefoxban a bélelt mellény vásárlása és +1 maximális életereje is ellenőrzött.
6. **Pályaütközés:** víznél megállás, valódi átsétálás a fahídon, déli térképrész és kamerakövetés, zárt és nyitott északi kapu.
7. **Három Kenney-forrás:** a két környezeti PNG HTTP-betöltése és mérete, mind az **59 környezeti grafikai definíció** tényleges rajzolása, látható pixelek és minden 2 × 2 pixeles blokk azonossága. Mind a **10 szereplőprofil** látható és a mozgatott képkockái különböznek. A teljes jelenet húsznál több színt tartalmaz.
8. **Felület és hang:** hangerő, némítás, külön falusi/erdei zenei oszcillátorsorok, sérült mentés, újrakezdés megerősítése/megszakítása, mobilméretű nézet túlcsordulás nélkül. Firefoxban külön főellenfél-zene is ellenőrzött.

A teljes Firefox-futásban **0 alkalmazásból érkező JavaScript-hiba és 0 külső erőforráskérés** volt.

## További Chromium-próbák

- Az RPG és Indoor PNG-k letöltésének külön-külön szándékos megszakítása látható grafikai hibát és tiltott indítást eredményez. Az R és a Betöltés sem kerüli meg a hibát. A Characters PNG ugyanilyen külön hibapróbája is sikeres.
- A régi `smaragd-atlas.png` blokkolása mellett is elindul a játék; a böngésző nem is kéri ezt a fájlt. Nincs régi atlaszos helyettesítés vagy külső grafikai kérés.
- A Canvas CSS-megjelenítése `pixelated`; az összes környezeti elem egész pixeles, élsimítás nélküli nagyítással rajzolódik.
- Házfal ütközése és a mentett pozíció ellenőrzése.
- TouchStart/touchEnd érintésemuláció ténylegesen mozgatja a lovagot; az E-gomb érintése Réka párbeszédét nyitja meg.
- Teljes felszerelésű 5. szint és 11/11 életerő mellett, 390 × 844-es nézetben sincs vízszintes túlcsordulás.

## Logikai és forrásellenőrzések

A 23 korábbi motor-/hangteszt megmaradt: irányított kardcsapás és várakozási idő, egyszeri jutalmak, távoli újraéledés, 1–5. szint, ütközések, párbeszéd alatti szünet, árak, mellény, italok, növény- és mentési küldetés, főellenfél-pajzs, végleges győzelem, jelzés nélküli szekrény, naplófüggés, rúnák, vereség, teljes mentési kör, sérült/tiltott tárhely és hibás mentésadatok, kilenc ajtó, v1-mentés migrációja, kapuküszöb, hanghibák, három zene, hangerő/némítás.

Négy grafikai teszt ellenőrzi a három PNG SHA-256 azonosítóját, képfejléc-méreteit és CC0-licenceit, a tíz karakterprofil forráskoordinátáit, valamint az összes környezeti kompozíció forrás- és célterületi határait. A tesztek mellett a kilenc eredeti PNG/licenc/leírás teljes bájtazonosságát közvetlenül a feltöltött ZIP-ekből is ellenőriztük.

Az `engine.js`, `world.js`, `game.js`, `audio.js`, a mentési kulcs és adatséma ebben a grafikai folytatásban nem változott. A régi mentések használhatók; nincs újrakezdési követelmény.

## Vizuális ellenőrzés

Az `artifacts/previews/` nyolc valódi játékállapota: falu, déli falu, patak/híd, erdő, sziklás magaslat, kunyhó, pince, kovácsműhely. Megtekintve ellenőriztem a fákat, házakat, szereplőket, bútorokat, kövezetet, hidat, vízpartok helyes irányát, szekrényt és egységes pixelméretet. Az első képeken észlelt hibás talajszegélyeket, felcserélt folyópartokat, ajtó- és bútorcsempéket a végleges ellenőrzések előtt javítottam.

A képernyőképek fejlesztői bizonyítékok, nem részei a Gitbe kerülő játékkódnak. A tényleges grafikai lapok, CC0-licencek, csempeleírások és renderelési jegyzékek verziókezeltek.

## Módszer és korlátok

A hosszú sétákat normál mentésadatokból készített ellenőrzőpontok rövidítik. A tényleges játékműveletek DOM-gombokkal, billentyűkkel és érintésemulációval történnek; a böngészős tesztek nem hívják közvetlenül a játék motorfüggvényeit. A grafikai próbák külön Canvas-ra is rajzolnak. Ez nem egyetlen megszakítás nélküli, kézi végigjátszás mérése.

A Kenney szereplők statikus rétegeiből lábelmozdítással és kis testmozgással készül animáció; a csomag nem kész járássorozatként van feltüntetve. Fizikai mobiltelefonos és hangszórós próba nem történt. A Web Audio ellenőrzése Firefoxban virtuális PulseAudio-kimenetet használ.

A korlátozott konténerben használt Firefox-parancs:

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

Ezek a tesztgép beállításai, a játék nem módosítja a felhasználó böngészőjének beállításait. A Firefox Debian-csomagból, aláírt csomagindex alapján került `/tmp` alá; TLS- és aláírás-ellenőrzést nem kapcsoltunk ki. A Playwright Firefox-letöltését a proxy blokkolta, ezért valódi Firefox ESR-rel és Puppeteer WebDriver BiDi-vel teszteltünk.
