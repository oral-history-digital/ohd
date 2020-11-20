import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class RegistryNameForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form 
                scope='registry_name'
                onSubmit={function(params){_this.props.submitData(_this.props, params);}}
                onSubmitCallback={_this.props.onSubmitCallback}
                formClasses={_this.props.formClasses}
                data={this.props.registryName}
                values={{
                    registry_entry_id: (_this.props.registryName && _this.props.registryName.registry_entry_id) || _this.props.registryEntryId
                }}
                submitText='submit'
                elements={[
                    {
                        attribute: 'descriptor',
                        multiLocale: true
                    },
                    {
                        elementType: 'textarea',
                        multiLocale: true,
                        attribute: 'notes',
                    },
                    {
                        elementType: 'input',
                        attribute: 'name_position',
                        validate: function(v){return /^\d+$/.test(v)} 
                    },
                    {
                        elementType: 'select',
                        attribute: 'registry_name_type_id',
                        values: this.props.registryNameTypes && Object.values(this.props.registryNameTypes),
                        withEmpty: true,
                        validate: function(v){return /^\d+$/.test(v)} 
                    },
                ]}
            />
        );
    }
}
