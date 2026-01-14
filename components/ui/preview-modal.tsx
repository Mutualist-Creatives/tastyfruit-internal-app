"use client";

import React, { useState } from "react";
import { X, Monitor, Smartphone, Eye, ExternalLink } from "lucide-react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onPublish?: () => void;
  publishLabel?: string;
  isPublishing?: boolean;
}

export default function PreviewModal({
  isOpen,
  onClose,
  title,
  children,
  onPublish,
  publishLabel = "Publish",
  isPublishing = false,
}: PreviewModalProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800">
                Preview: {title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("desktop")}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === "desktop"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </button>
                <button
                  onClick={() => setViewMode("mobile")}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === "mobile"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </button>
              </div>

              {/* Publish Button */}
              {onPublish && (
                <button
                  onClick={onPublish}
                  disabled={isPublishing}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  {isPublishing ? "Publishing..." : publishLabel}
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex items-center justify-center p-6 bg-slate-50">
              <div
                className={`bg-white shadow-lg transition-all duration-300 ${
                  viewMode === "desktop"
                    ? "w-full max-w-4xl h-full rounded-lg"
                    : "w-80 h-[600px] rounded-[2rem] border-8 border-slate-800"
                }`}
              >
                <div className="h-full overflow-y-auto">
                  {React.cloneElement(children as React.ReactElement<any>, {
                    viewMode,
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-slate-50 text-center">
            <p className="text-sm text-slate-500">
              Preview menampilkan tampilan konten seperti yang akan dilihat
              pengunjung
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
