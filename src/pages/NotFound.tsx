import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SeoHead from "@/components/SeoHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <>
      <SeoHead
        title="Sidan hittades inte | Viriditas"
        description="Sidan du letar efter finns inte. Gå tillbaka till startsidan för att hitta massagebehandlingar i Uddevalla hos Viriditas."
        noindex
      />
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center px-6">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">
            Sidan hittades inte
          </p>
          <a
            href="/"
            className="text-primary underline hover:text-primary/90"
          >
            Tillbaka till startsidan
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
