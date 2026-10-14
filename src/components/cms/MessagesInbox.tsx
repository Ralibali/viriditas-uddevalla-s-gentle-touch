import { useState } from "react";
import { toast } from "sonner";
import { useMessageActions, useMessages, type MessageFilter } from "@/hooks/useAdmin";
import { formatDateTime, type ContactMessage } from "@/lib/adminTypes";

const FILTERS: { id: MessageFilter; label: string }[] = [
  { id: "new", label: "Nya" },
  { id: "handled", label: "Hanterade" },
  { id: "all", label: "Alla" },
];

function replyLink(message: ContactMessage): string {
  const subject = message.kind === "gift_card" ? "Ditt presentkort" : "Svar på din fråga";
  return `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(subject)}`;
}

function MessageCard({ message }: { message: ContactMessage }) {
  const { update, remove } = useMessageActions();
  const busy = update.isPending || remove.isPending;
  const isGift = message.kind === "gift_card";
  const titleId = `message-${message.id}`;

  const setStatus = (status: "new" | "handled") =>
    update.mutate(
      { id: message.id, status },
      {
        onSuccess: () => toast.success(status === "handled" ? "Markerat som hanterat." : "Markerat som nytt."),
        onError: (error) => toast.error(error.message),
      },
    );

  const deleteMessage = () => {
    if (!window.confirm(`Ta bort meddelandet från ${message.name}? Det går inte att ångra.`)) return;
    remove.mutate(message.id, {
      onSuccess: () => toast.success("Meddelandet är borttaget."),
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <article aria-labelledby={titleId} className="rounded-2xl border border-line bg-paper-raised p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={titleId} className="font-display text-xl text-ink soft-type">
            {isGift ? "Presentkort" : "Fråga"} från {message.name}
          </h2>
          <p className="mt-1 type-small text-moss">
            <time dateTime={message.created_at}>{formatDateTime(message.created_at)}</time>
            {message.status === "handled" && message.handled_at && <>, hanterat {formatDateTime(message.handled_at)}</>}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${message.status === "new" ? "bg-sprout text-ink" : "bg-paper-deep text-ink"}`}>
          {message.status === "new" ? "Ny" : "Hanterad"}
        </span>
      </header>

      <dl className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-[10rem_1fr]">
        <dt className="font-semibold">E-post</dt>
        <dd>
          <a href={`mailto:${message.email}`} className="link break-words">
            {message.email}
          </a>
        </dd>
        {message.phone && (
          <>
            <dt className="font-semibold">Telefon</dt>
            <dd>
              <a href={`tel:${message.phone.replace(/[^\d+]/g, "")}`} className="link">
                {message.phone}
              </a>
            </dd>
          </>
        )}
        {isGift && (
          <>
            <dt className="font-semibold">Gäller</dt>
            <dd>{message.details.gift || "–"}</dd>
            <dt className="font-semibold">Mottagare</dt>
            <dd>{message.details.recipient || "–"}</dd>
            <dt className="font-semibold">Leverans</dt>
            <dd>{message.details.delivery === "pickup" ? "Hämtas på plats" : "Skickas med e-post"}</dd>
            {message.details.greeting && (
              <>
                <dt className="font-semibold">Hälsning</dt>
                <dd className="whitespace-pre-line">{message.details.greeting}</dd>
              </>
            )}
          </>
        )}
      </dl>

      {message.message && (
        <div className="mt-5 border-t border-line pt-4">
          <p className="sr-only">{isGift ? "Övrigt:" : "Meddelande:"}</p>
          <p className="whitespace-pre-line text-ink/90">{message.message}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={replyLink(message)} className="btn btn-primary min-h-11 px-5 py-2">
          Svara med e-post
        </a>
        {message.status === "new" ? (
          <button type="button" disabled={busy} onClick={() => setStatus("handled")} className="btn btn-quiet min-h-11 px-5 py-2 disabled:opacity-50">
            Markera som hanterad
          </button>
        ) : (
          <button type="button" disabled={busy} onClick={() => setStatus("new")} className="btn btn-quiet min-h-11 px-5 py-2 disabled:opacity-50">
            Markera som ny
          </button>
        )}
        <button type="button" disabled={busy} onClick={deleteMessage} className="btn min-h-11 px-5 py-2 text-destructive hover:bg-destructive/5 disabled:opacity-50">
          Ta bort
        </button>
      </div>
    </article>
  );
}

export default function MessagesInbox() {
  const [filter, setFilter] = useState<MessageFilter>("new");
  const messages = useMessages(filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-moss">Frågor och presentkortsbeställningar från webbplatsen. Meddelanden raderas automatiskt efter tolv månader.</p>
        <div role="group" aria-label="Visa meddelanden" className="flex rounded-full border border-line bg-paper-raised p-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${filter === item.id ? "bg-primary text-primary-foreground" : "text-ink/75 hover:text-ink"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {messages.isLoading && <p role="status" className="py-8 text-moss">Hämtar meddelanden…</p>}
      {messages.isError && (
        <div role="alert" className="rounded-2xl border border-destructive/30 bg-paper-raised p-6">
          <p className="font-semibold text-destructive">{messages.error.message}</p>
          <button type="button" onClick={() => void messages.refetch()} className="link mt-3">
            Försök igen
          </button>
        </div>
      )}
      {messages.data && messages.data.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-moss">
          {filter === "new" ? "Inga nya meddelanden. När någon skickar en fråga eller beställer ett presentkort visas det här." : "Inga meddelanden att visa."}
        </p>
      )}
      <div className="space-y-4">
        {messages.data?.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
