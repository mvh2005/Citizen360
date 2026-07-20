import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();

const rootElement = document.getElementById("root");

if (rootElement && !rootElement.innerHTML) {
    const root = createRoot(rootElement);
    root.render(
        <QueryClientProvider client={ router.context.queryClient } >
    <RouterProvider router={ router } />
    </QueryClientProvider>
    );
}
