# Redox-Labor

Eine responsive, interaktive Lerneinheit zu Redoxreaktionen. Sie basiert auf den bereitgestellten Unterrichtsunterlagen und funktioniert vollständig im Browser.

## Enthalten

- 6 aufeinander aufbauende Etappen
- 34 Aufgaben auf drei Niveaus
- Auswahl-, Mehrfachauswahl-, Eingabe- und Sortieraufgaben
- gestufte Hinweise, Teilpunkte und erklärende Selbstkorrektur
- kurze Eingangsdiagnose und adaptive Niveaustufe
- serverseitiger Lernstand mit unveränderlichem Versuchsprotokoll
- geräteübergreifende pseudonyme Lernkonten
- Lehrpersonenbericht mit CSV-Export
- Glossar, Tastaturbedienung und responsive Darstellung
- keine Build-Schritte und keine JavaScript-Abhängigkeiten

## Architektur

Die Website bleibt statisch und kann auf GitHub Pages liegen. Eine getrennte Cloudflare-Worker-API bewertet Antworten serverseitig und speichert sie in einer D1-Datenbank. Dadurch kann der Browser keine beliebigen Punktstände übermitteln.

Die Datenbank führt zwei Ebenen:

- `attempts` protokolliert jeden Lösungsversuch unverändert.
- `mastery` speichert den besten Wert und die Zahl der Versuche je Aufgabe.

Klassen, pseudonyme Lernkonten, Lernniveau und die letzte Etappe liegen ebenfalls in D1. Im Browser wird nur ein zeitlich begrenztes Sitzungstoken gespeichert, keine Fortschrittsdaten.

## Website lokal starten

Einfach `index.html` öffnen. Zuverlässiger ist ein kleiner lokaler Server:

```bash
python3 -m http.server 8000
```

Danach `http://localhost:8000` aufrufen.

## Datenbank und API einrichten

Voraussetzung ist ein Cloudflare-Konto. Im Ordner `backend`:

```bash
npm install
npx wrangler login
npx wrangler d1 create redox-lernstand
```

Die ausgegebene `database_id` in `backend/wrangler.jsonc` einsetzen. Dort ausserdem unter `ALLOWED_ORIGINS` die echte GitHub-Pages-Origin eintragen, zum Beispiel `https://mein-name.github.io`. Anschliessend ein langes, zufälliges Admin-Token als Secret setzen:

```bash
npx wrangler secret put ADMIN_TOKEN
npm run db:remote
npm run deploy
```

Die beim Deployment ausgegebene Worker-URL in `config.js` eintragen. Beispiel:

```js
window.REDOX_API_URL = 'https://redox-lernstand-api.example.workers.dev';
```

Danach über `teacher.html` mit dem Admin-Token eine Klasse und deren Klassen-Code anlegen. Lernende registrieren sich mit diesem Code, einem Pseudonym und einer persönlichen PIN.

## GitHub Pages veröffentlichen

1. Diesen Ordner als Repository-Inhalt zu GitHub hochladen.
2. Unter **Settings → Pages** als Quelle **Deploy from a branch** wählen.
3. Branch `main` und Ordner `/ (root)` auswählen.
4. Speichern. GitHub veröffentlicht die Seite nach kurzer Zeit.

Die Datei `.nojekyll` stellt sicher, dass GitHub Pages alle statischen Dateien unverändert ausliefert.

## Datenschutz und Betrieb

Die Anwendung lädt nur die Schriftarten DM Mono und Manrope von Google Fonts. Für einen vollständig externdienstfreien Schriftbetrieb kann die `@import`-Zeile in `styles.css` entfernt werden; dann greifen die Systemschriften.

- Für Lernnamen sollten ausschliesslich Pseudonyme verwendet werden.
- PINs werden mit PBKDF2-SHA-256 und individuellem Salt gespeichert, nicht im Klartext.
- Das Admin-Token liegt ausschliesslich als Cloudflare Secret vor.
- CORS beschränkt API-Zugriffe auf die konfigurierten Website-Origins.
- Einzelne Lernkonten können durch eine Lehrperson direkt in D1 gelöscht werden. Dank Fremdschlüsseln mit `ON DELETE CASCADE` verschwinden dabei auch Sitzungen, Versuche und Mastery-Daten.
- Für schulischen Produktivbetrieb sollten Aufbewahrungsdauer, Löschprozess und Informationspflichten vorab festgelegt werden.

Cloudflare D1 unterstützt Wiederherstellungspunkte. Zusätzlich kann regelmässig ein SQL-Export gesichert werden:

```bash
npx wrangler d1 export redox-lernstand --remote --output=backup.sql
```

## Technische Prüfung

```bash
cd backend
npm run types
npm run check
npm run deploy:check
```

## Quellenbasis

- `Redox-Reaktionen.pdf`, Kantonsschule Ausserschwyz
- `Redox-reaktionen.pptx`

Die Quelldateien selbst sind nicht enthalten. Vor einer öffentlichen Weitergabe bitte Rechte und gewünschte Quellenangabe prüfen.
