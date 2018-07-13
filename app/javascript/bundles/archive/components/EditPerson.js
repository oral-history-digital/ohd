import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class EditPerson extends React.Component {

    render() {
        return (
            <Form 
                scope='people'
                onSubmit={this.props.submitData}
                values={{
                    archive_id: this.props.archiveId
                }}
                submitText='submit'
                elements={[
                    {
                        elementType: 'select',
                        attribute: 'gender',
                        values: ['male', 'female'],
                        value: this.props.person && this.props.person.gender,
                        withEmpty: true,
                        validate: function(v){return v !== ''} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'first_name',
                        value: this.props.person && this.props.person.names[this.props.locale].firstname,
                        type: 'text',
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'last_name',
                        value: this.props.person && this.props.person.names[this.props.locale].lastname,
                        type: 'text',
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        elementType: 'input',
                        attribute: 'birth_name',
                        value: this.props.person && this.props.person.names[this.props.locale].birthname,
                        type: 'text',
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
