import { defineRoute } from "./define";

export const privacyContent = defineRoute({
  id: "privacy",
  label: "Integritet och cookies",
  path: "/integritet",
  sections: [
    { title: "Sökmotorer", fields: [
      ["seo_title", "Sidtitel i sökresultat och webbläsarflik", "Integritet och cookies | Viriditas"],
      ["seo_description", "Beskrivning i sökresultat", "Information om personuppgifter, bokning, statistik och cookies på Viriditas webbplats.", "longtext"],
    ] },
    { title: "Sidans början", fields: [
      ["text_002", "Huvudrubrik (H1)", "Integritet och cookies"],
      ["text_003", "Ingress: Information om webbplatsen Viriditas – Andreas…", "Information om webbplatsen Viriditas – Andreas Håman. Uppdaterad 14 oktober 2026."],
      ["link_001", "Länk till startsidan, adress", "/"],
      ["text_001", "Länk till startsidan, text", "Till startsidan"],
    ] },
    { title: "Kontakt om personuppgifter", fields: [
      ["text_004", "Rubrik", "Kontakt om personuppgifter"],
      ["text_005", "Text före e-postadressen: Kontakta Viriditas via", "Kontakta Viriditas via "],
      ["text_006", "Text efter e-postadressen: eller via verksamheten på Uddevalla Folkets Hu…", " eller via verksamheten på Uddevalla Folkets Hus, Göteborgsvägen 11B, om uppgifter som behandlas i samband med webbplatsen, kontakt eller bokning.", "longtext"],
    ] },
    { title: "Bokning och kontakt", fields: [
      ["text_007", "Rubrik", "Bokning och kontakt"],
      ["text_008", "Stycke: Bokningslänkar öppnar BokaDirekt. Information…", "Bokningslänkar öppnar BokaDirekt. Information du lämnar där hanteras i bokningstjänsten enligt dess information och verksamhetens rutiner för bokning och behandling. När du kontaktar oss används dina kontaktuppgifter och det du lämnar för att besvara förfrågan eller hantera avtal om behandlingen. Lämna bara uppgifter som behövs för ditt ärende.", "longtext"],
      ["text_021", "Stycke om lagring: Webbplatsens innehåll, administration och medd…", "Webbplatsens innehåll, administration och meddelanden från formulären lagras hos vår databasleverantör Supabase. Webbplatsen har inget patientregister.", "longtext"],
    ] },
    { title: "Formulär för frågor och presentkort", fields: [
      ["text_022", "Rubrik", "Formulär för frågor och presentkort"],
      ["text_023", "Stycke: När du skickar en fråga eller beställer ett pr…", "När du skickar en fråga eller beställer ett presentkort sparas ditt namn, din e-postadress, ditt telefonnummer om du anger det och det du skriver. Uppgifterna används bara för att svara dig och hantera beställningen. Ett meddelande om ditt ärende kan skickas vidare till verksamhetens e-post via en e-posttjänst.", "longtext"],
      ["text_024", "Stycke: Meddelanden raderas automatiskt efter tolv mån…", "Meddelanden raderas automatiskt efter tolv månader, eller tidigare när ärendet är avslutat. Skriv inte känsliga uppgifter, till exempel om din hälsa, i formuläret. Det tar vi hellre upp vid besöket.", "longtext"],
    ] },
    { title: "Statistik och cookies", fields: [
      ["text_010", "Rubrik", "Statistik och cookies"],
      ["text_011", "Stycke: Om du godkänner statistik används Google Analy…", "Om du godkänner statistik används Google Analytics 4 och klickstatistik för att förstå hur webbplatsen används. Det kan omfatta sidvisningar och klick på bokning eller kontakt. Vi skickar inte formulärtext, kontaktuppgifter eller parametrar från adressfältet i dessa klickhändelser. Google kan behandla data utanför EU/EES; läs ", "longtext"],
      ["link_002", "Länk till Googles information, adress", "https://policies.google.com/privacy"],
      ["text_012", "Länk till Googles information, text", "Googles information"],
      ["text_013", "Stycke om valet: Statistik är valfri. Du kan neka eller ändra d…", "Statistik är valfri. Du kan neka eller ändra ditt val via Cookieinställningar. Valet sparas lokalt under ", "longtext"],
      ["text_014", "Namnet på sparat val", "viriditas_ga4_consent_v2"],
      ["text_015", "Fortsättning om cookies: . Valet gäller högst 365 dagar. Google kan eft…", ". Valet gäller högst 365 dagar. Google kan efter godkännande skapa _ga och _ga_* med pseudonyma besöksidentifierare, normalt i upp till två år efter senaste användning. När du återkallar stoppas nya statistikhändelser och tillgängliga statistikcookies tas bort. Administratörens inloggning kräver nödvändig sessionslagring.", "longtext"],
      ["text_016", "Stycke om karta och typsnitt: Google Maps ansluts först när du väljer att vi…", "Google Maps ansluts först när du väljer att visa kartan. Google får då din IP-adress och webbläsarinformation. Teckensnitt serveras från vår egen webbplats.", "longtext"],
    ] },
    { title: "Lagring och dina rättigheter", fields: [
      ["text_017", "Rubrik", "Lagring och dina rättigheter"],
      ["text_018", "Stycke: Uppgifter används så länge ditt ärende eller b…", "Uppgifter används så länge ditt ärende eller bokning hanteras samt när lagkrav eller rättsliga anspråk kräver det. Kontakta verksamheten för besked om lagring av en viss uppgift, mottagare och eventuella överföringar utanför EU/EES.", "longtext"],
      ["text_019", "Stycke: Du kan begära tillgång, rättelse, radering, be…", "Du kan begära tillgång, rättelse, radering, begränsning och dataportabilitet när reglerna gäller, invända mot behandling och återkalla samtycke. Kontakta Andreas enligt ovan. Du har också rätt att klaga hos ", "longtext"],
      ["link_003", "Länk till IMY, adress", "https://www.imy.se/privatperson/dataskydd/dina-rattigheter/"],
      ["text_020", "Länk till IMY, text", "Integritetsskyddsmyndigheten (IMY)"],
    ] },
  ],
});
