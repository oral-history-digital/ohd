import React from 'react';
import Form from '../containers/form/Form';
import { t, admin } from '../../../lib/utils';

export default class RegistryReferenceForm extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {parentEntryId: this.props.parentEntryId};
        this.handleSelectedRegistryEntry = this.handleSelectedRegistryEntry.bind(this);
    }

    componentDidMount() {
        this.loadRegistryEntries();
        this.loadRegistryReferenceTypes();
        this.loadParentEntry();
    }

    componentDidUpdate() {
        this.loadRegistryEntries();
        this.loadRegistryReferenceTypes();
        this.loadParentEntry();
    }

    loadRegistryEntries() {
        if (
            !this.props.registryEntriesStatus[`children_for_entry_${this.state.parentEntryId}`] ||
            (
                this.props.registryEntriesStatus[this.state.parentEntryId] &&
                this.props.registryEntriesStatus[this.state.parentEntryId].split('-')[0] === 'reload'
            )
        ) {
            this.props.fetchData(this.props, 'registry_entries', null, null, `children_for_entry=${this.state.parentEntryId}`);
    }
}

    loadRegistryReferenceTypes() {
        if (!this.props.registryReferenceTypesStatus) {
            this.props.fetchData(this.props, 'registry_reference_types');
        }
    }

    loadParentEntry() {
        if (
            (
                !this.registryEntryParent() &&
                this.props.registryEntriesStatus[this.props.parentEntryId] !== 'fetching'
            ) || 
            (
                this.registryEntryParent() && 
                !this.registryEntryParent().associations_loaded &&
                this.props.registryEntriesStatus[this.props.parentEntryId] !== 'fetching'
            ) ||
            (
                this.props.registryEntriesStatus[this.props.parentEntryId] &&
                this.props.registryEntriesStatus[this.props.parentEntryId].split('-')[0] === 'reload'
            )
        ) {
            this.props.fetchData(this.props, 'registry_entries', this.props.parentEntryId, null, 'with_associations=true');
        }
    }

    registryEntryParent() {
        return this.props.registryEntries[this.state.parentEntryId];
    }
    
    elements() {
        let _this = this;
        let elements = [
            {
                elementType: 'select',
                attribute: 'registry_entry_id',
                values: this.registryEntries(),
                value: this.props.registryReference && this.props.registryReference.registry_entry_id,
                withEmpty: true,
                validate: function(v){return v !== ''},
                individualErrorMsg: 'empty',
                handlechangecallback: _this.handleSelectedRegistryEntry
            },
            {
                elementType: 'select',
                attribute: 'workflow_state',
                values: ['preliminary', 'checked', 'rejected'],
                value: this.props.registryReference && this.props.registryReference.workflow_state,
                optionsScope: 'workflow_states',
            }
        ]
        if (!_this.props.registryReferenceTypeId) {
            elements.push(
                {
                    elementType: 'select',
                    attribute: 'registry_reference_type_id',
                    values: this.props.registryReferenceTypesStatus && this.props.registryReferenceTypesStatus.split('-')[0] === 'fetched' && Object.values(this.props.registryReferenceTypes),
                    value: this.props.registryReference && this.props.registryReference.registry_reference_type_id || this.props.refTypeId,
                    withEmpty: false,
                }
            )
        }
        return elements;
    }

    registryEntries() {
        if (
            // check whether parentEntry is loaded
            this.registryEntryParent() && 
            this.registryEntryParent().associations_loaded &&
            this.props.registryEntriesStatus[this.props.parentEntryId].split('-')[0] === 'fetched' &&

            // check whether childEntries are loaded
            this.props.registryEntriesStatus[`children_for_entry_${this.state.parentEntryId}`] && 
            this.props.registryEntriesStatus[`children_for_entry_${this.state.parentEntryId}`].split('-')[0] === 'fetched'
        ) {
            return this.registryEntryParent().child_ids[this.props.locale].map((id, index) => {
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
            this.setState({parentEntryId: value});
        }
    }

    selectedRegistryEntry() {
        if (this.registryEntryParent() && this.state.parentEntryId !== this.props.parentEntryId) {
            return (
                <div>
                    <span><b>{t(this.props, 'selected_registry_entry') + ': '}</b></span>
                    <span>{this.registryEntryParent().name[this.props.locale]}</span>
                </div>
            )
        } else {
            return null;
        }
    }

    goUp() {
        if (this.registryEntryParent() && this.registryEntryParent().associations_loaded && this.state.parentEntryId !== this.props.parentEntryId) {
            let parentRegistryEntryId = this.registryEntryParent().parent_ids[this.props.locale][0] === this.props.parentEntryId ?
                this.props.parentEntryId :
                this.registryEntryParent().parent_ids[this.props.locale][0]
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.registry_entry.go_up')}
                    onClick={() => this.setState({parentEntryId: parentRegistryEntryId})}
                >
                    go up
                    <i className="fa fa-arrow-alt-up"></i>
                </div>
            )
        }
    }

    render() {
        let _this = this;
        return (
            <div>
                {this.selectedRegistryEntry()}
                {this.goUp()}
                <Form 
                    scope='registry_reference'
                    data={this.props.registryReference}
                    values={!this.props.registryReference && {
                        ref_object_id: this.props.refObject.id,
                        ref_object_type: this.props.refObject.type,
                        interview_id: this.props.interview.id,
                        registry_reference_type_id: this.props.registryReferenceTypeId || null,
                        // TODO: change following dummy-values with meaningfull ones
                        ref_position: 1,
                        workflow_state: 'preliminary'
                    }}
                    onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                    elements={_this.elements()}
                />
            </div>
        );
    }
}
