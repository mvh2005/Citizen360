import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import {
    Outlet,
    Link,
    createRootRouteWithContext,
    useRouter,
    HeadContent,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="max-w-md text-center">
                <h1 className="text-7xl font-bold text-foreground">404</h1>
                <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ErrorComponent({ error, reset }) {
    console.error(error);
    const router = useRouter();
    useEffect(() => {
        reportLovableError(error, { boundary: "tanstack_root_error_component" });
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="max-w-md text-center">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                    This page didn't load
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Something went wrong on our end. You can try refreshing or head back home.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => {
                            router.invalidate();
                            reset();
                        }}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Try again
                    </button>
                    <a
                        href="/"
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                        Go home
                    </a>
                </div>
            </div>
        </div>
    );
}

export const Route = createRootRouteWithContext()({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { title: "Citizen360 — Smart Civic Complaint Management" },
            { name: "description", content: "Report civic issues instantly and track their resolution with complete transparency. A smart city platform for citizens, officers and administrators." },
            { name: "author", content: "Citizen360" },
            { property: "og:title", content: "Citizen360 — Smart Civic Complaint Management" },
            { property: "og:description", content: "Report civic issues instantly and track their resolution with complete transparency. A smart city platform for citizens, officers and administrators." },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:title", content: "Citizen360 — Smart Civic Complaint Management" },
            { name: "twitter:description", content: "Report civic issues instantly and track their resolution with complete transparency. A smart city platform for citizens, officers and administrators." },
            { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a658494a-5796-4206-bf37-dac9dd71a4f0/id-preview-e01ca6e2--ea01e287-44b4-484b-ad2a-37faf29f588a.lovable.app-1784452397219.png" },
            { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a658494a-5796-4206-bf37-dac9dd71a4f0/id-preview-e01ca6e2--ea01e287-44b4-484b-ad2a-37faf29f588a.lovable.app-1784452397219.png" },
        ],
        links: [
            {
                rel: "stylesheet",
                href: appCss,
            },
            { rel: "preconnect", href: "https://fonts.googleapis.com" },
            { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
            },
            { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
});

function RootShell({ children }) {
    return (
        <>
            <HeadContent />
            {children}
        </>
    );
}

function RootComponent() {
    const { queryClient } = Route.useRouteContext();

    return (
        <QueryClientProvider client={queryClient}>
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
        </QueryClientProvider>
    );
}