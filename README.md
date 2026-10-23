# A Varázsló Tornya – Smaragdvölgy

Magyar nyelvű, felülnézetes, SNES-hangulatú fantasy RPG-kezdőterület HTML5, CSS és JavaScript használatával. A korábbi működő lovagos játék harca, mozgása és életerőrendszere tovább él benne, falusi élettel, fejlődéssel és felfedezhető titkokkal bővítve.

## Indítás

A projekt könyvtárában:

```sh
python3 -m http.server 8000
```

Ezután nyisd meg a `http://localhost:8000` címet Firefoxban vagy Chromiumban. Alternatíva: `npm start`. A játék indításához nem kell `npm install`, build vagy internet. Az ES-modulok miatt az `index.html` közvetlen, `file://` megnyitása helyett az egyszerű helyi webszervert használd. Windows EXE nem készül.

## Kenney grafikai frissítés – aktuális állapot

A `feat/kenney-graphics` ág a korábbi működő verziót fejleszti tovább. A ténylegesen feltöltött **Kenney Roguelike Characters 2.0 (CC0)** csomagból új lovag-, NPC- és ellenfélgrafikák kerültek be, egységes pixelmérettel. A játékszabályok, mentési formátum, küldetések, ütközések és a titkos pince nem változtak.

**A környezetcsere még nem teljes:** a `kenney_roguelike-rpg-pack.zip` és `kenney_roguelike-indoors.zip` nincs a rendelkezésre álló mellékletek között. Ezek megérkezéséig a tájakat, házakat és bútorokat a korábbi saját atlasz rajzolja. Pontos forrás- és licencjegyzék: [ASSET_CREDITS.md](ASSET_CREDITS.md).

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

A kültéri pálya **1920 × 640 pixel**, **16 × 16 pixeles alapcsempékkel**, két tengelyen követő kamerával.

- **Smaragdvölgy:** hat lakóház, kovácsműhely, fogadó és kereskedő boltja. Mind a kilenc ajtóhoz be lehet menni E-vel; a kijáratok visszavisznek az adott épület elé. A házak bútorozottak, a fontos üzletekben a tulajdonos is megszólítható. A főutca, a déli keresztutca és kisebb ösvények mellett kút, kertek, virágágyások, kerítések és lámpások állnak.
- **Faluszéli rét:** gyengébb ellenfelek, egyszer gyűjthető gyógyfüvek, virágok, bokrok, sziklás magaslat. A patakot csak a fahídon lehet átszelni.
- **Öreg erdő:** sűrűbb fenyőcsoportok, erősebb lények, elhagyott kunyhó, Dénes és Tövisúr északi tisztása. A kapu legyőzött főellenfél után ténylegesen átléphető, de csak a fejezet végét jelző küszöbig; nincs mögötte elkészített új terület.

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

A korábbi Smaragdvölgy **1-es verziójú mentéseit automatikusan átveszi**. Ha az új víz vagy bútor miatt a korábbi pozíció már nem járható, biztonságos helyre állítja a lovagot, a fejlődés és tárgyak megőrzésével. Betöltés után egy másodperc sérthetetlenség jár. Hibás mentés vagy tiltott tárhely esetén hibaüzenetet kapsz, az aktív játék nem íródik felül.

A mentés nem automatikus, nem felhőalapú. Ugyanaz a böngészőprofil és cím/port kell hozzá: `localhost` és `127.0.0.1` külön tároló. Az Új játék nem törli a kézi mentést.

## Pixelgrafika és hang

A környezet a korábbi helyi, 74 elemes PNG-atlaszt használja. A karaktereket külön, módosítatlan Kenney PNG-lap adja; a 16 pixeles források 2× (főellenfélnél 3×) egész léptékben, élsimítás nélkül jelennek meg. A víz és szereplők animáltak. A források és a külső csomagok elérhetősége az [ASSET_CREDITS.md](ASSET_CREDITS.md) fájlban olvasható. Külső Zelda-/Secret of Mana-grafikát nem tartalmaz.

A nyugodt falusi, titokzatos erdei és gyorsabb főellenfél-dallam, valamint a retro hanghatások saját Web Audio szintézissel készülnek. Nincs külső zene vagy hangfelvétel.

Az eredeti grafikai forrás újraépíthető külső csomag nélkül:

```sh
npm run assets:build
```

A `tools/build-assets.mjs` a korábbi környezetrajzok forrása, az `assets/atlas.js` a generált koordinátajegyzék. Ez az újraépítés nem írja át a Kenney-fájlokat. A Kenney szereplők rétegei és eltolásai az `assets/kenney/characters/profiles.js` fájlban szerkeszthetők. Hiányzó PNG esetén a játék látható betöltési hibával áll meg, nem helyettesíti a grafikát geometriai alakzatokkal.

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

Nyolc valódi játékállapot képernyőképe helyi szerverrel készíthető:

```sh
npm run screenshots
```

Kimenet: `artifacts/previews/` (Git által figyelmen kívül hagyva). Ez csak fejlesztői tesztsegédlet, nem része a játék futásának.

## Felépítés és Git

- `world.js`: pálya, ajtók, helyszínek, NPC-k, ellenfelek és ütköző tárgyak.
- `engine.js`: a korábbi mozgást és kardharcot bővítő játékszabályok, párbeszédek, gazdaság, mentés és kompatibilitás.
- `renderer.js`, `assets/`: csempék, sprite-ok, kamera és animációk.
- `audio.js`: három eredeti zenetéma, hanghatások, hangerő és némítás.
- `game.js`: HUD, billentyűzet, érintés és játékhurok.
- `tests/`, `tools/`: logikai/böngészős tesztek, eredeti grafikai forrás és képernyőkép-segédlet.

Az aktuális karaktercsere a **`feat/kenney-graphics`** ágon készül, a korábbi **`feat/snes-falu-kornyek`** működő verziójából. Megőrzi a korábbi Smaragdvölgy működő rendszereit és történetét. A `main`, `feat/browser-knight-game`, `feat/smaragdvolgy` és `feat/snes-falu-kornyek` korábbi ágai változatlanok. A felhasználó jóváhagyása után az ág GitHubra került; a távoli commitot és a játékfájlokat visszaellenőriztük.
