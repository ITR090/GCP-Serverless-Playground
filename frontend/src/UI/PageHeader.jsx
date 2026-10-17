import React from "react";

export default function PageHeader({ icon: Icon, eyebrow, title, children }) {
    return (
        <section className="bg-hero border-b border-base-300">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
                <div className="flex items-start gap-4">
                    <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary sm:grid">
                        <Icon className="h-6 w-6" />
                    </span>
                    <div className="max-w-2xl">
                        {eyebrow && <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>}
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
                        <p className="mt-3 text-base-content/70 sm:text-lg">{children}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
