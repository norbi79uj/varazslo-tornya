# Grafikai források – Smaragdvölgy

## Beépített, eredeti pixelgrafika

| Tartalom | Fájl / szerkeszthető forrás | Alkotás módja |
| --- | --- | --- |
| 16 × 16 pixeles fű, erdei talaj, út, víz, part, híd, padló és kőcsempék | `assets/smaragd-atlas.png`, `tools/build-assets.mjs` | E fejlesztéshez készült eredeti, pixelenként raszterizált rajzok, Codex közreműködésével |
| Lombos és fenyőfák, bokrok, sziklák, virágok, gyógyfű | ugyanaz | Szabálytalan sziluett, rétegzett árnyalatok és levél-/kőminták |
| Házak, kút, kerítés, lámpás, bútorok és tárgyak | ugyanaz | Eredeti pixelrajzok, közös palettával |
| Lovag, falusiak és ellenfelek háromképkockás animációi | ugyanaz | Eredeti 24 × 32 / 32 × 32 / 48 × 48 pixeles sprite-ok |

Az atlasz koordinátáit és a közös palettát az `assets/atlas.js` rögzíti. Újragenerálás: `node tools/build-assets.mjs`. Nincs külső képkérés játék közben, nincs átvett Zelda-/Secret of Mana-sprite vagy más játékból kivágott grafika.

**Licencstátusz:** ez a projekt számára most létrehozott, saját grafikai forrás, nem harmadik féltől letöltött csomag. Nem állítjuk róla, hogy külső CC0-licencű mű. A projekt nem kapott e fejlesztés során új, általános nyilvános licencet; a jogi terjesztési feltételekről a projekt tulajdonosa dönthet. A megbízás új változata kifejezetten megengedi a saját generált sprite-ok használatát.

## Megvizsgálni kívánt külső csomagok – nem kerültek beépítésre

| Forrás | Állapot, 2026. október 23. | Felhasználás |
| --- | --- | --- |
| https://opengameart.org/content/zelda-like-tilesets-and-sprites | A környezet proxyja 403-mal blokkolja; az alkotó és a licenc nem ellenőrizhető | Nincs |
| https://kenney.nl/assets/tiny-town | A környezet proxyja 403-mal blokkolja; az oldalon szereplő licenc nem ellenőrizhető | Nincs |
| https://opengameart.org/node/138681 | A korábbi hozzáférési próbát a proxy 403-mal blokkolta; alkotó/licenc nem ellenőrzött | Nincs |

Ezeket nem jelöljük igazolt CC0-forrásként és nem töltöttünk le belőlük grafikai fájlt. Későbbi felhasználás előtt a tényleges forrásoldal és a csomag licencfájlja ellenőrizendő, az alkotóval és a pontosan átvett fájlokkal együtt.

## Hang és felület

A zene és hanghatások továbbra is saját Web Audio szintézissel készülnek. A felület rendszerbetűket használ. Nincs külső hangfelvétel, font vagy futás közben letöltött tartalom.
