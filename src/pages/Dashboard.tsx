import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { BarChart3, MousePointerClick, TrendingUp, Calendar, Lock } from "lucide-react";
import { Link } from "react-router-dom";

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

const Dashboard = () => {
  const { data: clicks, isLoading } = useBookingClicks();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-body">Laddar statistik...</p>
      </div>
    );
  }

  const allClicks = clicks || [];
  const totalClicks = allClicks.length;

  // By source
  const bySource: Record<string, number> = {};
  allClicks.forEach(c => {
    const s = c.source || "okänd";
    bySource[s] = (bySource[s] || 0) + 1;
  });
  const sourceData = Object.entries(bySource)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // By day (last 14 days)
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
    date: date.slice(5), // MM-DD
    clicks,
  }));

  // Today & this week
  const today = now.toISOString().slice(0, 10);
  const todayClicks = allClicks.filter(c => c.clicked_at.slice(0, 10) === today).length;
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekClicks = allClicks.filter(c => new Date(c.clicked_at) >= weekAgo).length;

  // Top source
  const topSource = sourceData.length > 0 ? sourceData[0] : { name: "-", value: 0 };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" /> Bokningsstatistik
            </h1>
            <p className="text-muted-foreground font-body mt-1">Spårning av klick på bokningsknappar</p>
          </div>
          <Link to="/" className="text-primary font-body font-medium hover:underline text-sm">
            ← Tillbaka
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Totalt klick", value: totalClicks, icon: MousePointerClick, color: "text-primary" },
            { label: "Idag", value: todayClicks, icon: Calendar, color: "text-emerald-500" },
            { label: "Senaste 7 dagar", value: weekClicks, icon: TrendingUp, color: "text-blue-500" },
            { label: "Bästa källa", value: topSource.name, icon: BarChart3, color: "text-amber-500" },
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

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Daily chart */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm"
          >
            <h2 className="font-display font-semibold text-foreground mb-4">Klick per dag (14 dagar)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="clicks" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Source pie chart */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={5}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm"
          >
            <h2 className="font-display font-semibold text-foreground mb-4">Fördelning per källa</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                  style={{ fontSize: 11 }}
                >
                  {sourceData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Source table */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={6}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm mt-8"
        >
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
      </div>
    </div>
  );
};

export default Dashboard;
