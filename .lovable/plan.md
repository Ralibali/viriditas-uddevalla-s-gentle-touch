## Fullt CMS i dashboarden

### Steg 1: Databas
- Skapa `site_pages`-tabell (slug, title, content som JSON, meta-data, published-status, nav-ordning)
- Skapa `site_settings`-tabell (nyckel-värde för global info som telefon, adress, etc.)
- RLS: publikt läsbar, lösenordsskydd via dashboard

### Steg 2: Seed befintligt innehåll
- Migrera nuvarande hårdkodade sidor (startsida, om-andreas, klassisk-massage) till databasen

### Steg 3: Dashboard CMS-vy
- Sidolista med möjlighet att skapa/ta bort/redigera sidor
- Blockredigerare för sidinnehåll (rubriker, text, bilder, knappar, listor)
- Inställningar-vy för global info
- Navigationshantering (ordning, vilka sidor som syns i menyn)

### Steg 4: Dynamisk rendering
- Ändra frontend att hämta innehåll från databasen istället för hårdkodat
- Dynamisk route-hantering för nya sidor
- Uppdatera navbar att hämta menylänkar från databasen

### Begränsningar att vara medveten om
- Bilduppladdning kräver storage-bucket
- Blockredigeraren blir enklare än t.ex. WordPress – fokus på de vanligaste blocktyperna
- Startsidan har speciallayout (hero, recensioner etc.) som kan vara svårare att redigera fritt