import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { trackFormEvent } from "@/lib/analytics";
import { contactPayload, EMPTY_CONTACT, giftDescription, sendContact, validateContact, type ContactErrors, type ContactValues, type FormKind } from "@/lib/contactForm";
import { getGlobalContentValue, TREATMENT_MINUTES } from "@/lib/siteContentValues";

type Status = { state: "idle" } | { state: "sending" } | { state: "sent" } | { state: "error"; message: string };

function useContactForm(kind: FormKind) {
  const [values, setValues] = useState<ContactValues>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const startedAt = useRef(Date.now());
  const website = useRef("");
  const formRef = useRef<HTMLFormElement>(null);

  const set = (field: keyof ContactValues) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  async function submit(event: FormEvent, gift = "") {
    event.preventDefault();
    const found = validateContact(kind, values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus({ state: "sending" });
    try {
      await sendContact(contactPayload(kind, values, gift, startedAt.current, website.current));
      trackFormEvent(kind);
      setStatus({ state: "sent" });
      setValues(EMPTY_CONTACT);
    } catch (error) {
      setStatus({ state: "error", message: error instanceof Error ? error.message : "Meddelandet kunde inte skickas. Försök igen." });
    }
  }

  function reset() {
    startedAt.current = Date.now();
    setStatus({ state: "idle" });
  }

  return { values, errors, status, set, submit, reset, formRef, website };
}

interface FieldProps {
  name: keyof ContactValues;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  optional?: boolean;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  maxLength?: number;
  inputMode?: "numeric" | "tel" | "email" | "text";
}

function Field({ name, label, value, onChange, error, hint, optional, type = "text", autoComplete, multiline, maxLength, inputMode }: FieldProps) {
  const id = useId();
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name,
    value,
    onChange: (event: { target: { value: string } }) => onChange(event.target.value),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    "aria-required": optional ? undefined : true,
    autoComplete,
    maxLength,
    className: "field-input",
  };
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="font-normal text-moss"> (valfritt)</span>}
      </label>
      {multiline ? <textarea {...common} rows={5} /> : <input {...common} type={type} inputMode={inputMode} />}
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[0.9375rem] font-semibold text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Hidden from people; automated form fillers tend to complete it, and their messages are dropped. */
function Honeypot({ onChange }: { onChange: (value: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
      <label>
        Lämna tomt
        <input type="text" name="website" tabIndex={-1} autoComplete="off" onChange={(event) => onChange(event.target.value)} />
      </label>
    </div>
  );
}

function Sent({ children, onAgain, againLabel }: { children: ReactNode; onAgain: () => void; againLabel: string }) {
  return (
    <div role="status" className="rounded-2xl border border-primary/30 bg-paper-raised p-6">
      <p className="font-display text-2xl text-ink soft-type">{children}</p>
      <button type="button" onClick={onAgain} className="link mt-4">
        {againLabel}
      </button>
    </div>
  );
}

function PrivacyNote() {
  return (
    <p className="field-hint">
      Vi använder uppgifterna bara för att svara dig och raderar dem efter tolv månader. Skriv inte känsliga uppgifter om din hälsa här.{" "}
      <Link to="/integritet" className="link-quiet text-ink">
        Så hanterar vi personuppgifter
      </Link>
      .
    </p>
  );
}

function SubmitRow({ status, label }: { status: Status; label: string }) {
  const { data: settings } = useSiteSettings();
  const email = getGlobalContentValue("email", settings);
  return (
    <div className="space-y-3">
      {status.state === "error" && (
        <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-[0.9375rem]">
          <p className="font-semibold text-destructive">{status.message}</p>
          {email && (
            <p className="mt-1 text-ink">
              Du kan också mejla direkt till{" "}
              <a href={`mailto:${email}`} className="link-quiet break-words font-semibold">
                {email}
              </a>
              .
            </p>
          )}
        </div>
      )}
      <button type="submit" className="btn btn-primary btn-lg w-full sm:w-auto" disabled={status.state === "sending"} aria-disabled={status.state === "sending"}>
        {status.state === "sending" ? "Skickar…" : label}
      </button>
    </div>
  );
}

export function QuestionForm({ sentText }: { sentText: string }) {
  const form = useContactForm("question");
  const { values, errors, set } = form;
  if (form.status.state === "sent") {
    return (
      <Sent onAgain={form.reset} againLabel="Skicka en fråga till">
        {sentText}
      </Sent>
    );
  }
  return (
    <form ref={form.formRef} noValidate onSubmit={(event) => void form.submit(event)} className="relative space-y-5">
      <Honeypot onChange={(value) => (form.website.current = value)} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Namn" value={values.name} onChange={set("name")} error={errors.name} autoComplete="name" maxLength={120} />
        <Field name="email" label="E-post" type="email" inputMode="email" value={values.email} onChange={set("email")} error={errors.email} autoComplete="email" maxLength={254} />
      </div>
      <Field name="phone" label="Telefon" type="tel" inputMode="tel" optional value={values.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" maxLength={40} />
      <Field name="message" label="Din fråga" multiline value={values.message} onChange={set("message")} error={errors.message} maxLength={4000} />
      <PrivacyNote />
      <SubmitRow status={form.status} label="Skicka frågan" />
    </form>
  );
}

export function GiftCardForm({ sentText }: { sentText: string }) {
  const form = useContactForm("gift_card");
  const { values, errors, set } = form;
  const { data: settings } = useSiteSettings();
  const deliveryId = useId();
  const giftId = useId();
  const options = [
    ...TREATMENT_MINUTES.map((minutes) => ({ value: `${minutes}`, label: `Klassisk massage ${minutes} min, ${getGlobalContentValue(`treatment_${minutes}_price`, settings)}` })),
    { value: "amount", label: "Valfritt belopp" },
  ];

  if (form.status.state === "sent") {
    return (
      <Sent onAgain={form.reset} againLabel="Beställ ett presentkort till">
        {sentText}
      </Sent>
    );
  }

  return (
    <form ref={form.formRef} noValidate onSubmit={(event) => void form.submit(event, giftDescription(values, options))} className="relative space-y-5">
      <Honeypot onChange={(value) => (form.website.current = value)} />
      <div>
        <label htmlFor={giftId} className="field-label">
          Presentkortet ska gälla
        </label>
        <select
          id={giftId}
          name="gift"
          value={values.gift}
          onChange={(event) => set("gift")(event.target.value)}
          className="field-input appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3 6l5 5 5-5' fill='none' stroke='%232D5A3D' stroke-width='2'/%3E%3C/svg%3E\")" }}
          aria-invalid={errors.gift ? true : undefined}
          aria-describedby={errors.gift ? `${giftId}-error` : undefined}
          aria-required
        >
          <option value="">Välj behandling eller belopp</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.gift && (
          <p id={`${giftId}-error`} className="mt-1.5 text-[0.9375rem] font-semibold text-destructive">
            {errors.gift}
          </p>
        )}
      </div>
      {values.gift === "amount" && (
        <Field name="amount" label="Belopp i kronor" inputMode="numeric" value={values.amount} onChange={set("amount")} error={errors.amount} maxLength={5} hint="Till exempel 500." />
      )}
      <Field name="recipient" label="Vem är presentkortet till?" optional value={values.recipient} onChange={set("recipient")} error={errors.recipient} maxLength={120} />
      <Field name="greeting" label="Hälsning på presentkortet" optional multiline value={values.greeting} onChange={set("greeting")} error={errors.greeting} maxLength={500} />

      <fieldset aria-describedby={errors.delivery ? `${deliveryId}-error` : undefined}>
        <legend className="field-label">Leverans</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { value: "email", label: "Skicka med e-post" },
            { value: "pickup", label: "Hämta på plats" },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                values.delivery === option.value ? "border-primary bg-paper-raised" : "border-ink/25 hover:border-ink/50"
              }`}
            >
              <input
                type="radio"
                name="delivery"
                value={option.value}
                checked={values.delivery === option.value}
                onChange={() => set("delivery")(option.value)}
                className="h-5 w-5 accent-[hsl(var(--primary))]"
              />
              {option.label}
            </label>
          ))}
        </div>
        {errors.delivery && (
          <p id={`${deliveryId}-error`} className="mt-1.5 text-[0.9375rem] font-semibold text-destructive">
            {errors.delivery}
          </p>
        )}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label="Ditt namn" value={values.name} onChange={set("name")} error={errors.name} autoComplete="name" maxLength={120} />
        <Field name="email" label="Din e-post" type="email" inputMode="email" value={values.email} onChange={set("email")} error={errors.email} autoComplete="email" maxLength={254} />
      </div>
      <Field name="phone" label="Telefon" type="tel" inputMode="tel" optional value={values.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" maxLength={40} />
      <Field name="message" label="Övrigt" optional multiline value={values.message} onChange={set("message")} error={errors.message} maxLength={2000} />
      <PrivacyNote />
      <SubmitRow status={form.status} label="Skicka beställningen" />
    </form>
  );
}
