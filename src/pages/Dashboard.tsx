import { lazy, Suspense, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, FileText, Settings, LayoutDashboard, Users, Pencil, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { SitePage } from "@/types/cms";
import PageList from "@/components/cms/PageList";
import PageEditor from "@/components/cms/PageEditor";
import SettingsEditor from "@/components/cms/SettingsEditor";
import SeoHead from "@/components/SeoHead";
import AdminAuthPanel from "@/components/cms/AdminAuthPanel";
import CmsAccessEditor from "@/components/cms/CmsAccessEditor";
import ContentEditor from "@/components/cms/ContentEditor";
import { clearLegacyAdminLogin, cmsAdminCall, setCmsSession } from "@/lib/cmsAdmin";
import { toast } from "sonner";

const BookingStatistics = lazy(() => import("@/components/cms/BookingStatistics"));

type Tab = "stats" | "content" | "pages" | "settings" | "access";

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
    content = <div className="min-h-screen flex items-center justify-center bg-background"><p role="status" className="font-body text-muted-foreground">Kontrollerar administratörsåtkomst…</p></div>;
  } else if (!access.data || access.isError) {
    content = <div className="min-h-screen flex items-center justify-center bg-background px-5"><div className="max-w-md bg-card border border-border rounded-3xl p-8 space-y-4 font-body">
      <h1 className="text-2xl font-display font-semibold">Åtkomst kunde inte bekräftas</h1>
      <p className="text-sm text-muted-foreground">Inloggningen kan ha gått ut. Logga in igen eller försök kontrollera sessionen på nytt.</p>
      <p role="alert" className="text-sm text-destructive">{access.error?.message || "Kunde inte kontrollera behörigheten."}</p>
      <button onClick={() => access.refetch()} className="text-primary underline text-sm">Kontrollera igen</button>
      <button onClick={signOut} className="block text-primary underline text-sm">Till inloggningen</button>
      <Link to="/" className="block text-muted-foreground underline text-sm">Till webbplatsen</Link>
    </div></div>;
  } else {
    // Protected queries and editors mount only after the server verifies the session.
    content = <AuthorizedDashboard key={token} onSignOut={signOut} />;
  }

  return <><SeoHead title="Administration | Viriditas" description="Webbplatsens administration." noindex />{content}</>;
};

function AuthorizedDashboard({ onSignOut }: { onSignOut: () => Promise<void> }) {
  const [tab, setTab] = useState<Tab>("content");
  const [editingPage, setEditingPage] = useState<SitePage | "new" | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const mayLeave = () => !dirty || window.confirm("Du har osparade ändringar. Vill du lämna utan att spara?");

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "content", label: "Innehåll", icon: Pencil },
    { id: "stats", label: "Statistik", icon: LayoutDashboard },
    { id: "pages", label: "Sidor", icon: FileText },
    { id: "settings", label: "Inställningar", icon: Settings },
    { id: "access", label: "Åtkomst & hjälp", icon: Users },
  ];

  const selectTab = (next: Tab) => {
    if (tab === next || !mayLeave()) return false;
    setTab(next);
    setEditingPage(null);
    setDirty(false);
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <h1 className="text-2xl md:text-4xl font-display font-semibold text-foreground flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary" /> Administration
          </h1>
          <div className="font-body text-sm flex flex-wrap items-center gap-4"><Link to="/" onClick={(event) => { if (!mayLeave()) event.preventDefault(); }} className="text-primary font-medium hover:underline">Visa webbplatsen</Link><button onClick={() => { if (mayLeave()) void onSignOut(); }} className="text-muted-foreground flex items-center gap-1.5 hover:underline"><LogOut className="w-4 h-4" /> Logga ut</button></div>
        </div>
        {dirty && <p className="font-body text-primary text-sm mb-5">Osparade ändringar</p>}

        {/* Tabs */}
        <div role="tablist" aria-label="Administration" className="flex gap-1 sm:gap-2 mb-8 border-b border-border pb-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={`admin-panel-${t.id}`}
              id={`admin-tab-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => selectTab(t.id)}
              onKeyDown={(event) => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const index = tabs.findIndex(item => item.id === t.id);
                const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
                const next = tabs[nextIndex].id;
                if (selectTab(next)) document.getElementById(`admin-tab-${next}`)?.focus();
              }}
              className={`flex flex-shrink-0 items-center gap-2 px-3 sm:px-4 py-2 rounded-t-xl font-body text-sm font-medium transition-colors ${
                tab === t.id
                  ? "bg-card border border-border border-b-background text-foreground -mb-[1px]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`admin-panel-${tab}`} aria-labelledby={`admin-tab-${tab}`}>
        {tab === "content" && <ContentEditor onDirtyChange={setDirty} />}
        {tab === "pages" && (
          editingPage ? (
            <PageEditor
              page={editingPage === "new" ? null : editingPage}
              onBack={() => { setEditingPage(null); setDirty(false); }}
              onDirtyChange={setDirty}
            />
          ) : (
            <PageList
              onEdit={(page) => setEditingPage(page)}
              onNew={() => setEditingPage("new")}
            />
          )
        )}

        {tab === "settings" && <SettingsEditor onDirtyChange={setDirty} />}
        {tab === "access" && <CmsAccessEditor onDirtyChange={setDirty} />}

        {tab === "stats" && <Suspense fallback={<p role="status" className="py-12 text-muted-foreground">Laddar statistik…</p>}><BookingStatistics /></Suspense>}
        </div>
      </div>
    </div>
  );
}


export default Dashboard;
