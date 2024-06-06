import PropTypes from 'prop-types';
import classNames from 'classnames';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { PixelLoader } from 'modules/spinners';
import { Modal } from 'modules/ui';
import RegistryEntryContainer from './RegistryEntryContainer';
import RegistryEntryFormContainer from './RegistryEntryFormContainer';
import useRegistryEntries from './useRegistryEntries';

export default function RegistryEntries({
    className,
    registryEntryParent,
    root = false,
}) {
    const { t } = useI18n();
    const { dataLoaded, registryEntries } = useRegistryEntries(registryEntryParent);

    return (
        <div className={className}>
            <ul className={classNames('RegistryEntryList', {
                'RegistryEntryList--root': root,
            })}>
                {dataLoaded ? (
                    registryEntries.map((registryEntry) => (
                        <RegistryEntryContainer
                            key={registryEntry.id}
                            data={registryEntry}
                            registryEntryParent={registryEntryParent}
                        />
                    ))
                ) : (<li><PixelLoader /></li>)}
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
