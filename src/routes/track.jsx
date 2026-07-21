import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowLeft, Search, MessageCircle, Download, Image as ImageIcon, Plus, CheckCircle2, Clock, Loader2, AlertCircle } from "lucide-react";
import * as api from "../lib/api";

export const Route = createFileRoute("/track")({
    validateSearch: (search) => ({
        id: search.id || "",
    }),
    head: () => ({
        meta: [
            { title: "Track Complaint — Citizen360" },
            { name: "description", content: "Track the status of your civic complaint in real time." },
        ],
    }),
    component: TrackPage,
});

const FULL_TIMELINE_STEPS = [
    "Complaint Submitted",
    "Assigned to Department",
    "Officer Accepted",
    "Work Started",
    "Inspection",
    "Completed",
];

const STATUS_COLORS = {
    "Complaint Submitted": "bg-muted-foreground",
    "Assigned to Department": "bg-primary",
    "Officer Accepted": "bg-primary",
    "Work Started": "bg-warning",
    "Inspection": "bg-warning",
    "Completed": "bg-success",
};

const STATUS_DISPLAY = {
    PENDING: { label: "Pending", color: "bg-muted text-muted-foreground" },
    ASSIGNED: { label: "Assigned", color: "bg-primary/15 text-primary" },
    IN_PROGRESS: { label: "In Progress", color: "bg-warning/20 text-warning" },
    RESOLVED: { label: "Resolved", color: "bg-success/15 text-success" },
    REJECTED: { label: "Rejected", color: "bg-destructive/15 text-destructive" },
};

function TrackPage() {
    const search = Route.useSearch();
    const [query, setQuery] = useState(search.id || "");
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (search.id) {
            setQuery(search.id);
            doSearchWithId(search.id);
        }
    }, [search.id]);

    const doSearch = async () => {
        doSearchWithId(query);
    };

    const doSearchWithId = async (idToSearch) => {
        if (!idToSearch || !idToSearch.trim()) return;
        setLoading(true);
        setError(null);
        setSearched(true);
        try {
            const data = await api.getComplaint(idToSearch.trim());
            setComplaint(data);
        } catch (err) {
            setError("Complaint not found. Please check the ID and try again.");
            setComplaint(null);
        } finally {
            setLoading(false);
        }
    };

    // Build the full timeline with done/active states
    const buildTimeline = () => {
        if (!complaint) return [];
        const doneSteps = new Set(complaint.timeline?.map(t => t.title) || []);

        let lastDoneIndex = -1;
        FULL_TIMELINE_STEPS.forEach((step, i) => {
            if (doneSteps.has(step)) lastDoneIndex = i;
        });

        return FULL_TIMELINE_STEPS.map((step, i) => {
            const timelineEntry = complaint.timeline?.find(t => t.title === step);
            const done = doneSteps.has(step);
            const active = !done && i === lastDoneIndex + 1;

            return {
                title: step,
                time: timelineEntry
                    ? new Date(timelineEntry.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
                    : (active ? "In progress" : "Pending"),
                color: STATUS_COLORS[step] || "bg-muted",
                done,
                active,
            };
        });
    };

    const timeline = buildTimeline();
    const statusInfo = complaint ? (STATUS_DISPLAY[complaint.status] || STATUS_DISPLAY.PENDING) : null;

    return (
        <div className="min-h-screen bg-background">
            <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" /> Track Complaint
                    </Link>
                </div>
            </header>
            <div className="mx-auto max-w-5xl px-4 pb-16 pt-24">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-6 shadow-xl sm:p-8">
                    <div className="text-xs font-medium uppercase tracking-widest text-primary">Live tracking</div>
                    <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Find your complaint</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Search using your complaint ID (e.g. CT-2087).</p>

                    <form onSubmit={(e) => { e.preventDefault(); doSearch(); }} className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="CT-2087" className="w-full bg-transparent text-sm outline-none" />
                        </div>
                        <button type="submit" disabled={loading} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50">
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Track"}
                        </button>
                    </form>
                </motion.div>

                {loading && (
                    <div className="mt-10 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {error && searched && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-3xl border border-destructive/30 bg-destructive/10 p-6 text-center">
                        <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
                        <div className="mt-2 text-sm font-medium text-destructive">{error}</div>
                    </motion.div>
                )}

                {complaint && !loading && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                    <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Complaint</div>
                                    <div className="text-lg font-extrabold">{complaint.title}</div>
                                    <div className="mt-0.5 text-xs text-muted-foreground">#{complaint.complaintId} · {complaint.department || complaint.category}</div>
                                </div>
                                {statusInfo && (
                                    <div className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.color}`}>
                                        <Clock className="h-3.5 w-3.5" /> {statusInfo.label}
                                    </div>
                                )}
                            </div>

                            {complaint.description && (
                                <p className="mt-3 text-sm text-muted-foreground">{complaint.description}</p>
                            )}

                            <ol className="mt-6 space-y-4">
                                {timeline.map((t, i) => (
                                    <li key={t.title} className="relative flex gap-4 pb-4 last:pb-0">
                                        {i < timeline.length - 1 && <span className="absolute left-3 top-6 h-full w-px bg-border" />}
                                        <span className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full ${t.done ? t.color : "bg-muted"} text-[10px] text-white ${t.active ? "ring-4 ring-warning/20" : ""}`}>
                                            {t.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className={`text-sm font-semibold ${t.done ? "" : "text-muted-foreground"}`}>{t.title}</div>
                                            <div className="text-xs text-muted-foreground">{t.time}</div>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-3xl border border-border bg-card p-5">
                                <div className="text-sm font-bold">Actions</div>
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                    <ActionBtn icon={ImageIcon} label="View Images" />
                                    <ActionBtn icon={Download} label="Receipt PDF" />
                                    <ActionBtn icon={MessageCircle} label="Chat Officer" />
                                    <ActionBtn icon={Plus} label="Add Images" />
                                </div>
                            </div>
                            <div className="rounded-3xl border border-border bg-card p-5">
                                <div className="text-sm font-bold">Assigned Officer</div>
                                <div className="mt-3 flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                        {complaint.officerName ? complaint.officerName.split(" ").map(p => p[0]).join("") : "—"}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">{complaint.officerName || "Not yet assigned"}</div>
                                        <div className="text-xs text-muted-foreground">{complaint.department || complaint.category}</div>
                                    </div>
                                </div>
                            </div>
                            {complaint.location && (
                                <div className="rounded-3xl border border-border bg-card p-5">
                                    <div className="text-sm font-bold">Location</div>
                                    <div className="mt-2 text-xs text-muted-foreground">{complaint.location}</div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function ActionBtn({ icon: Icon, label }) {
    return (
        <button className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-xs font-semibold hover:bg-muted">
            <Icon className="h-4 w-4 text-primary" /> {label}
        </button>
    );
}