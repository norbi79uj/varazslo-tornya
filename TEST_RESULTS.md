# Smaragdvölgy – részletes falu: tényleges ellenőrzések

**Dátum:** 2026. október 23. **Ág:** `feat/smaragdvolgy-village-detail`. Kiindulás: a sikeresen tesztelt és feltöltött `feat/kenney-graphics`, `ce6e837`. Első működő fejlesztési mérföldkő: `5132526`.

## Eredmények

| Ellenőrzés                                                   | Eredmény                                                             |
| ------------------------------------------------------------ | -------------------------------------------------------------------- |
| `npm test`: motor, hang, grafika, falusi élet                | **34/34 sikeres**, 0 hibás, 0 kihagyott                              |
| `npm run test:browser`, Chromium                             | **12/12 sikeres**, 0 kihagyott                                       |
| `npm run test:firefox`, valódi Firefox ESR                   | **10/10 sikeres**, 0 kihagyott                                       |
| `npm run screenshots`                                        | **10** valódi játékállapot rögzítve és vizuálisan megtekintve        |
| Három Kenney PNG, három eredeti licenc és három csempeleírás | **Mind a kilenc fájl bájtazonos** a feltöltött ZIP-ekkel             |
| Saját pixelatlasz és két metaadatfájl ismételt újraépítése   | **Bájtazonos kimenet**                                               |
| Korábbi statikus játékadatok és `initialState()` összevetése | Változatlan történeti/fejlődési/ellenfél/ajtó/NPC/alapmentési adatok |
| JavaScript-szintaxis és `git diff --check`                   | Sikeres                                                              |

Környezet: Debian 13, Node.js **24.19.0**, Python **3.12.14**, Chromium **154.0.8037.57**, Firefox ESR **153.5.1**, Playwright **1.58.2**, Puppeteer Core **25.16.0**. Mindkét böngésző ténylegesen, headless módban, helyi HTTP-szerverről futott. Nem csupán szintaxis- vagy forráskód-ellenőrzés történt.

## A mindkét böngészőben elvégzett játékpróbák

1. **Indítás, NPC-k és kereskedés:** Boros, Ilona, Áron, Márton, Réka és Dénes magyar párbeszédei; elégtelen arany elutasítása; kard- és italvásárlás, helyes aranylevonás; fogadói gyógyulás; növénygyűjtés és egyszeri jutalom.
2. **Mozgás és harc:** WASD és nyilak; folyamatos falu–rét–erdő váltás mindkét irányban; kardcsapásokkal ellenfél legyőzése, TP és arany; gyógyital; sebződés, vereség, visszatérés a faluba.
3. **Dénes és Tövisúr:** megbízás felvétele, Dénes kiszabadítása, visszatérés, szerény jutalompenge, szintlépés, Tövisúr tényleges kardcsapásokkal történő legyőzése, kapunyitás mentése. Külön mozgásteszt ellenőrzi a lezárt, majd nyitott kapuküszöböt.
4. **Titkos pince:** kunyhóba belépés, naplóolvasás, szekrény kézi vizsgálata és félretolása, lejutás, felirat, hibás rúnasorrend nullázása, helyes sorrend, egyszeri medál/arany/ital, belső mentés és visszaút. Napló nélkül a szekrény nem nyit átjárót.
5. **Ajtók, mentés és ütközés:** mind a kilenc falusi ajtó be- és kilépése a megfelelő visszatérési pontra; belső mentés, oldal-újratöltés és folytatás; kovács beszélgetése bent; bútorütközés; víznél megállás és valódi átsétálás a fahídon. Firefoxban a bélelt mellény megvásárlása és +1 életereje is lefutott.
6. **Felület és hang:** némítás, hangerő megőrzése, külön falusi és erdei hangfrekvenciák, Firefoxban főellenfél-zene; hibás mentés kezelése, újrakezdés megerősítése/megszakítása, keskeny nézet vízszintes túlcsordulás nélkül.
7. **Grafika:** mind a **66 elérhető Kenney-környezeti definíció** és **72 saját kiegészítő grafika** tényleges Canvas-rajzolása, látható pixelek, minden 2 × 2 pixeles blokk azonossága. Mind a tíz szereplőprofil járási képkockái különböznek, és mindegyiküknek **négy eltérő irányképe** van. A teljes jelenet húsznál több színt tartalmaz.
8. **Valódi NPC-mozgás:** a futó játék Canvas-rajzolási transzformációit figyelő teszt kiméri Réka vízszintes helyváltoztatását; a megnyitott párbeszéd alatt a pozíció változatlan. A pult, Réka és a játékos tényleges kirajzolási sorrendjét is ellenőrzi: Réka a pult mögött, az előtte álló lovag a pult előtt látszik.
9. **GitHub Pages elérési útjának modellezése:** valódi helyi HTTP-alkönyvtárból indul a teljes játék, az összes modul és **mind a négy PNG** relatív útvonalról betöltődik, és billentyűkkel mozgatva a lovag helye ténylegesen változik a mentésben. A teszt nem helyettesíti az éles GitHub Pages közzététel ellenőrzését.

A teljes Firefox-futásban **0 alkalmazásból érkező JavaScript-hiba és 0 külső erőforráskérés** volt.

## További Chromium-próbák

- Az RPG-, Indoor- és Characters-PNG külön-külön szándékos megszakítása látható grafikai hibát és tiltott indítást eredményez. Az R és a Betöltés nem kerüli meg a Kenney-lapok hibáját.
- Az új `assets/village/details.png` megszakított betöltése is láthatóan megállítja az indítást. Nincs geometriai helyettesítő pálya.
- A régi `smaragd-atlas.png` blokkolása mellett elindul a játék; azt a böngésző nem is kéri.
- Canvas CSS: `pixelated`. A natív képpontok az új grafikai lapnál is élesek.
- Érintésemulációval az iránygomb mozgat, az E-gomb Réka párbeszédét nyitja meg.
- Teljes felszerelésű 5. szint, 11/11 életerő és 390 × 844-es nézet mellett sincs vízszintes túlcsordulás.

## A 34 motor-, hang- és adatellenőrzés

A 20 korábbi motorteszt megmaradt. Ezek az irányított kardcsapást, támadási várakozási időt, egyszeri jutalmakat, távoli újraéledést, 1–5. szintet, ütközést, párbeszéd alatti szünetet, árakat, felszerelést, italokat, küldetéseket, főellenfél-pajzsot, győzelmet, jelzés nélküli szekrényt, naplófüggést, rúnákat, vereséget, mentést, sérült adatokat, ajtókat, v1-migrációt és kapuküszöböt fedik le.

Négy hangteszt ellenőrzi a hiányzó/hibás/függő hangkimenetet, három zenetémát, hangerőt/némítást, valamint a halk, helyhez kötött, időben korlátozott környezeti hangokat. A háttérhangok párbeszédben és némításkor nem ütemeződnek, a rövid ajtóhang külön frekvenciasort kapott.

Öt grafikai teszt ellenőrzi a három Kenney PNG hashét, méretét és CC0-licencét, a tíz karakter forráskoordinátáit, a környezeti kompozíciók határait, valamint a saját PNG méretét, 72 képkivágását és saját CC0-licencét.

Öt új falusi teszt:

- Négy helyszín rutinjai 60 másodpercnyi szimuláció alatt minden útvonalpontot meglátogatnak, akadályba lépés és helyváltoztatási ugrás nélkül.
- A mozgó NPC látható pozíciója a megszólítás helye; beszélgetéskor a játékos felé fordul, és a teljes rutinóra megáll.
- Járhatósági keresés igazolja mind a kilenc ajtó megközelíthetőségét; az új kerítések és kút valóban akadályok.
- Korábbi szabályos v2-mentés új kültéri vagy belső díszletbe kerülő pozícióját közeli járható pontra igazítjuk, fejlődésvesztés nélkül.
- Az NPC-állapot nem kerül a mentésbe; a séma v2 marad, új játék és betöltés újraindítja a rutinokat.

Külön összehasonlítás igazolta, hogy a `ce6e837` verzióhoz képest változatlan a `WORLD`, `LEVEL_XP`, `WEAPONS`, `BUILDINGS`, `NPCS`, `HERBS`, `ENCOUNTERS`, `OBJECTS`, `STREAM`, `INTERIORS` és az `initialState()` kimenete. A párbeszédek kiegészültek, a korábbi történet, árak és jutalmak megmaradtak. A falusi élet külön, nem mentett osztályban működik.

## Vizuális ellenőrzés és reprodukálhatóság

A tíz megtekintett kép: falu, piac, fogadó, déli falu, patak/híd, erdő, sziklás magaslat, kunyhó, pince, kovácsműhely. Ellenőriztem a négyféle cserepezett tetőt, kerek kutat, standot, kovács- és favágóeszközöket, füstöt, kerteket, cégtáblákat, tyúkokat, árnyékokat, erdei tónust, fogadóbelsőt, bútorokat és karakterarányokat.

A képek alapján javult a piaci pult rétegzése: nem takarja el az előtte álló lovagot. A fogadó korábbi, bútorcsempékből összerakott szőnyege saját sík, mintás pixelrajzot kapott. A végleges változat után a teljes böngészős sorozatok újra lefutottak.

A saját PNG és két metaadatfájl újraépítése azonos bájtokat adott. Végleges `details.png` SHA-256: `264a07719c49cbf3722ab5ca7828a3526d7b4b39a65d3079d5128f2fafa4503c`. Az eredeti Kenney-fájlok külön ZIP-összevetése mind a kilenc fájlnál sikeres.

A képek helye `artifacts/previews/`, Git által figyelmen kívül hagyva. A tényleges PNG-k, licencek, képkivágások és saját szerkeszthető pixelrajzforrás viszont verziókezeltek.

## Módszer, közzététel és korlátok

A hosszú sétákat normál mentésadatokból készített ellenőrzőpontok rövidítik. A böngészős játékműveletek felületi gombokkal, billentyűkkel és érintésemulációval történnek; nem közvetlen motorhívásokkal. A grafikai próbák külön Canvas-ra is rajzolnak. Ez nem egyetlen megszakítás nélküli, kézi végigjátszás mérése.

Az irányképek a Kenney-frontképekre illeszkedő saját fej-/hátrétegek. A bal oldal tükrözött saját oldalállás, a lábmozgás és testmozgás a statikus csempéket animálja; nem Kenney-féle kész négyirányú járássorozatként dokumentáltuk. Fizikai mobiltelefonos és hangszórós próba nem történt; Firefoxban virtuális PulseAudio-kimenet működött.

**A GitHub Pages közzétételi beállításait nem módosítottuk.** Az API a jelenlegi Pages-forrás lekérésére `Forbidden` választ adott. Az alkönyvtáras helyi teszt kompatibilitást igazol, élő közzétételt nem. Ha a Pages másik ágat szolgál ki, az új változat megjelenítéséhez kézi forráságváltás vagy a meglévő közzétételi folyamatba emelés szükséges; útmutató a README-ben.

A korlátozott konténer Firefox-parancsa:

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

Ezek a tesztgép beállításai; a játék nem módosítja a felhasználó böngészőjét. A Firefox aláírt Debian-csomagindex alapján került `/tmp` alá, TLS- és aláírás-ellenőrzés kikapcsolása nélkül. A Playwright Firefox-letöltését korábban a proxy blokkolta; a próba valódi Firefox ESR-rel, Puppeteer WebDriver BiDi-vel történt.
