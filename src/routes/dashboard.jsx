import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { LayoutDashboard, FilePlus2, FileText, Bell, Map as MapIcon, User, Settings, LogOut, ShieldCheck, Search, ArrowLeft, CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

export const Route = createFileRoute("/dashboard")({
    head: () => ({
        meta: [
            { title: "Dashboard — Citizen360" },
            { name: "description", content: "Your complaints, notifications and civic activity at a glance." },
        ],
    }),
    component: Dashboard,
});

const monthly = [
    { m: "Jan", v: 24 }, { m: "Feb", v: 32 }, { m: "Mar", v: 28 }, { m: "Apr", v: 41 },
    { m: "May", v: 38 }, { m: "Jun", v: 52 }, { m: "Jul", v: 47 },
];
const pieData = [
    { name: "Roads", value: 34 },
    { name: "Sanitation", value: 22 },
    { name: "Water", value: 15 },
    { name: "Electricity", value: 18 },
    { name: "Drainage", value: 11 },
];
const PIE_COLORS = ["oklch(0.55 0.22 258)", "oklch(0.72 0.17 152)", "oklch(0.65 0.18 200)", "oklch(0.77 0.16 65)", "oklch(0.60 0.20 300)"];

const complaints = [
    { id: "CT-2087", title: "Pothole on MG Road", dept: "Roads", status: "In Progress", date: "12 Jul" },
    { id: "CT-2064", title: "Overflowing bin near park", dept: "Sanitation", status: "Resolved", date: "10 Jul" },
    { id: "CT-2041", title: "Streetlight not working", dept: "Electricity", status: "Assigned", date: "09 Jul" },
    { id: "CT-2019", title: "Water leakage on Block C", dept: "Water", status: "Pending", date: "07 Jul" },
];

function Dashboard() {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="lg:pl-64">
                <TopNav />
                <main className="mx-auto max-w-7xl px-4 py-8">
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Welcome back</div>
                                <h1 className="text-2xl font-extrabold sm:text-3xl">Priya Sharma</h1>
                            </div>
                            <Link to="/report" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90">
                                <FilePlus2 className="h-4 w-4" /> New Complaint
                            </Link>
                        </div>
                    </motion.div>

                    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <StatCard icon={FileText} label="Total Complaints" value="12" tint="text-primary bg-primary/10" trend="+3" />
                        <StatCard icon={Clock} label="Pending" value="2" tint="text-muted-foreground bg-muted" />
                        <StatCard icon={AlertCircle} label="In Progress" value="3" tint="text-warning bg-warning/15" />
                        <StatCard icon={CheckCircle2} label="Resolved" value="7" tint="text-success bg-success/15" trend="+2" />
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold">Monthly Complaints</div>
                                    <div className="text-xs text-muted-foreground">Last 7 months</div>
                                </div>
                                <div className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[10px] font-semibold text-success"><TrendingUp className="h-3 w-3" /> +18%</div>
                            </div>
                            <div className="mt-4 h-64">
                                <ResponsiveContainer>
                                    <AreaChart data={monthly}>
                                        <defs>
                                            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="oklch(0.55 0.22 258)" stopOpacity={0.5} />
                                                <stop offset="100%" stopColor="oklch(0.55 0.22 258)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={11} />
                                        <YAxis tickLine={false} axisLine={false} fontSize={11} />
                                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
                                        <Area type="monotone" dataKey="v" stroke="oklch(0.55 0.22 258)" strokeWidth={2.5} fill="url(#g1)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                            <div className="text-sm font-bold">By Category</div>
                            <div className="text-xs text-muted-foreground">Distribution</div>
                            <div className="mt-4 h-64">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={pieData} dataKey="value" innerRadius={45} outerRadius={80} paddingAngle={2}>
                                            {pieData.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i]} />))}
                                        </Pie>
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border border-border bg-card shadow-sm">
                        <div className="flex items-center justify-between border-b border-border px-5 py-4">
                            <div className="text-sm font-bold">Recent Complaints</div>
                            <Link to="/track" className="text-xs font-semibold text-primary hover:underline">View all</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                                    <tr>
                                        <th className="px-5 py-3">ID</th>
                                        <th className="px-5 py-3">Title</th>
                                        <th className="px-5 py-3">Department</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.map((c) => (
                                        <tr key={c.id} className="border-t border-border hover:bg-muted/40">
                                            <td className="px-5 py-3 font-mono text-xs">#{c.id}</td>
                                            <td className="px-5 py-3 font-medium">{c.title}</td>
                                            <td className="px-5 py-3 text-muted-foreground">{c.dept}</td>
                                            <td className="px-5 py-3"><StatusBadge s={c.status} /></td>
                                            <td className="px-5 py-3 text-muted-foreground">{c.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
function StatCard({ icon: Icon, label, value, tint, trend }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className={`inline-grid h-10 w-10 place-items-center rounded-xl ${tint}`}><Icon className="h-5 w-5" /></div>
            <div className="mt-3 flex items-baseline gap-2">
                <div className="text-2xl font-extrabold">{value}</div>
                {trend && <div className="text-[10px] font-semibold text-success">{trend}</div>}
            </div>
            <div className="text-xs text-muted-foreground">{label}</div>
        </motion.div>
    );
}

function StatusBadge({ s }) {
    const map = {
        Pending: "bg-muted text-muted-foreground",
        Assigned: "bg-primary/15 text-primary",
        "In Progress": "bg-warning/20 text-warning",
        Resolved: "bg-success/15 text-success",
    };
    return <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${map[s] || "bg-muted"}`}>{s}</span>;
}

function Sidebar() {
    const items = [
        { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard", active: true },
        { icon: FilePlus2, label: "New Complaint", to: "/report" },
        { icon: FileText, label: "My Complaints", to: "/track" },
        { icon: Bell, label: "Notifications", to: "/dashboard" },
        { icon: MapIcon, label: "Map", to: "/dashboard" },
        { icon: User, label: "Profile", to: "/dashboard" },
        { icon: Settings, label: "Settings", to: "/dashboard" },
    ];
    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-sidebar lg:block">
            <div className="flex h-16 items-center gap-2 border-b border-border px-5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><ShieldCheck className="h-5 w-5" /></div>
                <div>
                    <div className="text-sm font-extrabold">Citizen360</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Citizen Portal</div>
                </div>
            </div>
            <nav className="p-3">
                {items.map((i) => (
                    <Link key={i.label} to={i.to} className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${i.active ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                        <i.icon className="h-4 w-4" /> {i.label}
                    </Link>
                ))}
                <Link to="/" className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                    <LogOut className="h-4 w-4" /> Logout
                </Link>
            </nav>
        </aside>
    );
}

function TopNav() {
    return (
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground lg:hidden">
                    <ArrowLeft className="h-4 w-4" /> Home
                </Link>
                <div className="hidden flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 sm:flex sm:max-w-md">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <input placeholder="Search complaints, locations…" className="w-full bg-transparent text-sm outline-none" />
                </div>
                <div className="flex items-center gap-2">
                    <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-card">
                        <Bell className="h-4 w-4" />
                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
                    </button>
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">PS</div>
                </div>
            </div>
        </header>
    );
}