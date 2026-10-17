import React, { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text, label = "Copy" }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const t = setTimeout(() => setCopied(false), 1800);
        return () => clearTimeout(t);
    }, [copied]);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text ?? "");
            setCopied(true);
        } catch {
            // clipboard can be blocked on insecure origins; fail quietly
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            disabled={!text}
            className={`btn btn-ghost btn-xs gap-1.5 ${copied ? "text-success" : "text-base-content/60"}`}
            aria-live="polite"
        >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : label}
        </button>
    );
}
