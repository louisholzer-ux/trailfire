const DISCIPLINES = [
  { id: "hm", name: "Horsemanship", short: "Grundlagen", where: "sattel" },
  { id: "re", name: "Reining", short: "Manöver", where: "sattel" },
  { id: "tr", name: "Trail", short: "Hindernisse", where: "sattel" },
  { id: "wp", name: "Western Pleasure", short: "Gang & Pattern", where: "sattel" },
  { id: "rr", name: "Ranch Riding", short: "Ranch", where: "sattel" },
  { id: "bw", name: "Bodenarbeit", short: "Boden", where: "boden" }
];

const EXERCISES = [
  {
    id: "hm-mount", d: "hm", name: "Korrektes Aufsteigen", min: 6, reps: "6 Aufstiege", where: "sattel", side: false,
    goal: "Ruhig, gerade und ohne Ziehen am Sattelhorn aufsteigen.",
    setup: "Pferd steht gerade, Zügel aufgenommen, Steigbügel passend. Sicherer Untergrund.",
    steps: ["Pferd parallel und still stellen", "Linken Fuß in den Bügel, Gewicht in den Ballen", "Mit der Hand am Horn nur balancieren, nicht hochziehen", "Rechtes Bein ruhig überschwingen, weich in den Sitz kommen", "Sofort Zügel sortieren und einen Schritt vorwärts bitten"],
    errors: ["Am Horn hochziehen", "Pferd tritt weg, weil der Reiter in den Rücken fällt", "Zügel verloren, Pferd dreht ein"],
    up: "Aus dem Stand, dann nach einem Rückwärtstritt, dann von beiden Seiten, wenn das Pferd das kennt."
  },
  {
    id: "hm-seat", d: "hm", name: "Sitz und Balance im Walk", min: 8, reps: "2 × 3 Min", where: "sattel", side: true,
    goal: "Im Schritt unabhängig sitzen, Becken folgt, Beine ruhig.",
    setup: "Sichere Bahn oder Roundpen, Zügel lang genug für leichten Kontakt.",
    steps: ["Geradeaus im Walk, Blick auf", "Drei Atemzüge nur aufs Becken achten", "Arme seitlich, dann zurück an den Zügel", "Volte links und rechts ohne Tempo-Verlust", "Anhalten ohne nach vorn zu kippen"],
    errors: ["Festhalten am Horn", "Bein klemmt bei jeder Wendung", "Oberkörper fällt in die Volte"],
    up: "Ohne Bügel für kurze Stücke, nur wenn das Pferd sicher ist."
  },
  {
    id: "hm-aids", d: "hm", name: "Unabhängige Hilfen", min: 8, reps: "5 Durchgänge", where: "sattel", side: true,
    goal: "Bein, Sitz und Hand getrennt einsetzen.",
    setup: "Gerade Linie und eine große Volte.",
    steps: ["Walk, Hand still", "Nur Sitz: etwas mehr Tempo, dann zurück", "Nur Bein an der Longe-Seite leicht anlegen", "Hand bleibt tief und ruhig", "Wechsel: eine Hilfe, die anderen still"],
    errors: ["Jede Hilfe kommt gleichzeitig", "Zügel wird kürzer, sobald das Bein arbeitet"],
    up: "Im Jog dieselbe Trennung, kurze Sequenzen."
  },
  {
    id: "hm-rein", d: "hm", name: "Zügelhaltung einhändig", min: 6, reps: "4 × 1 Min", where: "sattel", side: true,
    goal: "Neck-rein leicht, Hand über dem Horn, nicht sägend.",
    setup: "Split oder Romal, eine Hand. Freie Hand am Schenkel.",
    steps: ["Zügel gleich lang aufnehmen", "Hand geschlossen, Daumen oben", "Geradeaus, Hand still", "Leichte Wendung nur aus der Hand, Sitz folgt", "Gerade richten, Zügel nachfassen"],
    errors: ["Hand wandert zur Seite weg", "Zügel ungleich, Pferd über eine Schulter"],
    up: "Slalom um Kegel mit nur einer Hand."
  },
  {
    id: "hm-stop", d: "hm", name: "Stop aus dem Walk", min: 7, reps: "8 Stops", where: "sattel", side: false,
    goal: "Pferd hält gerade, Reiter sitzt bis zum Schluss.",
    setup: "Lange Gerade. Markierung als Haltepunkt.",
    steps: ["Walk gleichmäßig zur Marke", "Sitz wird still, Bein hört auf zu treiben", "Zügel schließt weich, kein Ruck", "Pferd steht quadratisch", "Drei Sekunden stehen, dann lösen"],
    errors: ["Nach vorn fallen", "Zügel zu lang, dann plötzlich kurz", "Pferd steht schief"],
    up: "Aus dem Jog, immer noch weich, nicht sliden."
  },
  {
    id: "hm-back", d: "hm", name: "Backup gerade", min: 6, reps: "6 × 6 Tritte", where: "sattel", side: false,
    goal: "Gerade rückwärts, diagonal, ohne Eile.",
    setup: "Entlang einer Bande oder zwischen zwei Linien.",
    steps: ["Aus dem Halt Sitz leicht schließen", "Zügel pulsierend, nicht starr", "Erste zwei Tritte langsam", "Gerade halten, Schultern im Blick", "Vorwärts lösen und loben"],
    errors: ["Dauerzug", "Pferd weicht mit der Hüfte", "Reiter lehnt zu weit zurück"],
    up: "Leichte Biegung im Backup, dann wieder gerade."
  },
  {
    id: "hm-side", d: "hm", name: "Seitwärts im Sattel", min: 7, reps: "6 Bahnen", where: "sattel", side: true,
    goal: "Seitengang mit Vorder- und Hinterhand zusammen.",
    setup: "Entlang der Bande, weg von der Bande seitwärts.",
    steps: ["Walk, dann Halt parallel zur Bande", "Bein an der Seite, die weichen soll", "Sitz öffnet leicht zur Bewegungsrichtung", "Ein Schritt, nachgeben", "Gerade neu ausrichten"],
    errors: ["Nur Vorhand schiebt", "Zügel blockiert die Schulter"],
    up: "Über eine am Boden liegende Stange."
  },
  {
    id: "hm-bend", d: "hm", name: "Biegung auf der Volte", min: 8, reps: "4 Volten je Seite", where: "sattel", side: true,
    goal: "Gleichmäßige Biegung durch den Körper, nicht nur der Hals.",
    setup: "12-m-Volte, Kegel als Mitte.",
    steps: ["Walk auf der Volte", "Inneres Bein am Gurt, äußeres dahinter", "Innerer Zügel fragt, äußerer begrenzt", "Rippen folgen, nicht einrollen", "Geradeaus auf die Linie zurück"],
    errors: ["Hals überbiegt, Schulter fällt raus", "Tempo bricht ein"],
    up: "Volte verkleinern, dann im Jog."
  },
  {
    id: "hm-trans", d: "hm", name: "Übergänge Walk–Jog–Walk", min: 8, reps: "10 Übergänge", where: "sattel", side: false,
    goal: "Übergang aus dem Sitz, Pferd bleibt im Rahmen.",
    setup: "Große Bahn, gleiche Strecke für jeden Übergang.",
    steps: ["Walk taktrein", "Sitz etwas aktiver für Jog", "Jog 8 Tritte", "Sitz still, weiches Annehmen für Walk", "Sofort wieder Takt suchen"],
    errors: ["Bein trommelt", "Übergang über die Hand erzwungen"],
    up: "Jog–Lope nur, wenn das Pferd den Lope schon kennt und ruhig bleibt."
  },
  {
    id: "re-circles", d: "re", name: "Circles klein und groß", min: 10, reps: "2 große, 2 kleine je Hand", where: "sattel", side: true,
    goal: "Runder Circle, Tempo zur Größe passend, Lead klar.",
    setup: "Abgesteckter Circle, etwa 18 m groß und 9 m klein. Sicheres Pferd im Lope.",
    steps: ["Großer Circle im Lope, gleichmäßiger Takt", "Größe halten, nicht eiern", "Auf den kleinen Circle verkürzen, ohne zu hetzen", "Zurück auf groß, Tempo atmet mit", "In die Mitte führen und weich abwärts"],
    errors: ["Circle wird zum Ei", "Innen schultert", "Tempo fällt auf dem kleinen Circle zusammen"],
    up: "Geschwindigkeitswechsel innerhalb des großen Circles."
  },
  {
    id: "re-lead", d: "re", name: "Einfache Lead Changes", min: 8, reps: "6 Changes", where: "sattel", side: true,
    goal: "Lead über den Walk oder Jog wechseln, sauber und ruhig.",
    setup: "Diagonale oder Acht. Nur reiten, was das Pferd schon gelernt hat.",
    steps: ["Lope auf dem bekannten Lead", "Auf die Mittellinie, abwärts in den Jog", "Gerade richten, neuen Lead vorbereiten", "Neuer Lope auf dem anderen Fuß", "Circle zur Kontrolle"],
    errors: ["Change im schiefen Pferd", "Zu frühes Bein, Crossfire"],
    up: "Weniger Jog-Tritte zwischen den Leads, nie erzwingen."
  },
  {
    id: "re-spin", d: "re", name: "Spins vorbereiten", min: 8, reps: "4 × 180° je Seite", where: "sattel", side: true,
    goal: "Hinterhand als Achse andeuten, nicht hetzen.",
    setup: "Ebener Boden, Pferd kennt Seitwärts. Erst 90 bis 180 Grad.",
    steps: ["Aus dem Halt Außenbein leicht zurück", "Sitz öffnet in die Drehrichtung", "Vorderhand kreuzt, Hinterhand bleibt", "Nach einer Vierteldrehung lösen", "Geradeaus einen Schritt, dann neu"],
    errors: ["Pferd tritt mit der Hinterhand weg", "Reiter zieht den Kopf herum", "Mehr Tempo statt mehr Kreuzung"],
    up: "360 Grad nur bei gerader Achse."
  },
  {
    id: "re-slide", d: "re", name: "Sliding-Stop-Vorbereitung", min: 8, reps: "6 Stopps", where: "sattel", side: false,
    goal: "Tiefer, gerader Stop aus dem Lope, noch ohne Rutschpflicht.",
    setup: "Guter Boden, nicht zu tief oder steinig. Pferd stoppt schon aus dem Jog.",
    steps: ["Lope auf der Geraden, Reiter mittig", "Sitz tief und still in den letzten Tritten", "Stimme oder weiches Schließen, kein Ruck", "Pferd hält mit der Hinterhand unter dem Körper", "Stehen bleiben, nachgeben"],
    errors: ["Nach vorn werfen", "Zügel hochreißen", "Stop in der Wendung"],
    up: "Etwas mehr Tempo, nur wenn der Stop gerade bleibt."
  },
  {
    id: "re-roll", d: "re", name: "Rollback-Form", min: 8, reps: "6 Rollbacks", where: "sattel", side: true,
    goal: "Stop, 180 Grad über die Hinterhand, neuer Lead.",
    setup: "Bande oder imaginäre Linie. Boden griffig.",
    steps: ["Entlang der Linie im Lope", "Stop gerade", "Gewicht zur neuen Richtung", "Vorderhand dreht 180", "Sofort in den neuen Lope oder Jog"],
    errors: ["Drehung nach vorn heraus", "Pause zu lang, Pferd schläft ein", "Schiefer Stop"],
    up: "Flüssiger, ohne Extra-Schritt."
  },
  {
    id: "re-run", d: "re", name: "Rundown-Gerade", min: 7, reps: "4 Geraden", where: "sattel", side: false,
    goal: "Gerade beschleunigen und geführt bleiben.",
    setup: "Lange, freie Gerade. Nur Tempo, das du halten kannst.",
    steps: ["Aus dem Jog auf die Gerade", "Lope aufbauen, eine Linie", "Hände ruhig, Blick ans Ende", "Vor der Marke Tempo zurück", "Stop oder weicher Übergang"],
    errors: ["Linie verlässt die Mitte", "Tempo ohne Rahmen", "Reiter kommt hinter die Bewegung"],
    up: "Längere Gerade, gleicher Rahmen."
  },
  {
    id: "tr-bridge", d: "tr", name: "Brücke", min: 7, reps: "6 Überquerungen", where: "sattel", side: false,
    goal: "Gerade, im Walk, ohne Zögern mittig über die Brücke.",
    setup: "Stabile Brücke, Anritt frei. Bodenarbeit zuerst, wenn unsicher.",
    steps: ["Gerader Anritt im Walk", "Blick über die Brücke, nicht auf die Füße", "Mittig bleiben, Zügel lang genug", "Auf der Brücke nicht antreiben im Paniktempo", "Gerade herunter, zwei Schritte geradeaus"],
    errors: ["Schiefer Anritt", "Reiter schaut runter und kippt", "Mitten drauf anhalten und festhalten"],
    up: "Halt auf der Brücke, dann weiter. Jog nur bei sicherem Pferd."
  },
  {
    id: "tr-gate", d: "tr", name: "Gate öffnen und schließen", min: 9, reps: "4 Tore je Seite", where: "sattel", side: true,
    goal: "Tor kontrolliert, Pferd parallel, Riegel ohne Lostreten.",
    setup: "Sicheres Tor, das zum Pferd passt. Eine Hand frei.",
    steps: ["Parallel ans Tor, die richtige Seite", "Riegel öffnen, Tor einen Spalt", "Seitwärts oder Vorhand wenden, je nach Tor", "Durchgehen, ohne das Tor zu verlieren", "Schließen und Riegel zu, dann gerade weg"],
    errors: ["Zügel verloren", "Pferd drängt durchs offene Tor", "Schulter fällt ins Tor"],
    up: "Andere Hand, engeres Tor, aus dem Backup."
  },
  {
    id: "tr-back", d: "tr", name: "Back-through", min: 8, reps: "5 Durchgänge", where: "sattel", side: true,
    goal: "Rückwärts durch eine L- oder Gerade, Stangen nicht berühren.",
    setup: "Stangen am Boden, zunächst weit. Helfer nicht nötig.",
    steps: ["Gerade vor dem Eingang halten", "Backup einen Tritt, prüfen", "Schultern in die Lücke steuern", "Ecke früh andeuten", "Durch, dann vorwärts lösen"],
    errors: ["Zu schnell", "Nur über den Zügel lenken", "Stange mit der Hinterhand"],
    up: "Enger stellen, L-Form."
  },
  {
    id: "tr-side", d: "tr", name: "Sidepass über die Stange", min: 7, reps: "6 Seiten", where: "sattel", side: true,
    goal: "Seitwärts über eine Stange, Vorder- und Hinterhuf kreuzen sie.",
    setup: "Eine Stange am Boden, parallel zum Pferd.",
    steps: ["Parallel, Stange unter der Mitte", "Ein Seitwärtsschritt", "Beide Beinpaare über die Stange", "Nicht vorwärts ausweichen", "Andere Richtung"],
    errors: ["Stange nur mit der Vorhand", "Eile, Huf schleift"],
    up: "Erhöhte Stange nur minimal, oder zwischen zwei Stangen."
  },
  {
    id: "tr-serp", d: "tr", name: "Serpentinen um Kegel", min: 7, reps: "4 Serpentinen", where: "sattel", side: true,
    goal: "Gleichmäßige Bögen, gleicher Abstand, Walk-Takt.",
    setup: "3 bis 5 Kegel in einer Linie.",
    steps: ["Ersten Kegel links umrunden", "Wechsel der Biegung vor dem nächsten", "Abstand gleich halten", "Tempo nicht in der Biegung verlieren", "Letzten Kegel gerade verlassen"],
    errors: ["Kegel schneiden", "Halsbiegung ohne Körper", "Jog, bevor der Walk stimmt"],
    up: "Engere Abstände oder kurzer Jog zwischen den Kegeln."
  },
  {
    id: "tr-mail", d: "tr", name: "Mailbox", min: 6, reps: "4 je Seite", where: "sattel", side: true,
    goal: "Seitlich an die Box, Deckel oder Gegenstand ruhig nehmen und zurücklegen.",
    setup: "Kiste auf Stangenhöhe. Gegenstand leicht.",
    steps: ["Parallel, die arbeitende Seite zur Box", "Stehen, Zügel in einer Hand", "Gegenstand nehmen", "Einen Schritt weg oder bleiben", "Zurücklegen, dann aktiv weiter"],
    errors: ["Pferd weicht, sobald die Hand hochgeht", "Reiter klappt zur Seite und verliert den Sitz"],
    up: "Aus dem Walk anreiten und nach einem Tritt stehen."
  },
  {
    id: "tr-stand", d: "tr", name: "Ruhiges Stehen", min: 6, reps: "4 × 20 Sek", where: "sattel", side: false,
    goal: "Pferd steht, während der Reiter etwas tut.",
    setup: "Offene Fläche, dann neben einem Gegenstand.",
    steps: ["Weicher Halt", "Zügel lang, Sitz still", "Eine Hand bewegt sich langsam", "20 Sekunden ohne Nachtreten", "Ein Schritt vor, neu aufbauen"],
    errors: ["Dauernd korrigieren", "Zügel fest, Pferd wird eng"],
    up: "Mantel an- und ausziehen, Tür im Stand öffnen."
  },
  {
    id: "wp-jog", d: "wp", name: "Gleichmäßiger Jog", min: 8, reps: "3 × 2 Min", where: "sattel", side: true,
    goal: "Langer, gleicher Jog, Ecken gerundet, Headset ruhig.",
    setup: "Bahn oder Viereck. Pleasure-Tempo, nicht Trail-Tempo.",
    steps: ["Aus dem Walk in den Jog an der langen Seite", "Takt zählen", "Ecke als Viertelvolte", "Headset nicht festzurren", "Walk an einer festen Marke"],
    errors: ["Jog wird zum Trab nach vorn", "Jede Ecke wird langsamer", "Hand spielt ständig"],
    up: "Diagonale mit gleichem Takt."
  },
  {
    id: "wp-lope", d: "wp", name: "Gleichmäßiger Lope", min: 8, reps: "3 Runden je Hand", where: "sattel", side: true,
    goal: "Dreitakt bleibt, Pferd trägt sich, Reiter sitzt tief.",
    setup: "Großer Zirkel. Nur wenn Lope schon sicher ist.",
    steps: ["Übergang aus dem Jog an der langen Seite", "Lead prüfen", "Eine Runde gleicher Takt", "Ecken nicht schneiden", "Zurück in den Jog, bevor es auseinanderfällt"],
    errors: ["Viertakt", "Innen durch die Schulter", "Reiter treibt in jedem Tritt nach"],
    up: "Große Acht mit einfachem Leadwechsel."
  },
  {
    id: "wp-trans", d: "wp", name: "Pleasure-Übergänge", min: 8, reps: "8 Übergänge", where: "sattel", side: false,
    goal: "Walk, Jog, Lope ohne sichtbaren Kampf.",
    setup: "Marken für Übergänge auf der Bahn.",
    steps: ["Walk zur ersten Marke", "Jog, Rahmen behalten", "Lope kurz, wenn passend", "Abwärts erst Sitz, dann Hand", "Headset bleibt in jeder Gangart"],
    errors: ["Kopf hoch im Abwärts", "Übergang zu spät an der Marke"],
    up: "Pattern mit festen Punkten auswendig."
  },
  {
    id: "wp-head", d: "wp", name: "Headset und Rahmen", min: 7, reps: "4 × 1 Min", where: "sattel", side: true,
    goal: "Genick nachgeben, ohne den Rücken zu verlieren.",
    setup: "Walk und Jog. Kein Tiefliegen erzwingen.",
    steps: ["Takt zuerst", "Weiches Pulsieren, dann nachgeben", "Sobald das Genick kommt, Hand still", "Biegung prüfen: Rahmen bleibt in der Volte", "Lob im langen Zügel für ein paar Tritte"],
    errors: ["Starrer Zug", "Hinter dem Zügel kriechen", "Nur der Hals rund, Rücken weg"],
    up: "Gleicher Rahmen im Lope auf dem großen Circle."
  },
  {
    id: "wp-pattern", d: "wp", name: "Horsemanship-Pattern sauber", min: 12, reps: "3 Muster", where: "sattel", side: true,
    goal: "Ein kleines Muster mit Marken, Übergängen und Halt exakt reiten.",
    setup: "Kegel: Start, Mitte, Stop-Punkt. Muster vorher am Boden abgehen.",
    steps: ["Muster einmal im Walk abschreiten", "Jog auf der ersten Linie", "Stop an der Marke, 3 Sekunden", "Backup 4 Tritte", "360 Grad, dann Jog zur nächsten Marke"],
    errors: ["Marke verpasst", "Tempo zwischen den Elementen unterschiedlich", "Schiefer Halt"],
    up: "Muster mit Lope-Teilstück."
  },
  {
    id: "rr-ext", d: "rr", name: "Verlängern und verkürzen", min: 8, reps: "6 Wechsel", where: "sattel", side: false,
    goal: "Gangart bleibt, Raumgriff ändert sich.",
    setup: "Lange Seite der Bahn oder Feldweg.",
    steps: ["Mittleren Jog finden", "Sitz bittet um mehr Raumgriff", "6 Tritte verlängert", "Sitz sammelt, ohne zu ziehen", "Zurück zum Ausgangstakt"],
    errors: ["Verlängern wird hetzen", "Verkürzen wird zum Halt", "Rahmen bricht"],
    up: "Dasselbe im Lope auf sicherem Boden."
  },
  {
    id: "rr-stop", d: "rr", name: "Ausbalancierte Ranch-Stopps", min: 7, reps: "8 Stopps", where: "sattel", side: false,
    goal: "Stop aus Jog oder Lope, Pferd bleibt auf der Hinterhand verfügbar.",
    setup: "Feld oder Bahn, Markierung.",
    steps: ["Anritt gerade", "Vor der Marke Sitz tief", "Stop, alle vier Hufe unter dem Reiter", "Sofort Backup zwei Tritte oder weiter", "Kein Nachtreten"],
    errors: ["Auf die Vorhand fallen", "Stop zu spät"],
    up: "Stop und direkt in eine andere Richtung."
  },
  {
    id: "rr-gate", d: "rr", name: "Rückwärts durchs Tor", min: 8, reps: "4 Tore", where: "sattel", side: true,
    goal: "Tor rückwärts passieren, typisch Ranch, ohne Hektik.",
    setup: "Weidetor oder aufgebautes Tor. Platz hinter dem Pferd frei.",
    steps: ["Vor dem Tor halten", "Riegel, Tor einen Spalt", "Backup durch die Öffnung", "Tor mitnehmen", "Schließen, gerade weiter"],
    errors: ["Vorwärts durchdrücken", "Tor schlägt ans Bein"],
    up: "Engeres Tor, andere Seite."
  },
  {
    id: "rr-terrain", d: "rr", name: "Gelände nutzen", min: 12, reps: "1 Runde", where: "sattel", side: true,
    goal: "Hügel, Bodenwechsel oder Baumreihe als Trainingslinie.",
    setup: "Bekannter Ausritt oder eingezäunte Fläche. Tempo dem Boden anpassen.",
    steps: ["Walk bergauf, Reiter entlastet leicht nach vorn", "Gerade Linie zwischen zwei Punkten", "Jog nur auf gutem Boden", "Hang seitlich queren, bergauf-Bein bewusst", "Unten ankommen und stehen"],
    errors: ["Tempo in den Abhang", "Zügel als Bremse am Hang", "Schwache Seite immer außen vergessen"],
    up: "Kleine Rangieraufgabe an einem Baum wie an einem Tor."
  },
  {
    id: "bw-join", d: "bw", name: "Join-up light", min: 8, reps: "3 Runden", where: "boden", side: false,
    goal: "Pferd sucht die Nähe, ohne Jagd.",
    setup: "Roundpen oder Longierzirkel. Seil oder Leadrope.",
    steps: ["Pferd auf den Zirkel bitten", "Körper zeigt Druck, dann weg", "Sobald Ohr und Kopf kommen, Druck weg", "Einladen, nicht hinterherlaufen", "Stehen und Putzen als Lob"],
    errors: ["Dauerdruck", "Pferd hetzt, Mensch dreht mit", "Join-up an der falschen Stelle belohnen"],
    up: "Richtungswechsel über die Körpersprache."
  },
  {
    id: "bw-lead", d: "bw", name: "Führen mit Raum", min: 7, reps: "4 Linien", where: "boden", side: true,
    goal: "Pferd an der Schulter, hält an, wenn du hältst.",
    setup: "Halfter und Führstrick, etwa eine Armlänge.",
    steps: ["Neben der Schulter losgehen", "Blick dahin, wo ihr hinwollt", "Halt: eigener Stop, dann Strick kurz pulsieren falls nötig", "Zwei Sekunden stehen", "Wendung: Schulter weist den Weg"],
    errors: ["Am Kopf zerren", "Pferd läuft voraus oder hinterher", "Mensch schaut das Pferd an statt den Weg"],
    up: "Slalom und Halt auf einer Decke."
  },
  {
    id: "bw-back", d: "bw", name: "Rückwärts am Boden", min: 6, reps: "6 × 5 Tritte", where: "boden", side: false,
    goal: "Gerade rückwärts vom Wellen des Stricks, ohne Dauersog.",
    setup: "Entlang einer Wand oder Linie.",
    steps: ["Pferd gerade stellen", "Strick Richtung Brust pulsieren", "Erster Tritt, nachgeben", "Weitere Tritte rhythmisch", "Vorwärts bitten zum Lösen"],
    errors: ["Strick dauerhaft eng", "Mensch geht rückwärts in das Pferd", "Hüfte bricht aus"],
    up: "Leichte Ecke im Backup."
  },
  {
    id: "bw-side", d: "bw", name: "Seitwärts am Boden", min: 7, reps: "6 Bahnen", where: "boden", side: true,
    goal: "Seitengang von der Schulter oder vom Strick, Hufe kreuzen.",
    setup: "Entlang einer Stange oder Bande.",
    steps: ["Parallel aufstellen", "Druck an der Schulter zur Seite", "Ein Schritt, Pause", "Hinterhand mitnehmen, nicht nur vorne", "Andere Seite genauso lange"],
    errors: ["Nur Vorhand", "Mensch steht im Weg der Hinterhand"],
    up: "Über eine Bodenstange."
  },
  {
    id: "bw-desen", d: "bw", name: "Desensibilisierung", min: 8, reps: "4 Reize", where: "boden", side: true,
    goal: "Plane, Geräusch oder ungewohnter Gegenstand wird langweilig.",
    setup: "Bekannte Plane oder Jacke. Abstand, den das Pferd aushält.",
    steps: ["Gegenstand zeigen, Druck unter der Reaktionsschwelle", "Ruhiges Ohr abwarten", "Druck wegnehmen im richtigen Moment", "Näher, dieselbe Logik", "Andere Seite"],
    errors: ["Reiz bis zur Flucht steigern", "Wegnehmen, während das Pferd noch zappelt", "Nur die gute Seite trainieren"],
    up: "Gegenstand im Sattel, nur nach sicherer Bodenarbeit."
  },
  {
    id: "bw-lunge", d: "bw", name: "Longieren im Roundpen", min: 10, reps: "2 × 4 Min je Hand", where: "boden", side: true,
    goal: "Walk, Jog, Halt auf Stimme und Körpersprache.",
    setup: "Roundpen oder Zirkel, sicheres Equipment.",
    steps: ["Walk anbitten, Position halten", "Jog über Stimme und Energie", "Eine Runde gleicher Takt", "Abwärts, innen einladen", "Halt und zur Mitte kommen"],
    errors: ["Mitlaufen", "Seil als Peitsche", "Nur eine Hand longieren"],
    up: "Übergang an einer festen Stelle im Pen."
  }
];

const FLAME_TIERS = [
  { min: 60, name: "Präriebrand", line: "Die Ebene brennt. Du reitest, auch wenn der Wind dreht." },
  { min: 30, name: "Lauffeuer", line: "Das Feuer läuft mit dir über die Bahn." },
  { min: 14, name: "Lagerfeuer", line: "Warmes, stetiges Feuer. Daraus wird Ritt." },
  { min: 7, name: "Flamme", line: "Eine richtige Flamme. Die Woche gehört dir." },
  { min: 3, name: "Glut", line: "Glut hält. Ein Ritt und sie lebt." },
  { min: 1, name: "Funke", line: "Ein Funke. Der nächste Ritt macht Glut." },
  { min: 0, name: "Asche", line: "Kalt. Ein Workout zündet den Tag." }
];

const RANKS = [
  { id: "none", label: "Neu", min: 0 },
  { id: "bronze", label: "Bronze", min: 3 },
  { id: "silver", label: "Silber", min: 8 },
  { id: "gold", label: "Gold", min: 15 },
  { id: "platin", label: "Platin", min: 28 },
  { id: "elite", label: "Elite", min: 45 }
];
