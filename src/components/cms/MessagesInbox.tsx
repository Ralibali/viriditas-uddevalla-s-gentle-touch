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
    <article aria-labelledby={titleId} className="bg-card border border-border rounded-2xl p-5 sm:p-6 text-sm">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={titleId} className="font-display font-semibold text-base">
            {isGift ? "Presentkort" : "Fråga"} från {message.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <time dateTime={message.created_at}>{formatDateTime(message.created_at)}</time>
            {message.status === "handled" && message.handled_at && <>, hanterat {formatDateTime(message.handled_at)}</>}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${message.status === "new" ? "bg-primary/10 text-primary" : "bg-muted text-foreground"}`}>
          {message.status === "new" ? "Ny" : "Hanterad"}
        </span>
      </header>

      <dl className="mt-4 grid gap-x-6 gap-y-1.5 sm:grid-cols-[8rem_1fr]">
        <dt className="text-muted-foreground">E-post</dt>
        <dd>
          <a href={`mailto:${message.email}`} className="text-primary hover:underline break-words">
            {message.email}
          </a>
        </dd>
        {message.phone && (
          <>
            <dt className="text-muted-foreground">Telefon</dt>
            <dd>
              <a href={`tel:${message.phone.replace(/[^\d+]/g, "")}`} className="text-primary hover:underline">
                {message.phone}
              </a>
            </dd>
          </>
        )}
        {isGift && (
          <>
            <dt className="text-muted-foreground">Gäller</dt>
            <dd>{message.details.gift || "–"}</dd>
            <dt className="text-muted-foreground">Mottagare</dt>
            <dd>{message.details.recipient || "–"}</dd>
            <dt className="text-muted-foreground">Leverans</dt>
            <dd>{message.details.delivery === "pickup" ? "Hämtas på plats" : "Skickas med e-post"}</dd>
            {message.details.greeting && (
              <>
                <dt className="text-muted-foreground">Hälsning</dt>
                <dd className="whitespace-pre-line">{message.details.greeting}</dd>
              </>
            )}
          </>
        )}
      </dl>

      {message.message && <p className="mt-4 border-t border-border pt-4 whitespace-pre-line">{message.message}</p>}

      <div className="mt-5 flex flex-wrap gap-2">
        <a href={replyLink(message)} className="inline-flex items-center rounded-xl bg-primary px-4 py-2 font-medium text-primary-foreground">
          Svara med e-post
        </a>
        <button
          type="button"
          disabled={busy}
          onClick={() => setStatus(message.status === "new" ? "handled" : "new")}
          className="rounded-xl px-4 py-2 border border-border hover:bg-muted disabled:opacity-50"
        >
          {message.status === "new" ? "Markera som hanterad" : "Markera som ny"}
        </button>
        <button type="button" disabled={busy} onClick={deleteMessage} className="rounded-xl px-4 py-2 text-destructive hover:bg-destructive/5 disabled:opacity-50">
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
    <div className="space-y-6 font-body">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-semibold">Meddelanden</h2>
          <p className="mt-1 text-sm text-muted-foreground">Frågor och presentkortsbeställningar. Meddelanden raderas automatiskt efter tolv månader.</p>
        </div>
        <div role="group" aria-label="Visa meddelanden" className="flex rounded-xl border border-border bg-card p-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${filter === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {messages.isLoading && <p role="status" className="py-8 text-center text-muted-foreground">Hämtar meddelanden…</p>}
      {messages.isError && (
        <div role="alert" className="bg-card border border-border rounded-2xl p-5 space-y-3 text-sm">
          <p className="text-destructive">{messages.error.message}</p>
          <button type="button" onClick={() => void messages.refetch()} className="text-primary underline">
            Försök igen
          </button>
        </div>
      )}
      {messages.data && messages.data.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">{filter === "new" ? "Inga nya meddelanden." : "Inga meddelanden att visa."}</p>
      )}
      <div className="space-y-4">
        {messages.data?.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
