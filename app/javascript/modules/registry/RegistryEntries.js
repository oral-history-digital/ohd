import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { PixelLoader } from 'modules/spinners';
import { Modal } from 'modules/ui';
import { getIsLoggedIn } from 'modules/user';
import RegistryEntryContainer from './RegistryEntryContainer';
import RegistryEntryFormContainer from './RegistryEntryFormContainer';
import useRegistryEntries from './useRegistryEntries';

export default function RegistryEntries({
    className,
    registryEntryParent,
    root = false,
}) {
    const { t, locale } = useI18n();
    const { project } = useProject();
    const { isAuthorized } = useAuthorization();
    const isLoggedIn = useSelector(getIsLoggedIn);
    const { dataLoaded, registryEntries } = useRegistryEntries(registryEntryParent);

    function isHidden(aRegistryEntry) {
        if (hasAdminRights()) {
            return false;
        }

        return isAlwaysHidden(aRegistryEntry)
            || (isLoggedOut() && isHiddenWhenLoggedOut(aRegistryEntry));
    }

    function hasAdminRights() {
        return isAuthorized({ type: 'RegistryEntry' }, 'update');
    }

    function isAlwaysHidden(aRegistryEntry) {
        return project.hidden_registry_entry_ids?.includes(String(aRegistryEntry.id));
    }

    function isLoggedOut() {
        return !isLoggedIn;
    }

    function isHiddenWhenLoggedOut(aRegistryEntry) {
        return !isMarkedVisibleWhenLoggedOut(aRegistryEntry)
            && isOnFirstLevel(aRegistryEntry);
    }

    function isMarkedVisibleWhenLoggedOut(aRegistryEntry) {
        return project.logged_out_visible_registry_entry_ids?.includes(String(aRegistryEntry.id));
    }

    function isOnFirstLevel(aRegistryEntry) {
        return !!(aRegistryEntry.parent_registry_hierarchy_ids[project.root_registry_entry_id]);
    }

    return (
        <div className={className}>
            <ul className={classNames('RegistryEntryList', {
                'RegistryEntryList--root': root,
            })}>
                {dataLoaded ? (
                    registryEntryParent.child_ids[locale].map((id) => {
                        const registryEntry = registryEntries[id];

                        if (!registryEntry || isHidden(registryEntry)) {
                            return null;
                        }

                        return (
                            <RegistryEntryContainer
                                key={id}
                                data={registryEntry}
                                registryEntryParent={registryEntryParent}
                            />
                        );
                    })
                ) : (
                    <li><PixelLoader /></li>
                )}
            </ul>
            <AuthorizedContent object={{ type: 'RegistryEntry' }} action='create'>
                <Modal
                    title={t('edit.registry_entry.new')}
                    trigger={t('edit.registry_entry.new')}
                    triggerClassName="flyout-sub-tabs-content-ico-link"
                >
                    {close => (
                        <RegistryEntryFormContainer
                            registryEntryParent={registryEntryParent}
                            onSubmit={close}
                            onCancel={close}
                        />
                    )}
                </Modal>
            </AuthorizedContent>
        </div>
    );
}

RegistryEntries.propTypes = {
    className: PropTypes.string,
    root: PropTypes.bool,
    registryEntryParent: PropTypes.object,
};
