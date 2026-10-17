import { CircleAlert, RotateCcw } from "lucide-react";

const ErrorFeedback = ({ message, onRetry, onDismiss }) => {
    return (
        <div role="alert" className="animate-fade-up alert alert-error alert-soft items-start">
            <CircleAlert className="h-5 w-5 shrink-0" />
            <div className="flex-1">
                <p className="font-semibold">We couldn't process that image</p>
                <p className="text-sm opacity-90">{message}</p>
            </div>
            <div className="flex gap-1">
                {onRetry && (
                    <button type="button" className="btn btn-sm btn-ghost gap-1" onClick={onRetry}>
                        <RotateCcw className="h-4 w-4" /> Retry
                    </button>
                )}
                {onDismiss && (
                    <button type="button" className="btn btn-sm btn-ghost" onClick={onDismiss}>
                        Dismiss
                    </button>
                )}
            </div>
        </div>
    )
}

export default ErrorFeedback;
