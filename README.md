# A Varázsló Tornya – Smaragdvölgy

Kis méretű, magyar nyelvű, felülnézetes fantasy RPG, saját 16 bites hangulatú pixelgrafikával és szintetizált retro zenével. A korábbi lovagos böngészőjáték folytatása, ugyanazzal a Canvas-alapú megjelenítéssel, WASD/nyíl vezérléssel és irányított kardharccal.

## Indítás

A projekt könyvtárában:

```sh
python3 -m http.server 8000
```

Nyisd meg a `http://localhost:8000` címet Chromiumban vagy Firefoxban. Alternatíva: `npm start`. A játékhoz nincs csomagtelepítés vagy build; modern böngésző és helyi HTTP-szerver kell. Az ES-modulok miatt az `index.html` közvetlen, `file://` megnyitása helyett használd a szervert. Nincs Windows EXE.

A játék nem tölt le külső képet, betűtípust, zenét vagy egyéb eszközt. A helyi szerver elindítása után internet nélkül is játszható.

## Vezérlés

| Művelet                            | Vezérlés                         |
| ---------------------------------- | -------------------------------- |
| Mozgás                             | WASD / nyilak                    |
| Kardcsapás                         | Szóköz, nyomva tartva ismétlődik |
| Beszélgetés, gyűjtés, vizsgálat    | E, közelről                      |
| Gyógyital                          | Q / ital gomb                    |
| Tarisznya, felszerelés, küldetések | I / Tarisznya                    |
| Párbeszéd bezárása                 | Esc / Tovább                     |
| Új játék                           | R / Új játék, megerősítéssel     |
| Mentés / visszatöltés              | A játéktér alatti gombok         |
| Zene és hanghatások                | Hang: ki/be gomb                 |

Érintőképernyőn külön mozgás-, támadás-, E- és Q-gombok jelennek meg. A hang alapból ki van kapcsolva; kattintással kapcsolható be. A párbeszédek megállítják a harcot. Az új játék nem törli a kézi mentést.

## A kezdőterület

- **Smaragdvölgy falu:** biztonságos tér, házak, kovácsműhely, fogadó és kereskedő. Boros edzett vaskardot árul, Ilona gyógyít és gyógyfüvet kér, Áron a vidék múltjáról mesél, Márton az eltűnt Dénes felkutatásával bíz meg. Rékánál gyógyital vehető.
- **Faluszéli rét:** a falutól keletre, nyálkákkal és gyűjthető gyógyfüvekkel. Három gyógyfűért Ilona egyszeri jutalmat ad.
- **Öreg erdő:** tovább keletre, erősebb ellenfelekkel és egy elhagyott kunyhóval. Dénes a kunyhótól délkeletre vár. Kiszabadítása után térj vissza Mártonhoz; a kapott közönséges penge áttöri Tövisúr pajzsát. Tövisúr az északi tisztáson áll.

Az összefüggő kültéri pályán a kamera követi a lovagot, nincs betöltés a helyszínek között. A kunyhó ajtaján E-vel léphetsz be. A kunyhó titkait a napló és a tárgyak saját kezű vizsgálata árulja el; a titkos tárgynál nincs automatikus jelzés. A pince teljesen opcionális, a fő küldetés nélküle is végigjátszható. Az északi kapu csak Tövisúr legyőzése után nyílik ki; mögötte még nincs új pálya.

## Fejlődés és tárgyak

A lovag 1. szinten, vaskarddal (1 sebzés), vaspajzzsal, vászonvérttel, 18 arannyal, két gyógyitallal és öt életerővel indul. A pajzs és a vért alapfelszerelés; nincs külön felszerelési menü vagy védelemstatisztika.

| Szint | Összes TP | Alap maximális életerő |
| ----- | --------: | ---------------------: |
| 1     |         0 |                      5 |
| 2     |        20 |                      6 |
| 3     |        55 |                      7 |
| 4     |       110 |                      8 |
| 5     |       190 |                      9 |

A szintlépés feltölti az életerőt. Az edzett vaskard és az erdőjáró pengéje is 2 sebzést okoz; nincs epikus vagy legendás felszerelés. A pince szerény jutalma egy +1 maximális életerőt adó rézmedál, arany és gyógyital. A szint maximum 5. A közönséges ellenfelek 35 másodperc után csak akkor élednek újra, ha a játékos távol van; Tövisúr végleg legyőzhető.

Gyógyital: +4 életerő, teljes életerőn nem fogy el. A fogadó 5 aranyért teljesen meggyógyít. Vereség után a faluban térsz magadhoz, legfeljebb 5 arany veszteséggel; a fejlődésed, tárgyaid és küldetéseid megmaradnak.

## Mentés

A **Mentés** gomb egy kézi mentési helyet használ az adott böngésző `localStorage` tárhelyén (`varazslo-tornya.smaragdvolgy.v1`). Mentődik a helyszín és pozíció, életerő, szint, TP, arany, tárgyak, küldetések, ellenfelek, gyűjtött növények és a pince állapota. Újratöltés után a **Mentés folytatása** gombbal térhetsz vissza.

A mentés nem felhőalapú és nem automatikus. Azonos böngésző, profil és cím/port szükséges; a `localhost` és a `127.0.0.1` külön tárhely. Sérült vagy eltérő verziójú mentést a játék elutasít, az aktuális állapot megőrzésével. Tiltott helyi tárhelynél érthető hibaüzenetet ad. Vereség közben nem lehet menteni. Betöltés után egy másodperc sérthetetlenséget kapsz.

## Tesztek

Csak a fejlesztői tesztekhez kell Node.js 22+ és npm:

```sh
npm ci
npm test
npm run test:browser
```

A Chromium-tesztek Playwrightot használnak. Alapértelmezett böngészőút: `/usr/bin/chromium`; másik telepítéshez `CHROMIUM_PATH=/teljes/ut/chromium npm run test:browser`. A teszt automatikusan indít helyi HTTP-szervert a 8000-es porton, vagy használja a már futót. A kizárólag rendszerre telepített böngészővel tesztelő konfiguráció nem tölt le böngészőt.

A külön Firefox-ellenőrzés valódi Firefoxot vezérel WebDriver BiDi-n keresztül:

```sh
# Egy másik terminálban fusson a helyi HTTP-szerver:
FIREFOX_PATH=/teljes/ut/firefox npm run test:firefox
```

Az alapértelmezett Firefox-út `/usr/bin/firefox-esr`. A teszt nem telepít Firefoxot. Korlátozott Linux-konténerben, ahol a Firefox nem tud felhasználói névteret létrehozni, a tesztfolyamathoz `MOZ_DISABLE_CONTENT_SANDBOX=1` lehet szükséges; normál gépen ezt ne állítsd be. A Firefox automatizálási profilja engedélyezi a Web Audio lejátszást a determinisztikus hangteszthez. Fizikai hangkimenet nélküli konténerben virtuális PulseAudio-kimenet is kellhet; a futtatott környezet pontos beállításait a tesztjelentés rögzíti. Ezek nem módosítják a játék vagy a felhasználó böngészőjének beállításait. A böngészős tesztek a forgatókönyvek közötti hosszú sétát mentési ellenőrzőpontokkal rövidítik, a tényleges műveleteket gombokkal és billentyűkkel hajtják végre. Részletes eredmény: [TEST_RESULTS.md](TEST_RESULTS.md).

## Bővíthető felépítés

- `world.js`: világméret, épületek, NPC-k, tárgyak, ellenfelek és szintküszöbök.
- `engine.js`: mozgás, harc, küldetések, gazdaság, párbeszédműveletek, mentésellenőrzés; DOM nélkül tesztelhető.
- `renderer.js`: az eredeti karaktergrafikát és rajzolást bővítő Canvas-megjelenítés, kamera, animációk.
- `audio.js`: saját dallamok és hanghatások Web Audio API-val.
- `game.js`: böngészős vezérlés, kezelőfelület és játékhurok.
- `tests/`: logikai és tényleges böngészős ellenőrzések.

A `feat/browser-knight-game` ág őrzi az eredeti működő verziót. Ez a bővítés a `feat/smaragdvolgy` ágon készül; a `main` ágat nem módosítja.
