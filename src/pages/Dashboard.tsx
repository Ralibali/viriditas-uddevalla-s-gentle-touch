import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { BarChart3, MousePointerClick, TrendingUp, Calendar, Lock, FileText, Settings, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import type { SitePage } from "@/types/cms";
import PageList from "@/components/cms/PageList";
import PageEditor from "@/components/cms/PageEditor";
import SettingsEditor from "@/components/cms/SettingsEditor";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const COLORS = ["hsl(var(--primary))", "hsl(142 71% 45%)", "hsl(217 91% 60%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)", "hsl(280 65% 60%)"];

function useBookingClicks() {
  return useQuery({
    queryKey: ["booking-clicks-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("booking_clicks")
        .select("*")
        .order("clicked_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

const DASHBOARD_PASSWORD = "Annika";

type Tab = "stats" | "pages" | "settings";

const Dashboard = () => {
  const [isAuthed, setIsAuthed] = useState(() => sessionStorage.getItem("dashboard-auth") === "true");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<Tab>("stats");
  const [editingPage, setEditingPage] = useState<SitePage | "new" | null>(null);
  const { data: clicks, isLoading } = useBookingClicks();

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-8 shadow-lg max-w-sm w-full text-center space-y-4"
        >
          <Lock className="w-10 h-10 text-primary mx-auto" />
          <h2 className="text-xl font-display font-semibold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground text-sm font-body">Ange lösenord för att se statistiken</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password === DASHBOARD_PASSWORD) {
                sessionStorage.setItem("dashboard-auth", "true");
                setIsAuthed(true);
                setError(false);
              } else {
                setError(true);
              }
            }}
            className="space-y-3"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Lösenord"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-body text-center focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            {error && <p className="text-destructive text-sm font-body">Fel lösenord</p>}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-body font-medium hover:bg-primary/90 transition-colors"
            >
              Logga in
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "stats", label: "Statistik", icon: LayoutDashboard },
    { id: "pages", label: "Sidor", icon: FileText },
    { id: "settings", label: "Inställningar", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" /> Dashboard
          </h1>
          <Link to="/" className="text-primary font-body font-medium hover:underline text-sm">
            ← Tillbaka
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setEditingPage(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-xl font-body text-sm font-medium transition-colors ${
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

        {tab === "pages" && (
          editingPage ? (
            <PageEditor
              page={editingPage === "new" ? null : editingPage}
              onBack={() => setEditingPage(null)}
            />
          ) : (
            <PageList
              onEdit={(page) => setEditingPage(page)}
              onNew={() => setEditingPage("new")}
            />
          )
        )}

        {tab === "settings" && <SettingsEditor />}

        {tab === "stats" && <StatsView clicks={clicks} isLoading={isLoading} />}
      </div>
    </div>
  );
};

function StatsView({ clicks, isLoading }: { clicks: any[] | undefined; isLoading: boolean }) {
  if (isLoading) {
    return <p className="text-muted-foreground font-body text-center py-12">Laddar statistik...</p>;
  }

  const allClicks = clicks || [];
  const totalClicks = allClicks.length;

  const bySource: Record<string, number> = {};
  allClicks.forEach(c => {
    const s = c.source || "okänd";
    bySource[s] = (bySource[s] || 0) + 1;
  });
  const sourceData = Object.entries(bySource)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const dailyMap: Record<string, number> = {};
  const now = new Date();
  for (let d = 13; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    dailyMap[date.toISOString().slice(0, 10)] = 0;
  }
  allClicks.forEach(c => {
    const day = c.clicked_at.slice(0, 10);
    if (day in dailyMap) dailyMap[day]++;
  });
  const dailyData = Object.entries(dailyMap).map(([date, clicks]) => ({
    date: date.slice(5),
    clicks,
  }));

  const today = now.toISOString().slice(0, 10);
  const todayClicks = allClicks.filter(c => c.clicked_at.slice(0, 10) === today).length;
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekClicks = allClicks.filter(c => new Date(c.clicked_at) >= weekAgo).length;
  const topSource = sourceData.length > 0 ? sourceData[0] : { name: "-", value: 0 };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Totalt klick", value: totalClicks, icon: MousePointerClick, color: "text-primary" },
          { label: "Idag", value: todayClicks, icon: Calendar, color: "text-primary" },
          { label: "Senaste 7 dagar", value: weekClicks, icon: TrendingUp, color: "text-primary" },
          { label: "Bästa källa", value: topSource.name, icon: BarChart3, color: "text-primary" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={i}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-muted-foreground text-xs font-body">{stat.label}</span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-display font-semibold text-foreground mb-4">Klick per dag (14 dagar)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyData}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", fontSize: 13 }} />
              <Bar dataKey="clicks" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-display font-semibold text-foreground mb-4">Fördelning per källa</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false} style={{ fontSize: 11 }}>
                {sourceData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="bg-card border border-border rounded-2xl p-6 shadow-sm mt-8">
        <h2 className="font-display font-semibold text-foreground mb-4">Alla källor</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 text-muted-foreground font-body font-medium">Källa</th>
                <th className="py-2 text-muted-foreground font-body font-medium text-right">Klick</th>
                <th className="py-2 text-muted-foreground font-body font-medium text-right">Andel</th>
              </tr>
            </thead>
            <tbody>
              {sourceData.map((s, i) => (
                <tr key={s.name} className="border-b border-border/50">
                  <td className="py-3 text-foreground font-body flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ background: COLORS[i % COLORS.length] }} />
                    {s.name}
                  </td>
                  <td className="py-3 text-foreground font-body text-right font-medium">{s.value}</td>
                  <td className="py-3 text-muted-foreground font-body text-right">
                    {totalClicks > 0 ? ((s.value / totalClicks) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}

export default Dashboard;
