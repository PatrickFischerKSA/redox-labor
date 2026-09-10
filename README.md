# Redox-Labor

Eine responsive, interaktive Lerneinheit zu Redoxreaktionen. Sie basiert auf den bereitgestellten Unterrichtsunterlagen und funktioniert vollständig im Browser.

## Enthalten

- 6 aufeinander aufbauende Etappen
- 34 Aufgaben auf drei Niveaus
- Auswahl-, Mehrfachauswahl-, Eingabe- und Sortieraufgaben
- gestufte Hinweise, Teilpunkte und erklärende Selbstkorrektur
- kurze Eingangsdiagnose und adaptive Niveaustufe
- lokaler Lernstand über `localStorage`
- Glossar, Tastaturbedienung und responsive Darstellung
- keine Build-Schritte und keine JavaScript-Abhängigkeiten

## Lokal starten

Einfach `index.html` öffnen. Zuverlässiger ist ein kleiner lokaler Server:

```bash
python3 -m http.server 8000
```

Danach `http://localhost:8000` aufrufen.

## GitHub Pages

1. Diesen Ordner als Repository-Inhalt zu GitHub hochladen.
2. Unter **Settings → Pages** als Quelle **Deploy from a branch** wählen.
3. Branch `main` und Ordner `/ (root)` auswählen.
4. Speichern. GitHub veröffentlicht die Seite nach kurzer Zeit.

Die Datei `.nojekyll` stellt sicher, dass GitHub Pages alle statischen Dateien unverändert ausliefert.

## Datenschutz

Die Anwendung lädt nur die Schriftarten DM Mono und Manrope von Google Fonts. Lernantworten und Fortschritt bleiben im Browser. Für einen vollständig offlinefähigen Betrieb kann die `@import`-Zeile in `styles.css` entfernt werden; dann greifen die Systemschriften.

## Quellenbasis

- `Redox-Reaktionen.pdf`, Kantonsschule Ausserschwyz
- `Redox-reaktionen.pptx`

Die Quelldateien selbst sind nicht enthalten. Vor einer öffentlichen Weitergabe bitte Rechte und gewünschte Quellenangabe prüfen.
