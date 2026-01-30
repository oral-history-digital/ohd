import { getRegistryEntries } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { getIsLoggedIn } from 'modules/user';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import EntryReferenceGroups from './EntryReferenceGroups';
import OpenStreetMapLink from './OpenStreetMapLink';
import RegistryEntryBreadcrumbs from './RegistryEntryBreadcrumbs';
import referenceCountTitle from './referenceCountTitle';

export default function RegistryEntryShow({
    registryEntryId,
    normDataLinks,
    onSubmit,
}) {
    const { t, locale } = useI18n();
    const registryEntries = useSelector(getRegistryEntries);
    const registryEntry = registryEntries[registryEntryId];
    const showOpenStreetMapLink =
        registryEntry.latitude + registryEntry.longitude !== 0;
    const isLoggedIn = useSelector(getIsLoggedIn);

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
            {isLoggedIn && registryEntry.registry_references_count > 0 ? (
                <EntryReferenceGroups
                    registryEntry={registryEntry}
                    onSubmit={onSubmit}
                />
            ) : (
                <h4>
                    {referenceCountTitle(
                        t,
                        registryEntry.registry_references_count
                    )}
                </h4>
            )}
        </div>
    );
}

RegistryEntryShow.propTypes = {
    normDataLinks: PropTypes.object,
    registryEntryId: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
