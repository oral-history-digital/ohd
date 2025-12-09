import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { FaDownload } from 'react-icons/fa';

function DownloadRegistryEntries(props) {
    const { format, specificLocale } = props;
    const { t } = useI18n();

    return (
        <p>
            <a
                href={`${usePathBase()}/registry_entries.${format}?lang=${specificLocale}`}
            >
                <FaDownload
                    className="Icon Icon--primary"
                    title={t('download_registry_entries', {
                        format: format,
                        locale: specificLocale,
                    })}
                />{' '}
                {t('download_registry_entries', {
                    format: format,
                    locale: specificLocale,
                })}
            </a>
        </p>
    );
}

DownloadRegistryEntries.propTypes = {
    format: PropTypes.string.isRequired,
    specificLocale: PropTypes.string.isRequired,
};

export default DownloadRegistryEntries;
