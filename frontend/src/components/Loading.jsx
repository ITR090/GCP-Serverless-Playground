import { useEffect, useState } from "react";

// Shows a spinner with stage messages that advance while the request is in flight.
const Loading = ({ messages = ["Working on it…"], interval = 2500 }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (messages.length < 2) return;
        const t = setInterval(() => setIndex((i) => Math.min(i + 1, messages.length - 1)), interval);
        return () => clearInterval(t);
    }, [messages, interval]);

    return (
        <div role="status" className="animate-fade-up flex flex-col items-center gap-4 rounded-box border border-base-300 bg-base-100 px-6 py-10 text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="font-medium">{messages[index]}</p>
            {messages.length > 1 && (
                <ul className="steps steps-horizontal w-full max-w-md text-xs">
                    {messages.map((m, i) => (
                        <li key={m} className={`step ${i <= index ? "step-primary" : ""}`}></li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Loading
