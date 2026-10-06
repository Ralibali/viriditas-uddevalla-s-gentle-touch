import { useSiteContent } from "@/hooks/useSiteContent";
import { Link } from 'react-router-dom';
import Footer from '@/components/Footer';
import SeoHead from '@/components/SeoHead';

export default function Privacy() {
  const { c, g } = useSiteContent("privacy");

  return <main className="min-h-screen bg-background text-foreground">
    <SeoHead title={c("seo_title", "Integritet och cookies | Viriditas")} description={c("seo_description", "Information om personuppgifter, bokning, statistik och cookies på Viriditas webbplats.")} path="/integritet" />
    <article className="mx-auto max-w-3xl space-y-5 px-6 py-16">
      <Link to={c("link_001", "/")} className="underline">{c("text_001", "Till startsidan")}</Link>
      <h1 className="font-display text-3xl">{c("text_002", "Integritet och cookies")}</h1>
      <p>{c("text_003", "Information om webbplatsen Viriditas – Andreas Håman. Uppdaterad 1 oktober 2026.")}</p>
      <h2 className="text-xl font-semibold">{c("text_004", "Kontakt om personuppgifter")}</h2>
      <p>{c("text_005", "Kontakta Viriditas via ")}<a className="underline" href={`mailto:${g("email")}`}>{g("email")}</a>{c("text_006", " eller via verksamheten på Uddevalla Folkets Hus, Göteborgsvägen 11B, om uppgifter som behandlas i samband med webbplatsen, kontakt eller bokning.")}</p>
      <h2 className="text-xl font-semibold">{c("text_007", "Bokning och kontakt")}</h2>
      <p>{c("text_008", "Bokningslänkar öppnar BokaDirekt. Information du lämnar där hanteras i bokningstjänsten enligt dess information och verksamhetens rutiner för bokning och behandling. När du kontaktar oss används dina kontaktuppgifter och det du lämnar för att besvara förfrågan eller hantera avtal om behandlingen. Lämna bara uppgifter som behövs för ditt ärende.")}</p>
      <p>{c("text_009", "Webbplatsens publicerade innehåll och administration använder Lovable Cloud/Supabase. Webbplatsen har inget offentligt patientregister eller kontaktformulär. Denna information beskriver webbplatsen; du kan få information om boknings- och behandlingsuppgifter direkt från verksamheten.")}</p>
      <h2 className="text-xl font-semibold">{c("text_010", "Statistik och cookies")}</h2>
      <p>{c("text_011", "Om du godkänner statistik används Google Analytics 4 och klickstatistik för att förstå hur webbplatsen används. Det kan omfatta sidvisningar och klick på bokning eller kontakt. Vi skickar inte formulärtext, kontaktuppgifter eller parametrar från adressfältet i dessa klickhändelser. Google kan behandla data utanför EU/EES; läs ")}<a className="underline" href={c("link_002", "https://policies.google.com/privacy")} target="_blank" rel="noopener noreferrer">{c("text_012", "Googles information")}</a>.</p>
      <p>{c("text_013", "Statistik är valfri. Du kan neka eller ändra ditt val via Cookieinställningar. Valet sparas lokalt under ")}<code>{c("text_014", "viriditas_ga4_consent_v2")}</code>{c("text_015", ". Valet gäller högst 365 dagar. Google kan efter godkännande skapa _ga och _ga_* med pseudonyma besöksidentifierare, normalt i upp till två år efter senaste användning. När du återkallar stoppas nya statistikhändelser och tillgängliga statistikcookies tas bort. Administratörens inloggning kräver nödvändig sessionslagring.")}</p>
      <p>{c("text_016", "Google Maps ansluts först när du väljer att visa kartan. Google får då din IP-adress och webbläsarinformation. Teckensnitt serveras från vår egen webbplats.")}</p>
      <h2 className="text-xl font-semibold">{c("text_017", "Lagring och dina rättigheter")}</h2>
      <p>{c("text_018", "Uppgifter används så länge ditt ärende eller bokning hanteras samt när lagkrav eller rättsliga anspråk kräver det. Kontakta verksamheten för besked om lagring av en viss uppgift, mottagare och eventuella överföringar utanför EU/EES.")}</p>
      <p>{c("text_019", "Du kan begära tillgång, rättelse, radering, begränsning och dataportabilitet när reglerna gäller, invända mot behandling och återkalla samtycke. Kontakta Andreas enligt ovan. Du har också rätt att klaga hos ")}<a className="underline" href={c("link_003", "https://www.imy.se/privatperson/dataskydd/dina-rattigheter/")} target="_blank" rel="noopener noreferrer">{c("text_020", "Integritetsskyddsmyndigheten (IMY)")}</a>.</p>
    </article>
    <Footer />
  </main>;
}
