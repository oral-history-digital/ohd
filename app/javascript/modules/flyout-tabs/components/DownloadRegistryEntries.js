import React from 'react';
import PropTypes from 'prop-types';

import { t, pathBase } from 'lib/utils';

function DownloadRegistryEntries(props) {
    const { format, specificLocale } = props;

    return (
        <p>
            <a href={`${pathBase(props)}/registry_entries.${format}?lang=${specificLocale}`}>
                <i
                    className="fa fa-download flyout-content-ico"
                    title={t(props, 'download_registry_entries', { format: format, locale: specificLocale })}
                />
                <span>
                    {` ${t(props, 'download_registry_entries', { format: format, locale: specificLocale })}`}
                </span>
            </a>
        </p>
    );
}

DownloadRegistryEntries.propTypes = {
    format: PropTypes.string.isRequired,
    specificLocale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
};

export default DownloadRegistryEntries;
