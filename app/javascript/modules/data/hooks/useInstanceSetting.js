import { useState } from 'react';

import buildFormData from 'modules/api/buildFormData';
import { usePathBase } from 'modules/routes';
import useSWR from 'swr';

export function useInstanceSetting() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pathBase = usePathBase();
    const path = `${pathBase}/admin/instance-settings.json`;
    const { isLoading, data: response, error, mutate } = useSWR(path);

    async function updateInstanceSetting(params) {
        setIsSubmitting(true);

        const formData = new FormData();
        buildFormData(formData, params);

        const res = await fetch(path, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        });

        setIsSubmitting(false);

        if (!res.ok) {
            let message = `Request failed with status ${res.status}`;
            try {
                const body = await res.json();
                message = body?.error || body?.message || message;
            } catch (_e) {
                // Keep fallback message when response body is not JSON.
            }

            throw new Error(message);
        }

        const updated = await res.json();
        mutate(updated, { revalidate: false });
        return updated;
    }

    return {
        isLoading,
        isSubmitting,
        error,
        mutate,
        instanceSetting: response?.data,
        updateInstanceSetting,
    };
}

export default useInstanceSetting;
