import { toast } from "sonner";

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 6000,
    });
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
    });
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};

// API Error Handler
export const handleApiError = (
  error: any,
  defaultMessage = "Terjadi kesalahan"
) => {
  console.error("API Error:", error);

  if (error?.response?.data?.error) {
    showToast.error("Error", error.response.data.error);
  } else if (error?.message) {
    showToast.error("Error", error.message);
  } else {
    showToast.error("Error", defaultMessage);
  }
};

// Success Handler
export const handleApiSuccess = (message: string, description?: string) => {
  showToast.success(message, description);
};
