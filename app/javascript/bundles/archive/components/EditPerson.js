import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class EditPerson extends React.Component {

    render() {
        return (
            <Form 
                scope='preson'
                onSubmit={this.props.submitPerson}
                submitText='submit'
                elements={[
                    {
                        elementType: 'select',
                        attribute: 'appellation',
                        values: ['ms', 'ms_dr', 'ms_prof', 'mr', 'mr_dr', 'mr_prof'],
                        selected: this.props.person && this.props.person.appelation,
                        withEmpty: true,
                        validate: function(v){return v !== ''} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'first_name',
                        value: this.props.person && this.props.person.first_name,
                        type: 'text',
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'last_name',
                        value: this.props.person && this.props.person.last_name,
                        type: 'text',
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'birth_name',
                        value: this.props.person && this.props.person.birth_name,
                        type: 'text',
                    },
                    {
                        elementType: 'input',
                        attribute: 'middle_names',
                        value: this.props.person && this.props.person.middle_names,
                        type: 'text',
                    },
                    {
                        elementType: 'select',
                        attribute: 'gender',
                        values: ['male', 'female'],
                        withEmpty: true,
                        validate: function(v){return v !== ''} 
                    },
                    { 
                        attribute: 'date_of_birth',
                        value: this.props.person && this.props.person.date_of_birth,
                        elementType: 'input',
                        type: 'date'
                    },
                ]}
            />
        );
    }
}
