import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class HistoryForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form 
                scope='history'
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                values={{
                    id: this.props.history && this.props.history.id,
                    person_id: (this.props.person && this.props.person.id) || (this.props.history && this.props.history.person_id)
                }}
                elements={[
                    {
                        elementType: 'textarea',
                        attribute: 'forced_labor_details',
                        value: this.props.history && this.props.history.forced_labor_details[this.props.locale],
                        validate: function(v){return v.length > 1} 
                    },
                    {
                        attribute: 'return_date',
                        value: this.props.history && this.props.history.return_date[this.props.locale],
                    },
                    {
                        attribute: 'deportation_date',
                        value: this.props.history && this.props.history.deportation_date[this.props.locale],
                    },
                    {
                        attribute: 'punishment',
                        value: this.props.history && this.props.history.punishment[this.props.locale],
                    },
                    {
                        attribute: 'liberation_date',
                        value: this.props.history && this.props.history.liberation_date[this.props.locale],
                    },
                ]}
            />
        );
    }
}
