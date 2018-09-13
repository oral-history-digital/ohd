import React from 'react';
import Form from '../containers/form/Form';
import { t, admin } from '../../../lib/utils';

export default class RegistryReferenceForm extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {registryEntryParentId: this.props.registryEntryParentId};
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
        if (
            !this.props.registryEntriesStatus[`children_for_entry_${this.state.registryEntryParentId}`] ||
            (this.props.registryEntriesStatus[this.state.registryEntryParentId] &&
                this.props.registryEntriesStatus[this.state.registryEntryParentId].split('-')[0] === 'reload')
        ) {
            this.props.fetchData('registry_entries', null, null, this.props.locale, `children_for_entry=${this.state.registryEntryParentId}`);
        }
    }

    loadRegistryReferenceTypes() {
        if (!this.props.registryReferenceTypesStatus) {
            this.props.fetchData('registry_reference_types');
        }
    }

    registryEntryParent() {
        return this.props.registryEntries[this.state.registryEntryParentId];
    }
    
    elements() {
        let _this = this;
        let elements = [
            {
                elementType: 'select',
                attribute: 'registry_entry_id',
                values: this.registryEntries(),
                value: this.props.registry_reference && this.props.registry_reference.registry_entry_id,
                withEmpty: true,
                validate: function(v){return v !== ''},
                individualErrorMsg: 'empty',
                handleChangeCallback: _this.handleSelectedRegistryEntry
            }
        ]
        if (_this.props.selectRegistryReferenceType) {
            elements.push(
                {
                    elementType: 'select',
                    attribute: 'registry_reference_type_id',
                    values: this.props.registryReferenceTypesStatus && this.props.registryReferenceTypesStatus.split('-')[0] === 'fetched' && Object.values(this.props.registryReferenceTypes),
                    value: this.props.registry_reference && this.props.registry_reference.registry_reference_type_id || this.props.refTypeId,
                    withEmpty: false,
                    hidden: (_this.props.selectRegistryReferenceType == 'hidden') ? true : false
                }
            )
        }
        return elements;
    }

    registryEntries() {
        if (
            this.props.registryEntriesStatus[`children_for_entry_${this.state.registryEntryParentId}`] && 
            this.props.registryEntriesStatus[`children_for_entry_${this.state.registryEntryParentId}`].split('-')[0] === 'fetched'
        ) {
            return this.registryEntryParent().child_ids.map((id, index) => {
                return this.props.registryEntries[id];
            })
        } else {
            return [];
        }
    }

    handleSelectedRegistryEntry(name, value) {
        if (this.props.goDeeper) {
            this.setState({registryEntryParentId: value});
        }
    }

    selectedRegistryEntry() {
        if (this.state.registryEntryParentId !== this.props.registryEntryParentId) {
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
        if (this.state.registryEntryParentId !== this.props.registryEntryParentId) {
            let parentRegistryEntryId = this.registryEntryParent().parent_ids[0] === this.props.registryEntryParentId ?
                this.props.registryEntryParentId :
                this.registryEntryParent().parent_ids[0]
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.registry_entry.go_up')}
                    onClick={() => this.setState({registryEntryParentId: parentRegistryEntryId})}
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
                    values={{
                        id: this.props.registry_reference && this.props.registry_reference.id,
                        ref_object_id: this.props.refObject.id,
                        ref_object_type: this.props.refObjectType,
                        interview_id: this.props.interview.id,
                        registry_reference_type_id: this.props.refTypeId || null,
                        // TODO: change following dummy-values with meaningfull ones
                        ref_position: 1,
                        workflow_state: 'preliminary'
                    }}
                    onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                    elements={_this.elements()}
                />
            </div>
        );
    }
}
