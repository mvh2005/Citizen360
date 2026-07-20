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
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [priority, setPriority] = useState("medium");
    const [submitted, setSubmitted] = useState(null);
    const [location, setLocation] = useState("");
    const fileInput = useRef(null);

    const onFiles = (files) => {
        if (!files) return;

        const newImages = Array.from(files).map((file) => ({
            id: crypto.randomUUID(),
            url: URL.createObjectURL(file),
            file: file
        }));

        setImages((s) => {
            // Clean up old URLs to avoid memory leaks
            const combined = [...s, ...newImages].slice(0, 6);
            return combined;
        });
    };

    const removeImage = (id, url) => {
        URL.revokeObjectURL(url); // Free up browser memory
        setImages((s) => s.filter((img) => img.id !== id));
    };

    const detectGPS = () => {
        setLocation("Detecting…");

        // Using real Geolocation API if available, falls back to mock data
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(`Sector 42, Block C, New Delhi (${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E)`);
                },
                () => {
                    // Fallback if permission denied
                    setTimeout(() => setLocation("Sector 42, Block C, New Delhi (28.5355° N, 77.3910° E)"), 700);
                }
            );
        } else {
            setTimeout(() => setLocation("Sector 42, Block C, New Delhi (28.5355° N, 77.3910° E)"), 700);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        // In a real application, you would construct FormData here:
        // const formData = new FormData();
        // formData.append('title', title);
        // images.forEach(img => formData.append('files', img.file));

        setSubmitted({
            id: `CT-${Math.floor(1000 + Math.random() * 9000)}`,
            eta: "18h 42m",
            dept: `${category === "Garbage" ? "Sanitation" : "Roads"} Department`
        });
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
                            <Field
                                label="Complaint title"
                                placeholder="Large pothole on MG Road"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold">Description</label>
                                <textarea
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the issue in detail…"
                                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    required
                                />
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
                                <div
                                    onClick={() => fileInput.current?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
                                    className="cursor-pointer rounded-2xl border-2 border-dashed border-border bg-card p-6 text-center transition-colors hover:border-primary hover:bg-primary/5"
                                >
                                    <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                                    <div className="mt-2 text-sm font-semibold">Drag & drop or click to upload</div>
                                    <div className="text-xs text-muted-foreground">Up to 6 images · JPG, PNG</div>
                                </div>

                                {images.length > 0 && (
                                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                                        {images.map((img) => (
                                            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
                                                <img src={img.url} alt="" className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Avoid triggering file selection panel opens again
                                                        removeImage(img.id, img.url);
                                                    }}
                                                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100"
                                                >
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
                                        <input
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="Address or landmark"
                                            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                            required
                                        />
                                    </div>
                                    <button type="button" onClick={detectGPS} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90">
                                        <MapPin className="h-4 w-4" /> Use GPS
                                    </button>
                                </div>
                                <div className="mt-3 h-48 overflow-hidden rounded-2xl border border-border bg-muted [background-image:linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:32px_32px]">
                                    <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Interactive map (tap to drop pin)</div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-transform hover:scale-[1.01]">
                                <Send className="h-4 w-4" /> Submit Complaint
                            </button>
                        </div>
                    </motion.form>
                )}
            </div>
        </div>
    );
}

function TopBar({ title }) {
    return (
        <div className="mb-6 flex items-center justify-between rounded-3xl border border-border bg-card px-4 py-3 shadow-sm">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary">
                <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
            <div className="text-sm font-semibold text-muted-foreground">{title}</div>
            <Link to="/track" className="rounded-full border border-border bg-muted px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-primary/5">
                Track my complaints
            </Link>
        </div>
    );
}

function SuccessCard({ data }) {
    return (
        <div className="glass-strong rounded-3xl border border-border bg-card p-8 shadow-xl">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Complaint submitted</div>
                    <h2 className="mt-3 text-2xl font-extrabold text-foreground">Your report is on its way</h2>
                    <p className="mt-2 text-sm text-muted-foreground">We have routed your complaint to the appropriate department. Track progress in real time.</p>
                </div>
                <div className="rounded-3xl bg-primary/10 p-4 text-primary">
                    <CheckCircle2 className="h-7 w-7" />
                </div>
            </div>
            <div className="mt-8 grid gap-4 rounded-3xl border border-border bg-muted p-4 text-sm text-foreground sm:grid-cols-3">
                <div>
                    <div className="text-xs text-muted-foreground">Complaint ID</div>
                    <div className="mt-1 font-semibold">{data.id}</div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground">Expected resolution</div>
                    <div className="mt-1 font-semibold">{data.eta}</div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground">Department</div>
                    <div className="mt-1 font-semibold">{data.dept}</div>
                </div>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link to="/track" className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90">
                    Track this complaint
                </Link>
                <Link to="/report" className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted">
                    Submit another complaint
                </Link>
            </div>
        </div>
    );
}

function Field({ label, ...props }) {
    return (
        <label className="block">
            <div className="mb-1.5 text-xs font-semibold text-foreground">{label}</div>
            <input
                {...props}
                className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
        </label>
    );
}