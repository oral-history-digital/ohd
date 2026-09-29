import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';

import { InstanceSettingsSection } from '../components';
import { BreadcrumbLogoForm } from '../forms';
import { useInstanceSettings } from '../hooks';

export default function BreadcrumbLogosSection() {
    const { t } = useI18n();
    const {
        error,
        instanceSettings,
        isLoading,
        isSubmitting,
        removeBreadcrumbLogo,
        updateBreadcrumbLogo,
    } = useInstanceSettings();

    return (
        <InstanceSettingsSection
            title={t('edit.instance.breadcrumb_logos.title')}
            description={t('edit.instance.breadcrumb_logos.description')}
        >
            {isLoading && <Spinner withPadding />}
            {!isLoading && error && <p>{error.message}</p>}
            {!isLoading && !error && instanceSettings && (
                <BreadcrumbLogoForm
                    instanceSettings={instanceSettings}
                    isSubmitting={isSubmitting}
                    onRemove={removeBreadcrumbLogo}
                    onUpload={updateBreadcrumbLogo}
                />
            )}
        </InstanceSettingsSection>
    );
}
