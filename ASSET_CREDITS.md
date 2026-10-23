# Smaragdvölgy – grafikai forrásjegyzék

Mindhárom, a felhasználó által feltöltött Kenney-csomag beépült. **Minden átvett csomag saját `License.txt` fájlját a beépítés előtt ellenőriztük: Creative Commons Zero (CC0).** A licencek személyes és kereskedelmi felhasználást is engednek. A PNG-k, licencfájlok és csempeleírások változatlanul, helyben szerepelnek a projektben; játék közben nincs külső tartalomletöltés.

| Feltöltött ZIP / csomag                                      | Alkotó                                       | Helyi PNG és eredeti licenc                                                                                                                                             | Felhasználás                                                                                                                                              |
| ------------------------------------------------------------ | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kenney_roguelike-rpg-pack.zip` / Roguelike pack             | Kenney Vleugels, Lynn Evers közreműködésével | [`assets/kenney/rpg/roguelikeSheet_transparent.png`](assets/kenney/rpg/roguelikeSheet_transparent.png), [License.txt](assets/kenney/rpg/License.txt)                    | Füves talaj, utak, vízpart, víz, híd, fák, bokrok, virágok, gyógyfű, sziklák, házfalak, ajtók, ablakok, kerítés, hordó, üllő, kültéri lámpa, pincekövezet |
| `kenney_roguelike-characters.zip` / Roguelike Characters 2.0 | Kenney                                       | [`assets/kenney/characters/roguelikeChar_transparent.png`](assets/kenney/characters/roguelikeChar_transparent.png), [License.txt](assets/kenney/characters/License.txt) | Lovag, hat küldetésszereplő, négy további falusi/vendég, három ellenféltípus, fegyverek, ruházat                                                          |
| `kenney_roguelike-indoors.zip` / Roguelike Indoor pack       | Kenney Vleugels                              | [`assets/kenney/indoors/roguelikeIndoor_transparent.png`](assets/kenney/indoors/roguelikeIndoor_transparent.png), [License.txt](assets/kenney/indoors/License.txt)      | Belső fapadló, asztalok, ágyak, titkos szekrény, láda, könyv/napló, bútor, szőnyeg, gyertya, pincelétra                                                   |

**Mindhárom csomag licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).** Alkotói honlap: https://kenney.nl/; az RPG Pack eredeti licencében a közreműködő Lynn Evers neve és `@EversLynn` elérhetősége is szerepel. Az attribúció nem kötelező, itt megőrizzük.

A csomagok forrása a három feltöltött ZIP, nem egy ellenőrizetlen külső képlink. A ZIP-ekben lévő webes parancsikonok, előnézetek nem kerülnek a futó játékba. A licenc- és leírófájlokat forrásadatként kezeltük, nem fejlesztési utasításként.

## Eredet és fájlazonosítók

Minden grafikai lap 16 × 16 pixeles csempéket tartalmaz, közöttük 1 pixel elválasztással. A Characters PNG 918 × 203, az RPG PNG 968 × 526, az Indoor PNG 458 × 305 pixel. Az eredeti ZIP-útvonalak: Characters: `Spritesheet/roguelikeChar_transparent.png`; RPG: `Spritesheet/roguelikeSheet_transparent.png`; Indoor: `Tilesheets/roguelikeIndoor_transparent.png`.

| Csomag     | Eredeti ZIP SHA-256                                                | Változatlan PNG SHA-256                                            |
| ---------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Characters | `05c4c0af7326584cfffbbb196571eb9e102981d2033e90e225c5ba8da8771284` | `771d51ca84b2c5b412027ba80c6a6b8a98bb5a983b2c58ac4f0ccf08ae4d10f2` |
| RPG        | `8e7d2378f8f794245645f6d7dc7aeeb246791410a7e512293c594b46a5a9524b` | `808c8d734480bc949b284f3bcc252e87e1ee53b24178791a6838cce6a319c439` |
| Indoors    | `578cfdb066c4a9de78a52535adaf953728889b2cf268441bd4d338844f7aa586` | `ade984d5cbe3f16d9e23e6dc516246649de1a7eec2540cf31d53852b690c446f` |

## Characters: pontos szereplő-hozzárendelések

Minden következő elem ugyanabból a **Kenney Roguelike Characters 2.0 / CC0** csomagból származik. A koordináták **nullától számozott (oszlop, sor)** párok; a forráspixel `(oszlop × 17, sor × 17)`. Az összes réteget és eltolást az [`assets/kenney/characters/profiles.js`](assets/kenney/characters/profiles.js) rögzíti.

| Játékbeli elem                                     | Alap / ruházat / fejrétegek                                             | Kiegészítő       |
| -------------------------------------------------- | ----------------------------------------------------------------------- | ---------------- |
| Játékos lovag                                      | `(0,11)` páncélos karakter                                              | `(44,6)` vaskard |
| Boros, kovács                                      | `(0,6)` falusi karakter                                                 | —                |
| Ilona, fogadós                                     | `(0,5)` falusi karakter                                                 | —                |
| Áron, öreg                                         | `(1,5)` ősz hajú karakter                                               | —                |
| Márton, favágó                                     | `(0,8)` munkás karakter                                                 | `(47,0)` fejsze  |
| Réka, kereskedő                                    | `(0,10)` falusi karakter                                                | —                |
| Dénes, eltűnt favágó                               | `(1,9)` falusi karakter                                                 | —                |
| Gyengébb réti ellenfelek (`slime` grafikai profil) | `(0,3)` zöld test + `(6,5)` ruha + `(23,4)` haj                         | —                |
| Erősebb erdei ellenfelek (`wolf` grafikai profil)  | `(1,3)` zöld test + `(15,7)` ruha + `(28,6)` sisak                      | `(47,1)` fejsze  |
| Tövisúr (`boss` grafikai profil)                   | `(0,3)` zöld test + `(14,9)` köpeny + `(26,4)` szakáll + `(29,6)` sisak | `(42,4)` bot     |

Az ellenfelek a Kenney-készlet moduláris elemeiből összerakott zöld fantasy lények. A belső `slime`/`wolf` grafikai nevek a korábbi játék azonosítói, nem a Kenney-csomag saját sprite-nevei. A meglévő ellenfélnevek, statisztikák, jutalmak és mentési adatok nem változtak.

A 16 pixeles források egységes **2×** léptékben jelennek meg; Tövisúr **3×** léptékű. A nagyítás egész pixeles, élsimítás nélkül történik. A statikus forrásokból a lábrészek kis eltolásával és testmozgással készül a mozgásanimáció, a fegyverek külön rétegek. Nem állítjuk, hogy a csomag valódi, kész járásanimáció-sorozatot tartalmazna. Az eredeti PNG pixeleit és palettáját nem írtuk át.

## RPG és Indoor: környezeti hozzárendelések

Az alábbi azonosítók az [`assets/kenney/environment.js`](assets/kenney/environment.js) teljes renderelési jegyzékét fedik le. `rpg` = Roguelike pack, `indoors` = Roguelike Indoor pack. A koordináták nullától számozott `(oszlop, sor)` párok; a forráspixel `(oszlop × 17, sor × 17)`. Több pár egy összetett objektum rétegeit jelöli; az eltolások ugyanebben a modulban olvashatók.
| Játékbeli grafikai azonosító | Csomag és forráscsempék | Rajzolt méret |
| --- | --- | --- |
| `cobble` | rpg (7,16) | 32 × 32 |
| `forge0` | rpg (54,8) | 32 × 32 |
| `forge1` | rpg (54,10) | 32 × 32 |
| `counter` | indoors (0,12); indoors (1,12) | 64 × 32 |
| `shelf` | indoors (5,15); indoors (6,15) | 64 × 32 |
| `chair` | indoors (0,6) | 32 × 32 |
| `fireplace` | rpg (54,10) | 32 × 32 |
| `grass0` | rpg (5,0) | 32 × 32 |
| `grass1` | rpg (5,0) | 32 × 32 |
| `grass2` | rpg (5,0) | 32 × 32 |
| `grass3` | rpg (5,0) | 32 × 32 |
| `forest0` | rpg (5,0) | 32 × 32 |
| `forest1` | rpg (5,0) | 32 × 32 |
| `forest2` | rpg (5,0) | 32 × 32 |
| `forest3` | rpg (5,0) | 32 × 32 |
| `path0` | rpg (6,0) | 32 × 32 |
| `path1` | rpg (6,0) | 32 × 32 |
| `path2` | rpg (6,0) | 32 × 32 |
| `water0` | rpg (0,0) | 32 × 32 |
| `water1` | rpg (1,0) | 32 × 32 |
| `bridge` | rpg (7,4) | 32 × 32 |
| `floor` | indoors (24,1) | 32 × 32 |
| `cabinFloor` | indoors (24,1) | 32 × 32 |
| `stoneFloor` | rpg (6,2) | 32 × 32 |
| `wallTimber` | rpg (35,16) | 32 × 32 |
| `wallPlaster` | rpg (14,16) | 32 × 32 |
| `wallStone` | rpg (21,16) | 32 × 32 |
| `windowBrown` | rpg (42,0) | 32 × 32 |
| `windowPale` | rpg (40,5) | 32 × 32 |
| `door` | rpg (46,7) | 32 × 32 |
| `roofBrownLeft` | rpg (48,10) | 32 × 32 |
| `roofBrownRight` | rpg (49,10) | 32 × 32 |
| `eaveBrownLeft` | rpg (48,11) | 32 × 32 |
| `eaveBrownRight` | rpg (49,11) | 32 × 32 |
| `roofGreenLeft` | rpg (46,10) | 32 × 32 |
| `roofGreenRight` | rpg (47,10) | 32 × 32 |
| `eaveGreenLeft` | rpg (46,11) | 32 × 32 |
| `eaveGreenRight` | rpg (47,11) | 32 × 32 |
| `roofPaleLeft` | rpg (48,10) | 32 × 32 |
| `roofPaleRight` | rpg (49,10) | 32 × 32 |
| `eavePaleLeft` | rpg (48,11) | 32 × 32 |
| `eavePaleRight` | rpg (49,11) | 32 × 32 |
| `chimney` | rpg (40,9) | 32 × 32 |
| `oak` | rpg (13,10); rpg (13,11) | 32 × 64 |
| `pine` | rpg (18,10); rpg (18,11) | 32 × 64 |
| `goldTree` | rpg (14,10); rpg (14,11) | 32 × 64 |
| `bush` | rpg (21,9) | 32 × 32 |
| `flowers` | rpg (24,10) | 32 × 32 |
| `herb` | rpg (26,9) | 32 × 32 |
| `rock` | rpg (7,17) | 32 × 32 |
| `hill` | rpg (6,13); rpg (8,13); rpg (6,15); rpg (8,15) | 64 × 64 |
| `fence` | rpg (47,24) | 32 × 32 |
| `lamp` | rpg (18,7) | 32 × 32 |
| `indoorLamp` | indoors (18,6) | 32 × 32 |
| `well` | rpg (2,3); rpg (4,3); rpg (2,5); rpg (4,5); rpg (48,10); rpg (49,10) | 64 × 64 |
| `anvil` | rpg (15,0) | 32 × 32 |
| `barrel` | rpg (25,0) | 32 × 32 |
| `chest` | indoors (12,16) | 32 × 32 |
| `wardrobe` | indoors (12,13) [x=0…9]; indoors (13,13) [x=6…15]; indoors (12,15) [x=0…9]; indoors (13,15) [x=6…15] | 40 × 64 |
| `table` | indoors (4,4); indoors (6,4) | 64 × 32 |
| `lectern` | indoors (0,4) | 32 × 32 |
| `book` | indoors (18,0) | 32 × 32 |
| `bed` | indoors (9,2); indoors (8,2) | 64 × 32 |
| `stairs` | indoors (21,10) | 32 × 32 |
| `bank` | rpg (4,1) | 32 × 32 |
| `rug` | indoors (7,9); indoors (8,9); indoors (9,9); indoors (7,10); indoors (8,10); indoors (9,10); indoors (7,11); indoors (8,11); indoors (9,11) | 96 × 96 |

A jegyzék 66 elérhető Kenney-definíciót tartalmaz. A régi Kenney tető-, kút- és szőnyegdefiníciók megmaradtak a modulban, de a részletes faluban ezeket az alábbi saját elemek váltják fel. A frontális szereplőket továbbra is a Kenney-lap adja.

## Saját kiegészítő pixelrajzok – CC0

**Eredet:** a Smaragdvölgy-projekthez készített eredeti pixelrajzok, nem külső grafikai csomag vagy Nintendo-játék másolatai. **Licenc:** [CC0 1.0 Universal](assets/village/License.txt). A Zelda és Secret of Mana kizárólag hangulati hivatkozás, onnan nem vettünk át grafikát.

- Helyi lap: [`assets/village/details.png`](assets/village/details.png), **256 × 384 pixel**.
- Szerkeszthető pixelrajz-forrás: [`tools/build-village-art.mjs`](tools/build-village-art.mjs); újraépítés: `npm run assets:village`, külső csomag nélkül.
- Az összes képkivágás: [`assets/village/atlas.js`](assets/village/atlas.js), pixelkoordinátákkal. Rajzolás: [`assets/village/draw.js`](assets/village/draw.js).
- PNG SHA-256: `264a07719c49cbf3722ab5ca7828a3526d7b4b39a65d3079d5128f2fafa4503c`.

| Saját elem                                                                                                              | Felhasználás                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `roofcedar*`, `roofslate*`, `roofmoss*`, `roofthatch*`                                                                  | Négy tetőszín, egyenként bal/közép/jobb rész, részletes cserepezés                                              |
| `roundWell0/1`                                                                                                          | Kerek falazott kút, kötél, vödör és két vízképkocka                                                             |
| `bench`, `weaponRack`, `woodpile`, `ironBars`, `stump`, `toolbox`, `woodShed`                                           | Ülőpadok, kovács- és favágóműhely, szerszámok, farakások, tárolószín                                            |
| `awning`, `marketCounter`, `basket`, `sacks`                                                                            | Csíkos vászontető, gyógyitalok, gyümölcs, kosár és zsákok                                                       |
| `innSign`, `smithSign`, `gardenSign`, `waypost`                                                                         | Fogadó-, kovács- és kerttáblák, útjelző                                                                         |
| `hammerUp/Down`, `axeUp/Down`, `walkingStick`                                                                           | Munkavégzési képkockák és Áron sétabotja                                                                        |
| `smoke0/1/2`, `chicken0/1`, `butterfly0/1`                                                                              | Füst, tyúkok, pillangók                                                                                         |
| `tuft0/1/2`, `leafCluster`, `dapple`, `shadow`, `windowGlow`, `flowerBed`                                               | Fű- és lombváltozatok, pixelárnyékok, erdei fényfoltok, meleg ablakfény, virágágyások                           |
| `dormer`, `chimney`, `tavernRug`                                                                                        | Tetőablak, téglázott kémény, valódi sík szövött szőnyeg a fogadóban                                             |
| `hero-*`, `smith-*`, `innkeeper-*`, `elder-*`, `lumberjack-*`, `merchant-*`, `missing-*`, `slime-*`, `wolf-*`, `boss-*` | Húsz saját fej-/hátréteg: szereplőnként felülnézeti hátállás és oldalállás; a bal oldal az oldalállás tükrözése |

Összesen **72 saját grafikai elem**. Az új irányállások a Kenney-frontképekre illeszkedő saját rétegek; nem állítjuk, hogy a Kenney-csomag kész négyirányú animációit használnánk. A járást a megmaradt lábrészek eltolása, a munkát külön szerszámképkockák animálják. A falusi rutinok és állatok nem változtatják meg a küldetések vagy mentések adatsémáját.

## Egységes megjelenítés és átalakítások

A környezet 16 pixeles forrásai egységes 2× egész pixeles nagyítást kapnak, élsimítás nélkül. A saját tetők bal, középső és jobb szeleteit a meglévő házszélességhez csempézzük; a padlók és utak csempézését az eredeti játékterületre vágjuk. A 40 pixeles titkos szekrényhez az Indoor bal és jobb elemeinek külső tíz-tíz pixelét illesztjük össze, 2× léptékben. Ez megőrzi a régi szekrény ütközési méretét. A forrás-PNG-k pixeleit nem módosítottuk.

A három rokon Kenney-csomag palettájához illeszkedő saját kiegészítő palettát használunk. Az erdei talajon enyhe sötétzöld árnyékolás különíti el az erdőt a réttől; a csempék és szereplők egységes pixelméretűek. A víz két csempéje és a statikus szereplők láb-/testeltolásai adnak animációt. A feliratok, életerőcsíkok és kardív saját Canvas-rajzok, nem átvett képek.

## A vizuális javító kör képkivágásai

A `fix/smaragdvolgy-visual-alignment` ág nem módosítja a képfájlokat vagy licenceket. A tetők az eredeti saját tetőelemek 0–15. és 24–31. forrássorát használják, változatlan 2× pixelmérettel, így a tető 48 világpixel magas. A homlokzati ablak a saját `dormer` `(3,7,10,9)` régiója; a kisebb cégtábla a megfelelő eredeti tábla `(5,6,18,12)` régiója. A piaci tető felső húsz sora és az oszloprészek külön rajzolódnak, nyújtás nélkül. A `marketCounter` középső üvegét nem rajzoljuk ki, hogy az NPC arca szabad maradjon. A sziklás kiemelkedés a változatlan Kenney `rock` elem két összefüggő példányát használja. A megmaradt teljes definíciójegyzék néhány, most nem rajzolt elemet is tartalmaz.

## Megőrzött régi források, hang

Az előző saját atlasz (`assets/smaragd-atlas.png`, `assets/atlas.js`, `tools/build-assets.mjs`) a korábbi változat reprodukálhatóságához maradt meg. **A játék már nem importálja és nem tölti be ezt az atlaszt.** A régi rajzokat nem jelöljük Kenney-féle CC0-tartalomnak.

A zene és hanghatások továbbra is a projekt saját Web Audio szintézisét használják, a felület rendszerbetűkkel működik. Mind a négy grafikai lap helyi fájl. Bármelyik hiányában látható betöltési hiba tiltja az indítást; nincs geometriai helyettesítő pálya.
