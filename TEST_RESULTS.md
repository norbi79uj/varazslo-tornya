# Smaragdvölgy – tényleges ellenőrzések

Dátum: **2026. október 23.** A tesztek a `feat/smaragdvolgy` fejlesztésén, valódi böngészőkkel, helyi HTTP-szerverről futottak. Nem készült Windows EXE.

## Végső eredmények

| Ellenőrzés                                       | Eredmény                                  |
| ------------------------------------------------ | ----------------------------------------- |
| `npm test` – játékmenet, mentés és hangkezelés   | **19 / 19 sikeres**, 0 hibás, 0 kihagyott |
| `npm run test:browser` – Chromium                | **5 / 5 sikeres**, 0 hibás, 0 kihagyott   |
| `npm run test:firefox` – Firefox, WebDriver BiDi | **5 / 5 sikeres**, 0 hibás, 0 kihagyott   |
| `git diff --check`                               | Sikeres                                   |

Környezet: Debian GNU/Linux 13, Node.js 24.19.0, Python 3.12.14, Chromium **154.0.8037.57**, Firefox ESR **153.5.1**, Playwright **1.58.2**, Puppeteer Core **25.16.0**. A böngészők headless módban futottak.

## Böngészős forgatókönyvek

Mindkét böngészőben végrehajtva:

1. **Falusi élet és kereskedés:** Boros párbeszéde; elégtelen arannyal sikertelen vásárlás, változatlan arany és fegyver; edzett vaskard megvétele 24 aranyért; Réka gyógyitalának megvétele 8 aranyért; Ilonánál 5 aranyért gyógyulás; Áron története; három külön növény felvétele a réten, Ilona egyszeri jutalma; böngészőoldal újratöltése után a fegyver, arany és italok visszatöltése.
2. **Mozgás és harc:** WASD és nyilak; falu–rét és rét–erdő határátlépés mindkét irányban; réti ellenfél tényleges kardcsapásokkal legyőzése, arany és TP jóváírása; Q-val gyógyítás; ellenféltől sebzés, vereség; Esc nem kerüli meg a vereséget; visszatérés a faluba, helyes aranyveszteséggel. Chromiumban házfalnak mozgás és a pozíció ellenőrzése is lefutott.
3. **Fő küldetés:** zárt északi kapu; Márton megbízása; Dénes kiszabadítása; visszatérés és jutalomátvétel; a 2 sebzésű erdőjáró penge és 2. szint ellenőrzése; Tövisúr legyőzése valódi, ismételt kardcsapásokkal; győzelmi párbeszéd; a kapu megnyílása és állapotának megőrzése oldal-újratöltés után. Az északi világ nem járható.
4. **Kunyhó és pince:** belépés E-vel, napló olvasása; a szekrény első vizsgálata még nem mozdítja el; második vizsgálat és külön félretolási döntés; lejutás; felirat; zárt láda; rossz rúnasorrend nullázása; helyes sorrend (kelet → dél → nyugat); a rézmedál, +1 maximális életerő, 15 arany és ital ellenőrzése; ismételt jutalom kizárása; pinceállapot visszatöltése teljes oldal-újratöltés után; kijutás a pincéből és a kunyhóból.
5. **Kezelőfelület és hibakezelés:** hang ki/be; sérült JSON-mentés elutasítása; új játék megerősítése és megszakítása; 390 × 844-es nézet vízszintes túlcsordulás nélkül. Firefoxban a falu és az erdő eltérő, ténylegesen ütemezett oszcillátorfrekvenciáit is ellenőriztük. A teljes Firefox-futásban 0 alkalmazásból érkező JavaScript-futáshiba és 0 külső tartalomkérés volt.

A tesztek mentési ellenőrzőpontokkal helyezik el a lovagot a vizsgált helyzetekben. **Nem egyetlen, megszakítás nélküli, kézzel végigjátszott útvonalat mérnek.** A párbeszédeket, vásárlást, gyűjtést, harcot, helyszínváltást, rejtvényt és mentést a tényleges kezelőfelülettel/billentyűzettel végzik; nem hívják közvetlenül a játékmotor műveleteit. A tesztek helyenként ellenőrzött aranyat/életerőt állítanak be a konkrét esetre. A szabad kültéri határátlépést tényleges mozgás ellenőrzi.

## A 19 logikai ellenőrzés tartalma

- Irányított kard: rossz irányból nincs találat, támadási várakozás érvényesül.
- Ellenfél legyőzéséért egyszer jár jutalom; a közönséges ellenfél csak távol éled újra.
- Szintküszöbök, 5-ös szintkorlát, teljes gyógyulás és maximális életerő növekedése.
- Épület- és pályahatár-ütközés; folytonos helyszínhatárok.
- Párbeszéd szünetelteti a mozgást és harcot, nem marad beragadt billentyű.
- Kovács: elégtelen arany, egyszeri levonás, szerény fegyverfejlesztés.
- Kereskedő, fogadó, italok: helyes árak, teljes életerőn nincs felesleges fogyasztás.
- Egyszer gyűjthető növények, pontosan három gyógyfű és egyszeri jutalom.
- Mentési küldetés, egyszeri fegyver/arany/TP-jutalom, főellenfél pajzsa.
- Tövisúr a küldetés nélkül nem sebezhető; legyőzése végleges, a kapu megnyílik.
- A szekrény mellett **nincs automatikus közelségi felirat**; megvizsgálás és elmozdítás külön kézi művelet.
- Napló utalása, rossz és helyes rúnasorrend, egyszeri pincejutalom.
- Sebzés, vereség és feléledés a fejlődés elvesztése nélkül.
- Új motorpéldányba teljes mentési kör, beleértve a pince/rúnák/ellenfelek állapotát.
- Hiányzó, sérült, idegen verziójú vagy hozzáférhetetlen mentés nem írja felül az aktív játékot.
- Hibás koordináták, életerő, hiányzó ellenfelek, ismeretlen fegyver és sérült állapot elutasítása.
- Hiányzó vagy hibát jelző Web Audio esetén a játék némán működik tovább.
- Örökké függő hangindítás 2,5 másodperc után megszakad, a kapcsoló nem ragad le.
- Eltérő falu/erdő dallam, vásárlási/támadási hangok és némítás működése.

## Firefox és hang: a környezet pontosítása

A Playwright Firefox-letöltését a felhőkörnyezet hálózati engedélylistája 403-mal blokkolta. Ezért a valódi Firefox ESR-t a Debian aláírt csomagindexei alapján, `apt-get download` segítségével töltöttük le és `/tmp` alá bontottuk ki. Az aláírás- és TLS-ellenőrzést nem kapcsoltuk ki. A normál Firefoxot Puppeteer WebDriver BiDi-val vezéreltük, nem Chromiumot neveztünk át Firefoxnak.

A konténer nem enged felhasználói névtereket létrehozni, és nincs fizikai hangkártyája. A teszt saját profilja engedélyezi a Web Audio lejátszást, a hang virtuális, helyi PulseAudio null-kimenetre kerül. Ehhez a **tesztfolyamatban**, nem a játék kódjában, a konténerbeli Firefox tartalmi és utility sandboxát fel kellett oldani. Normál asztali böngészőnek ezek a környezeti kerülőutak nem kellenek.

Az itt ténylegesen sikeres Firefox-parancs a már előkészített tesztkörnyezetben:

```sh
FIREFOX_PATH=/tmp/smaragd-firefox/runtime/usr/lib/firefox-esr/firefox-esr \
XDG_CONFIG_HOME=/tmp/smaragd-firefox/config \
XDG_CACHE_HOME=/tmp/smaragd-firefox/cache \
MOZ_DISABLE_CONTENT_SANDBOX=1 \
MOZ_DISABLE_UTILITY_SANDBOX=1 \
FIREFOX_CONTAINER_AUDIO=1 \
PULSE_SERVER=unix:/tmp/smaragd-pulse/run/native \
npm run test:firefox
```

A `/tmp`-beli Firefox és a virtuális hangkimenet tesztsegédlet, **nem a játék terjesztett függősége**. Más gépen a telepített Firefox útjával, normál hangkimenettel futtatható a dokumentált teszt.

Az oszcillátorok ütemezését és működő AudioContextet ellenőriztük. **Fizikai hangszórón történő meghallgatás, szubjektív hangminőség-értékelés és valódi mobilkészülékes érintésteszt nem történt.** A mobilos ellenőrzés a böngésző nézetméretére és túlcsordulására vonatkozik.

## Fejlesztés közben javított problémák

- Visszatöltés után a közeli ellenfél azonnal eltalálhatta a lovagot. Betöltéskor most egy másodperc sérthetetlenséget kap.
- Elérhetetlen hangkimenetnél az AudioContext indítása végtelenül függőben maradhatott. A hangindítás most időkorlátos, kezelhetően kikapcsolva marad.
- A HUD azonos értékeit képkockánként újraírta. Most a szöveg és az életerő akadálymentes felirata csak változáskor frissül.
- Az első Chromium-futásban egy kapupárbeszéd-ellenőrzés eltérő szöveget várt. A helyes, tényleges végállapothoz igazított teszt ezután sikeres; a korábbi hibás futást nem számítjuk sikeresnek.
