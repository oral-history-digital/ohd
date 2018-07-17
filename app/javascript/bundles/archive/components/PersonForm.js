import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class PersonForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form 
                scope='person'
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                values={{
                    id: this.props.person && this.props.person.id
                }}
                submitText='submit'
                elements={[
                    {
                        elementType: 'select',
                        attribute: 'gender',
                        values: ['male', 'female'],
                        value: this.props.person && this.props.person.gender,
                        optionsScope: 'genders',
                        withEmpty: true,
                        validate: function(v){return v !== ''} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'first_name',
                        value: this.props.person && this.props.person.names[this.props.locale] && this.props.person.names[this.props.locale].firstname,
                        type: 'text',
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'last_name',
                        value: this.props.person && this.props.person.names[this.props.locale] && this.props.person.names[this.props.locale].lastname,
                        type: 'text',
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'birth_name',
                        value: this.props.person && this.props.person.names[this.props.locale] && this.props.person.names[this.props.locale].birthname,
                        type: 'text',
                    },
                    { 
                        attribute: 'date_of_birth',
                        value: this.props.person && this.props.person.date_of_birth,
                        //elementType: 'input',
                        //type: 'date'
                    },
                ]}
            />
        );
    }
}
