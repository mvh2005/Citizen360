import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { LayoutDashboard, FilePlus2, FileText, Bell, Map as MapIcon, User, Settings, LogOut, ShieldCheck, Search, ArrowLeft, CheckCircle2, Clock, AlertCircle, TrendingUp, Loader2, Users, Check, X, ShieldAlert, Award, FileEdit } from "lucide-react";
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
    
    const [activeTab, setActiveTab] = useState("dashboard");
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Admin specific state
    const [officers, setOfficers] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate({ to: "/auth" });
            return;
        }
        loadDashboardData();
    }, [isAuthenticated]);

    async function loadDashboardData() {
        try {
            setLoading(true);
            const data = await api.getDashboard();
            setDashboard(data);
            
            if (user?.role === "ADMIN") {
                const officersList = await api.getAdminOfficers();
                setOfficers(officersList);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Admin Actions
    const handleApproveOfficer = async (officerId) => {
        try {
            await api.approveOfficer(officerId);
            const updated = await api.getAdminOfficers();
            setOfficers(updated);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRejectOfficer = async (officerId) => {
        if (!confirm("Are you sure you want to delete this officer?")) return;
        try {
            await api.rejectOfficer(officerId);
            const updated = await api.getAdminOfficers();
            setOfficers(updated);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleAssignOfficer = async (complaintId, officerId) => {
        try {
            await api.assignComplaintOfficer(complaintId, officerId);
            await loadDashboardData();
        } catch (err) {
            alert(err.message);
        }
    };

    // Officer Actions
    const handleUpdateStatus = async (complaintId, status, note) => {
        try {
            await api.updateComplaintStatus(complaintId, status, note);
            await loadDashboardData();
        } catch (err) {
            alert(err.message);
        }
    };

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
    const approvedOfficers = officers.filter(o => o.approved);

    return (
        <div className="min-h-screen bg-background">
            <Sidebar 
                user={user} 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={() => { logout(); navigate({ to: "/" }); }} 
            />
            
            <div className="lg:pl-64">
                <TopNav />
                
                <main className="mx-auto max-w-7xl px-4 py-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                                    Welcome back, {user?.role}
                                </div>
                                <h1 className="text-2xl font-extrabold sm:text-3xl">{user?.fullName || "User"}</h1>
                            </div>
                            {user?.role === "CITIZEN" && (
                                <Link to="/report" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90">
                                    <FilePlus2 className="h-4 w-4" /> New Complaint
                                </Link>
                            )}
                        </div>
                    </motion.div>

                    {error && (
                        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
                    )}

                    {/* RENDER TAB CONTENTS */}
                    {activeTab === "dashboard" && (
                        <>
                            {/* Stats Grid */}
                            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                                <StatCard icon={FileText} label="Total Duties/Complaints" value={String(dashboard?.totalComplaints || 0)} tint="text-primary bg-primary/10" />
                                <StatCard icon={Clock} label="Pending Tasks" value={String(dashboard?.pending || 0)} tint="text-muted-foreground bg-muted" />
                                <StatCard icon={AlertCircle} label="In Progress" value={String(dashboard?.inProgress || 0)} tint="text-warning bg-warning/15" />
                                <StatCard icon={CheckCircle2} label="Resolved / Closed" value={String(dashboard?.resolved || 0)} tint="text-success bg-success/15" />
                            </div>

                            {/* Charts */}
                            <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                                <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-bold">Monthly Trend</div>
                                            <div className="text-xs text-muted-foreground">Civic issues timeline</div>
                                        </div>
                                        {monthly.length > 1 && (
                                            <div className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[10px] font-semibold text-success">
                                                <TrendingUp className="h-3 w-3" /> Active
                                            </div>
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
                                            <div className="grid h-full place-items-center text-sm text-muted-foreground">No reports recorded in this period</div>
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                                    <div className="text-sm font-bold">Department Categories</div>
                                    <div className="text-xs text-muted-foreground">Distribution details</div>
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
                                            <div className="grid h-full place-items-center text-sm text-muted-foreground">No category data yet</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Recent items list */}
                            <div className="mt-6 rounded-3xl border border-border bg-card shadow-sm">
                                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                                    <div className="text-sm font-bold">
                                        {user?.role === "ADMIN" ? "Recent City Complaints" : user?.role === "OFFICER" ? "My Recent Assignments" : "My Recent Submissions"}
                                    </div>
                                    <button onClick={() => setActiveTab(user?.role === "ADMIN" ? "complaints" : user?.role === "OFFICER" ? "assigned" : "complaints")} className="text-xs font-semibold text-primary hover:underline">
                                        View all
                                    </button>
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
                                                <tr>
                                                    <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                                                        No duties or complaints found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* COMPLAINTS TAB FOR ADMIN / GENERAL VIEW */}
                    {activeTab === "complaints" && (
                        <div className="mt-6 rounded-3xl border border-border bg-card shadow-sm">
                            <div className="flex items-center justify-between border-b border-border px-5 py-4">
                                <h2 className="text-lg font-bold">Manage City Complaints</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                                        <tr>
                                            <th className="px-5 py-3">ID</th>
                                            <th className="px-5 py-3">Title</th>
                                            <th className="px-5 py-3">Category</th>
                                            <th className="px-5 py-3">Assigned Officer</th>
                                            <th className="px-5 py-3">Status</th>
                                            {user?.role === "ADMIN" && <th className="px-5 py-3">Action</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {complaints.length > 0 ? complaints.map((c) => (
                                            <tr key={c.complaintId} className="border-t border-border hover:bg-muted/40">
                                                <td className="px-5 py-3 font-mono text-xs">#{c.complaintId}</td>
                                                <td className="px-5 py-3 font-medium cursor-pointer" onClick={() => navigate({ to: "/track", search: { id: c.complaintId } })}>{c.title}</td>
                                                <td className="px-5 py-3 text-muted-foreground">{c.category}</td>
                                                <td className="px-5 py-3 font-medium text-primary">
                                                    {c.officerName || <span className="text-muted-foreground font-normal italic">Unassigned</span>}
                                                </td>
                                                <td className="px-5 py-3"><StatusBadge s={STATUS_MAP[c.status] || c.status} /></td>
                                                {user?.role === "ADMIN" && (
                                                    <td className="px-5 py-3">
                                                        <button 
                                                            onClick={() => { setSelectedComplaint(c); setShowAssignModal(true); }}
                                                            className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg bg-primary/10 text-primary px-2.5 py-1 hover:bg-primary/20"
                                                        >
                                                            <Award className="h-3 w-3" /> Assign
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                                                    No complaints reported.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ASSIGNED DUTIES FOR OFFICERS */}
                    {activeTab === "assigned" && (
                        <div className="mt-6 rounded-3xl border border-border bg-card shadow-sm">
                            <div className="flex items-center justify-between border-b border-border px-5 py-4">
                                <h2 className="text-lg font-bold">My Assigned Duties</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                                        <tr>
                                            <th className="px-5 py-3">ID</th>
                                            <th className="px-5 py-3">Title</th>
                                            <th className="px-5 py-3">Location</th>
                                            <th className="px-5 py-3">Priority</th>
                                            <th className="px-5 py-3">Status</th>
                                            <th className="px-5 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {complaints.length > 0 ? complaints.map((c) => (
                                            <tr key={c.complaintId} className="border-t border-border hover:bg-muted/40">
                                                <td className="px-5 py-3 font-mono text-xs">#{c.complaintId}</td>
                                                <td className="px-5 py-3 font-medium cursor-pointer" onClick={() => navigate({ to: "/track", search: { id: c.complaintId } })}>{c.title}</td>
                                                <td className="px-5 py-3 text-muted-foreground">{c.location}</td>
                                                <td className="px-5 py-3 text-xs uppercase tracking-wider font-semibold">{c.priority}</td>
                                                <td className="px-5 py-3"><StatusBadge s={STATUS_MAP[c.status] || c.status} /></td>
                                                <td className="px-5 py-3">
                                                    <button 
                                                        onClick={() => { setSelectedComplaint(c); setShowStatusModal(true); }}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg bg-warning/15 text-warning px-2.5 py-1 hover:bg-warning/25"
                                                    >
                                                        <FileEdit className="h-3 w-3" /> Update Status
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                                                    No assignments found. Clean job sheet!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* MANAGE OFFICERS TAB FOR ADMIN */}
                    {activeTab === "officers" && user?.role === "ADMIN" && (
                        <div className="mt-6 rounded-3xl border border-border bg-card shadow-sm">
                            <div className="border-b border-border px-5 py-4">
                                <h2 className="text-lg font-bold">Officer Registrations</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Approve new municipal officers to let them log in and resolve citizen issues.</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                                        <tr>
                                            <th className="px-5 py-3">ID</th>
                                            <th className="px-5 py-3">Officer Name</th>
                                            <th className="px-5 py-3">Email Address</th>
                                            <th className="px-5 py-3">Registered Date</th>
                                            <th className="px-5 py-3">Status</th>
                                            <th className="px-5 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {officers.length > 0 ? officers.map((o) => (
                                            <tr key={o.id} className="border-t border-border hover:bg-muted/40">
                                                <td className="px-5 py-3 font-mono text-xs">#{o.id}</td>
                                                <td className="px-5 py-3 font-semibold">{o.fullName}</td>
                                                <td className="px-5 py-3 text-muted-foreground">{o.email}</td>
                                                <td className="px-5 py-3 text-muted-foreground">{o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</td>
                                                <td className="px-5 py-3">
                                                    {o.approved ? (
                                                        <span className="inline-flex rounded-full bg-success/15 px-2 py-1 text-[10px] font-semibold text-success">Approved</span>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-warning/15 px-2 py-1 text-[10px] font-semibold text-warning animate-pulse">Pending Approval</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3 flex gap-2">
                                                    {!o.approved && (
                                                        <button 
                                                            onClick={() => handleApproveOfficer(o.id)}
                                                            className="p-1 rounded-lg bg-success/15 text-success hover:bg-success/25"
                                                            title="Approve Officer"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleRejectOfficer(o.id)}
                                                        className="p-1 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25"
                                                        title="Reject/Delete Officer"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">
                                                    No officers registered.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* MODALS */}
            {showAssignModal && selectedComplaint && (
                <AssignModal 
                    complaint={selectedComplaint}
                    officers={approvedOfficers}
                    onClose={() => { setSelectedComplaint(null); setShowAssignModal(false); }}
                    onAssign={handleAssignOfficer}
                />
            )}

            {showStatusModal && selectedComplaint && (
                <StatusModal 
                    complaint={selectedComplaint}
                    onClose={() => { setSelectedComplaint(null); setShowStatusModal(false); }}
                    onUpdate={handleUpdateStatus}
                />
            )}
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
        Rejected: "bg-destructive/15 text-destructive",
    };
    return <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${map[s] || "bg-muted"}`}>{s}</span>;
}

function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
    let items = [];
    if (user?.role === "ADMIN") {
        items = [
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "complaints", icon: FileText, label: "City Complaints" },
            { id: "officers", icon: Users, label: "Manage Officers" },
        ];
    } else if (user?.role === "OFFICER") {
        items = [
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "assigned", icon: FileText, label: "Assigned Duties" },
        ];
    } else {
        items = [
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "report-link", icon: FilePlus2, label: "New Complaint", to: "/report" },
            { id: "track-link", icon: FileText, label: "Track Status", to: "/track" },
        ];
    }

    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-sidebar lg:block">
            <div className="flex h-16 items-center gap-2 border-b border-border px-5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                    <div className="text-sm font-extrabold">Citizen360</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Smart City Initiative</div>
                </div>
            </div>
            <nav className="p-3 space-y-1">
                {items.map((i) => {
                    if (i.to) {
                        return (
                            <Link 
                                key={i.label} 
                                to={i.to} 
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                                <i.icon className="h-4 w-4" /> {i.label}
                            </Link>
                        );
                    }
                    
                    const active = activeTab === i.id;
                    return (
                        <button
                            key={i.id}
                            onClick={() => setActiveTab(i.id)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                active 
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 font-semibold" 
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                        >
                            <i.icon className="h-4 w-4" /> {i.label}
                        </button>
                    );
                })}
                <button 
                    onClick={onLogout} 
                    className="mt-6 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                    <LogOut className="h-4 w-4" /> Logout
                </button>
            </nav>
        </aside>
    );
}

function TopNav() {
    const user = api.getCurrentUser();
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
                    <div className="text-right hidden sm:block">
                        <div className="text-xs font-bold">{user?.fullName}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{user?.role}</div>
                    </div>
                    <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-card">
                        <Bell className="h-4 w-4" />
                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
                    </button>
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {user?.fullName?.split(" ").map(p => p[0]).join("") || "U"}
                    </div>
                </div>
            </div>
        </header>
    );
}

function AssignModal({ complaint, officers, onClose, onAssign }) {
    const [selectedOfficer, setSelectedOfficer] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedOfficer) return;
        setSubmitting(true);
        try {
            await onAssign(complaint.complaintId, selectedOfficer);
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong w-full max-w-md rounded-3xl p-6 shadow-2xl bg-card border border-border">
                <h3 className="text-lg font-bold flex items-center gap-2"><Award className="text-primary" /> Assign Duty</h3>
                <p className="text-xs text-muted-foreground mt-1">Assign Complaint #{complaint.complaintId} to an officer.</p>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <label className="block">
                        <div className="text-xs font-semibold mb-1">Select Approved Officer</div>
                        <select value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)} className="w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary" required>
                            <option value="">-- Choose an Officer --</option>
                            {officers.map(o => (
                                <option key={o.id} value={o.id}>{o.fullName} ({o.email})</option>
                            ))}
                        </select>
                    </label>
                    <div className="flex justify-end gap-2 text-sm font-semibold pt-2">
                        <button type="button" onClick={onClose} className="rounded-xl border border-border px-4 py-2 hover:bg-muted transition-colors">Cancel</button>
                        <button type="submit" disabled={submitting} className="rounded-xl bg-primary px-4 py-2 text-primary-foreground shadow-md hover:bg-primary/95 disabled:opacity-50 transition-colors">
                            {submitting ? "Assigning..." : "Assign"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

function StatusModal({ complaint, onClose, onUpdate }) {
    const [status, setStatus] = useState(complaint.status);
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onUpdate(complaint.complaintId, status, note);
            onClose();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong w-full max-w-md rounded-3xl p-6 shadow-2xl bg-card border border-border">
                <h3 className="text-lg font-bold flex items-center gap-2"><FileEdit className="text-warning" /> Update Complaint Status</h3>
                <p className="text-xs text-muted-foreground mt-1">Complaint #{complaint.complaintId}</p>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <label className="block">
                        <div className="text-xs font-semibold mb-1">Status</div>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none focus:border-primary" required>
                            <option value="ASSIGNED">Assigned (Open)</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </label>
                    <label className="block">
                        <div className="text-xs font-semibold mb-1">Timeline Comment / Action Note</div>
                        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Explain the current progress or reason for resolution/rejection..." className="w-full rounded-xl border border-border bg-background p-2.5 text-sm outline-none h-24 resize-none focus:border-primary" required />
                    </label>
                    <div className="flex justify-end gap-2 text-sm font-semibold pt-2">
                        <button type="button" onClick={onClose} className="rounded-xl border border-border px-4 py-2 hover:bg-muted transition-colors">Cancel</button>
                        <button type="submit" disabled={submitting} className="rounded-xl bg-primary px-4 py-2 text-primary-foreground shadow-md hover:bg-primary/95 disabled:opacity-50 transition-colors">
                            {submitting ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}