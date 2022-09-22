import { Component } from 'react';
import { FaArrowUp } from 'react-icons/fa';

import Select from './SelectContainer';
import { t } from 'modules/i18n';

export default class RegistryEntrySelect extends Component {

    constructor(props, context) {
        super(props, context);
        const selectedRegistryEntryId = (this.props.data && this.props.data[this.props.attribute]) || this.props.project?.root_registry_entry_id;
        this.state = {
            selectedRegistryEntryId: selectedRegistryEntryId,
            valid: selectedRegistryEntryId !== this.props.project?.root_registry_entry_id,
        };

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
            this.setState({selectedRegistryEntryId: parseInt(value)});
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
        const valid = parseInt(this.state.selectedRegistryEntryId) !== this.props.project?.root_registry_entry_id;
        if (
            this.selectedRegistryEntry() &&
            parseInt(this.state.selectedRegistryEntryId) !== this.props.project?.root_registry_entry_id &&
            this.selectedRegistryEntry().associations_loaded
        ) {
            return (
                <button
                    type="button"
                    className="Button Button--transparent Button--icon"
                    title={t(this.props, 'edit.registry_entry.go_up')}
                    onClick={() => {
                        this.setState({
                            valid: valid,
                            selectedRegistryEntryId: this.parentRegistryEntryId(),
                        });
                        this.props.handleErrors(this.props.attribute, valid);
                    }}
                >
                    {t(this.props, 'edit.registry_entry.go_up')}
                    <FaArrowUp className="Icon Icon--editorial" />
                </button>
            )
        }
    }

    goDown() {
        const valid = parseInt(this.state.selectedRegistryEntryId) !== this.props.project?.root_registry_entry_id;
        if (
            this.selectedRegistryEntry() &&
            this.selectedRegistryEntry().associations_loaded &&
            this.selectedRegistryEntry().child_ids[this.props.locale].length > 0
        ) {
            return (
                <Select
                    attribute={this.props.attribute}
                    scope={this.props.scope}
                    value={this.state.selectedRegistryEntryId}
                    values={this.registryEntries()}
                    withEmpty={true}
                    validate={function(v){return /\d+/.test(parseInt(v))}}
                    valid={valid}
                    showErrors={true}
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
