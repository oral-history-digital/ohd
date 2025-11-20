import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { getRegistryEntries } from 'modules/data';
import EntryReferenceGroups from './EntryReferenceGroups';
import OpenStreetMapLink from './OpenStreetMapLink';
import RegistryEntryBreadcrumbs from './RegistryEntryBreadcrumbs';

export default function RegistryEntryShow({
    registryEntryId,
    normDataLinks,
    onSubmit,
}) {
    const { locale } = useI18n();
    const registryEntries = useSelector(getRegistryEntries);
    const registryEntry = registryEntries[registryEntryId];
    const showOpenStreetMapLink =
        registryEntry.latitude + registryEntry.longitude !== 0;

    return (
        <div>
            <div>
                <RegistryEntryBreadcrumbs registryEntry={registryEntry} />
            </div>
            <h3>
                {registryEntry.name[locale]}
                {showOpenStreetMapLink && (
                    <small className="u-ml-small">
                        <OpenStreetMapLink
                            lat={registryEntry.latitude}
                            lng={registryEntry.longitude}
                        />
                    </small>
                )}
            </h3>
            <div className="small-right">{normDataLinks}</div>
            <p>{registryEntry.notes[locale]}</p>
            <EntryReferenceGroups
                registryEntry={registryEntry}
                onSubmit={onSubmit}
            />
        </div>
    );
}

RegistryEntryShow.propTypes = {
    normDataLinks: PropTypes.object,
    registryEntryId: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
