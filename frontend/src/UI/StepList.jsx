import React from "react";

// steps: [{ icon, title, text }]
export default function StepList({ steps }) {
    return (
        <ol className="space-y-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="flex gap-3">
                    <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-base-200 text-primary">
                        <Icon className="h-4 w-4" />
                        <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-content">
                            {i + 1}
                        </span>
                    </span>
                    <div>
                        <p className="font-medium">{title}</p>
                        <p className="text-sm text-base-content/60">{text}</p>
                    </div>
                </li>
            ))}
        </ol>
    )
}
