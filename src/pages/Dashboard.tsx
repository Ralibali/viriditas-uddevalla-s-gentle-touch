import { lazy, Suspense, useEffect, useState, type ComponentType } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { BarChart3, FileText, Inbox, KeyRound, LayoutDashboard, LogOut, Pencil, Settings, Star, Tags } from "lucide-react";
import type { SitePage } from "@/types/cms";
import PageList from "@/components/cms/PageList";
import PageEditor from "@/components/cms/PageEditor";
import SettingsEditor from "@/components/cms/SettingsEditor";
import SeoHead from "@/components/SeoHead";
import AdminAuthPanel from "@/components/cms/AdminAuthPanel";
import CmsAccessEditor from "@/components/cms/CmsAccessEditor";
import ContentEditor from "@/components/cms/ContentEditor";
import Overview from "@/components/cms/Overview";
import MessagesInbox from "@/components/cms/MessagesInbox";
import ReviewsManager from "@/components/cms/ReviewsManager";
import PriceSync from "@/components/cms/PriceSync";
import { BrailleMark } from "@/components/site/BrailleMark";
import { useOverview, type AdminTab } from "@/hooks/useAdmin";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { getGlobalContentValue } from "@/lib/siteContentValues";
import { clearLegacyAdminLogin, cmsAdminCall, setCmsSession } from "@/lib/cmsAdmin";

const BookingStatistics = lazy(() => import("@/components/cms/BookingStatistics"));

const TABS: { id: AdminTab; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Översikt", icon: LayoutDashboard },
  { id: "messages", label: "Meddelanden", icon: Inbox },
  { id: "content", label: "Innehåll", icon: Pencil },
  { id: "pages", label: "Sidor", icon: FileText },
  { id: "reviews", label: "Omdömen", icon: Star },
  { id: "prices", label: "Priser", icon: Tags },
  { id: "stats", label: "Statistik", icon: BarChart3 },
  { id: "settings", label: "Inställningar", icon: Settings },
  { id: "access", label: "Åtkomst & hjälp", icon: KeyRound },
];

const Dashboard = () => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [token, setToken] = useState(() => sessionStorage.getItem("cms-session"));

  useEffect(() => {
    clearLegacyAdminLogin();
    const changed = () => setToken(sessionStorage.getItem("cms-session"));
    window.addEventListener("cms-session-changed", changed);
    return () => window.removeEventListener("cms-session-changed", changed);
  }, []);

  const access = useQuery({
    queryKey: ["cms-admin-access", token],
    queryFn: () => cmsAdminCall<{ expires_at: string }>("check_access"),
    enabled: !!token,
    retry: false,
    staleTime: 0,
  });

  async function signOut() {
    try {
      await cmsAdminCall("logout");
    } catch {
      toast.error("Du är utloggad på den här enheten. Sessionen kunde inte avslutas på servern och upphör automatiskt.");
    } finally {
      setCmsSession(null);
      qc.clear();
      navigate("/admin", { replace: true });
    }
  }

  let content;
  if (!token) {
    content = <AdminAuthPanel />;
  } else if (access.isLoading) {
    content = (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p role="status" className="text-moss">
          Kontrollerar administratörsåtkomst…
        </p>
      </main>
    );
  } else if (!access.data || access.isError) {
    content = (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="max-w-md space-y-4 rounded-media border border-line bg-paper-raised p-8">
          <h1 className="type-h3">Åtkomst kunde inte bekräftas</h1>
          <p className="text-ink/80">Inloggningen kan ha gått ut. Logga in igen eller kontrollera sessionen på nytt.</p>
          <p role="alert" className="font-semibold text-destructive">
            {access.error?.message || "Kunde inte kontrollera behörigheten."}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={() => void access.refetch()} className="btn btn-quiet">
              Kontrollera igen
            </button>
            <button onClick={() => void signOut()} className="btn btn-primary">
              Till inloggningen
            </button>
          </div>
          <Link to="/" className="link-quiet block text-moss">
            Till webbplatsen
          </Link>
        </div>
      </main>
    );
  } else {
    // Protected queries and editors mount only after the server verifies the session.
    content = <AuthorizedDashboard key={token} onSignOut={signOut} />;
  }

  return (
    <>
      <SeoHead title="Administration | Viriditas" description="Webbplatsens administration." noindex />
      <Toaster position="top-center" toastOptions={{ classNames: { toast: "font-body !bg-paper-raised !text-ink !border-line" } }} />
      {content}
    </>
  );
};

function AuthorizedDashboard({ onSignOut }: { onSignOut: () => Promise<void> }) {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [editingPage, setEditingPage] = useState<SitePage | "new" | null>(null);
  const [dirty, setDirty] = useState(false);
  const { data: settings } = useSiteSettings();
  const overview = useOverview();
  const newMessages = overview.data?.messages?.new ?? 0;

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const mayLeave = () => !dirty || window.confirm("Du har osparade ändringar. Vill du lämna utan att spara?");

  const selectTab = (next: AdminTab) => {
    if (tab === next || !mayLeave()) return false;
    setTab(next);
    setEditingPage(null);
    setDirty(false);
    return true;
  };

  const current = TABS.find((item) => item.id === tab)!;

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16.5rem_1fr]">
      <nav aria-label="Administrationens delar" className="border-b border-line bg-paper-raised lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-5 py-5">
          <BrailleMark />
          <span className="font-display text-xl text-ink soft-type">{getGlobalContentValue("business_name", settings)}</span>
          <span className="type-small text-moss">admin</span>
        </div>
        <div
          role="tablist"
          aria-label="Administration"
          aria-orientation="vertical"
          className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-6"
        >
          {TABS.map((item) => (
            <button
              key={item.id}
              role="tab"
              id={`admin-tab-${item.id}`}
              aria-selected={tab === item.id}
              aria-controls={`admin-panel-${item.id}`}
              tabIndex={tab === item.id ? 0 : -1}
              onClick={() => selectTab(item.id)}
              onKeyDown={(event) => {
                const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
                if (!keys.includes(event.key)) return;
                event.preventDefault();
                const index = TABS.findIndex((entry) => entry.id === item.id);
                const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
                const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? TABS.length - 1 : (index + step + TABS.length) % TABS.length;
                const next = TABS[nextIndex].id;
                if (selectTab(next)) document.getElementById(`admin-tab-${next}`)?.focus();
              }}
              className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3.5 text-left font-semibold transition-colors ${
                tab === item.id ? "bg-primary text-primary-foreground" : "text-ink/75 hover:bg-paper-deep hover:text-ink"
              }`}
            >
              <item.icon className="h-[1.1rem] w-[1.1rem] shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">{item.label}</span>
              {item.id === "messages" && newMessages > 0 && (
                <span className={`ml-auto rounded-full px-2 py-0.5 text-xs ${tab === item.id ? "bg-paper-raised text-primary" : "bg-sprout text-ink"}`}>
                  {newMessages}
                  <span className="sr-only"> nya</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-5 sm:px-8">
          <h1 className="type-h3">
            <span className="sr-only">Administration: </span>
            {current.label}
          </h1>
          <div className="flex flex-wrap items-center gap-5">
            {dirty && <p className="font-semibold text-primary">Osparade ändringar</p>}
            <Link
              to="/"
              onClick={(event) => {
                if (!mayLeave()) event.preventDefault();
              }}
              className="link"
            >
              Visa webbplatsen
            </Link>
            <button
              type="button"
              onClick={() => {
                if (mayLeave()) void onSignOut();
              }}
              className="btn btn-quiet min-h-10 px-4 py-1.5"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Logga ut
            </button>
          </div>
        </header>

        <div role="tabpanel" id={`admin-panel-${tab}`} aria-labelledby={`admin-tab-${tab}`} className="max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          {tab === "overview" && <Overview onNavigate={(next) => void selectTab(next)} />}
          {tab === "messages" && <MessagesInbox />}
          {tab === "content" && <ContentEditor onDirtyChange={setDirty} />}
          {tab === "pages" &&
            (editingPage ? (
              <PageEditor
                page={editingPage === "new" ? null : editingPage}
                onBack={() => {
                  setEditingPage(null);
                  setDirty(false);
                }}
                onDirtyChange={setDirty}
              />
            ) : (
              <PageList onEdit={(page) => setEditingPage(page)} onNew={() => setEditingPage("new")} />
            ))}
          {tab === "reviews" && <ReviewsManager />}
          {tab === "prices" && <PriceSync />}
          {tab === "stats" && (
            <Suspense
              fallback={
                <p role="status" className="py-12 text-moss">
                  Laddar statistik…
                </p>
              }
            >
              <BookingStatistics />
            </Suspense>
          )}
          {tab === "settings" && <SettingsEditor onDirtyChange={setDirty} />}
          {tab === "access" && <CmsAccessEditor onDirtyChange={setDirty} />}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
