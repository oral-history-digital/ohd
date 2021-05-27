import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';

function DownloadRegistryEntries(props) {
    const { format, specificLocale } = props;
    const { t } = useI18n();

    return (
        <p>
            <a href={`${usePathBase()}/registry_entries.${format}?lang=${specificLocale}`}>
                <i
                    className="fa fa-download flyout-content-ico"
                    title={t('download_registry_entries', { format: format, locale: specificLocale })}
                />
                <span>
                    {` ${t('download_registry_entries', { format: format, locale: specificLocale })}`}
                </span>
            </a>
        </p>
    );
}

DownloadRegistryEntries.propTypes = {
    format: PropTypes.string.isRequired,
    specificLocale: PropTypes.string.isRequired,
};

export default DownloadRegistryEntries;
