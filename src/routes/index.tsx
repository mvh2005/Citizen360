import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
    MapPin,
    Camera,
    Building2,
    BarChart3,
    Bell,
    Sparkles,
    Map as MapIcon,
    Construction,
    Trash2,
    Droplets,
    Zap,
    Waves,
    Trees,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    Clock,
    Users,
    FileText,
    Menu,
    X,
    Sun,
    Moon,
    Phone,
    Mail,
    Copy,
    Heart,
    Share2,
    Info,
} from "lucide-react";
import { useEffect, useState } from "react";

// Mock hero image - replace with actual image when available
const heroImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1200'%3E%3Crect fill='%23f3f4f6' width='1600' height='1200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-size='48' fill='%236b7280'%3ESmart City Hero Image%3C/text%3E%3C/svg%3E";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <Hero />
            <Stats />
            <Features />
            <Departments />
            <HowItWorks />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
}

function Navbar() {
    const [open, setOpen] = useState(false);
    const [dark, setDark] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
    }, [dark]);

    const nav = [
        { label: "Home", href: "#home" },
        { label: "Features", href: "#features" },
        { label: "Departments", href: "#departments" },
        { label: "About", href: "#how" },
        { label: "Contact", href: "#contact" },
    ];

    return (
        <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "py-2" : "py-4"}`}>
            <div className="mx-auto max-w-7xl px-4">
                <div className={`glass-strong flex items-center justify-between gap-4 rounded-2xl px-4 py-3 shadow-sm transition-all ${scrolled ? "shadow-md" : ""}`}>
                    <a href="#home" className="flex items-center gap-2">
                        <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-md shadow-primary/30">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div className="leading-tight">
                            <div className="text-sm font-extrabold tracking-tight">Citizen360</div>
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Smart Civic</div>
                        </div>
                    </a>

                    <nav className="hidden items-center gap-1 md:flex">
                        {nav.map((n) => (
                            <a key={n.label} href={n.href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                                {n.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <button onClick={() => setDark((d) => !d)} aria-label="Toggle theme" className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground">
                            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                        <Link to="/auth" className="hidden rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted md:inline-flex">
                            Login
                        </Link>
                        <Link to="/auth" className="hidden rounded-lg gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-transform hover:scale-[1.02] md:inline-flex">
                            Register
                        </Link>
                        <button onClick={() => setOpen((o) => !o)} className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card md:hidden" aria-label="Menu">
                            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
                {open && (
                    <div className="glass-strong mt-2 rounded-2xl p-3 md:hidden">
                        {nav.map((n) => (
                            <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                                {n.label}
                            </a>
                        ))}
                        <div className="mt-2 grid grid-cols-2 gap-2">
                            <Link to="/auth" className="rounded-lg border border-border bg-card px-3 py-2 text-center text-sm font-semibold">Login</Link>
                            <Link to="/auth" className="rounded-lg gradient-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground">Register</Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

function Hero() {
    return (
        <section id="home" className="relative overflow-hidden gradient-hero pt-32 pb-16 md:pt-40 md:pb-24">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(color-mix(in_oklab,var(--color-primary)_18%,transparent)_1px,transparent_1px)] [background-size:22px_22px]" />
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                        <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" />
                        Smart City Initiative · Government of India
                    </div>
                    <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                        Making Cities Better, <span className="text-gradient">One Complaint at a Time</span>
                    </h1>
                    <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                        Report civic issues instantly and track their resolution with complete transparency. Powered by AI, GPS and a network of dedicated officers.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link to="/report" className="group inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02]">
                            <FileText className="h-4 w-4" /> Report Complaint
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <Link to="/track" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted">
                            <MapIcon className="h-4 w-4" /> Track Complaint
                        </Link>
                    </div>
                    <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Verified by Municipal Corp.</div>
                        <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Secure & Private</div>
                        <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-warning" /> AI-Powered</div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }} className="relative">
                    <div className="glass-strong relative rounded-3xl p-3 shadow-2xl shadow-primary/10">
                        <img src={heroImage} alt="Smart city illustration" width={1600} height={1200} className="rounded-2xl" />
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass absolute -left-4 top-8 hidden rounded-2xl p-3 shadow-xl sm:flex sm:items-center sm:gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-success/15 text-success"><CheckCircle2 className="h-5 w-5" /></div>
                            <div>
                                <div className="text-xs text-muted-foreground">Complaint #CT-2087</div>
                                <div className="text-sm font-semibold">Resolved in 4h 12m</div>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass absolute -right-4 bottom-8 hidden rounded-2xl p-3 shadow-xl sm:flex sm:items-center sm:gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary"><MapPin className="h-5 w-5" /></div>
                            <div>
                                <div className="text-xs text-muted-foreground">Sector 42, Block C</div>
                                <div className="text-sm font-semibold">Officer en route</div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function Stats() {
    const items = [
        { label: "Total Complaints", value: "128,430", icon: FileText, tint: "text-primary bg-primary/10" },
        { label: "Resolved Issues", value: "112,879", icon: CheckCircle2, tint: "text-success bg-success/10" },
        { label: "Active Users", value: "48,201", icon: Users, tint: "text-warning bg-warning/10" },
        { label: "Avg. Resolution Time", value: "18h 42m", icon: Clock, tint: "text-primary bg-primary/10" },
    ];
    return (
        <section className="relative -mt-8 pb-8">
            <div className="mx-auto max-w-7xl px-4">
                <div className="glass-strong grid grid-cols-2 gap-4 rounded-3xl p-4 shadow-xl md:grid-cols-4 md:p-6">
                    {items.map((it, i) => (
                        <motion.div key={it.label} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border bg-card p-4">
                            <div className={`inline-grid h-10 w-10 place-items-center rounded-xl ${it.tint}`}><it.icon className="h-5 w-5" /></div>
                            <div className="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">{it.value}</div>
                            <div className="text-xs text-muted-foreground md:text-sm">{it.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Features() {
    const feats = [
        { icon: MapPin, title: "GPS Location Detection", desc: "Automatically pinpoint the exact location of any civic issue." },
        { icon: Camera, title: "Upload Photos", desc: "Attach evidence with multi-image uploads and instant preview." },
        { icon: Building2, title: "Auto Department Assignment", desc: "Complaints routed to the correct department in seconds." },
        { icon: BarChart3, title: "Live Complaint Tracking", desc: "Follow every stage from submission to resolution." },
        { icon: Bell, title: "SMS & Email Alerts", desc: "Never miss an update with real-time notifications." },
        { icon: Sparkles, title: "AI Category Detection", desc: "Our AI reads your photo and suggests the right category." },
        { icon: MapIcon, title: "Interactive Map", desc: "See what's happening in your neighborhood on a live map." },
    ];
    return (
        <section id="features" className="py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeading eyebrow="Features" title="Everything you need to fix your city" desc="From reporting to resolution — Citizen360 combines AI, maps and government workflows into a single, delightful experience." />
                <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {feats.map((f, i) => (
                        <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ delay: i * 0.05, duration: 0.4 }} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
                            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-125" />
                            <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-md shadow-primary/30"><f.icon className="h-5 w-5" /></div>
                            <h3 className="mt-4 text-lg font-bold tracking-tight">{f.title}</h3>
                            <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Departments() {
    const deps = [
        { icon: Construction, name: "Roads", desc: "Potholes, damage, signage", color: "text-primary bg-primary/10" },
        { icon: Trash2, name: "Sanitation", desc: "Garbage & waste collection", color: "text-success bg-success/10" },
        { icon: Droplets, name: "Water Supply", desc: "Leakage, shortage, quality", color: "text-primary bg-primary/10" },
        { icon: Zap, name: "Electricity", desc: "Street lights, outages", color: "text-warning bg-warning/10" },
        { icon: Waves, name: "Drainage", desc: "Blockages, flooding", color: "text-primary bg-primary/10" },
        { icon: Trees, name: "Parks & Gardens", desc: "Maintenance, greenery", color: "text-success bg-success/10" },
    ];
    return (
        <section id="departments" className="bg-muted/30 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeading eyebrow="Departments" title="Six departments. One platform." desc="Every complaint is intelligently routed to the right team so it gets resolved faster." />
                <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {deps.map((d, i) => (
                        <motion.div key={d.name} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="group rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                            <div className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl ${d.color}`}><d.icon className="h-6 w-6" /></div>
                            <div className="mt-3 text-sm font-bold">{d.name}</div>
                            <div className="mt-0.5 text-[11px] text-muted-foreground">{d.desc}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    const steps = [
        { n: "01", title: "Register Complaint", desc: "Create an account in seconds and log your issue.", icon: FileText },
        { n: "02", title: "Upload Image", desc: "Attach photos as evidence for faster verification.", icon: Camera },
        { n: "03", title: "Detect Location", desc: "One-tap GPS pins the exact spot on the map.", icon: MapPin },
        { n: "04", title: "Auto-Assign Dept.", desc: "AI routes to the correct municipal department.", icon: Building2 },
        { n: "05", title: "Officer Reviews", desc: "A dedicated officer accepts and begins work.", icon: Users },
        { n: "06", title: "Complaint Resolved", desc: "Get notified when the issue is fixed. Rate the outcome.", icon: CheckCircle2 },
    ];
    return (
        <section id="how" className="py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeading eyebrow="How It Works" title="From complaint to resolution in 6 steps" desc="A transparent, trackable process that keeps citizens informed and officers accountable." />
                <div className="relative mt-14">
                    <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
                        {steps.map((s, i) => (
                            <motion.div key={s.n} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="relative rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <div className="mx-auto -mt-10 grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-sm font-black text-primary-foreground shadow-md shadow-primary/30">{s.n}</div>
                                <div className="mt-4 flex items-center gap-2">
                                    <s.icon className="h-4 w-4 text-primary" />
                                    <div className="text-sm font-bold">{s.title}</div>
                                </div>
                                <p className="mt-1.5 text-xs text-muted-foreground">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Testimonials() {
    const items = [
        { name: "Priya Sharma", role: "Resident, Sector 21", quote: "I reported a broken street light at 9 PM. It was fixed by noon the next day. This platform actually works." },
        { name: "Rajeev Menon", role: "Sanitation Officer", quote: "The auto-routing and photo evidence save my team hours every day. We resolve 3x more complaints now." },
        { name: "Anita Verma", role: "Municipal Commissioner", quote: "Real-time dashboards give us a heatmap of citizen concerns. Governance has never been this transparent." },
    ];
    return (
        <section className="bg-muted/30 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeading eyebrow="Testimonials" title="Trusted by citizens & officers" desc="Real people, real results — a growing community fixing their cities together." />
                <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
                    {items.map((t, i) => (
                        <motion.div key={t.name} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-strong rounded-3xl p-6 shadow-lg">
                            <div className="flex gap-1 text-warning">
                                {"★★★★★".split("").map((s, idx) => (<span key={idx}>{s}</span>))}
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
                            <div className="mt-5 flex items-center gap-3">
                                <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                                    {t.name.split(" ").map((p) => p[0]).join("")}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">{t.name}</div>
                                    <div className="text-xs text-muted-foreground">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTA() {
    return (
        <section id="contact" className="py-20 md:py-28">
            <div className="mx-auto max-w-6xl px-4">
                <div className="relative overflow-hidden rounded-3xl gradient-primary p-10 text-primary-foreground shadow-2xl shadow-primary/30 md:p-16">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
                        <div>
                            <div className="text-xs font-medium uppercase tracking-widest opacity-80">Get started</div>
                            <h3 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Your city is one complaint away from getting better.</h3>
                            <p className="mt-3 max-w-xl text-sm opacity-90 md:text-base">Join 48,000+ citizens making a difference. Free, transparent, and always on your side.</p>
                        </div>
                        <div className="flex flex-wrap gap-3 md:justify-end">
                            <Link to="/report" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary shadow-lg transition-transform hover:scale-[1.02]">Report Now</Link>
                            <Link to="/auth" className="rounded-xl border border-white/40 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">Create Account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-4 py-14">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground"><ShieldCheck className="h-5 w-5" /></div>
                            <div className="text-sm font-extrabold">Citizen360</div>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">A Smart City initiative to make civic engagement simple, transparent and effective.</p>
                        <div className="mt-4 flex gap-2">
                            {[Copy, Heart, Share2, Info].map((I, i) => (
                                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><I className="h-4 w-4" /></a>
                            ))}
                        </div>
                    </div>
                    <FooterCol title="Quick Links" items={["Home", "Features", "Departments", "How it Works", "Testimonials"]} />
                    <FooterCol title="Emergency Contacts" items={["Police — 100", "Fire — 101", "Ambulance — 108", "Women Helpline — 1091", "Municipal — 1800-11-1234"]} />
                    <div>
                        <div className="text-sm font-bold">Get in touch</div>
                        <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                            <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +91 1800-11-1234</li>
                            <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> support@citizen360.gov.in</li>
                            <li className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Nirman Bhawan, New Delhi</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
                    <div>© {new Date().getFullYear()} Citizen360. A Government of India initiative.</div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-foreground">Privacy Policy</a>
                        <a href="#" className="hover:text-foreground">Terms of Use</a>
                        <a href="#" className="hover:text-foreground">Accessibility</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
    return (
        <div>
            <div className="text-sm font-bold">{title}</div>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
                {items.map((it) => (
                    <li key={it}><a href="#" className="hover:text-foreground">{it}</a></li>
                ))}
            </ul>
        </div>
    );
}

function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
    return (
        <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                {eyebrow}
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">{desc}</p>
        </div>
    );
}