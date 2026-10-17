import { Landmark, Languages, House } from "lucide-react";

// single source of truth for navbar + mobile drawer links
export const NAV_ITEMS = [
    { to: "/", label: "Home", icon: House, end: true },
    {
        to: "/landmark-detection",
        label: "Landmark Detection",
        icon: Landmark,
        description: "Upload a photo and find out which landmark it is, with its location on a map.",
    },
    {
        to: "/document-translator",
        label: "Text Translator",
        icon: Languages,
        description: "Extract text from an image with OCR and translate it into Arabic.",
    },
];
