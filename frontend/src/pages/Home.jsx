import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CloudUpload, Cpu, Database, ScanEye, ShieldCheck } from 'lucide-react';
import { NAV_ITEMS } from '../lib/nav.js';

const TOOLS = NAV_ITEMS.filter((item) => item.description);

const PIPELINE = [
    { icon: CloudUpload, title: "Upload", text: "Your image goes to a Cloud Storage bucket via the Cloud Run API." },
    { icon: Cpu, title: "Process", text: "A Cloud Function calls the Vision and Translation APIs." },
    { icon: Database, title: "Store", text: "Results are logged and persisted with Firestore and Cloud Logging." },
    { icon: ShieldCheck, title: "Deliver", text: "You get the result back with a short-lived signed URL." },
];

const STACK = ["Cloud Run", "Cloud Functions", "Cloud Storage", "Vision API", "Translation API", "Pub/Sub", "Firestore"];

const Home = () => {
    return (
        <>
            <section className="bg-hero border-b border-base-300">
                <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
                    <span className="badge badge-primary badge-soft mb-5 gap-1.5">
                        <ScanEye className="h-3.5 w-3.5" /> GCP Serverless Playground
                    </span>
                    <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
                        See what's in your images with{' '}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Google Cloud AI</span>
                    </h1>
                    <p className="mx-auto mt-5 max-w-2xl text-lg text-base-content/70">
                        Recognize world landmarks and translate text from photos in seconds, powered by a fully
                        serverless pipeline on Google Cloud.
                    </p>
                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                        {TOOLS.map(({ to, label, icon: Icon }, i) => (
                            <Link key={to} to={to} className={`btn btn-lg gap-2 ${i === 0 ? 'btn-primary' : 'btn-outline'}`}>
                                <Icon className="h-5 w-5" /> {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-14">
                <h2 className="text-2xl font-bold tracking-tight">Choose a tool</h2>
                <p className="mt-1 text-base-content/60">Each one takes a single JPG or PNG image.</p>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {TOOLS.map(({ to, label, icon: Icon, description }) => (
                        <Link
                            key={to}
                            to={to}
                            className="group rounded-box border border-base-300 bg-base-100 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
                        >
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-content">
                                <Icon className="h-6 w-6" />
                            </span>
                            <h3 className="mt-4 text-lg font-semibold">{label}</h3>
                            <p className="mt-1 text-base-content/70">{description}</p>
                            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                                Get started <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="border-y border-base-300 bg-base-100">
                <div className="mx-auto max-w-6xl px-4 py-14">
                    <h2 className="text-2xl font-bold tracking-tight">How it works behind the scenes</h2>
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {PIPELINE.map(({ icon: Icon, title, text }, i) => (
                            <div key={title} className="relative">
                                <div className="flex items-center gap-3">
                                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-base-200 text-primary">
                                        <Icon className="h-5 w-5" />
                                    </span>
                                    <span className="text-xs font-semibold text-base-content/40">STEP {i + 1}</span>
                                </div>
                                <h3 className="mt-3 font-semibold">{title}</h3>
                                <p className="mt-1 text-sm text-base-content/60">{text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 flex flex-wrap gap-2">
                        {STACK.map((s) => <span key={s} className="badge badge-outline">{s}</span>)}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home;
