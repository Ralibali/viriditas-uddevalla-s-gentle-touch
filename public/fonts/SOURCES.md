# Teckensnitt

Webbplatsen serverar sina teckensnitt själv. Besökarens webbläsare kontaktar inte Google eller någon annan tredje part för typsnitt.

| Fil | Typsnitt | Användning | Licens |
| --- | --- | --- | --- |
| `fraunces-latin.woff2`, `fraunces-latin-ext.woff2` | Fraunces (variabelt: opsz, wght, SOFT, WONK) | Rubriker | SIL OFL 1.1, se `fraunces-OFL.txt` |
| `atkinson-hyperlegible-next-latin.woff2`, `atkinson-hyperlegible-next-latin-ext.woff2` | Atkinson Hyperlegible Next (variabelt: wght 200–800) | Brödtext och gränssnitt | SIL OFL 1.1, se `atkinson-hyperlegible-next-OFL.txt` |

Filerna kommer från npm-paketen `@fontsource-variable/fraunces@5.3.0` och `@fontsource-variable/atkinson-hyperlegible-next@5.3.0`.

Atkinson Hyperlegible är framtaget av Braille Institute of America för att vara så lättläst som möjligt, även för personer med nedsatt syn.

`@font-face`-reglerna finns i `src/index.css`. De två latinska filerna förladdas i `index.html`.
