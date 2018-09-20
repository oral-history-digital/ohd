import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class BiographicalEntryForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form 
                scope='biographical_entry'
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                values={{
                    id: this.props.biographical_entry && this.props.biographical_entry.id,
                    person_id: (this.props.person && this.props.person.id) || (this.props.biographical_entry && this.props.biographical_entry.person_id)
                }}
                elements={[
                    {
                        elementType: 'textarea',
                        attribute: 'text',
                        value: this.props.biographical_entry && this.props.biographical_entry.text[this.props.locale],
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        attribute: 'start_date',
                        value: this.props.biographical_entry && this.props.biographical_entry.start_date[this.props.locale],
                    },
                    {
                        attribute: 'end_date',
                        value: this.props.biographical_entry && this.props.biographical_entry.end_date[this.props.locale],
                    },
                ]}
            />
        );
    }
}
