# AI Playground

En första fullstack-version av AI Playground med mockad AI.
Bygger på React Router loaders/actions, Drizzle och SQLite.

## 🚀 Funktioner

* Route /playground som startsida

* Formulär med input-text, mode och Run-knapp

* Mockad AI-funktion (summary, rewrite, social, campaign)

* Sparar resultat i SQLite via Drizzle

* Visar senaste körningen + historik

## Databas

Skapa .env:

```
DB_FILE_NAME=local.db
```

Kör migrationer:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

## Starta projektet

1. Installera dependencies:

```bash
npm install
```
2. Starta dev-server:

```bash
npm run dev
```

3. Öppna i webbläsare:
```
http://localhost:5173/playground
```