# Smaragdvölgy: vizuális rács, talppontok és rétegzés javítása

A túl magas házrajzok ráértek a következő sorra, az NPC-k rajzolt talpa eltért az ütközési lábrésztől, a stand részei és a folyamatos nevek pedig zsúfolták a főteret. Ez a külön javító kör közös pixelrácsot és talppontokat, 80 pixeles házrajzokat, kültéren és beltéren egységes Y-rendezést, helyesen illeszkedő piaci tetőt/pultot és egyetlen közeli, kontrasztos interakciós feliratot vezet be.

Kiindulás: `feat/smaragdvolgy-village-detail`, `3cd5010`; javító ág: `fix/smaragdvolgy-visual-alignment`. A játékmenet, logikai pozíciók, ütközések, mentés, küldetések, harc, NPC-rutinok és titkos pince forrása változatlan. Minden PNG és licenc is bájtazonos. Az igazítások kizárólag a megjelenítési rétegben vannak; részletes hibajegyzék: VISUAL_FIXES.md.

Ellenőrzés: **37/37** Node-teszt, **13/13** Chromium- és **11/11** Firefox-forgatókönyv. Mindkét böngészőben külön megtekintett főtér, piac, házak, ülő Áron, kovács és favágó. A valódi Canvas-hívásokból ellenőrzött talppontok, pixelrács, takarási sorrend és feliratok mellett a teljes korábbi játékregresszió is lefutott. Részletek: TEST_RESULTS.md.

A működő ágak és a GitHub Pages közzétételi beállításai megmaradnak.
