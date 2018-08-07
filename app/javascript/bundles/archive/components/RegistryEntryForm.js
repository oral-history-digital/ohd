import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class RegistryEntryForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form 
                scope='registry_entry'
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                values={{
                    id: this.props.registryEntry && this.props.registryEntry.id,
                    //parent_id: this.props.parent && this.props.parent.id
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
                        attribute: 'name',
                        value: this.props.registryEntry && this.props.registryEntry.name[this.props.locale],
                        type: 'text',
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        elementType: 'textarea',
                        attribute: 'notes',
                        value: this.props.registryEntry && this.props.registryEntry.notes[this.props.locale],
                    },
                ]}
            />
        );
    }
}
