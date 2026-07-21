import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ShieldCheck, User, UserCog, ShieldAlert, Mail, Lock, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/auth")({
    head: () => ({
        meta: [
            { title: "Sign in — Citizen360" },
            { name: "description", content: "Login or register for Citizen360 as a Citizen, Officer or Administrator." },
        ],
    }),
    component: AuthPage,
});

function AuthPage() {
    const [role, setRole] = useState("citizen");
    const [mode, setMode] = useState("login");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, register, loading, error, clearError, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate({ to: "/dashboard" });
        }
    }, [isAuthenticated]);

    const roles = [
        { id: "citizen", label: "Citizen", desc: "Report and track", icon: User },
        { id: "officer", label: "Officer", desc: "Resolve complaints", icon: UserCog },
        { id: "admin", label: "Administrator", desc: "Manage the city", icon: ShieldAlert },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        try {
            if (mode === "login") {
                await login(email, password, role);
            } else {
                await register(fullName, email, password, role);
            }
            navigate({ to: "/dashboard" });
        } catch {
            // Error is already set in auth context
        }
    };

    return (
        <div className="min-h-screen gradient-hero">
            <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 lg:grid-cols-2">
                <div className="hidden lg:block">
                    <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" /> Back to home
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-lg shadow-primary/30">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-lg font-extrabold">Citizen360</div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground">Smart Civic Portal</div>
                        </div>
                    </div>
                    <h1 className="mt-8 text-4xl font-extrabold tracking-tight md:text-5xl">
                        Welcome to a <span className="text-gradient">smarter city.</span>
                    </h1>
                    <p className="mt-4 max-w-md text-muted-foreground">
                        Report civic issues, track their resolution, and be part of the change your city needs.
                    </p>
                    <div className="mt-8 space-y-3">
                        {["Real-time complaint tracking", "AI-powered category detection", "Direct chat with officers"].map((f) => (
                            <div key={f} className="flex items-center gap-3 text-sm">
                                <span className="grid h-6 w-6 place-items-center rounded-full bg-success/15 text-success">✓</span>
                                {f}
                            </div>
                        ))}
                    </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-6 shadow-2xl shadow-primary/10 sm:p-8">
                    <Link to="/" className="mb-4 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground lg:hidden">
                        <ArrowLeft className="h-3.5 w-3.5" /> Home
                    </Link>
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1 text-sm font-semibold">
                        {["login", "register"].map((m) => (
                            <button key={m} onClick={() => { setMode(m); clearError(); }} className={`rounded-lg py-2 transition-colors ${mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                                {m === "login" ? "Sign in" : "Register"}
                            </button>
                        ))}
                    </div>

                    <div className="mt-5">
                        <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">I am a</div>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {roles.map((r) => (
                                <button key={r.id} onClick={() => setRole(r.id)} className={`rounded-xl border p-3 text-left transition-all ${role === r.id ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border bg-card hover:bg-muted"}`}>
                                    <r.icon className={`h-4 w-4 ${role === r.id ? "text-primary" : "text-muted-foreground"}`} />
                                    <div className="mt-2 text-xs font-bold">{r.label}</div>
                                    <div className="text-[10px] text-muted-foreground">{r.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                            {error}
                        </div>
                    )}

                    <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
                        {mode === "register" && (
                            <Field label="Full name" icon={User} placeholder="Priya Sharma" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                        )}
                        <Field label="Email" icon={Mail} placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <Field label="Password" icon={Lock} placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        {mode === "login" && (
                            <div className="flex items-center justify-between text-xs">
                                <label className="flex items-center gap-2 text-muted-foreground">
                                    <input type="checkbox" className="h-3.5 w-3.5 rounded border-border" /> Remember me
                                </label>
                                <a href="#" className="font-semibold text-primary hover:underline">Forgot password?</a>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.01] disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {loading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Please wait…</>
                            ) : (
                                <>{mode === "login" ? "Sign in" : "Create account"} <ArrowRight className="h-4 w-4" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-5 text-center text-xs text-muted-foreground">
                        By continuing, you agree to Citizen360's Terms of Use and Privacy Policy.
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function Field({ label, icon: Icon, ...props }) {
    return (
        <label className="block">
            <div className="mb-1.5 text-xs font-semibold text-foreground">{label}</div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <input {...props} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </div>
        </label>
    );
}