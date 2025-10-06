"use client";

import { useState, useCallback } from "react";
import { showToast, handleApiError, handleApiSuccess } from "@/lib/toast";

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T = any>(initialData: T | null = null) {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<T>, options: UseApiOptions = {}) => {
      const {
        onSuccess,
        onError,
        successMessage,
        errorMessage = "Terjadi kesalahan",
        showSuccessToast = true,
        showErrorToast = true,
      } = options;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiCall();

        setState({
          data: result,
          loading: false,
          error: null,
        });

        if (successMessage && showSuccessToast) {
          handleApiSuccess(successMessage);
        }

        onSuccess?.(result);
        return result;
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.error || error?.message || errorMessage;

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));

        if (showErrorToast) {
          handleApiError(error, errorMessage);
        }

        onError?.(error);
        throw error;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook khusus untuk operasi CRUD
export function useCrudApi<T = any>() {
  const createApi = useApi<T>();
  const updateApi = useApi<T>();
  const deleteApi = useApi<boolean>();

  const create = useCallback(
    (apiCall: () => Promise<T>, options: UseApiOptions = {}) => {
      return createApi.execute(apiCall, {
        successMessage: "Data berhasil ditambahkan",
        ...options,
      });
    },
    [createApi]
  );

  const update = useCallback(
    (apiCall: () => Promise<T>, options: UseApiOptions = {}) => {
      return updateApi.execute(apiCall, {
        successMessage: "Data berhasil diperbarui",
        ...options,
      });
    },
    [updateApi]
  );

  const remove = useCallback(
    (apiCall: () => Promise<boolean>, options: UseApiOptions = {}) => {
      return deleteApi.execute(apiCall, {
        successMessage: "Data berhasil dihapus",
        ...options,
      });
    },
    [deleteApi]
  );

  return {
    create: {
      ...createApi,
      execute: create,
    },
    update: {
      ...updateApi,
      execute: update,
    },
    delete: {
      ...deleteApi,
      execute: remove,
    },
  };
}

// Hook untuk fetch data dengan retry
export function useFetch<T = any>(initialData: T | null = null) {
  const api = useApi<T>(initialData);
  const [retryCount, setRetryCount] = useState(0);

  const fetch = useCallback(
    async (
      apiCall: () => Promise<T>,
      options: UseApiOptions & { maxRetries?: number } = {}
    ) => {
      const { maxRetries = 3, ...apiOptions } = options;

      try {
        const result = await api.execute(apiCall, {
          showErrorToast: retryCount >= maxRetries,
          ...apiOptions,
        });
        setRetryCount(0);
        return result;
      } catch (error) {
        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
          // Retry after delay
          setTimeout(() => {
            fetch(apiCall, options);
          }, 1000 * (retryCount + 1));
        }
        throw error;
      }
    },
    [api, retryCount]
  );

  const retry = useCallback(() => {
    setRetryCount(0);
  }, []);

  return {
    ...api,
    fetch,
    retry,
    retryCount,
  };
}
