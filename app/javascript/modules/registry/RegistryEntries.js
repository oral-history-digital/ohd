import classNames from 'classnames';
import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { PixelLoader } from 'modules/spinners';
import { InlineNotification, Modal } from 'modules/ui';
import PropTypes from 'prop-types';

import RegistryEntryContainer from './RegistryEntryContainer';
import RegistryEntryFormContainer from './RegistryEntryFormContainer';
import useRegistryEntries from './useRegistryEntries';

/**
 * Displays visible registry children and authorized creation controls.
 *
 * @param {Object} props - Child-list properties.
 * @param {string} [props.className] - Additional CSS class.
 * @param {Object} [props.registryEntryParent] - Parent entry whose children are shown.
 * @param {boolean} [props.root=false] - Applies root-list styling.
 * @returns {React.ReactElement} Child list, loading indicator, or project error.
 */
export default function RegistryEntries({
    className,
    registryEntryParent,
    root = false,
}) {
    const { t } = useI18n();
    const { dataLoaded, registryEntries, error } =
        useRegistryEntries(registryEntryParent);

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }

    return (
        <div className={className}>
            <ul
                className={classNames('RegistryEntryList', {
                    'RegistryEntryList--root': root,
                })}
            >
                {dataLoaded ? (
                    registryEntries.map((registryEntry) => (
                        <RegistryEntryContainer
                            key={registryEntry.id}
                            data={registryEntry}
                            registryEntryParent={registryEntryParent}
                        />
                    ))
                ) : (
                    <li>
                        <PixelLoader />
                    </li>
                )}
            </ul>
            <AuthorizedContent object={registryEntryParent} action="create">
                <Modal
                    title={t('edit.registry_entry.new')}
                    trigger={t('edit.registry_entry.new')}
                    triggerClassName="flyout-sub-tabs-content-ico-link"
                >
                    {(close) => (
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
