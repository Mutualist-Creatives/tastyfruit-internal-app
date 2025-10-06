"use client";

import { useState, useRef } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  currentImageUrl?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

export default function FileUpload({
  onFileSelect,
  onFileRemove,
  currentImageUrl,
  accept = "image/*",
  maxSize = 5,
  className = "",
  isUploading = false,
  uploadProgress = 0,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    currentImageUrl || null
  );
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Clear previous errors
    setError(null);
    setIsProcessing(true);

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(
        `Ukuran file terlalu besar (${sizeInMB}MB). Maksimal ${maxSize}MB`
      );
      setIsProcessing(false);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      const fileType = file.type || "unknown";
      setError(
        `Format file tidak didukung (${fileType}). Hanya file gambar (PNG, JPG, GIF) yang diperbolehkan`
      );
      setIsProcessing(false);
      return;
    }

    // Validate specific image formats
    const allowedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedFormats.includes(file.type.toLowerCase())) {
      setError(
        `Format gambar tidak didukung. Gunakan PNG, JPG, GIF, atau WebP`
      );
      setIsProcessing(false);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadstart = () => {
      setIsProcessing(true);
    };
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setError(null);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setError("Gagal membaca file. Silakan coba file lain");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);

    onFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onFileRemove();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              aria-label="Hapus gambar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {/* Upload Progress Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
              <p className="text-white text-sm font-medium">
                Mengupload... {uploadProgress}%
              </p>
              {uploadProgress > 0 && (
                <div className="w-3/4 h-2 bg-white/30 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isProcessing
              ? "border-primary bg-blue-50 cursor-wait"
              : dragActive
              ? "border-primary bg-blue-50 cursor-pointer"
              : error
              ? "border-red-300 bg-red-50 cursor-pointer"
              : "border-slate-300 hover:border-slate-400 cursor-pointer"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={!isProcessing ? openFileDialog : undefined}
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className={`p-3 rounded-full ${
                isProcessing
                  ? "bg-blue-100"
                  : error
                  ? "bg-red-100"
                  : "bg-slate-100"
              }`}
            >
              {isProcessing ? (
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              ) : (
                <ImageIcon
                  className={`h-6 w-6 ${
                    error ? "text-red-600" : "text-slate-600"
                  }`}
                />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {isProcessing
                  ? "Memproses file..."
                  : "Klik untuk upload atau drag & drop"}
              </p>
              <p className="text-xs text-slate-500">
                PNG, JPG, GIF hingga {maxSize}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                openFileDialog();
              }}
              className="mt-1 text-xs underline hover:no-underline"
            >
              Coba file lain
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
