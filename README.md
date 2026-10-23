# A Varázsló Tornya – Smaragdvölgy

Magyar nyelvű, felülnézetes, SNES-hangulatú fantasy RPG-kezdőterület HTML5, CSS és JavaScript használatával. A korábbi működő lovagos játék harca, mozgása és életerőrendszere tovább él benne, falusi élettel, fejlődéssel és felfedezhető titkokkal bővítve.

## Indítás

A projekt könyvtárában:

```sh
python3 -m http.server 8000
```

Ezután nyisd meg a `http://localhost:8000` címet Firefoxban vagy Chromiumban. Alternatíva: `npm start`. A játék indításához nem kell `npm install`, build vagy internet. Az ES-modulok miatt az `index.html` közvetlen, `file://` megnyitása helyett az egyszerű helyi webszervert használd. Windows EXE nem készül.

## Vizuális javító kör

A `fix/smaragdvolgy-visual-alignment` ág a működő `3cd5010` verzióból készül. Közös talppontok, egységes pixelrács, rövidebb és egymásba nem lógó házrajzok, helyes Y-rétegzés, rendezettebb főtér és javított stand készültek. Az NPC-nevek csak közeli interakciónál, egyetlen olvasható panelen jelennek meg. Asztali nézetben a játék natív 640 × 384 pixeles méretben látszik.

A játékmenet, ütközések, mentés és NPC-rutinok forrása változatlan. A konkrét hibák és javítások: [VISUAL_FIXES.md](VISUAL_FIXES.md). A külön javító ágat a korábbi működő ágak megtartásával használjuk.

## Részletes, élő falu – megőrzött kiindulás

A `feat/smaragdvolgy-village-detail` ág a legutóbbi, sikeresen tesztelt `feat/kenney-graphics` (`ce6e837`) verzióból indul. Megmaradt a történet, az árak, a harc, a Dénes-küldetés, Tövisúr és a kézzel felfedezhető titkos pince.

A faluban kövezett főtér, kerek kőkút vödörrel, kanyargó utak, négyféle részletes tető, kertek, padok és cégtáblák készültek. Boros műhelyében kohó, fegyverállvány, vasrudak és farakás látható; Márton tönknél dolgozik, Réka csíkos vászontetős standnál árul. A fogadó meleg ablakfényeket, kandallót, pultot, polcokat, székeket és beszélgető vendégeket kapott.

Boros kalapál, Márton fát vág; Ilona, Réka és Áron rövid útvonalakon mozog. Két további falusi sétál, két vendég ül a fogadóban, a kertekben tyúkok és pillangók élnek. A közeli NPC megáll és feléd fordul; párbeszéd közben a rutinok és munkamozdulatok szünetelnek. A szereplőknek négy különböző irányállásuk van. Az NPC-k nem ütköző akadályok.

A három eredeti, saját licencével igazolt **Kenney CC0** csomag és a hiányzó részletekhez készült saját **CC0 pixelrajzok** helyben, az `assets/` alatt találhatók. Nincs játék közbeni külső letöltés. Források, licencek és pontos hozzárendelések: [ASSET_CREDITS.md](ASSET_CREDITS.md). Tényleges ellenőrzések: [TEST_RESULTS.md](TEST_RESULTS.md).

## Vezérlés

| Művelet                               | Vezérlés                          |
| ------------------------------------- | --------------------------------- |
| Mozgás                                | WASD vagy nyilak                  |
| Irányított kardcsapás                 | Szóköz; nyomva tartva ismétlődik  |
| Beszélgetés, ajtó, gyűjtés, vizsgálat | E, közelről                       |
| Gyógyital                             | Q vagy ital gomb                  |
| Tarisznya és küldetések               | I vagy Tarisznya gomb             |
| Párbeszéd bezárása                    | Esc vagy Tovább                   |
| Új játék                              | R vagy Új játék; megerősítést kér |
| Mentés, betöltés                      | A játéktér alatti gombok          |
| Hang, hangerő                         | Hang gomb és Hangerő csúszka      |

Érintőképernyőn külön mozgás-, kard-, E- és Q-gombok látszanak. A hang csak felhasználói kattintásra indul. A csúszka a zenét és a hanghatásokat együtt szabályozza; beállítása megmarad. Párbeszéd közben a harc és mozgás szünetel. A falu biztonságos.

## Bejárható világ

A kültéri pálya **1920 × 640 pixel**, **16 × 16 pixeles, 2× léptékben rajzolt forráscsempékkel**, két tengelyen követő kamerával.

- **Smaragdvölgy:** hat lakóház, kovácsműhely, fogadó és kereskedő boltja. Mind a kilenc ajtóhoz be lehet menni E-vel; a kijáratok visszavisznek az adott épület elé. A házak bútorozottak, a fontos üzletekben a tulajdonos is megszólítható. A főutca, a déli keresztutca és kisebb ösvények mellett kút, kertek, virágágyások, kerítések és lámpások állnak.
- **Faluszéli rét:** gyengébb ellenfelek, egyszer gyűjthető gyógyfüvek, virágok, bokrok, sziklás magaslat. A patakot csak a fahídon lehet átszelni.
- **Öreg erdő:** sűrűbb fenyőcsoportok, erősebb lények, elhagyott kunyhó, Dénes és Tövisúr északi tisztása. A kapu legyőzött főellenfél után ténylegesen átléphető, de csak a fejezet végét jelző küszöbig; nincs mögötte elkészített új terület.

Az új kút, kovácseszközök, farakások, kerítésrészek és pultok kis, látható helyükhöz igazított ütköző területet kaptak. A kilenc falusi ajtó megközelíthető maradt. A házak helyét és a fontos interakciós pontokat megőriztük; a változatosságot a tetők, előkertek, kanyargó utcák és tárgycsoportok adják.

A három kültéri helyszín között nincs új pálya letöltése. A belső terek azonnal váltanak. Épületek, bútorok, fatörzsek, sziklák, bokrok és a hídon kívüli víz akadályozzák a mozgást; az apró virágok, lámpások és egyéb díszletek nem mind ütköző tárgyak.

## Falusiak és küldetések

- **Boros, a kovács:** 24 aranyért edzett vaskardot, 18 aranyért bélelt mellényt kínál.
- **Ilona, a fogadós:** 5 aranyért teljesen meggyógyít; három réti gyógyfűért egyszeri jutalmat ad.
- **Áron, a falusi öreg:** a torony mágusáról és Tövisúr eredetéről mesél.
- **Márton, a favágó:** az eltűnt Dénes felkutatását kéri. Dénest a kunyhótól délkeletre keresd. Kiszabadítása után térj vissza Mártonhoz a szerény jutalompengéért és a főellenfél pajzsának megtöréséért.
- **Réka, a kereskedő:** 8 aranyért gyógyitalt árul.

A kunyhó opcionális titkát a **napló elolvasása**, a **szekrény kézi vizsgálata**, majd a megtalált retesz kioldása és a bútor félretolása tárja fel. A szekrény mellett nincs automatikus interakciófelirat, világító nyíl vagy küldetésjel. A pincében egy rövid rúnarejtvény és egyszeri, a kezdőterülethez illő jutalom vár. A fő küldetés a pince nélkül is teljesíthető.

## Fejlődés és felszerelés

Kezdés: vaskard (1 sebzés), vaspajzs, vászonvért, 18 arany, két gyógyital és öt életerő. A pajzs alapfelszerelés, nem külön védelmi statisztika.

| Szint | Összes TP | Alap maximális életerő |
| ----- | --------: | ---------------------: |
| 1     |         0 |                      5 |
| 2     |        20 |                      6 |
| 3     |        55 |                      7 |
| 4     |       110 |                      8 |
| 5     |       190 |                      9 |

Szintlépéskor az életerő feltöltődik. Az edzett vaskard és az erdőjáró pengéje 2 sebzést okoz; a bélelt mellény +1 maximális életerőt ad. A pince rézmedálja további +1 maximális életerő, így a teljes felszerelésű, 5. szintű lovag maximuma 11. Nincs epikus vagy legendás felszerelés.

Gyógyital: +4 életerő, teljes életerőn nem fogy el. Vereség után a faluba kerülhetsz vissza, legfeljebb 5 arany veszteségével; a tárgyak, szintek és küldetések megmaradnak. A közönséges ellenfelek 35 aktív kültéri másodperc után csak távol élednek újra. Tövisúr nem éled újra.

## Mentés és régebbi mentések

A kézi mentés az adott böngésző `localStorage` tárhelyén él, a korábbi kulcson: `varazslo-tornya.smaragdvolgy.v1`. Az adat belső verziója most 2. Mentődik a pozíció, belső helyszín és visszaút, életerő, szint, TP, arany, kard, mellény, italok, növények, küldetések, titkok, rúnák, ellenfelek és a kapu átlépése.

A korábbi Smaragdvölgy **1-es és 2-es verziójú mentéseit átveszi**. Az NPC-rutinok nem kerülnek a mentésbe; betöltéskor újraindulnak, a küldetések és tárgyak megőrzésével. Ha egy korábbi, szabályos pozíció az új kútba, kerítésbe vagy pultba esne, közeli járható helyre igazítja. A régi falakba vagy vízbe mutató hibás v2-mentéseket továbbra is elutasítja.

Az 1-es verzió migrációjánál, ha az új víz vagy bútor miatt a korábbi pozíció már nem járható, biztonságos helyre állítja a lovagot, a fejlődés és tárgyak megőrzésével. Betöltés után egy másodperc sérthetetlenség jár. Hibás mentés vagy tiltott tárhely esetén hibaüzenetet kapsz, az aktív játék nem íródik felül.

A mentés nem automatikus, nem felhőalapú. Ugyanaz a böngészőprofil és cím/port kell hozzá: `localhost` és `127.0.0.1` külön tároló. Az Új játék nem törli a kézi mentést.

## Pixelgrafika és hang

A tájakat, házakat és belső tereket az RPG és Indoor lapok, a karaktereket a Characters lap adja. Minden forrás 16 pixeles, egységes 2× (főellenfélnél 3×) egész léptékben, élsimítás nélkül jelenik meg. A víz és szereplők animáltak. A források, a saját animáció módszere, a Kenney-alkotók és a licencek az [ASSET_CREDITS.md](ASSET_CREDITS.md) fájlban olvashatók.

A nyugodt falusi, titokzatos erdei és gyorsabb főellenfél-dallam, valamint a retro hanghatások saját Web Audio szintézissel készülnek. Nincs külső zene vagy hangfelvétel.

A saját, helyi kiegészítő lap forrása a `tools/build-village-art.mjs`; külső csomag nélkül újraépíthető az `npm run assets:village` paranccsal. A terep statikus része egyszer készül el egy háttérképen; a víz, füst, munkavégzés, állatok és szereplők külön animálódnak.

A környezet csempéi és rétegei az `assets/kenney/environment.js`, a szereplők az `assets/kenney/characters/profiles.js` fájlban szerkeszthetők. Hiányzó PNG esetén a játék látható betöltési hibával áll meg.

A `tools/build-assets.mjs`, az `assets/atlas.js` és az `assets/smaragd-atlas.png` történeti forrásként megmaradt. Az `npm run assets:build` csak ezt a régi, már nem betöltött atlaszt építi újra; a Kenney-grafikához nincs szükség buildre.

## Fejlesztői ellenőrzések

A tesztekhez Node.js 22+ és npm kell, a játékhoz nem:

```sh
npm ci
npm test
npm run test:browser
```

A Playwright Chromiumot használ (`/usr/bin/chromium`, vagy `CHROMIUM_PATH`), és szükség esetén elindítja a helyi szervert. A külön, valódi Firefoxot vezérlő WebDriver BiDi-teszthez fusson a szerver:

```sh
FIREFOX_PATH=/teljes/ut/firefox npm run test:firefox
```

Alapértelmezett Firefox: `/usr/bin/firefox-esr`. Az automatizálási profil a hangteszthez engedélyezi a Web Audio lejátszást. Korlátozott konténerben külön böngésző- és virtuális hangbeállítások kellhetnek; a ténylegesen használtakat a [TEST_RESULTS.md](TEST_RESULTS.md) tartalmazza.

Tíz valódi játékállapot képernyőképe helyi szerverrel készíthető:

```sh
npm run screenshots
```

Kimenet: `artifacts/previews/` (Git által figyelmen kívül hagyva). Ez csak fejlesztői tesztsegédlet, nem része a játék futásának.

## Felépítés és Git

- `world.js`: pálya, ajtók, helyszínek, NPC-k, ellenfelek és ütköző tárgyak.
- `engine.js`: a korábbi mozgást és kardharcot bővítő játékszabályok, párbeszédek, gazdaság, mentés és kompatibilitás.
- `renderer.js`, `assets/`: csempék, sprite-ok, kamera és animációk.
- `audio.js`: három eredeti zenetéma, halk helyi kalapálás/tűz/víz/madárhang, ajtóhang, hangerő és némítás.
- `village-life.js`: nem mentett NPC-rutinok és irányállások.
- `village-layout.js`: díszletek, kertek és hozzájuk tartozó ütköző területek.
- `village-view.js`: főtér, utak, tetők, falusi részletek és belső díszletek.
- `visual-layout.js`: közös kirajzolási rács, talppontok és megjelenítési mélység, a játékállapot módosítása nélkül.
- `game.js`: HUD, billentyűzet, érintés és játékhurok.
- `tests/`, `tools/`: logikai/böngészős tesztek, eredeti grafikai forrás és képernyőkép-segédlet.

Az aktuális javító ág **`fix/smaragdvolgy-visual-alignment`**; kiindulása a megőrzött **`feat/smaragdvolgy-village-detail`**. A `main`, `feat/browser-knight-game`, `feat/smaragdvolgy`, `feat/snes-falu-kornyek` és `feat/kenney-graphics` korábbi ágak megmaradnak.

## GitHub Pages

A játék build nélküli statikus HTML/CSS/JavaScript. Chromiumban és Firefoxban valódi helyi HTTP-alkönyvtárból is ellenőriztük, hogy az összes modul és mind a négy PNG relatív útvonalon betöltődik, és a lovag mozgatható. Ez a GitHub Pages projektoldalak `/varazslo-tornya/` jellegű elérési útját modellezi.

**A GitHub Pages beállításait nem módosítottuk.** A jelenlegi közzétételi ágat az API `Forbidden` válasza miatt nem tudtuk kiolvasni. Ha a Pages másik ágat szolgál ki, az új változat megjelenítéséhez a felhasználónak kell átállítania a forráságat a Settings → Pages oldalon (ág alapú közzétételnél: `fix/smaragdvolgy-visual-alignment`, `/(root)`), vagy a meglévő közzétételi folyamatba emelnie a változásokat. Az ág GitHubra feltöltése önmagában nem váltja át a közzétett oldalt.
