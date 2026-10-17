import { useState } from "react";
import api from "../lib/axios";
import { getErrorMessage } from "../lib/errors";

// Shared state machine for "pick an image -> POST it -> show result" pages.
// status: idle | loading | success | error
export default function useImageJob(endpoint, parseResponse) {
    const [file, setFileState] = useState(null);
    const [status, setStatus] = useState("idle");
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const setFile = (f) => {
        setFileState(f);
        setResult(null);
        setError(null);
        setStatus("idle");
    };

    const showError = (message) => {
        setError(message);
        setStatus("error");
    };

    const submit = async () => {
        if (!file) return;
        setStatus("loading");
        setError(null);
        setResult(null);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await api.post(endpoint, formData);
            setResult(parseResponse(response.data));
            setStatus("success");
        } catch (err) {
            showError(getErrorMessage(err));
        }
    };

    const reset = () => setFile(null);

    return { file, setFile, status, result, error, submit, reset, showError, dismissError: () => setStatus("idle") };
}
