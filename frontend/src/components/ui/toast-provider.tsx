"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "info" | "error";

interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  showToast: (input: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<ToastVariant, string> = {
  success: "border-[#b6e9c9] bg-[#effcf4] text-[#0f7a3f]",
  info: "border-[#b8dde2] bg-[#eff9fb] text-[#0a5f65]",
  error: "border-[#f2c1bc] bg-[#fff1ef] text-[#9c2e20]",
};

const variantIcons = {
  success: CheckCircle2,
  info: Info,
  error: XCircle,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(1);

  const showToast = useCallback((input: ToastInput) => {
    const id = nextId.current;
    nextId.current += 1;

    const toast: ToastMessage = {
      id,
      title: input.title,
      description: input.description,
      variant: input.variant ?? "info",
    };

    setToasts((current) => [...current, toast]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[70] flex w-[min(94vw,24rem)] flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = variantIcons[toast.variant];

          return (
            <div
              key={toast.id}
              className={cn(
                "rounded-2xl border px-4 py-3 shadow-[0_14px_40px_-24px_rgba(0,0,0,0.45)] backdrop-blur toast-enter",
                variantStyles[toast.variant],
              )}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description ? (
                    <p className="text-xs opacity-85">{toast.description}</p>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
