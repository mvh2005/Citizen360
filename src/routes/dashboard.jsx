import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { LayoutDashboard, FilePlus2, FileText, Bell, Map as MapIcon, User, Settings, LogOut, ShieldCheck, Search, ArrowLeft, CheckCircle2, Clock, AlertCircle, TrendingUp, Loader2 } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { useAuth } from "../hooks/useAuth";
import * as api from "../lib/api";

export const Route = createFileRoute("/dashboard")({
    head: () => ({
        meta: [
            { title: "Dashboard — Citizen360" },
            { name: "description", content: "Your complaints, notifications and civic activity at a glance." },
        ],
    }),
    component: Dashboard,
});

const PIE_COLORS = ["oklch(0.55 0.22 258)", "oklch(0.72 0.17 152)", "oklch(0.65 0.18 200)", "oklch(0.77 0.16 65)", "oklch(0.60 0.20 300)"];

const STATUS_MAP = {
    PENDING: "Pending",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    REJECTED: "Rejected",
};

function Dashboard() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate({ to: "/auth" });
            return;
        }
        loadDashboard();
    }, [isAuthenticated]);

    async function loadDashboard() {
        try {
            setLoading(true);
            const data = await api.getDashboard();
            setDashboard(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const monthly = dashboard?.monthly?.map((m) => ({ m: m.month, v: m.count })) || [];
    const pieData = dashboard?.categories?.map((c) => ({ name: c.name, value: c.value })) || [];
    const complaints = dashboard?.recentComplaints || [];

    return (
        <div className="min-h-screen bg-background">
            <Sidebar user={user} onLogout={() => { logout(); navigate({ to: "/" }); }} />
            <div className="lg:pl-64">
                <TopNav />
                <main className="mx-auto max-w-7xl px-4 py-8">
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Welcome back</div>
                                <h1 className="text-2xl font-extrabold sm:text-3xl">{user?.fullName || "User"}</h1>
                            </div>
                            <Link to="/report" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90">
                                <FilePlus2 className="h-4 w-4" /> New Complaint
                            </Link>
                        </div>
                    </motion.div>

                    {error && (
                        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
                    )}

                    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <StatCard icon={FileText} label="Total Complaints" value={String(dashboard?.totalComplaints || 0)} tint="text-primary bg-primary/10" />
                        <StatCard icon={Clock} label="Pending" value={String(dashboard?.pending || 0)} tint="text-muted-foreground bg-muted" />
                        <StatCard icon={AlertCircle} label="In Progress" value={String(dashboard?.inProgress || 0)} tint="text-warning bg-warning/15" />
                        <StatCard icon={CheckCircle2} label="Resolved" value={String(dashboard?.resolved || 0)} tint="text-success bg-success/15" />
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-bold">Monthly Complaints</div>
                                    <div className="text-xs text-muted-foreground">This year</div>
                                </div>
                                {monthly.length > 1 && (
                                    <div className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[10px] font-semibold text-success"><TrendingUp className="h-3 w-3" /> Trend</div>
                                )}
                            </div>
                            <div className="mt-4 h-64">
                                {monthly.length > 0 ? (
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
                                ) : (
                                    <div className="grid h-full place-items-center text-sm text-muted-foreground">No monthly data yet</div>
                                )}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                            <div className="text-sm font-bold">By Category</div>
                            <div className="text-xs text-muted-foreground">Distribution</div>
                            <div className="mt-4 h-64">
                                {pieData.length > 0 ? (
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie data={pieData} dataKey="value" innerRadius={45} outerRadius={80} paddingAngle={2}>
                                                {pieData.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
                                            </Pie>
                                            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="grid h-full place-items-center text-sm text-muted-foreground">No categories yet</div>
                                )}
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
                                    {complaints.length > 0 ? complaints.map((c) => (
                                        <tr key={c.complaintId} className="border-t border-border hover:bg-muted/40 cursor-pointer" onClick={() => navigate({ to: "/track", search: { id: c.complaintId } })}>
                                            <td className="px-5 py-3 font-mono text-xs">#{c.complaintId}</td>
                                            <td className="px-5 py-3 font-medium">{c.title}</td>
                                            <td className="px-5 py-3 text-muted-foreground">{c.department || c.category}</td>
                                            <td className="px-5 py-3"><StatusBadge s={STATUS_MAP[c.status] || c.status} /></td>
                                            <td className="px-5 py-3 text-muted-foreground">{c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : ""}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No complaints yet. Submit your first one!</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
function StatCard({ icon: Icon, label, value, tint }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className={`inline-grid h-10 w-10 place-items-center rounded-xl ${tint}`}><Icon className="h-5 w-5" /></div>
            <div className="mt-3 flex items-baseline gap-2">
                <div className="text-2xl font-extrabold">{value}</div>
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

function Sidebar({ user, onLogout }) {
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
                <button onClick={onLogout} className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                    <LogOut className="h-4 w-4" /> Logout
                </button>
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
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {api.getCurrentUser()?.fullName?.split(" ").map(p => p[0]).join("") || "U"}
                    </div>
                </div>
            </div>
        </header>
    );
}