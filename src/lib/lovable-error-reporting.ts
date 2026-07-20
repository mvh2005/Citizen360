export interface LovableErrorContext {
    boundary?: string;
    [key: string]: any;
}

export function reportLovableError(
    error: Error,
    context?: LovableErrorContext
): void {
    console.error("[Lovable Error]", {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
    });

    // In production, you might send this to an error tracking service
    if (typeof window !== "undefined" && window.__LOVABLE_ERROR_HANDLER__) {
        window.__LOVABLE_ERROR_HANDLER__(error, context);
    }
}

declare global {
    interface Window {
        __LOVABLE_ERROR_HANDLER__?: (error: Error, context?: LovableErrorContext) => void;
    }
}
