
import { useState, useCallback } from 'react';

interface FetchOptions extends RequestInit {
    retries?: number;
    timeout?: number;
}

export function useSentinelApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const callApi = useCallback(async (url: string, options: FetchOptions = {}) => {
        const { retries = 3, timeout = 5000, ...fetchOptions } = options;
        setLoading(true);
        setError(null);

        let attempt = 0;
        while (attempt < retries) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                const response = await fetch(url, {
                    ...fetchOptions,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) throw new Error(`HTTP_${response.status}`);

                const data = await response.json();
                setLoading(false);
                return data;
            } catch (err: any) {
                attempt++;
                if (attempt === retries) {
                    const error = err.name === 'AbortError' ? new Error('REQUEST_TIMEOUT') : err;
                    setError(error);
                    setLoading(false);
                    throw error;
                }
                // Exponential backoff: 500ms, 1000ms, 2000ms...
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 250));
            }
        }
    }, []);

    return { callApi, loading, error };
}
