# A varázsló tornya

Egyszerű, SNES-hangulatú, felülnézetes fantasy játék HTML, CSS és JavaScript használatával. Nincs build vagy alkalmazásfüggőség; a grafika Canvas segítségével készül.

## Indítás

Nyisd meg az `index.html` fájlt böngészőben, vagy a projekt könyvtárában indíts helyi szervert:

```sh
python3 -m http.server 8000
```

Ezután nyisd meg a `http://localhost:8000` címet.

## Játékmenet

- Indítás: **Kaland indítása**.
- Mozgás: **WASD** vagy **nyilak**; érintőképernyőn a megjelenő gombok.
- Kard: **szóköz**. Közelről, az ellenfél felé fordulva támadj. Az őrző három találattal győzhető le.
- A lovag öt életerővel indul. Az őrző érintése sebzést okoz, rövid sérthetetlenséggel.
- **R** vagy **Újrakezdés**: új játék győzelem vagy vereség után is.

A külső Google Fonts betűkészlet opcionális: internet nélkül helyi tartalék betűtípussal is fut a játék. Windows EXE nem készül.
