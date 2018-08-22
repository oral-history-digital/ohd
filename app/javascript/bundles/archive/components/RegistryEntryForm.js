import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class RegistryEntryForm extends React.Component {

    parentRegistryEntry() {
        //return (
            //<div>
                //<span><b>{t(this.props, 'edit.registry_entry.parent') + ': '}</b></span>
                //<span>{this.props.registryEntryParent.name[this.props.locale]}</span>
            //</div>
        //)
    }

    render() {
        let _this = this;
        return (
            <div>
                {this.parentRegistryEntry()}
                <Form 
                    scope='registry_entry'
                    onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                    values={{
                        id: this.props.registryEntry && this.props.registryEntry.id,
                        workflow_state: this.props.registryEntry && this.props.registryEntry.workflow_state || 'preliminary',
                        parent_id: this.props.registryEntryParent && this.props.registryEntryParent.id,
                        name_position: '0',
                        registry_name_type_id: 4,
                        //workflow_state: this.props.registryEntry && this.props.registryEntry.workflow_state || 'preliminary',
                        //'[parents][]id': this.props.registryEntryParent && this.props.registryEntryParent.id,
                        //'[registry_names_attributes][]name_position': '0',
                        //'[registry_names_attributes][]registry_name_type_id': 4,
                    }}
                    submitText='submit'
                    elements={[
                        //{
                            //elementType: 'select',
                            //attribute: 'parent',
                            //values: this.props.parents,
                            //value: this.props.parent && this.props.parent.id,
                            //withEmpty: true,
                            //validate: function(v){return v !== ''} 
                        //},
                        {
                            elementType: 'input',
                            attribute: 'descriptor',
                            //attribute: '[registry_names_attributes][]descriptor',
                            value: this.props.registryEntry && this.props.registryEntry.name[this.props.locale],
                            type: 'text',
                            validate: function(v){return v.length > 1} 
                        },
                        {
                            elementType: 'textarea',
                            attribute: 'notes',
                            //attribute: '[registry_names_attributes][]notes',
                            value: this.props.registryEntry && this.props.registryEntry.notes[this.props.locale],
                        },
                    ]}
                />
            </div>
        );
    }
}
