import { useState } from 'react';

import buildFormData from 'modules/api/buildFormData';
import { usePathBase } from 'modules/routes';
import useSWR from 'swr';

export function useInstanceSettings() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pathBase = usePathBase();
    const path = `${pathBase}/admin/instance-settings.json`;
    const { isLoading, data: response, error, mutate } = useSWR(path);

    async function updateInstanceSettings(params) {
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

    async function updateBreadcrumbLogo(variant, file) {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('instance_setting[file]', file);
        const res = await fetch(
            `${pathBase}/admin/instance-settings/breadcrumb-logo/${variant}.json`,
            {
                method: 'PUT',
                headers: { Accept: 'application/json' },
                body: formData,
            }
        );

        setIsSubmitting(false);
        if (!res.ok)
            throw new Error(`Request failed with status ${res.status}`);

        const updated = await res.json();
        mutate(updated, { revalidate: false });
        return updated;
    }

    async function removeBreadcrumbLogo(variant) {
        setIsSubmitting(true);

        const res = await fetch(
            `${pathBase}/admin/instance-settings/breadcrumb-logo/${variant}.json`,
            { method: 'DELETE', headers: { Accept: 'application/json' } }
        );

        setIsSubmitting(false);
        if (!res.ok)
            throw new Error(`Request failed with status ${res.status}`);

        const updated = await res.json();
        mutate(updated, { revalidate: false });
        return updated;
    }

    return {
        isLoading,
        isSubmitting,
        error,
        mutate,
        instanceSettings: response?.data,
        updateInstanceSettings,
        updateBreadcrumbLogo,
        removeBreadcrumbLogo,
    };
}

export default useInstanceSettings;
