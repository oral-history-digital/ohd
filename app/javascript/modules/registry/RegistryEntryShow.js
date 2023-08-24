import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import EntryReferencesContainer from './EntryReferencesContainer';
import OpenStreetMapLink from './OpenStreetMapLink';
import RegistryEntryBreadcrumbs from './RegistryEntryBreadcrumbs';

export default function RegistryEntryShow({
    registryEntries,
    registryEntriesStatus,
    registryEntryId,
    normDataLinks,
    onSubmit,
    fetchData,
}) {
    const { locale } = useI18n();
    const { project, projectId } = useProject();
    const registryEntry = registryEntries[registryEntryId];
    const showOpenStreetMapLink = registryEntry.latitude + registryEntry.longitude !== 0;

    useEffect(() => {
        loadWithAssociations();
    });

    function loadWithAssociations() {
        const registryEntry = registryEntries[registryEntryId];

        if (
            (!registryEntry?.associations_loaded) &&
            registryEntriesStatus[registryEntryId] !== 'fetching'
        ) {
            fetchData({ project, projectId, locale }, 'registry_entries',
                registryEntryId, null, 'with_associations=true');
        }
    }

    if (!registryEntry?.associations_loaded) {
        return null;
    }

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
            <div className='small-right'>
                {normDataLinks}
            </div>
            <p>
                {registryEntry.notes[locale]}
            </p>
            <EntryReferencesContainer
                registryEntry={registryEntry}
                onSubmit={onSubmit}
            />
        </div>
    );
}

RegistryEntryShow.propTypes = {
    normDataLinks: PropTypes.object,
    registryEntries: PropTypes.object,
    registryEntriesStatus: PropTypes.object,
    registryEntryId: PropTypes.number.isRequired,
    fetchData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
