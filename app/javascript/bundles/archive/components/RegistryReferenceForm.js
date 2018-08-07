import React from 'react';
import Form from '../containers/form/Form';
import { t, admin } from '../../../lib/utils';

export default class RegistryReferenceForm extends React.Component {

    constructor(props, context) {
        super(props, context);
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
        // TODO: fit this to registry entries used as facets
        //let entry = {id: 1};
        if (!this.props.data[`registry_entries_children_for_entry_${this.props.registryEntryParent.id}_status`]) {
            this.props.fetchData('registry_entries', null, null, this.props.locale, `children_for_entry=${this.props.registryEntryParent.id}`);
        }
    }

    loadRegistryReferenceTypes() {
        if (!this.props.registry_reference_types_status) {
            this.props.fetchData('registry_reference_types');
        }
    }

    registryEntries() {
        if (this.props.data[`registry_entries_children_for_entry_${this.props.registryEntryParent.id}_status`] === 'fetched') {
            return this.props.registryEntryParent.child_ids.map((id, index) => {
                return this.props.registryEntries[id];
            })
        } else {
            return [];
        }
            //&& Object.values(this.props.registryEntries),
    }

    render() {
        let _this = this;
        return (
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
                        individualErrorMsg: 'empty'
                    },
                    {
                        elementType: 'select',
                        attribute: 'registry_reference_type_id',
                        values: this.props.registry_reference_types_status === 'fetched' && Object.values(this.props.registryReferenceTypes),
                        value: this.props.registry_reference && this.props.registry_reference.registry_reference_type_id,
                        //optionsScope: 'registry_references',
                        withEmpty: true,
                        //validate: function(v){return v !== ''} 
                    },
                ]}
            />
        );
    }
}
