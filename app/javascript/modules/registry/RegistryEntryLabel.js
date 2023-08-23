import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';

export default function RegistryEntryLabel({
    registryEntry,
}) {
    const { t, locale } = useI18n();

    const localizedName = registryEntry.name[locale];
    const name = localizedName?.length > 0
        ? localizedName
        : (<i>{t('modules.registry.name_missing')}</i>);

    return (
        <span className="RegistryEntry-label">
            {name}
            <AuthorizedContent object={registryEntry} action='update'>
                {` (ID: ${registryEntry.id})`}
            </AuthorizedContent>
        </span>
    );
}

RegistryEntryLabel.propTypes = {
    registryEntry: PropTypes.object.isRequired,
};
