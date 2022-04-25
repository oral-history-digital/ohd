import { Component } from 'react';

import { Form } from 'modules/forms';

export default class RegistryNameForm extends Component {

    render() {
        let defaultNameType = Object.values(this.props.registryNameTypes).find(r => r.code === 'spelling')
        let _this = this;
        return (
            <Form
                scope='registry_name'
                onSubmit={function(params){_this.props.submitData(_this.props, params, _this.props.index);}}
                onSubmitCallback={_this.props.onSubmitCallback}
                formClasses={_this.props.formClasses}
                data={this.props.data}
                values={{
                    registry_entry_id: (_this.props.data && _this.props.data.registry_entry_id) || _this.props.registryEntryId,
                    registry_name_type_id: (_this.props.data && _this.props.data.registry_name_type_id) || defaultNameType.id,
                    name_position: 1,
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
                        elementType: 'select',
                        attribute: 'registry_name_type_id',
                        value: (_this.props.data && _this.props.data.registry_name_type_id) || defaultNameType.id,
                        values: this.props.registryNameTypes && Object.values(this.props.registryNameTypes),
                        validate: function(v){return /^\d+$/.test(v)}
                    },
                ]}
            />
        );
    }
}
