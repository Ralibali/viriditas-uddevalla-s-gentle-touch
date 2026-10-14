import { homeContent } from "@/content/home";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useReviews, type Review } from "@/hooks/useReviews";
import { useAmbientVideo } from "@/hooks/useMediaQuery";
import { trackBookingClick, trackContactClick } from "@/lib/trackBookingClick";
import { TREATMENT_MINUTES } from "@/lib/siteContentValues";
import { formatRating, splitPriceFact } from "@/lib/format";
import SeoHead from "@/components/SeoHead";
import ExternalEmbedGate from "@/components/ExternalEmbedGate";
import SiteLayout from "@/components/site/SiteLayout";
import Braille from "@/components/site/Braille";
import BookingLink from "@/components/site/BookingLink";
import SmartLink from "@/components/site/SmartLink";
import Stars from "@/components/site/Stars";
import Faq from "@/components/site/Faq";
import JsonLd, { breadcrumbs, faqPage } from "@/components/site/JsonLd";
import { GiftCardForm, QuestionForm } from "@/components/site/ContactForms";

const RECOVERY_WORDS = /stress|lugn|avslapp|återhämt|avkopp|sl[äa]ppa|tyst|värme/i;

const Index = () => {
  const { c, g, show, settings } = useSiteContent(homeContent);
  const { data: reviews = [] } = useReviews();
  const ambientVideo = useAmbientVideo();

  const withText = reviews.filter((review) => review.review_text);
  const ratingOnly = reviews.filter((review) => !review.review_text);
  const storedRating = Number(settings?.review_rating_value);
  const storedCount = Number(settings?.review_count);
  const localAverage = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const rating = storedRating > 0 ? storedRating : localAverage;
  const reviewCount = storedCount > 0 ? storedCount : reviews.length;
  const recoveryReviews = withText.filter((review) => RECOVERY_WORDS.test(review.review_text ?? "")).slice(0, 2);
  const priceFact = splitPriceFact(c("hero_price_from"));

  const mainFaq = [10, 12, 14, 16, 18].map((n) => ({ question: c(`faq_0${n}`), answer: c(`faq_0${n + 1}`) }));
  const recoveryFaq = [1, 2, 3, 4].map((n) => ({ question: c(`recovery_faq_q${n}`), answer: c(`recovery_faq_a${n}`) }));
  const durationKeys: Record<number, [string, string]> = { 30: ["text_033", "text_036"], 45: ["text_038", "text_041"], 60: ["text_043", "text_046"], 80: ["text_048", "text_051"] };

  return (
    <SiteLayout stickyBooking="sticky-mobile">
      <SeoHead title={c("seo_001")} description={c("seo_002")} path="/" />
      <JsonLd data={breadcrumbs([{ name: c("seo_003"), path: "/" }])} />
      {show("show_faq") && <JsonLd data={faqPage([...mainFaq, ...recoveryFaq])} />}

      {show("show_hero") && (
        <section aria-labelledby="hero-title" className="pt-[4.5rem]">
          <div className="page-gutter grid gap-10 pb-16 pt-8 md:grid-cols-12 md:items-center md:gap-10 md:pb-24 md:pt-14 lg:gap-16">
            <div className="md:col-span-7">
              <h1 id="hero-title" className="hero-enter">
                <span className="type-display block">{c("hero_title")}</span>
                {c("hero_subtitle") && (
                  <span className="mt-4 block max-w-xl font-display text-[clamp(1.375rem,1.1rem+1.2vw,2.125rem)] leading-tight text-moss soft-type" style={{ fontWeight: 360 }}>
                    {c("hero_subtitle")}
                  </span>
                )}
              </h1>

              <div className="hero-enter-late mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Braille word="viriditas" size="clamp(1rem, 0.75rem + 1vw, 1.35rem)" animated />
                <span className="type-small text-moss">{c("text_104")}</span>
              </div>

              <div className="hero-enter-late mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
                <BookingLink source="hero" className="btn btn-primary btn-lg" />
                <SmartLink to={c("link_002")} className="link">
                  {c("text_005")}
                </SmartLink>
              </div>
              {c("hero_availability") && <p className="mt-3 type-small text-moss">{c("hero_availability")}</p>}

              <dl className="hero-enter-late mt-10 grid max-w-lg grid-cols-3 border-t border-line pt-5">
                {rating > 0 && (
                  <div className="pr-4">
                    <dt className="sr-only">Betyg</dt>
                    <dd>
                      <span className="block font-display text-[1.75rem] leading-none text-ink">{formatRating(rating)}</span>
                      <span className="mt-2 block type-small text-moss">{c("text_007")}</span>
                    </dd>
                  </div>
                )}
                <div className="border-l border-line px-4">
                  <dt className="sr-only">Pris</dt>
                  <dd>
                    <span className="block whitespace-nowrap font-display text-[1.75rem] leading-none text-ink">{priceFact.value}</span>
                    {priceFact.label && <span className="mt-2 block type-small text-moss">{priceFact.label}</span>}
                  </dd>
                </div>
                {reviewCount > 0 && (
                  <div className="border-l border-line pl-4">
                    <dt className="sr-only">Omdömen</dt>
                    <dd>
                      <span className="block font-display text-[1.75rem] leading-none text-ink">{reviewCount}</span>
                      <span className="mt-2 block type-small text-moss">{c("text_009")}</span>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="md:col-span-5">
              <div className="hero-enter relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-media bg-paper-deep md:max-w-none">
                {ambientVideo && (c("video_001") || c("video_002")) ? (
                  <video autoPlay muted loop playsInline preload="metadata" poster={c("image_001")} aria-hidden="true" className="absolute inset-0 h-full w-full object-cover">
                    {c("video_001") && <source src={c("video_001")} type="video/webm" />}
                    {c("video_002") && <source src={c("video_002")} type="video/mp4" />}
                  </video>
                ) : (
                  <img
                    src={c("image_001")}
                    alt={c("text_002")}
                    width={576}
                    height={1024}
                    {...{ fetchpriority: "high" }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {show("show_intro") && (
        <section aria-labelledby="intro-title" className="section rule-top">
          <div className="page-gutter grid gap-8 md:grid-cols-12 md:gap-12">
            <h2 id="intro-title" className="type-h2 md:col-span-5">
              {c("seo_intro_title")}
            </h2>
            <div className="max-w-prose space-y-5 md:col-span-7">
              <p className="type-lead text-ink/90">
                {c("text_025")}{" "}
                <SmartLink to={c("link_005")} className="link">
                  {c("text_026")}
                </SmartLink>
                .
              </p>
              <p className="text-ink/80">
                {c("text_027")}{" "}
                <SmartLink to={c("link_004")} className="link">
                  {c("text_028")}
                </SmartLink>
                {c("text_029")}
              </p>
            </div>
          </div>
        </section>
      )}

      {show("show_treatments") && (
        <section id="behandlingar" aria-labelledby="treatments-title" className="section bg-paper-raised">
          <div className="page-gutter grid gap-12 lg:grid-cols-12 lg:gap-16">
            <header className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
              <h2 id="treatments-title" className="type-h2">
                {c("treatments_title")}
              </h2>
              <p className="mt-5 text-ink/80">{c("treatments_intro")}</p>
              <p className="mt-6">
                <SmartLink to={c("link_005")} className="link">
                  {c("text_060")}
                </SmartLink>
              </p>
            </header>

            <div className="lg:col-span-8">
              <ul className="border-t-2 border-ink">
                {TREATMENT_MINUTES.map((minutes) => {
                  const [durationKey, ctaKey] = durationKeys[minutes];
                  const featured = minutes === 60;
                  return (
                    <li key={minutes} className="grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-3 border-b border-line py-7 sm:grid-cols-[5.5rem_1fr_auto]">
                      <p className="col-start-1 row-start-1 font-display text-xl text-moss soft-type sm:pt-1">{c(durationKey)}</p>
                      <div className="col-span-2 col-start-1 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1">
                        <h3 className="type-h3 flex flex-wrap items-center gap-x-3 gap-y-1">
                          {c(`treatment_${minutes}_title`)}
                          {featured && c("text_105") && (
                            <span className="rounded-full bg-sprout px-3 py-0.5 font-body text-[0.8125rem] font-semibold text-ink">{c("text_105")}</span>
                          )}
                        </h3>
                        <p className="mt-2 max-w-prose text-ink/75">{c(`treatment_${minutes}_desc`)}</p>
                      </div>
                      <div className="col-start-2 row-start-1 flex flex-col items-end gap-3 text-right sm:col-start-3">
                        <p className="font-display text-[1.75rem] leading-none text-ink">{c(`treatment_${minutes}_price`)}</p>
                        <BookingLink source={`treatment-${minutes} min`} treatmentCategory={`classic-${minutes}`} ariaLabel={c(ctaKey)} className={`btn ${featured ? "btn-primary" : "btn-quiet"} min-h-11 px-5 py-2`}>
                          Boka
                        </BookingLink>
                      </div>
                    </li>
                  );
                })}

                <li className="grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-3 border-b border-line py-7 sm:grid-cols-[5.5rem_1fr_auto]">
                  <p className="col-start-1 row-start-1 font-display text-xl text-moss soft-type sm:pt-1">{c("text_053")}</p>
                  <div className="col-span-2 col-start-1 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1">
                    <h3 className="type-h3">{c("treatment_recovery_title")}</h3>
                    <p className="mt-2 max-w-prose text-ink/75">{c("treatment_recovery_desc")}</p>
                  </div>
                  <div className="col-start-2 row-start-1 flex flex-col items-end gap-3 text-right sm:col-start-3">
                    <p className="font-display text-xl leading-tight text-ink">{c("treatment_recovery_price")}</p>
                    <BookingLink source="treatment-recovery" treatmentCategory="recovery" ariaLabel={c("recovery_cta")} className="btn btn-quiet min-h-11 px-5 py-2">
                      Boka
                    </BookingLink>
                  </div>
                </li>

                <li className="grid grid-cols-[1fr_auto] items-start gap-x-6 gap-y-3 py-7 sm:grid-cols-[5.5rem_1fr_auto]">
                  <p className="col-start-1 row-start-1 font-display text-xl text-moss soft-type sm:pt-1">{c("text_053")}</p>
                  <div className="col-span-2 col-start-1 row-start-2 sm:col-span-1 sm:col-start-2 sm:row-start-1">
                    <h3 className="type-h3">{c("gift_title")}</h3>
                    <p className="mt-2 max-w-prose text-ink/75">{c("gift_desc")}</p>
                  </div>
                  <div className="col-start-2 row-start-1 flex flex-col items-end gap-3 text-right sm:col-start-3">
                    <p className="font-display text-xl leading-tight text-ink">{c("gift_price")}</p>
                    {show("show_gift") && (
                      <SmartLink to="#presentkort" className="btn btn-quiet min-h-11 px-5 py-2">
                        {c("text_059")}
                      </SmartLink>
                    )}
                  </div>
                </li>
              </ul>

              <RecoveryPanel c={c} reviews={recoveryReviews} />
            </div>
          </div>
        </section>
      )}

      {show("show_about") && (
        <section id="om" aria-labelledby="about-title" className="section">
          <div className="page-gutter grid gap-12 md:grid-cols-12 md:items-center lg:gap-20">
            <div className="md:col-span-5">
              <img
                src={c("image_002")}
                alt={c("text_011")}
                width={900}
                height={1200}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full rounded-media object-cover object-top"
              />
            </div>
            <div className="md:col-span-7">
              <h2 id="about-title" className="type-h2">
                {c("about_title")}
              </h2>
              <figure className="mt-8">
                <blockquote>
                  <p className="font-display text-[clamp(2rem,1.5rem+2.4vw,3.5rem)] leading-[1.05] text-primary soft-type" style={{ fontWeight: 380 }}>
                    ”{c("about_quote")}”
                  </p>
                </blockquote>
                <figcaption className="mt-3 text-moss">{c("text_016")}</figcaption>
              </figure>
              <p className="mt-8 max-w-prose type-lead text-ink/90">{c("about_text_1")}</p>
              <p className="mt-4 max-w-prose text-ink/80">{c("about_text_2")}</p>
              <p className="mt-7">
                <SmartLink to={c("link_004")} className="link">
                  {c("text_017")}
                </SmartLink>
              </p>
            </div>
          </div>
        </section>
      )}

      {show("show_cta1") && (
        <section aria-labelledby="cta1-title" className="bg-primary text-primary-foreground">
          <div className="page-gutter flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-14">
            <div>
              <h2 id="cta1-title" className="type-h3 text-primary-foreground">
                {c("cta1_title")}
              </h2>
              <p className="mt-2 text-primary-foreground/80">{c("cta1_text")}</p>
            </div>
            <BookingLink source="cta-after-about" className="btn btn-on-dark btn-lg shrink-0">
              {c("text_020")}
            </BookingLink>
          </div>
        </section>
      )}

      {show("show_reviews") && (
        <section aria-labelledby="reviews-title" className="section">
          <div className="page-gutter grid gap-12 lg:grid-cols-12 lg:gap-16">
            <header className="lg:col-span-4">
              <h2 id="reviews-title" className="type-h2">
                {c("text_081")}
              </h2>
              {rating > 0 && (
                <div className="mt-8 flex items-end gap-4">
                  <p className="font-display text-[4.5rem] leading-[0.85] text-ink" aria-label={`Betyg ${formatRating(rating)} av 5`}>
                    {formatRating(rating)}
                  </p>
                  <div>
                    <Stars rating={rating} size="1.25rem" />
                    <p className="mt-1 type-small text-moss">
                      {reviewCount} {c("text_082")}
                    </p>
                  </div>
                </div>
              )}
              <ul className="mt-8 space-y-3">
                <li>
                  <BookingLink source="reviews-all" className="link">
                    {c("text_103")}
                  </BookingLink>
                </li>
                {g("google_review_url") && (
                  <li>
                    <a href={g("google_review_url")} target="_blank" rel="noopener noreferrer" className="link" onClick={() => void trackContactClick("google-review")}>
                      Lämna ett omdöme på Google<span className="sr-only"> (öppnas i ny flik)</span>
                    </a>
                  </li>
                )}
              </ul>
            </header>

            <div className="lg:col-span-8">
              <div className="gap-10 md:columns-2">
                {withText.slice(0, 6).map((review) => (
                  <ReviewQuote key={review.id} review={review} />
                ))}
              </div>
              {ratingOnly.length > 0 && (
                <div className="mt-6 border-t border-line pt-6">
                  <p className="type-small text-moss">Betyg utan text</p>
                  <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
                    {ratingOnly.slice(0, 12).map((review) => (
                      <li key={review.id} className="flex items-center gap-2 type-small">
                        <Stars rating={review.rating} size="0.85rem" />
                        <span className="sr-only">{review.rating} av 5 från</span>
                        {review.reviewer_name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-10">
                <BookingLink source="cta-after-reviews" className="btn btn-primary btn-lg">
                  {c("text_083")}
                </BookingLink>
              </div>
            </div>
          </div>
        </section>
      )}

      {show("show_wellness") && (
        <section aria-labelledby="wellness-title" className="rule-top">
          <div className="page-gutter grid gap-8 py-14 md:grid-cols-12 md:items-center md:gap-12 md:py-16">
            <div className="flex items-center gap-6 md:col-span-5">
              <div className="flex h-20 w-36 shrink-0 items-center justify-center rounded-xl bg-white px-5">
                <img src={c("image_004")} alt={c("text_076")} width={140} height={44} loading="lazy" className="h-auto w-full" />
              </div>
              <h2 id="wellness-title" className="type-h3">
                {c("text_075")}
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="max-w-prose text-ink/85">
                {c("text_077")}
                <strong className="font-semibold text-ink">{c("text_078")}</strong>
                {c("text_079")}
              </p>
              <p className="mt-4">
                <SmartLink to={c("link_006")} className="link">
                  {c("text_080")}
                </SmartLink>
              </p>
            </div>
          </div>
        </section>
      )}

      {show("show_viriditas") && (
        <section aria-labelledby="viriditas-title" className="bg-primary-deep text-paper">
          <div className="page-gutter grid gap-10 py-16 md:grid-cols-12 md:items-center md:gap-14 md:py-24">
            <div className="md:col-span-5">
              <h2 id="viriditas-title" className="type-h2 text-paper">
                {c("viriditas_title")}
              </h2>
              <p className="mt-6 type-lead text-paper/90">{c("viriditas_text_1")}</p>
              <p className="mt-4 text-paper/75">{c("viriditas_text_2")}</p>
            </div>
            <div className="md:col-span-7">
              {c("video_003") && ambientVideo ? (
                <video autoPlay muted loop playsInline preload="metadata" poster={c("image_003")} aria-hidden="true" className="aspect-[4/3] w-full rounded-media object-cover">
                  <source src={c("video_003")} />
                </video>
              ) : (
                <img
                  src={c("image_003")}
                  alt={c("text_106")}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full rounded-media object-cover"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {show("show_gallery") && (
        <section aria-labelledby="gallery-title" className="section">
          <div className="page-gutter">
            <div className="grid gap-6 md:grid-cols-12 md:items-end">
              <h2 id="gallery-title" className="type-h2 md:col-span-5">
                {c("text_096")}
              </h2>
              <p className="max-w-prose text-ink/80 md:col-span-6 md:col-start-7">{c("text_097")}</p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-12 md:grid-rows-[19rem_23rem] md:gap-5">
              <GalleryImage src={c("image_007")} alt={c("text_098")} className="col-span-2 aspect-[4/5] md:col-span-5 md:row-span-2 md:aspect-auto" />
              <GalleryImage src={c("image_008")} alt={c("text_099")} className="aspect-square md:col-span-3 md:aspect-auto" />
              <GalleryImage src={c("image_009")} alt={c("text_100")} className="aspect-square md:col-span-4 md:aspect-auto" />
              <GalleryImage src={c("image_010")} alt={c("text_101")} className="col-span-2 aspect-[16/10] md:col-span-7 md:aspect-auto" position="object-[50%_40%]" />
            </div>
          </div>
        </section>
      )}

      {show("show_gift") && (
        <section id="presentkort" aria-labelledby="gift-title" className="section bg-paper-raised">
          <div className="page-gutter grid gap-12 lg:grid-cols-12 lg:gap-16">
            <header className="lg:col-span-5">
              <h2 id="gift-title" className="type-h2">
                {c("text_107")}
              </h2>
              <p className="mt-5 max-w-prose type-lead text-ink/85">{c("text_108")}</p>
              <dl className="mt-8 grid max-w-sm grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-line pt-5">
                <dt className="text-moss">{c("gift_title")}</dt>
                <dd className="font-semibold">{c("gift_price")}</dd>
              </dl>
            </header>
            <div className="lg:col-span-7">
              <GiftCardForm sentText={c("text_109")} />
            </div>
          </div>
        </section>
      )}

      {show("show_contact") && (
        <section id="kontakt" aria-labelledby="contact-title" className="section">
          <div className="page-gutter">
            <h2 id="contact-title" className="type-h2 max-w-3xl">
              {c("contact_title")}
            </h2>
            <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <dl className="divide-y divide-line border-y border-line">
                  <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]">
                    <dt className="font-semibold">{c("text_085")}</dt>
                    <dd className="whitespace-pre-line text-ink/85">{c("contact_address_full")}</dd>
                  </div>
                  <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]">
                    <dt className="font-semibold">{c("text_087")}</dt>
                    <dd className="text-ink/85">
                      <span className="whitespace-pre-line">{c("contact_hours_display")}</span>
                      <br />
                      <BookingLink source="contact-hours-schedule-link" className="link mt-1 inline-block">
                        {c("text_089")}
                      </BookingLink>
                    </dd>
                  </div>
                  <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]">
                    <dt className="font-semibold">{c("text_090")}</dt>
                    <dd>
                      <a href={`mailto:${g("email")}`} onClick={() => void trackContactClick("kontakt-email")} className="link break-all">
                        {g("email")}
                      </a>
                    </dd>
                  </div>
                  {g("phone") && (
                    <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr]">
                      <dt className="font-semibold">Telefon</dt>
                      <dd>
                        <a href={`tel:${g("phone").replace(/[^\d+]/g, "")}`} onClick={() => void trackBookingClick("kontakt-phone")} className="link">
                          {g("phone")}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
                <div className="mt-8 flex flex-wrap gap-3">
                  <BookingLink source="kontakt" className="btn btn-primary">
                    {c("text_092")}
                  </BookingLink>
                  <a href={g("maps_url")} target="_blank" rel="noopener noreferrer" onClick={() => void trackContactClick("kontakt-maps")} className="btn btn-quiet">
                    {c("text_091")}
                    <span className="sr-only"> (öppnas i ny flik)</span>
                  </a>
                </div>
                <div className="mt-10 grid grid-cols-2 gap-3">
                  <img src={c("image_005")} alt={c("text_093")} width={800} height={900} loading="lazy" decoding="async" className="aspect-[4/5] w-full rounded-2xl object-cover" />
                  <img src={c("image_006")} alt={c("text_094")} width={800} height={896} loading="lazy" decoding="async" className="aspect-[4/5] w-full rounded-2xl object-cover" />
                </div>
              </div>

              <div className="space-y-12 lg:col-span-7">
                <div className="overflow-hidden rounded-media border border-line">
                  <ExternalEmbedGate service="Google Maps">
                    <iframe title={c("text_095")} src={g("map_embed_url")} width="100%" height="340" style={{ border: 0, display: "block" }} loading="lazy" referrerPolicy="no-referrer" />
                  </ExternalEmbedGate>
                </div>
                <div>
                  <h3 className="type-h3">{c("text_110")}</h3>
                  <p className="mt-2 max-w-prose text-ink/80">{c("text_111")}</p>
                  <div className="mt-6">
                    <QuestionForm sentText={c("text_112")} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {show("show_faq") && (
        <section aria-labelledby="faq-title" className="section bg-paper-raised">
          <div className="page-gutter grid gap-10 lg:grid-cols-12 lg:gap-16">
            <h2 id="faq-title" className="type-h2 lg:col-span-4">
              {c("text_102")}
            </h2>
            <div className="lg:col-span-8">
              <Faq items={mainFaq} />
              <h3 className="type-h3 mt-14">{c("recovery_faq_title")}</h3>
              <Faq items={recoveryFaq} className="mt-4" />
            </div>
          </div>
        </section>
      )}

      {show("show_cta2") && (
        <section aria-labelledby="cta2-title" className="section">
          <div className="page-gutter flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 id="cta2-title" className="type-h1">
                {c("cta2_title")}
              </h2>
              <p className="mt-4 type-lead text-ink/80">{c("cta2_text")}</p>
            </div>
            <BookingLink source="cta-before-footer" className="btn btn-primary btn-lg shrink-0" />
          </div>
        </section>
      )}
    </SiteLayout>
  );
};

function ReviewQuote({ review }: { review: Review }) {
  return (
    <figure className="mb-10 break-inside-avoid border-t border-line pt-6">
      <Stars rating={review.rating} />
      <span className="sr-only">{review.rating} av 5 stjärnor</span>
      <blockquote className="mt-4">
        <p className="whitespace-pre-line text-[1.0625rem] leading-relaxed text-ink/90 md:text-lg">”{review.review_text}”</p>
      </blockquote>
      <figcaption className="mt-4 type-small text-moss">
        {review.reviewer_name}, {review.review_date}
      </figcaption>
    </figure>
  );
}

function GalleryImage({ src, alt, className, position = "object-center" }: { src: string; alt: string; className: string; position?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-paper-deep md:rounded-media ${className}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover ${position}`} />
    </div>
  );
}

function RecoveryPanel({ c, reviews }: { c: (key: string) => string; reviews: Review[] }) {
  const bullets = [1, 2, 3, 4].map((n) => c(`recovery_bullet_${n}`)).filter(Boolean);
  return (
    <div className="mt-12 grid gap-10 rounded-media bg-paper p-6 sm:p-10 md:grid-cols-2">
      <div>
        <h3 className="type-h3">{c("recovery_section_title")}</h3>
        {c("recovery_eyebrow") && <p className="mt-2 font-semibold text-primary">{c("recovery_eyebrow")}</p>}
        <p className="mt-4 text-ink/80">{c("recovery_section_text_1")}</p>
        <p className="mt-3 text-ink/80">{c("recovery_section_text_2")}</p>
        {bullets.length > 0 && (
          <ul className="mt-5 space-y-2">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] h-2 w-2 shrink-0 rounded-full bg-primary" />
                {bullet}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-7">
          <BookingLink source="recovery-highlight" treatmentCategory="recovery" className="btn btn-primary">
            {c("recovery_cta")}
          </BookingLink>
        </div>
      </div>
      {reviews.length > 0 && (
        <div className="md:border-l md:border-line md:pl-10">
          <p className="font-display text-xl text-ink soft-type">{c("recovery_social_title")}</p>
          <p className="mt-2 type-small text-moss">{c("recovery_social_intro")}</p>
          <div className="mt-6 space-y-6">
            {reviews.map((review) => (
              <figure key={review.id} className="border-t border-line pt-5">
                <blockquote>
                  <p className="text-ink/90">”{review.review_text}”</p>
                </blockquote>
                <figcaption className="mt-2 type-small text-moss">{review.reviewer_name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Index;
