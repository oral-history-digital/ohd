import React from 'react';
import Form from '../containers/form/Form';
import { t, admin } from '../../../lib/utils';

export default class RegistryReferenceForm extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {registryEntryParent: this.props.registryEntryParent};
        this.handleSelectedRegistryEntry = this.handleSelectedRegistryEntry.bind(this);
    }

    componentDidMount() {
        this.loadRegistryEntries();
        this.loadRegistryReferenceTypes();
    }

    componentDidUpdate() {
        this.loadRegistryEntries();
        this.loadRegistryReferenceTypes();
    }

    loadRegistryEntries() {
        if (!this.props.registryEntriesStatus[`children_for_entry_${this.state.registryEntryParent.id}`]) {
            this.props.fetchData('registry_entries', null, null, this.props.locale, `children_for_entry=${this.state.registryEntryParent.id}`);
        }
    }

    loadRegistryReferenceTypes() {
        if (!this.props.registryReferenceTypesStatus) {
            this.props.fetchData('registry_reference_types');
        }
    }

    registryEntries() {
        if (
            this.props.registryEntriesStatus[`children_for_entry_${this.state.registryEntryParent.id}`] && 
            this.props.registryEntriesStatus[`children_for_entry_${this.state.registryEntryParent.id}`].split('-')[0] === 'fetched'
        ) {
            return this.state.registryEntryParent.child_ids.map((id, index) => {
                return this.props.registryEntries[id];
            })
        } else {
            return [];
        }
    }

    handleSelectedRegistryEntry(name, value) {
        this.setState({registryEntryParent: this.props.registryEntries[value]});
    }

    selectedRegistryEntry() {
        if (this.state.registryEntryParent !== this.props.registryEntryParent) {
            return (
                <div>
                    <span><b>{t(this.props, 'selected_registry_entry') + ': '}</b></span>
                    <span>{this.state.registryEntryParent.name[this.props.locale]}</span>
                </div>
            )
        } else {
            return null;
        }
    }

    render() {
        let _this = this;
        return (
            <div>
                {this.selectedRegistryEntry()}
                <Form 
                    scope='registry_reference'
                    values={{
                        id: this.props.registry_reference && this.props.registry_reference.id,
                        ref_object_id: this.props.refObject.id,
                        ref_object_type: this.props.refObjectType,
                        interview_id: this.props.interview.id,
                        // TODO: change following dummy-values with meaningfull ones
                        ref_position: 1,
                        workflow_state: 'preliminary'
                    }}
                    onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                    elements={[
                        {
                            elementType: 'select',
                            attribute: 'registry_entry_id',
                            values: this.registryEntries(),
                            value: this.props.registry_reference && this.props.registry_reference.registry_entry_id,
                            withEmpty: true,
                            validate: function(v){return v !== ''},
                            individualErrorMsg: 'empty',
                            handleChangeCallback: _this.handleSelectedRegistryEntry
                        },
                        {
                            elementType: 'select',
                            attribute: 'registry_reference_type_id',
                            values: this.props.registryReferenceTypesStatus && this.props.registryReferenceTypesStatus.split('-')[0] === 'fetched' && Object.values(this.props.registryReferenceTypes),
                            value: this.props.registry_reference && this.props.registry_reference.registry_reference_type_id,
                            withEmpty: true,
                        },
                    ]}
                />
            </div>
        );
    }
}
