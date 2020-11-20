import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class BiographicalEntryForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form 
                scope='biographical_entry'
                onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                data={this.props.biographicalEntry}
                values={{
                    person_id: (this.props.person && this.props.person.id) || (this.props.biographicalEntry && this.props.biographicalEntry.person_id)
                }}
                elements={[
                    {
                        elementType: 'textarea',
                        attribute: 'text',
                        value: this.props.biographicalEntry && this.props.biographicalEntry.text[this.props.locale],
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        attribute: 'start_date',
                        value: this.props.biographicalEntry && this.props.biographicalEntry.start_date[this.props.locale],
                    },
                    {
                        attribute: 'end_date',
                        value: this.props.biographicalEntry && this.props.biographicalEntry.end_date[this.props.locale],
                    },
                    {
                        elementType: 'select',
                        attribute: 'workflow_state',
                        values: ["unshared", "public"],
                        value: this.props.biographicalEntry && this.props.biographicalEntry.workflow_state,
                        optionsScope: 'workflow_states',
                    },
                ]}
            />
        );
    }
}
