import { useState } from 'react';

import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { ConfirmationModal } from 'modules/ui';
import PropTypes from 'prop-types';

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ['.png', '.svg', 'image/png', 'image/svg+xml'];

export default function BreadcrumbLogoForm({
    instanceSettings,
    isSubmitting,
    onRemove,
    onUpload,
}) {
    const { t } = useI18n();
    const [notification, setNotification] = useState(null);
    const [removeVariant, setRemoveVariant] = useState(null);

    function currentFile(url, label) {
        return url ? { name: label, url } : [];
    }

    const elements = [
        {
            attribute: 'breadcrumb_logo',
            elementType: 'fileInput',
            label: t('edit.instance.breadcrumb_logos.umbrella'),
            currentFiles: currentFile(
                instanceSettings.breadcrumb_logo_url,
                t('edit.instance.breadcrumb_logos.umbrella')
            ),
            accept: ACCEPTED_FILE_TYPES,
            maxSize: MAX_FILE_SIZE,
            preview: 'image',
            help: t('edit.instance.breadcrumb_logos.help'),
            onRemoveCurrent: () => setRemoveVariant('breadcrumb_logo'),
        },
        {
            attribute: 'secondary_breadcrumb_logo',
            elementType: 'fileInput',
            label: t('edit.instance.breadcrumb_logos.projects'),
            currentFiles: currentFile(
                instanceSettings.secondary_breadcrumb_logo_url,
                t('edit.instance.breadcrumb_logos.projects')
            ),
            accept: ACCEPTED_FILE_TYPES,
            maxSize: MAX_FILE_SIZE,
            preview: 'image',
            help: t('edit.instance.breadcrumb_logos.help'),
            onRemoveCurrent: () =>
                setRemoveVariant('secondary_breadcrumb_logo'),
        },
    ];

    async function upload({ instance_setting: values }) {
        // Filter out any values that are not files (e.g., null or undefined)
        const uploads = Object.entries(values).filter(
            ([, file]) => file instanceof File
        );

        try {
            for (const [variant, file] of uploads) {
                await onUpload(variant, file);
            }
            setNotification({
                variant: 'success',
                title: t('edit.instance.notification.success.title'),
            });
        } catch (error) {
            setNotification({
                variant: 'error',
                title: t('edit.instance.notification.error.title'),
                description: error.message,
            });
            throw error;
        }
    }

    async function remove() {
        try {
            await onRemove(removeVariant);
            setRemoveVariant(null);
            setNotification({
                variant: 'success',
                title: t('edit.instance.notification.success.title'),
            });
            return true;
        } catch (error) {
            setNotification({
                variant: 'error',
                title: t('edit.instance.notification.error.title'),
                description: error.message,
            });
            return false;
        }
    }

    return (
        <section className="InstanceBreadcrumbLogoForm">
            <Form
                disableIfUnchanged
                elements={elements}
                fetching={isSubmitting}
                notification={notification}
                onDismissNotification={() => setNotification(null)}
                onSubmit={upload}
                scope="instance_setting"
                values={{
                    breadcrumb_logo: null,
                    secondary_breadcrumb_logo: null,
                }}
            />
            <ConfirmationModal
                confirmColor="error"
                confirmText={t('edit.instance.breadcrumb_logos.remove_button')}
                isLoading={isSubmitting}
                isOpen={Boolean(removeVariant)}
                message={t('edit.instance.breadcrumb_logos.remove_warning')}
                onCancel={() => setRemoveVariant(null)}
                onConfirm={remove}
                title={t('edit.instance.breadcrumb_logos.remove_confirm')}
            />
        </section>
    );
}

BreadcrumbLogoForm.propTypes = {
    instanceSettings: PropTypes.shape({
        breadcrumb_logo_url: PropTypes.string,
        secondary_breadcrumb_logo_url: PropTypes.string,
    }).isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired,
};
