import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft, Search, MessageCircle, Download, Image as ImageIcon, Plus, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/track")({
    head: () => ({
        meta: [
            { title: "Track Complaint — Citizen360" },
            { name: "description", content: "Track the status of your civic complaint in real time." },
        ],
    }),
    component: TrackPage,
});

const TIMELINE = [
    { title: "Complaint Submitted", time: "12 Jul, 09:14 AM", color: "bg-muted-foreground", done: true },
    { title: "Assigned to Department", time: "12 Jul, 09:22 AM", color: "bg-primary", done: true },
    { title: "Officer Accepted", time: "12 Jul, 10:41 AM", color: "bg-primary", done: true },
    { title: "Work Started", time: "12 Jul, 12:05 PM", color: "bg-warning", done: true },
    { title: "Inspection", time: "In progress", color: "bg-warning", done: false, active: true },
    { title: "Completed", time: "Pending", color: "bg-success", done: false },
];

function TrackPage() {
    const [query, setQuery] = useState("CT-2087");

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
                    <p className="mt-1 text-sm text-muted-foreground">Search using your complaint ID or registered mobile number.</p>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="CT-2087 or +91 98xxxxxxxx" className="w-full bg-transparent text-sm outline-none" />
                        </div>
                        <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90">
                            Track
                        </button>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0">
                                <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Complaint</div>
                                <div className="text-lg font-extrabold">Pothole on MG Road, Sector 42</div>
                                <div className="mt-0.5 text-xs text-muted-foreground">#{query} · Roads Department</div>
                            </div>
                            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-warning/20 px-2.5 py-1 text-xs font-semibold text-warning">
                                <Clock className="h-3.5 w-3.5" /> In Progress
                            </div>
                        </div>

                        <ol className="mt-6 space-y-4">
                            {TIMELINE.map((t, i) => (
                                <li key={t.title} className="relative flex gap-4 pb-4 last:pb-0">
                                    {i < TIMELINE.length - 1 && <span className="absolute left-3 top-6 h-full w-px bg-border" />}
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
                                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">RM</div>
                                <div>
                                    <div className="text-sm font-semibold">Rajeev Menon</div>
                                    <div className="text-xs text-muted-foreground">Roads Dept. · 4.8★</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
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