import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { PixelLoader } from 'modules/spinners';
import { AuthorizedContent, admin } from 'modules/auth';
import { Modal } from 'modules/ui';
import { t } from 'modules/i18n';
import RegistryEntryContainer from './RegistryEntryContainer';
import RegistryEntryFormContainer from './RegistryEntryFormContainer';
import RegistryEntryFromNormDataFormContainer from './RegistryEntryFromNormDataFormContainer';

export default class RegistryEntries extends Component {
    componentDidMount() {
        this.loadWithAssociations();
        this.loadRegistryEntries();
    }

    componentDidUpdate() {
        this.loadWithAssociations();
        this.loadRegistryEntries();
    }

    loadWithAssociations() {
        if (
            this.props.registryEntryParent &&
            !this.props.registryEntryParent.associations_loaded &&
            this.props.registryEntriesStatus[this.props.registryEntryParent.id] !== 'fetching'
        ) {
            this.props.fetchData(this.props, 'registry_entries', this.props.registryEntryParent.id, null, 'with_associations=true');
        }
    }

    loadRegistryEntries() {
        if (
            this.props.projectId &&
            this.props.registryEntryParent &&
            this.props.registryEntryParent.associations_loaded &&
            !this.props.registryEntriesStatus[`children_for_entry_${this.props.registryEntryParent.id}`]
        ) {
            this.props.fetchData(this.props, 'registry_entries', null, null, `children_for_entry=${this.props.registryEntryParent.id}`);
        }
    }

    hideRegistryEntry(registryEntry) {
        if (
            this.props.project.hidden_registry_entry_ids?.indexOf(registryEntry.id.toString()) > -1 &&
            !admin(this.props, {type: 'RegistryEntry'}, 'update')
        ) {
            return true;
        }

        if (
            this.props.project.logged_out_visible_registry_entry_ids?.indexOf(registryEntry.id.toString()) === -1 &&
            !!registryEntry.parent_registry_hierarchy_ids[this.props.project.root_registry_entry_id] &&
            !this.props.isLoggedIn
        ) {
            return true;
        }

        return false;
    }

    registryEntries() {
        if (
            this.props.registryEntryParent &&
            this.props.registryEntriesStatus[`children_for_entry_${this.props.registryEntryParent.id}`] &&
            this.props.registryEntriesStatus[`children_for_entry_${this.props.registryEntryParent.id}`].split('-')[0] === 'fetched' &&
            this.props.registryEntryParent.associations_loaded
        ) {
            return this.props.registryEntryParent.child_ids[this.props.locale].map((id) => {
                let registryEntry = this.props.registryEntries[id]

                if (registryEntry && !this.hideRegistryEntry(registryEntry)) {
                    return (
                        <RegistryEntryContainer
                            key={id}
                            data={registryEntry}
                            registryEntryParent={this.props.registryEntryParent}
                        />
                    );
                }
            })
        } else {
            return <li><PixelLoader /></li>
        }
    }

    addRegistryEntry(component, titlePart) {
        return (
            <AuthorizedContent object={{type: 'RegistryEntry'}} action='create'>
                <Modal
                    title={t(this.props, `edit.registry_entry.${titlePart}`)}
                    trigger={t(this.props, `edit.registry_entry.${titlePart}`)}
                    triggerClassName="flyout-sub-tabs-content-ico-link"
                >
                    { close => createElement(component,
                        {
                            registryEntryParent: this.props.registryEntryParent,
                            onSubmit: close,
                            onCancel: close,
                        }
                    ) }
                </Modal>
            </AuthorizedContent>
        );
    }

    render() {
        return (
            <div className={this.props.className}>
                <ul className={classNames('RegistryEntryList', {
                    'RegistryEntryList--root': this.props.root,
                })}>
                    {this.registryEntries()}
                </ul>
                {this.addRegistryEntry(RegistryEntryFormContainer, 'new')}
                {this.addRegistryEntry(RegistryEntryFromNormDataFormContainer, 'from_norm_data')}
            </div>
        )
    }
}

RegistryEntries.propTypes = {
    root: PropTypes.bool.isRequired,
};

RegistryEntries.defaultProps = {
    root: false,
};
