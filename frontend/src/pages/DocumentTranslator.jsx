import { Languages, ImageUp, ScanText, Sparkles, ArrowRight, RotateCcw, Lightbulb, Zap } from "lucide-react";
import Card from "../UI/Card";
import FileDropzone from "../UI/FileDropzone";
import PageHeader from "../UI/PageHeader";
import StepList from "../UI/StepList";
import CopyButton from "../UI/CopyButton";
import useImageJob from "../hooks/useImageJob";
// components
import ErrorFeedback from "../components/ErrorFeedback";
import Loading from "../components/Loading";

const STEPS = [
    { icon: ImageUp, title: "Upload an image", text: "A photo, screenshot or scan containing text (JPG or PNG)." },
    { icon: ScanText, title: "Text is extracted", text: "OCR reads every line, even from photos taken at an angle." },
    { icon: Languages, title: "Translated to Arabic", text: "Cloud Translation converts the text in seconds." },
    { icon: Zap, title: "Copy and use it", text: "See both versions side by side and copy either one." },
];

const LOADING_MESSAGES = ["Uploading your image…", "Reading the text with OCR…", "Translating to Arabic…"];

const parseTranslation = (data) => ({
    original: data?.message?.data?.contents?.[0] ?? "",
    translated: data?.message?.translatedText ?? "",
});

export default function DocumentTranslator() {
    const job = useImageJob("/documentTranslator", parseTranslation);
    const loading = job.status === "loading";

    return (
        <>
            <PageHeader icon={Languages} eyebrow="Cloud Vision OCR · Cloud Translation" title="Translate text inside images">
                Snap a sign, menu or document and get its text extracted and translated into Arabic, ready to copy.
            </PageHeader>

            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px]">
                <div className="space-y-6">
                    <Card>
                        <FileDropzone
                            file={job.file}
                            onFileChange={job.setFile}
                            onInvalid={job.showError}
                            disabled={loading}
                            label="Drop an image with text here"
                        />
                        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2 text-sm text-base-content/60">
                                <span className="badge badge-ghost">Auto-detect</span>
                                <ArrowRight className="h-4 w-4" />
                                <span className="badge badge-primary badge-soft">Arabic</span>
                            </div>
                            <div className="flex flex-col-reverse gap-2 sm:flex-row">
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
                                    {loading ? "Translating…" : "Extract & translate"}
                                </button>
                            </div>
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

                    {job.status === "success" && <TranslationResult result={job.result} onReset={job.reset} />}
                </div>

                <aside className="space-y-6">
                    <Card>
                        <h2 className="mb-4 font-semibold">How it works</h2>
                        <StepList steps={STEPS} />
                    </Card>
                    <div className="flex gap-3 rounded-box border border-warning/30 bg-warning/10 p-4 text-sm">
                        <Lightbulb className="h-5 w-5 shrink-0 text-warning" />
                        <p>Tip: keep the text in focus and avoid glare. One page per image gives the best results.</p>
                    </div>
                </aside>
            </div>
        </>
    )
}

function TranslationResult({ result, onReset }) {
    const { original, translated } = result;

    if (!original.trim()) {
        return (
            <div className="animate-fade-up alert alert-warning alert-soft">
                <ScanText className="h-5 w-5" />
                <div className="flex-1">
                    <p className="font-semibold">No text found</p>
                    <p className="text-sm">We couldn't find any readable text in that image. Try a sharper photo.</p>
                </div>
                <button type="button" className="btn btn-sm btn-ghost" onClick={onReset}>Try another</button>
            </div>
        );
    }

    return (
        <section className="animate-fade-up space-y-4" aria-live="polite">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Translation result</h2>
                <button type="button" className="btn btn-ghost btn-sm gap-1.5" onClick={onReset}>
                    <RotateCcw className="h-4 w-4" /> Translate another
                </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <TextPanel title="Original" text={original} />
                <TextPanel title="Arabic" text={translated} rtl highlight />
            </div>
        </section>
    );
}

function TextPanel({ title, text, rtl = false, highlight = false }) {
    return (
        <div className={`flex flex-col rounded-box border bg-base-100 shadow-sm ${highlight ? "border-primary/40" : "border-base-300"}`}>
            <div className="flex items-center justify-between border-b border-base-300 px-4 py-2.5">
                <h3 className={`text-sm font-semibold ${highlight ? "text-primary" : "text-base-content/70"}`}>{title}</h3>
                <CopyButton text={text} />
            </div>
            <p
                dir={rtl ? "rtl" : "auto"}
                lang={rtl ? "ar" : undefined}
                className={`max-h-96 overflow-y-auto whitespace-pre-wrap p-4 ${rtl ? "text-right text-lg leading-8" : "leading-7"}`}
            >
                {text}
            </p>
        </div>
    );
}
