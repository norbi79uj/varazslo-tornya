# Smaragdvölgy – grafikai forrásjegyzék

## A kért három Kenney csomag állapota

| Csomag                            | Ebben a fejlesztésben elérhető? | Felhasználás / licencellenőrzés                                                                                                                   |
| --------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kenney_roguelike-characters.zip` | Igen, a felhasználó feltöltötte | **Beépítve. Kenney Roguelike Characters 2.0, CC0.** Az archívum saját `License.txt` fájlja ellenőrizve és változatlanul megőrizve.                |
| `kenney_roguelike-rpg-pack.zip`   | Nem                             | Még nincs beépítve; az archívum és licencfájlja nem áll rendelkezésre. A táj és az épületek ezért egyelőre a korábbi projektből maradtak meg.     |
| `kenney_roguelike-indoors.zip`    | Nem                             | Még nincs beépítve; az archívum és licencfájlja nem áll rendelkezésre. A belső terek és bútorok ezért egyelőre a korábbi projektből maradtak meg. |

A felhasználó mindhárom csomagot CC0-ként jelölte meg. Ebben a munkafázisban **csak a ténylegesen feltöltött Characters csomag licencét tudtuk ellenőrizni**, és csak abból vettünk át Kenney-grafikát. Ez a karaktercsere működő, tesztelt mérföldköve; a teljes háromcsomagos környezetcsere még nincs kész.

## Beépített Kenney-forrás

- **Alkotó / kiadó:** Kenney, https://kenney.nl/
- **Csomag:** Roguelike Characters pack, **2.0**, az eredeti licenc szerint 2015. május 20.
- **Licenc:** Creative Commons Zero (**CC0 1.0**), https://creativecommons.org/publicdomain/zero/1.0/
- **Licenc bizonyítéka a projektben:** [`assets/kenney/characters/License.txt`](assets/kenney/characters/License.txt). Az eredeti szöveg szerint személyes, oktatási és kereskedelmi felhasználásra szabad; a Kenney feltüntetése nem kötelező. Itt feltüntetjük.
- **Eredeti fájl a ZIP-ben:** `Spritesheet/roguelikeChar_transparent.png`.
- **Helyi fájl:** `assets/kenney/characters/roguelikeChar_transparent.png`, **918 × 203 pixel**, változatlan PNG.
- **Csempeméret:** 16 × 16 pixel, közöttük 1 pixel elválasztás; az eredeti `spritesheetInfo.txt` szintén megőrizve.
- **ZIP SHA-256:** `05c4c0af7326584cfffbbb196571eb9e102981d2033e90e225c5ba8da8771284`.
- **PNG SHA-256:** `771d51ca84b2c5b412027ba80c6a6b8a98bb5a983b2c58ac4f0ccf08ae4d10f2`.

A feltöltött archívum volt a forrás, nem egy külső képlink. A ZIP-ben található webes parancsikonokat és előnézeteket nem használjuk játék közben. A licencszöveget forrásadatként kezeltük, nem fejlesztési utasításként.

## Pontos sprite-hozzárendelések

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

## Korábbi, még használt saját környezetgrafika

A fák, bokrok, talajok, utak, házak, víz, híd, belső terek és bútorok jelenleg továbbra is az `assets/smaragd-atlas.png` képből készülnek. Szerkeszthető forrás: `tools/build-assets.mjs`; koordináták és paletta: `assets/atlas.js`.

Ezek a projekt korábbi saját rajzai, **nem a még hiányzó Kenney RPG Pack vagy Indoors csomagból származnak, és nem jelöljük őket Kenney-féle CC0-tartalomként**. A korábbi saját karakterrajzok az eredeti atlasz reprodukálhatósága miatt még szerepelnek a fájlban, de a játékos, az NPC-k és az ellenfelek megjelenítéséhez már nem használjuk őket.

## Hang és futás közbeni betöltés

A zene és hanghatások a korábbi, saját Web Audio szintézist használják. A felület rendszerbetűkkel működik. Mindkét grafikai lap helyi fájl; a játék nem kér külső képet, zenét vagy betűtípust. Hiányzó karakterlapnál látható betöltési hibát ad, nem tér vissza a régi karakterrajzokhoz.
