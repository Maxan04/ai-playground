# AI Playground

En första fullstack-version av AI Playground med mockad AI.
Bygger på React Router loaders/actions, Drizzle och SQLite.

## 🚀 Funktioner

* Route `/playground` som startsida

* Formulär med input-text, mode och Run-knapp

* Mockad AI-funktion (summary, rewrite, social, campaign)

* Sparar resultat i SQLite via Drizzle

* Visar senaste körningen + historik

## Databas

Kör migrationer:

```bash
npm run db:generate
npm run db:push
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
http://localhost:5173/
```

## OpenAI

Applikationen fungerar utan OpenAI-nyckel.
Vill du använda riktig AI, skapa en .env-fil baserat på `.env.example` och lägg in din API-nyckel.