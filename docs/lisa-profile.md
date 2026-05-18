# Das Lisa-Profil

## Was ist das Lisa-Profil?
"Lisa's Happy Nahrungsmittel" ist ein vordefiniertes, strenges Ernährungsprofil. Es basiert auf der PDF „Lisa's Happy Nahrungsmittel“. Es hilft dabei, schnell zu erkennen, ob ein Produkt kritische (No-Go) oder unproblematische (Happy) Lebensmittel enthält.

## Happy Foods
Das sind Lebensmittel, die gemäß dem Profil unbedenklich sind. Happy Foods gelten als passende Lebensmittel.
Kategorien:
- Getreide, Pseudogetreide, Stärkehaltiges
- Hülsenfrüchte
- Nüsse & Samen
- Wurzel- & Knollengemüse
- Pilze
- Blattgemüse
- Zwiebelgemüse
- Kohlgemüse
- Fruchtgemüse
- Kern- und Steinobst
- Beeren & Melone
- Milchprodukte
- Süßungsmittel
- Fleisch & Wild
- Fisch & Meeresfrüchte
- Sonstiges & Spezial
- Kräuter & Gewürze
- Verdickungsmittel
- Getränke / Extrakte

## No-Go Foods (Kategorie "Das gar nicht")
Lebensmittel, die absolut vermieden werden müssen (No-Go Foods gelten als nicht geeignet), z.B.:
- Glutenhaltiges Getreide (Weizen, Dinkel, Gerste, Roggen, Kamut)
- Milch von der Kuh (Milch, Ricotta)
- Ei (Hühnereiweiß, Hühnereidotter, Wachtelei, Gänseei)
- Bestimmte Nüsse und Samen (Sonnenblumenkern, Sonnenblumenöl, Mandel, Haselnuss, Erdnuss)
- Sonstiges (Leinsamen, Kaffee, Ingwer)

## Bewertungslogik
- **ROT (Kritisch):** Sobald mindestens ein No-Go-Food in der Zutatenliste gefunden wird. (No-Go schlägt Happy immer)
- **GRÜN (Unauffällig):** Wenn ausschließlich Happy-Foods gefunden werden und KEINE No-Go-Foods.
- **GELB (Vorsicht):** Wenn die Zutatenliste weder eindeutige No-Go- noch Happy-Foods enthält (oder die Erkennung unklar ist).

## Aliase
Für die Erkennung werden umfangreiche Aliase verwendet, z.B. wird "Weizenmehl", "Weizenstärke", "Weizengluten" und "Hartweizen" allesamt als "Weizen" (No-Go) erkannt. Dies erhöht die Zuverlässigkeit bei echten Zutatenlisten drastisch.

## Wichtiger Medizinischer Disclaimer
- Die Liste ersetzt keine medizinische Beratung.
- OCR kann Fehler enthalten.
- Nutzer müssen Verpackungsangaben immer selbst prüfen.

## Spätere Supabase-Struktur
In der nächsten Phase werden die Profil-Daten aus dem Code in eine Datenbank migriert.
Tabelle: `lisa_foods`
- `id` (uuid)
- `name` (text)
- `category` (text)
- `status` (enum: happy, no_go)
- `aliases` (text[])
- `notes` (text)
