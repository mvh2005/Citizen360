import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { ArrowLeft, Camera, MapPin, Upload, Sparkles, CheckCircle2, Send, X } from "lucide-react";

export const Route = createFileRoute("/report")({
    head: () => ({
        meta: [
            { title: "New Complaint — Citizen360" },
            { name: "description", content: "Report a civic issue with photos, category, priority and GPS location." },
        ],
    }),
    component: ReportPage,
});

const CATEGORIES = ["Road Damage", "Garbage", "Street Light", "Water Leakage", "Drainage", "Public Toilet", "Electricity", "Illegal Dumping", "Others"];
const PRIORITIES = [
    { id: "low", label: "Low" },
    { id: "medium", label: "Medium" },
    { id: "high", label: "High" },
    { id: "emergency", label: "Emergency" },
];

function ReportPage() {
    const [images, setImages] = useState<string[]>([]);
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [priority, setPriority] = useState("medium");
    const [submitted, setSubmitted] = useState<null | { id: string; eta: string; dept: string }>(null);
    const [location, setLocation] = useState<string>("");
    const fileInput = useRef<HTMLInputElement>(null);

    const onFiles = (files: FileList | null) => {
        if (!files) return;
        const urls = Array.from(files).map((f) => URL.createObjectURL(f));
        setImages((s) => [...s, ...urls].slice(0, 6));
    };

    const detectGPS = () => {
        setLocation("Detecting…");
        setTimeout(() => setLocation("Sector 42, Block C, New Delhi (28.5355° N, 77.3910° E)"), 700);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted({ id: `CT-${Math.floor(1000 + Math.random() * 9000)}`, eta: "18h 42m", dept: `${category === "Garbage" ? "Sanitation" : "Roads"} Department` });
    };

    return (
        <div className="min-h-screen bg-background">
            <TopBar title="New Complaint" />
            <div className="mx-auto max-w-4xl px-4 pb-16 pt-24">
                {submitted ? (
                    <SuccessCard data={submitted} />
                ) : (
                    <motion.form onSubmit={onSubmit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-6 shadow-xl sm:p-8">
                        <div className="text-xs font-medium uppercase tracking-widest text-primary">Report an issue</div>
                        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Tell us what's wrong</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Add a photo and location for the fastest resolution.</p>

                        <div className="mt-6 space-y-5">
                            <Field label="Complaint title" placeholder="Large pothole on MG Road" />
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold">Description</label>
                                <textarea rows={3} placeholder="Describe the issue in detail…" className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold">Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary">
                                        {CATEGORIES.map((c) => (<option key={c}>{c}</option>))}
                                    </select>
                                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                                        <Sparkles className="h-3 w-3" /> AI detected: {category}
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold">Priority</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {PRIORITIES.map((p) => (
                                            <button type="button" key={p.id} onClick={() => setPriority(p.id)} className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-all ${priority === p.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}>
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold">Upload images</label>
                                <div onClick={() => fileInput.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }} className="cursor-pointer rounded-2xl border-2 border-dashed border-border bg-card p-6 text-center transition-colors hover:border-primary hover:bg-primary/5">
                                    <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                    <div className="mt-2 text-sm font-semibold">Drag & drop or click to upload</div>
                                    <div className="text-xs text-muted-foreground">Up to 6 images · JPG, PNG</div>
                                </div>
                                {images.length > 0 && (
                                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                                        {images.map((src, i) => (
                                            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
                                                <img src={src} alt="" className="h-full w-full object-cover" />
                                                <button type="button" onClick={() => setImages((s) => s.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold">Location</label>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Address or landmark" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
                                    </div>
                                    <button type="button" onClick={detectGPS} className="inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30">
                                        <MapPin className="h-4 w-4" /> Use GPS
                                    </button>
                                </div>
                                <div className="mt-3 h-48 overflow-hidden rounded-2xl border border-border bg-muted [background-image:linear-gradient(color-mix(in_oklab,var(--color-primary)_15%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--color-primary)_15%,transparent)_1px,transparent_1px)] [background-size:32px_32px]">
                                    <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Interactive map (tap to drop pin)</div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.01]">
                                <Send className="h-4 w-4" /> Submit Complaint
                            </button>
                        </div>
                    </motion.form>
                )}
            </div>
        </div>
    );
}

function SuccessCard({ data }: { data: { id: string; eta: string; dept: string } }) {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong rounded-3xl p-8 text-center shadow-xl">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
                <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold">Complaint submitted!</h2>
            <p className="mt-1 text-sm text-muted-foreground">We've routed your report and notified the assigned officer.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Stat label="Complaint ID" value={`#${data.id}`} />
                <Stat label="Estimated resolution" value={data.eta} />
                <Stat label="Assigned to" value={data.dept} />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/track" className="rounded-xl gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30">Track Complaint</Link>
                <Link to="/dashboard" className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-muted">Go to Dashboard</Link>
            </div>
        </motion.div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</div>
            <div className="mt-1 text-sm font-bold">{value}</div>
        </div>
    );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <label className="block">
            <div className="mb-1.5 text-xs font-semibold">{label}</div>
            <input {...props} className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
    );
}

function TopBar({ title }: { title: string }) {
    return (
        <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> {title}
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Camera className="h-4 w-4" /> Citizen360
                </div>
            </div>
        </header>
    );
}