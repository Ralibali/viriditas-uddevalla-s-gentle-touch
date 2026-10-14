import { Link } from "react-router-dom";
import SeoHead from "@/components/SeoHead";
import SiteLayout from "@/components/site/SiteLayout";
import Braille from "@/components/site/Braille";
import BookingLink from "@/components/site/BookingLink";

const NotFound = () => (
  <SiteLayout>
    <SeoHead
      title="Sidan hittades inte | Viriditas"
      description="Sidan du letar efter finns inte. Gå till startsidan för massage i Uddevalla hos Viriditas."
      noindex
    />
    <section className="page-gutter pb-24 pt-40 md:pt-48">
      <Braille word="vilse" size="1.4rem" animated />
      <h1 className="type-display mt-8 max-w-3xl">Den här sidan finns inte</h1>
      <p className="mt-6 max-w-prose type-lead text-ink/80">Adressen kan vara felstavad, eller så har sidan flyttats. Härifrån kommer du vidare.</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/" className="btn btn-primary btn-lg">
          Till startsidan
        </Link>
        <Link to="/#behandlingar" className="btn btn-quiet btn-lg">
          Se behandlingar och priser
        </Link>
        <BookingLink source="404" className="btn btn-quiet btn-lg" />
      </div>
    </section>
  </SiteLayout>
);

export default NotFound;
