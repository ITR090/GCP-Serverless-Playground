import React from "react";
import { Landmark, ImageUp, ScanSearch, MapPin, Globe, Sparkles, ExternalLink, RotateCcw, Lightbulb } from "lucide-react";
import Card from "../UI/Card";
import FileDropzone from "../UI/FileDropzone";
import PageHeader from "../UI/PageHeader";
import StepList from "../UI/StepList";
import useImageJob from "../hooks/useImageJob";
// components
import ErrorFeedback from "../components/ErrorFeedback";
import Loading from "../components/Loading";

const STEPS = [
    { icon: ImageUp, title: "Upload a clear photo", text: "A sharp, well-lit shot of the landmark works best." },
    { icon: ScanSearch, title: "AI recognizes it", text: "Cloud Vision compares it against thousands of known places." },
    { icon: MapPin, title: "See it on the map", text: "Get the name, confidence score and exact coordinates." },
];

const LOADING_MESSAGES = ["Uploading your photo…", "Analyzing with Cloud Vision…", "Locating the landmark…"];

const parseLandmark = (data) => {
    const landmark = data?.message?.data?.[0] ?? {};
    const latLng = landmark.locations?.[0]?.latLng;
    return {
        name: landmark.description,
        score: typeof landmark.score === "number" ? landmark.score : null,
        lat: latLng?.latitude,
        lng: latLng?.longitude,
        imageUrl: data?.url,
    };
};

export default function LandMarkDetection() {
    const job = useImageJob("/uploadLandmark", parseLandmark);
    const loading = job.status === "loading";

    return (
        <>
            <PageHeader icon={Landmark} eyebrow="Cloud Vision · Landmark detection" title="Identify any landmark from a photo">
                Upload a picture of a famous monument, natural wonder or cityscape and we'll tell you what it is
                and where it is on the map.
            </PageHeader>

            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px]">
                <div className="space-y-6">
                    <Card>
                        <FileDropzone
                            file={job.file}
                            onFileChange={job.setFile}
                            onInvalid={job.showError}
                            disabled={loading}
                            label="Drop a landmark photo here"
                        />
                        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            {job.file && !loading && (
                                <button type="button" className="btn btn-ghost" onClick={job.reset}>Clear</button>
                            )}
                            <button
                                type="button"
                                className="btn btn-primary sm:min-w-44"
                                onClick={job.submit}
                                disabled={!job.file || loading}
                            >
                                {loading ? <span className="loading loading-spinner loading-sm" /> : <Sparkles className="h-4 w-4" />}
                                {loading ? "Detecting…" : "Detect landmark"}
                            </button>
                        </div>
                    </Card>

                    {loading && <Loading messages={LOADING_MESSAGES} />}

                    {job.status === "error" && (
                        <ErrorFeedback
                            message={job.error}
                            onRetry={job.file ? job.submit : undefined}
                            onDismiss={job.dismissError}
                        />
                    )}

                    {job.status === "success" && <LandmarkResult result={job.result} onReset={job.reset} />}
                </div>

                <aside className="space-y-6">
                    <Card>
                        <h2 className="mb-4 font-semibold">How it works</h2>
                        <StepList steps={STEPS} />
                    </Card>
                    <div className="flex gap-3 rounded-box border border-warning/30 bg-warning/10 p-4 text-sm">
                        <Lightbulb className="h-5 w-5 shrink-0 text-warning" />
                        <p>Tip: try a photo where the landmark fills most of the frame. Close-ups of people or crowds often won't match.</p>
                    </div>
                </aside>
            </div>
        </>
    )
}

function LandmarkResult({ result, onReset }) {
    const { name, score, lat, lng, imageUrl } = result;
    const hasCoords = lat != null && lng != null;
    const mapsLink = hasCoords ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : null;

    return (
        <section className="animate-fade-up overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm" aria-live="polite">
            <div className="grid md:grid-cols-2">
                {imageUrl && (
                    <img src={imageUrl} alt={name || "Uploaded landmark"} className="h-64 w-full object-cover md:h-full" />
                )}
                <div className="flex flex-col gap-4 p-6">
                    <div>
                        <span className="badge badge-success badge-soft gap-1">
                            <Sparkles className="h-3 w-3" /> Landmark found
                        </span>
                        <h2 className="mt-3 text-2xl font-bold">{name || "Unknown landmark"}</h2>
                    </div>

                    {score != null && (
                        <div>
                            <div className="mb-1 flex justify-between text-sm">
                                <span className="text-base-content/60">Confidence</span>
                                <span className="font-semibold">{Math.round(score * 100)}%</span>
                            </div>
                            <progress className="progress progress-primary w-full" value={Math.round(score * 100)} max="100" />
                        </div>
                    )}

                    {hasCoords && (
                        <div className="flex items-center gap-2 rounded-field bg-base-200 px-3 py-2 font-mono text-sm">
                            <Globe className="h-4 w-4 text-primary" />
                            {lat.toFixed(5)}, {lng.toFixed(5)}
                        </div>
                    )}

                    <div className="mt-auto flex flex-wrap gap-2">
                        {mapsLink && (
                            <a href={mapsLink} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm gap-1.5">
                                <ExternalLink className="h-4 w-4" /> Open in Google Maps
                            </a>
                        )}
                        <button type="button" className="btn btn-ghost btn-sm gap-1.5" onClick={onReset}>
                            <RotateCcw className="h-4 w-4" /> Try another photo
                        </button>
                    </div>
                </div>
            </div>
            {hasCoords && (
                <iframe
                    title={`Map of ${name || "landmark"}`}
                    src={`https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`}
                    className="h-72 w-full border-0 border-t border-base-300"
                    allowFullScreen
                    loading="lazy"
                />
            )}
        </section>
    );
}
