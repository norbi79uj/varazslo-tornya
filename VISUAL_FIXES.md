# Smaragdvölgy – vizuális igazítás

Kiindulás: `feat/smaragdvolgy-village-detail`, `3cd5010`. Külön javító ág: `fix/smaragdvolgy-visual-alignment`.

## Javított hibák

- **Összeérő házsorok:** a 128 pixeles házrajzok helyett 80 pixeles megjelenítés készül, 32 pixeles homlokzattal és 48 pixeles tetővel. A következő házsor tetője így nem lóg rá az előző ház ajtajára. Az ajtók logikai helye és az ütközési mezők megmaradtak.
- **Eltérő rács és méretarány:** 16 pixeles forráscsempe → 32 pixeles világcsempe; a statikus építéshez 8 pixeles részrács, a kirajzoláshoz és kamerához 2 pixeles lépés tartozik. A forrásképek egész, 2× léptékű képpontjai nem nyúlnak meg. Tövisúr korábbi, szándékosan nagyobb 3× léptéke megmaradt. Asztali nézetben a Canvas natív 640 × 384 méretű, a korábbi tört CSS-nagyítás megszűnt; keskeny képernyőn továbbra is reszponzív.
- **Lebegő szereplők és bútorok:** korábban a normál szereplő rajzolt talpa a logikai Y + 15 helyén volt, az ütközési lábrész alsó széle viszont Y + 8. A rajzolás most az utóbbihoz igazodik. Az ülő szereplők külön ülési igazítást kapnak. A kút, padok, szekrény, asztalok, üllő, tönk, kerítések és fák alapja a tényleges talppontból számolódik, nem a transzparens képkocka sarkából.
- **Hibás takarás:** kültéren és beltéren ugyanaz a talppont szerinti Y-rendezés működik. Az árnyékok minden objektum előtt, a talajra kerülnek; a magasabb sprite téglalapja nem határozza meg a mélységét. A lovag a pult előtt teljesen látható, Réka a pult mögött áll.
- **Szétcsúszott piaci stand:** a vászontető és az ismételt, nyújtás nélküli oszloprészek ugyanahhoz az alaphoz igazodnak, mint a pult. Az áruk két oldalra kerültek; a középső üveg nem takarja Réka arcát. A járófelületre lógó kosár-, zsák- és vasrúd-díszítések eltűntek a megjelenítésből; ezeknek nem volt ütköző mezőjük.
- **Zsúfolt főtér:** a kőburkolatnak tiszta, rácshoz illeszkedő határa van. A középső járófelületen nincs véletlen fű- vagy virágminta, a nagy cégtáblák a homlokzat mellé kerültek. A kisebb homlokzati ablakok nem fedik az ajtókat.
- **Egymásra írt nevek:** a folyamatos NPC- és épületfeliratok helyett egyszerre csak egy közeli interakció felirata jelenik meg, kontrasztos panelen. Az alsó térképszélen a panel felülre vált, hogy ne takarja a lovagot. A titkos szekrény továbbra sem kap automatikus jelzést.
- **Környezeti illesztések:** a híd korlátai annak széleihez igazodnak; a vízben álló díszfák nem rajzolódnak ki. A sziklás kiemelkedés széteső négy sarokcsempéjét összefüggő, az eredeti akadály szélességéhez illesztett kőcsoport váltja fel.

## Megőrzött működés

Az `engine.js`, `world.js`, `game.js`, `village-life.js`, `village-layout.js`, `audio.js` és a karakterprofilok forrása bájtra megegyezik a `3cd5010` verzióval. A küldetések, harc, árak, mentés, titkos pince, NPC-funkciók és útvonalak, ajtók, logikai pozíciók és ütközések nem változtak. Minden PNG és eredeti licenc is változatlan.

## Tényleges ellenőrzés

- `npm test`: **37/37** sikeres.
- Chromium: **13/13** böngészős forgatókönyv sikeres.
- Firefox ESR: **11/11** böngészős forgatókönyv sikeres.
- Valódi Canvas-hívásokból ellenőrzött játékos-/NPC-talppont, 2 pixeles kirajzolási rács, pult előtti/mögötti sorrend, egyetlen közeli felirat és a lovagot szabadon hagyó panelhelyzet.
- Mindkét böngészőben külön megtekintett főtér, piac, házak, ülő Áron, kovács és favágó: összesen **12** célzott játéktérkép az `artifacts/alignment-review/` alatt. A tíz szokásos helyszínkép is újra elkészült az `artifacts/previews/` alatt.
- A teljes korábbi regresszió is lefutott: mozgás, kardharc, vásárlás, gyógyítás, Dénes-küldetés, Tövisúr, kilenc ajtó, híd, mentés/visszatöltés, titkos pince és mobilméretű felület.

A képek helyi tesztkimenetek, Git által figyelmen kívül hagyva. A részletes környezet és módszer: [TEST_RESULTS.md](TEST_RESULTS.md).
