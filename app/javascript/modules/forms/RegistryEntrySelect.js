import React from 'react';

import Select from './SelectContainer';
import { t } from 'modules/i18n';

export default class RegistryEntrySelect extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {selectedRegistryEntryId: (this.props.data && this.props.data[this.props.attribute]) || this.props.lowestAllowedRegistryEntryId};
        this.handleSelectedRegistryEntry = this.handleSelectedRegistryEntry.bind(this);
    }

    componentDidMount() {
        this.loadRegistryEntry(this.state.selectedRegistryEntryId);
        this.loadRegistryEntries();
    }

    componentDidUpdate() {
        this.loadRegistryEntry(this.state.selectedRegistryEntryId);
        this.loadRegistryEntries();
    }

    loadRegistryEntry(id) {
        if (
            id &&
            (
                !this.props.registryEntriesStatus[id] ||
                this.props.registryEntriesStatus[id] !== 'fetching'
            ) && (
                !this.props.registryEntries[id] ||
                (
                    this.props.registryEntries[id] &&
                    !this.props.registryEntries[id].associations_loaded
                )
            )
        ) {
            this.props.fetchData(this.props, 'registry_entries', id, null, 'with_associations=true');
        }
    }

    parentRegistryEntryId() {
        if (
            this.props.registryEntries[this.state.selectedRegistryEntryId] &&
            this.props.registryEntries[this.state.selectedRegistryEntryId].associations_loaded
        ) {
            return this.props.registryEntries[this.state.selectedRegistryEntryId].parent_ids[0];
        } else {
            return null;
        }
    }

    selectedRegistryEntry() {
        return this.props.registryEntries[this.state.selectedRegistryEntryId];
    }

    loadRegistryEntries() {
        if (
            this.state.selectedRegistryEntryId &&
            !this.props.registryEntriesStatus[`children_for_entry_${this.state.selectedRegistryEntryId}`] ||
            (
                this.props.registryEntriesStatus[this.state.selectedRegistryEntryId] &&
                this.props.registryEntriesStatus[this.state.selectedRegistryEntryId].split('-')[0] === 'reload'
            )
        ) {
            this.props.fetchData(this.props, 'registry_entries', null, null, `children_for_entry=${this.state.selectedRegistryEntryId}`);
    }
}

    registryEntries() {
        if (
            // check whether selected entry is loaded
            this.selectedRegistryEntry() &&
            this.selectedRegistryEntry().associations_loaded &&
            this.props.registryEntriesStatus[this.state.selectedRegistryEntryId]?.split('-')[0] === 'fetched' &&

            // check whether childEntries are loaded
            this.props.registryEntriesStatus[`children_for_entry_${this.state.selectedRegistryEntryId}`]?.split('-')[0] === 'fetched'
        ) {
            return this.selectedRegistryEntry().child_ids[this.props.locale]?.filter(rid => {
                return !this.props.inTranscript || this.props.project.hidden_transcript_registry_entry_ids.indexOf(rid.toString()) === -1
            }).map((id, index) => {
                return this.props.registryEntries[id];
            })
        } else {
            return [];
        }
    }

    handleSelectedRegistryEntry(name, value) {
        if (this.props.goDeeper) {
            if (!this.props.registryEntries[value] || !this.props.registryEntries[value].associations_loaded)
                this.props.fetchData(this.props, 'registry_entries', value, null, 'with_associations=true');
            this.setState({selectedRegistryEntryId: value});
        }
    }

    showSelectedRegistryEntry() {
        if (this.selectedRegistryEntry()) {
            return (
                <div>
                    <span><b>{t(this.props, 'selected_registry_entry') + ': '}</b></span>
                    <span>{this.selectedRegistryEntry().name[this.props.locale]}</span>
                </div>
            )
        } else {
            return null;
        }
    }

    goUp() {
        if (
            this.selectedRegistryEntry() &&
            this.selectedRegistryEntry().id !== this.props.lowestAllowedRegistryEntryId &&
            this.selectedRegistryEntry().associations_loaded
        ) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.registry_entry.go_up')}
                    onClick={() => this.setState({selectedRegistryEntryId: this.parentRegistryEntryId()})}
                >
                    {t(this.props, 'edit.registry_entry.go_up')}
                    <i className="fa fa-arrow-alt-up"></i>
                </div>
            )
        }
    }

    goDown() {
        if (
            this.selectedRegistryEntry() &&
            this.selectedRegistryEntry().associations_loaded &&
            this.selectedRegistryEntry().child_ids[this.props.locale].length > 0
        ) {
            return (
                <Select
                    attribute={this.props.attribute}
                    scope={this.props.scope}
                    values={this.registryEntries()}
                    withEmpty={true}
                    validate={function(v){return v !== ''}}
                    individualErrorMsg={'empty'}
                    handlechangecallback={this.handleSelectedRegistryEntry}
                    handleChange={this.props.handleChange}
                    handleErrors={this.props.handleErrors}
                    help={this.props.help}
                />
            )
        } else {
            return t(this.props, 'edit.registry_entry.no_more_children');
        }
    }

    render() {
        return (
            <div>
                {this.showSelectedRegistryEntry()}
                {this.goUp()}
                {this.goDown()}
            </div>
        );
    }
}
