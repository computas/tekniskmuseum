# Tekniskmuseum

Dette er repoet som står for front-end biten av Teknisk Museum-prosjektet "Kunstig Jens". Her finner du svar på de viktigste tingene du trenger å kunne for å starte opp applikasjonen.

## Oppsett

1. Prosjektet bruker [Bun](https://bun.sh) for pakkebehandling og kjøring av kode. Om du ikke har installert Bun, kan det gjøres slik:

```shell
# For MacOS, Linux, og WSL
curl -fsSL https://bun.sh/install | bash

# For Windows
powershell -c "irm bun.sh/install.ps1|iex"
```

2. Deretter kan du installere avhengighetene i prosjektet ved å kjøre

```shell
bun install
```

3. Til slutt kan du starte opp det lokale utviklingsmiljøet ved å kjøre

```shell
bun run start
```

## Forskjellige miljøer

Om man ønsker å gå mot forskjellige miljøer, er det satt opp et sett med forskjellige konfigurasjoner i prosjektet. Disse finner man i mappen `/src/environments/`. Om man f.eks. ønsker å bruke konfigurasjonen "Computas", kan man gjøre det ved å legge til argumentet `--configuration` når man starter opp det lokale utviklingsmiljøet. Det vil si at man da kjører scriptet

```shell
bun run start --configuration computas
```

## Oppstår det problemer i teamet forbundet med bruk av Bun?

Ikke noe problem! Dere kan enkelt gå over til mer tradisjonelle verktøy som Yarn eller NPM. Da er det bare å gjøre følgende:

- Slett `bun.lockb` filen.
- Endre workflowene i `.github/workflows` til å ikke bruke Bun (dvs erstatt trinnet `uses: oven-sh/setup-bun@v1` samt andre kall som bruker Bun).
- Skriv inn ny pakkebehandler i feltet `cli.packageManager` i `angular.json`.
- Lag en ny lockfil med den nye pakkebehandleren ved å kjøre hhv. `npm i` eller `yarn`.
