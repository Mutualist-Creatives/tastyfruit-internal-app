import { AlertTriangle, RefreshCw, Wifi } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  showRetry?: boolean;
}

export function ErrorState({
  title = "Terjadi Kesalahan",
  message = "Tidak dapat memuat data. Silakan coba lagi.",
  onRetry,
  retryLabel = "Coba Lagi",
  showRetry = true,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-2 text-center">
        {title}
      </h3>

      <p className="text-sm text-slate-600 mb-6 text-center max-w-md">
        {message}
      </p>

      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          {retryLabel}
        </button>
      )}
    </div>
  );
}

export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Koneksi Bermasalah"
      message="Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi."
      onRetry={onRetry}
      retryLabel="Coba Lagi"
    />
  );
}

export function NotFoundErrorState({
  title = "Data Tidak Ditemukan",
  message = "Data yang Anda cari tidak ditemukan atau telah dihapus.",
  onBack,
}: {
  title?: string;
  message?: string;
  onBack?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl mb-4">🔍</div>

      <h3 className="text-lg font-semibold text-slate-900 mb-2 text-center">
        {title}
      </h3>

      <p className="text-sm text-slate-600 mb-6 text-center max-w-md">
        {message}
      </p>

      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Kembali
        </button>
      )}
    </div>
  );
}

export function UnauthorizedErrorState({ onLogin }: { onLogin?: () => void }) {
  return (
    <ErrorState
      title="Akses Ditolak"
      message="Anda tidak memiliki izin untuk mengakses halaman ini. Silakan login kembali."
      onRetry={onLogin}
      retryLabel="Login"
    />
  );
}

export function ServerErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Server Bermasalah"
      message="Terjadi kesalahan pada server. Tim kami sedang memperbaikinya. Silakan coba lagi nanti."
      onRetry={onRetry}
      retryLabel="Coba Lagi"
    />
  );
}

// Inline Error Component untuk form fields
export function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

// Banner Error untuk top-level errors
export function ErrorBanner({
  message,
  onDismiss,
  onRetry,
  type = "error",
}: {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
  type?: "error" | "warning" | "info";
}) {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icons = {
    error: AlertTriangle,
    warning: AlertTriangle,
    info: Wifi,
  };

  const Icon = icons[type];

  return (
    <div className={`border rounded-lg p-4 mb-6 ${styles[type]}`}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm underline hover:no-underline"
            >
              Coba Lagi
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-sm underline hover:no-underline"
            >
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
