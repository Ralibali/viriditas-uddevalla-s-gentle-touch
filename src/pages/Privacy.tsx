import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';

export default function Privacy() {
  return <main className="min-h-screen bg-background text-foreground">
    <article className="mx-auto max-w-3xl space-y-5 px-6 py-16">
      <Link to="/" className="underline">Till startsidan</Link>
      <h1 className="font-display text-3xl">Integritet och cookies</h1>
      <p>Information om webbplatsen Viriditas – Andreas Håman. Uppdaterad 1 oktober 2026.</p>
      <h2 className="text-xl font-semibold">Kontakt om personuppgifter</h2>
      <p>Kontakta Viriditas via <a className="underline" href="mailto:info@auroramedia.se">info@auroramedia.se</a> eller via verksamheten på Uddevalla Folkets Hus, Göteborgsvägen 11B, om uppgifter som behandlas i samband med webbplatsen, kontakt eller bokning.</p>
      <h2 className="text-xl font-semibold">Bokning och kontakt</h2>
      <p>Bokningslänkar öppnar BokaDirekt. Information du lämnar där hanteras i bokningstjänsten enligt dess information och verksamhetens rutiner för bokning och behandling. När du kontaktar oss används dina kontaktuppgifter och det du lämnar för att besvara förfrågan eller hantera avtal om behandlingen. Lämna bara uppgifter som behövs för ditt ärende.</p>
      <p>Webbplatsens publicerade innehåll och administration använder Lovable Cloud/Supabase. Webbplatsen har inget offentligt patientregister eller kontaktformulär. Denna information beskriver webbplatsen; du kan få information om boknings- och behandlingsuppgifter direkt från verksamheten.</p>
      <h2 className="text-xl font-semibold">Statistik och cookies</h2>
      <p>Om du godkänner statistik används Google Analytics 4 och klickstatistik för att förstå hur webbplatsen används. Det kan omfatta sidvisningar och klick på bokning eller kontakt. Vi skickar inte formulärtext, kontaktuppgifter eller parametrar från adressfältet i dessa klickhändelser. Google kan behandla data utanför EU/EES; läs <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Googles information</a>.</p>
      <p>Statistik är valfri. Du kan neka eller ändra ditt val via Cookieinställningar. Valet sparas lokalt under <code>viriditas_ga4_consent_v2</code>. Valet gäller högst 365 dagar. Google kan efter godkännande skapa _ga och _ga_* med pseudonyma besöksidentifierare, normalt i upp till två år efter senaste användning. När du återkallar stoppas nya statistikhändelser och tillgängliga statistikcookies tas bort. Administratörens inloggning kräver nödvändig sessionslagring.</p>
      <p>Google Maps ansluts först när du väljer att visa kartan. Google får då din IP-adress och webbläsarinformation. Teckensnitt serveras från vår egen webbplats.</p>
      <h2 className="text-xl font-semibold">Lagring och dina rättigheter</h2>
      <p>Uppgifter används så länge ditt ärende eller bokning hanteras samt när lagkrav eller rättsliga anspråk kräver det. Kontakta verksamheten för besked om lagring av en viss uppgift, mottagare och eventuella överföringar utanför EU/EES.</p>
      <p>Du kan begära tillgång, rättelse, radering, begränsning och dataportabilitet när reglerna gäller, invända mot behandling och återkalla samtycke. Kontakta Andreas enligt ovan. Du har också rätt att klaga hos <a className="underline" href="https://www.imy.se/privatperson/dataskydd/dina-rattigheter/" target="_blank" rel="noopener noreferrer">Integritetsskyddsmyndigheten (IMY)</a>.</p>
    </article>
    <Footer />
  </main>;
}
