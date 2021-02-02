import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { PixelLoader } from 'modules/spinners';
import AuthorizedContent from 'bundles/archive/components/AuthorizedContent';
import { t, admin } from 'lib/utils';
import RegistryEntryContainer from './RegistryEntryContainer';
import RegistryEntryFormContainer from './RegistryEntryFormContainer';

export default class RegistryEntries extends React.Component {
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

    hideRegistryEntry(id) {
        if (
            this.props.project.hidden_registry_entry_ids &&
            this.props.project.hidden_registry_entry_ids.indexOf(id.toString()) !== -1 &&
            !admin(this.props, {type: 'RegistryEntry', action: 'update'})
        ) {
            return true;
        }
        else {
            return false;
        }
    }

    registryEntries() {
        if (
            this.props.registryEntryParent &&
            this.props.registryEntriesStatus[`children_for_entry_${this.props.registryEntryParent.id}`] &&
            this.props.registryEntriesStatus[`children_for_entry_${this.props.registryEntryParent.id}`].split('-')[0] === 'fetched' &&
            this.props.registryEntryParent.associations_loaded
        ) {
            return this.props.registryEntryParent.child_ids[this.props.locale].map((id, index) => {
                let registryEntry = this.props.registryEntries[id]

                if (registryEntry && !this.hideRegistryEntry(id)) {
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

    addRegistryEntry() {
        return (
            <AuthorizedContent object={{type: 'RegistryEntry', action: 'create'}}>
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.registry_entry.new'),
                        content: <RegistryEntryFormContainer registryEntryParent={this.props.registryEntryParent} />
                    })}
                >
                    {t(this.props, 'edit.registry_entry.new')}
                </div>
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
                {this.addRegistryEntry()}
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
