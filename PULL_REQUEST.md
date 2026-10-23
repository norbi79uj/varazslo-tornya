# Smaragdvölgy: részletes SNES-falu és élő falusi környezet

Smaragdvölgy kövezett főteret, kerek kutat, négy cserepezett tetőcsaládot, kerteket, cégtáblákat, részletes kovács- és favágóműhelyt, vászontetős piacot és bútorozott fogadót kap. A lakók rövid útvonalakat járnak be, dolgoznak és beszélgetéskor megállnak, a játékos felé fordulnak. A karakterek négy irányállással jelennek meg; tyúkok, pillangók, füst, víz és halk környezeti hangok egészítik ki a falut.

Kiindulás a működő `feat/kenney-graphics` (`ce6e837`), új ág: `feat/smaragdvolgy-village-detail`. A történet, árak, ellenfelek, Dénes-küldetés, Tövisúr, ajtók és titkos pince megmaradnak. A mentési séma v2, az NPC-rutinok nem mentettek; új díszletbe eső régi pozíció közeli járható helyre kerül. A rajzolás és interakció azonos NPC-pozíciókat használ.

A három eredeti Kenney CC0-lap és licence változatlan. A hiányzó részletekhez 72 saját CC0 pixelrajz készült, helyi PNG-vel és reprodukálható JavaScript-forrással. Az eredet és hozzárendelések az ASSET_CREDITS.md fájlban szerepelnek.

Ellenőrzés: `npm test` **34/34**, Chromium **12/12**, valódi Firefox ESR **10/10**. Mozgás, harc, NPC-k, kereskedés, gyógyítás, teljes fő küldetés, főellenfél, titkos pince, mentés, kilenc ajtó, új ütközések, négy irányállás, NPC-mozgás/párbeszédszünet és pult mögötti/előtti helyes rétegzés ellenőrizve. Tíz valódi játékállapot képe megtekintve, saját grafika újraépítése bájtazonos. Részletek és korlátok: TEST_RESULTS.md.

A GitHub Pages jellegű HTTP-alkönyvtáras indítás mindkét böngészőben működik. A közzétételi beállításokhoz nem nyúltunk; az ág publikálásához szükséges kézi lépést a README leírja. A korábbi ágak változatlanok. Windows EXE nem készül.
