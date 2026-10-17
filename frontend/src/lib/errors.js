// Turns an axios error into a message a person can act on.
export function getErrorMessage(error) {
    if (!error?.response) {
        return "Can't reach the server. Check your connection and try again.";
    }
    const { status, data } = error.response;
    if (data?.message && typeof data.message === "string") return data.message;
    if (status === 413) return "That file is too large. Please choose a smaller image.";
    if (status >= 500) return "Something went wrong on our side. Please try again in a moment.";
    return "The request couldn't be completed. Please try again.";
}
