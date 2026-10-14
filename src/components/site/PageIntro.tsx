import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface PageIntroProps {
  /** Visible breadcrumb: the start page, an optional parent, and this page. */
  crumbs: { home: string; current: string; parent?: { label: string; to: string } };
  title: string;
  lead?: string;
  children?: ReactNode;
  /** Optional media shown beside the title on larger screens. */
  aside?: ReactNode;
  meta?: ReactNode;
}

/** The opening of every subpage: breadcrumb, H1, lead and the first action. */
export default function PageIntro({ crumbs, title, lead, children, aside, meta }: PageIntroProps) {
  return (
    <section className="pt-[4.5rem]">
      <div className={`page-gutter pb-12 pt-8 md:pb-16 md:pt-14 ${aside ? "grid gap-10 md:grid-cols-12 md:items-end md:gap-12" : ""}`}>
        <div className={aside ? "md:col-span-7" : ""}>
          <nav aria-label="Brödsmulor">
            <ol className="flex flex-wrap items-center gap-2 type-small text-moss">
              <li>
                <Link to="/" className="link-quiet">
                  {crumbs.home}
                </Link>
              </li>
              {crumbs.parent && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link to={crumbs.parent.to} className="link-quiet">
                      {crumbs.parent.label}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">
                {crumbs.current}
              </li>
            </ol>
          </nav>
          <h1 className="type-h1 hero-enter mt-6 max-w-4xl">{title}</h1>
          {meta && <div className="hero-enter-late mt-4 type-small text-moss">{meta}</div>}
          {lead && <p className="type-lead hero-enter-late mt-6 max-w-2xl text-ink/85">{lead}</p>}
          {children && <div className="hero-enter-late mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">{children}</div>}
        </div>
        {aside && <div className="md:col-span-5">{aside}</div>}
      </div>
    </section>
  );
}
