import { bookingClickSourceLabel, bookingClickPieSources } from "@/lib/bookingClickSources";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { BarChart3, MousePointerClick, TrendingUp, Calendar } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const COLORS = ["hsl(var(--primary))", "hsl(142 71% 45%)", "hsl(217 91% 60%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)", "hsl(280 65% 60%)", "hsl(var(--muted-foreground))"];

export type BookingClick = { source: string | null; clicked_at: string };

export default function BookingStatisticsCharts({ clicks, isLoading }: { clicks: BookingClick[] | undefined; isLoading: boolean }) {
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
    .map(([source, value]) => ({ source, name: bookingClickSourceLabel(source), value }))
    .sort((a, b) => b.value - a.value);
  const pieData = bookingClickPieSources(sourceData);

  const dailyMap: Record<string, number> = {};
  const now = new Date();
  const swedishDay = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit" });
  const today = swedishDay.format(now);
  for (let d = 13; d >= 0; d--) {
    const date = new Date(`${today}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() - d);
    dailyMap[date.toISOString().slice(0, 10)] = 0;
  }
  allClicks.forEach(c => {
    const day = swedishDay.format(new Date(c.clicked_at));
    if (day in dailyMap) dailyMap[day]++;
  });
  const dailyData = Object.entries(dailyMap).map(([date, clicks]) => ({
    date: date.slice(5),
    clicks,
  }));

  const todayClicks = allClicks.filter(c => swedishDay.format(new Date(c.clicked_at)) === today).length;
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekClicks = allClicks.filter(c => new Date(c.clicked_at) >= weekAgo).length;
  const topSource = sourceData.length > 0 ? sourceData[0] : { name: "-", value: 0 };

  return (
    <>
      <p className="font-body text-sm text-muted-foreground mb-6">Klick på bokning och kontakt, inklusive telefon och e-post. Bokningsklick visar intresse för att boka; genomförda bokningar och betalningar finns i Bokadirekt. Besökare som avböjer statistik registreras inte. Dagar visas enligt svensk tid.</p>
      {allClicks.length === 0 && <p role="status" className="font-body text-sm bg-card border border-border rounded-xl p-4 mb-6">Inga klick har registrerats ännu.</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Registrerade klick", value: totalClicks, icon: MousePointerClick, color: "text-primary" },
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
            className="min-w-0 bg-card border border-border rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-muted-foreground text-xs font-body">{stat.label}</span>
            </div>
            <p className="break-words text-2xl font-display font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="min-w-0 bg-card border border-border rounded-2xl p-6 shadow-sm">
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

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="min-w-0 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-display font-semibold text-foreground mb-4">Fördelning per källa</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 11 }}>
                {pieData.map((source, index) => (
                  <Cell key={source.source} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {sourceData.length > 6 && <p className="mb-3 text-xs text-muted-foreground">De sex största källorna visas separat. Resterande klick ingår i Övriga.</p>}
          <ul className="space-y-2 text-sm font-body">
            {pieData.map((source, index) => <li key={source.source} className="flex items-start gap-2"><span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: COLORS[index % COLORS.length] }} /><span className="min-w-0 break-words">{source.name}</span></li>)}
          </ul>
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
                <tr key={s.source} className="border-b border-border/50">
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

