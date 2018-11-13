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
            (this.props.registryEntriesStatus[this.state.parentEntryId] &&
                this.props.registryEntriesStatus[this.state.parentEntryId].split('-')[0] === 'reload')
        ) {
            this.props.fetchData('registry_entries', null, null, this.props.locale, `children_for_entry=${this.state.parentEntryId}`);
        }
    }

    loadRegistryReferenceTypes() {
        if (!this.props.registryReferenceTypesStatus) {
            this.props.fetchData('registry_reference_types');
        }
    }

    loadParentEntry() {
        if (
            !this.props.registryEntriesStatus[this.props.parentEntryId] ||
            (this.props.registryEntriesStatus[this.props.parentEntryId] &&
            this.props.registryEntriesStatus[this.props.parentEntryId].split('-')[0] === 'reload')
        ) {
            this.props.fetchData('registry_entries', this.props.parentEntryId);
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
                value: this.props.registry_reference && this.props.registry_reference.registry_entry_id,
                withEmpty: true,
                validate: function(v){return v !== ''},
                individualErrorMsg: 'empty',
                handlechangecallback: _this.handleSelectedRegistryEntry
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
            // check whether parentEntry is loaded
            this.props.registryEntriesStatus[this.props.parentEntryId] &&
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
            this.setState({parentEntryId: value});
        }
    }

    selectedRegistryEntry() {
        if (this.state.parentEntryId !== this.props.parentEntryId) {
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
        if (this.state.parentEntryId !== this.props.parentEntryId) {
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
