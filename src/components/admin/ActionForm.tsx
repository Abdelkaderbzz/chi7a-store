"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";

export type ActionState = {
  success?: boolean;
  error?: string;
  message?: string;
} | null | undefined;

export function ActionForm({ 
  action, 
  children, 
  className 
}: { 
  action: (prevState: any, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className={className}>
      {children}
    </form>
  );
}

export function SubmitButton({ children, className }: { children: React.ReactNode, className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "جاري المعالجة..." : children}
    </button>
  );
}

export function DeleteButton({ action }: { action: (prevState: any, formData: FormData) => Promise<ActionState> }) {
  const [state, formAction] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) toast.success(state.message);
    if (state?.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction}>
      <SubmitDelete />
    </form>
  );
}

function SubmitDelete() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="text-red-400 hover:text-red-600 p-2 disabled:opacity-50 transition-opacity">
      <Trash2 size={16} />
    </button>
  );
}
