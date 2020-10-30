import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class RegistryNameForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form 
                scope='person'
                onSubmit={function(params){
                    _this.props.submitData(_this.props, params);
                    if (typeof _this.props.closeArchivePopup === "function") {_this.props.closeArchivePopup()};
                    if (typeof _this.props.onSubmitCallback === "function") {_this.props.onSubmitCallback()}}
                }
                values={{
                    id: this.props.registry_name && this.props.registry_name.id
                    registry_entry_id: _this.props.registryEntryId
                }}
                submitText='submit'
                elements={[
                    {
                        elementType: 'multiLocaleInput',
                        attribute: 'descriptor',
                    },
                    {
                        elementType: 'input',
                        attribute: 'name_position',
                        value: this.props.registry_name && this.props.registry_name.name_position,
                        validate: function(v){return /^\d+$/.test(v)} 
                    },
                    {
                        elementType: 'select',
                        attribute: 'registry_name_type',
                        values: this.props.registryNameTypes && Object.values(this.props.registryNameTypes),
                        value: this.props.person && this.props.person.gender,
                        withEmpty: true,
                        validate: function(v){return /^\d+$/.test(v)} 
                    },
                ]}
            />
        );
    }
}
