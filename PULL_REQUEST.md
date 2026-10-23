# Smaragdvölgy: egységes Kenney CC0 pixelgrafika

A működő Smaragdvölgy RPG-t a felhasználó három feltöltött Kenney-csomagjával frissíti. A Roguelike pack adja a tájat, növényzetet és épületeket, a Characters 2.0 a lovagot, NPC-ket és ellenfeleket, az Indoor pack a belső padlókat és bútorokat. Az eredeti PNG-k, CC0-licencek és csempeleírások helyben szerepelnek; a forrásokat és minden képkivágást az ASSET_CREDITS.md dokumentálja.

A grafikai ág a működő `feat/snes-falu-kornyek` verzióból folytatódik. A mozgás, kardharc, mentések, NPC-k, kereskedés, küldetések, főellenfél és titkos pince megmaradt. Az új csempézés az eredeti ütközési területhez igazodik, egész pixeles nagyítással. A játék három helyi Kenney-lapot tölt, a régi saját atlaszt már nem használja; hiányzó lapnál látható hiba tiltja az indítást.

Ellenőrzés: `npm test` **27/27**, Chromium **10/10**, valódi Firefox ESR **8/8**. Lefedett a mozgás, harc, NPC-párbeszéd, vásárlás, mentés/visszatöltés, kilenc ajtó, híd, főellenfél és titkos pince. Mind az 59 környezeti elem és 10 szereplőprofil valódi Canvas-próbán ment át. Nyolc játékállapot képernyőképe vizuálisan ellenőrizve. A PNG-k, licencek és leírások bájtazonosak a feltöltött ZIP-ekkel. Részletes eredmények és korlátok: TEST_RESULTS.md.

A `main` és a korábbi működő ágak változatlanok; ez a PR nem hajt végre összeolvasztást. Windows EXE nem készült.
