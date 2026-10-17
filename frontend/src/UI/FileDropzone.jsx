import React, { useEffect, useMemo, useRef, useState } from "react";
import { ImageUp, X, FileImage } from "lucide-react";

const ACCEPTED = ["image/jpeg", "image/png"];

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Drag-and-drop / click-to-browse image picker with preview and client-side validation.
export default function FileDropzone({ file, onFileChange, onInvalid, maxSizeMB = 10, disabled = false, label = "Drop an image here" }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl]);

  const pick = (f) => {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      onInvalid?.("That file type isn't supported. Please choose a JPG or PNG image.");
      return;
    }
    if (f.size > maxSizeMB * 1024 * 1024) {
      onInvalid?.(`That image is ${formatSize(f.size)}. Please choose one under ${maxSizeMB} MB.`);
      return;
    }
    onFileChange(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled) pick(e.dataTransfer.files?.[0]);
  };

  const clear = () => {
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const input = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPTED.join(",")}
      className="sr-only"
      disabled={disabled}
      onChange={(e) => {
        pick(e.target.files?.[0]);
        // allow picking the same file again later
        e.target.value = "";
      }}
    />
  );

  if (file) {
    return (
      <div className="animate-fade-up overflow-hidden rounded-box border border-base-300 bg-base-200">
        <div className="grid max-h-80 place-items-center bg-base-300/50">
          <img src={previewUrl} alt="Selected image preview" className="max-h-80 w-full object-contain" />
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <FileImage className="h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-base-content/60">{formatSize(file.size)}</p>
          </div>
          <label className={`btn btn-ghost btn-sm ${disabled ? "btn-disabled" : ""}`}>
            Change
            {input}
          </label>
          <button type="button" className="btn btn-ghost btn-sm btn-square" onClick={clear} disabled={disabled} aria-label="Remove image">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`flex h-56 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-box border-2 border-dashed px-6 text-center transition
        focus-within:ring-2 focus-within:ring-primary/40
        ${dragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-base-300 hover:border-primary/60 hover:bg-base-200"}`}
    >
      <span className={`grid h-14 w-14 place-items-center rounded-2xl transition ${dragging ? "bg-primary text-primary-content" : "bg-primary/10 text-primary"}`}>
        <ImageUp className="h-7 w-7" />
      </span>
      <div>
        <p className="font-semibold">{dragging ? "Release to upload" : label}</p>
        <p className="mt-1 text-sm text-base-content/60">
          or <span className="font-medium text-primary underline-offset-2 hover:underline">browse your files</span>
        </p>
      </div>
      <p className="text-xs text-base-content/50">JPG or PNG · up to {maxSizeMB} MB</p>
      {input}
    </label>
  );
}
