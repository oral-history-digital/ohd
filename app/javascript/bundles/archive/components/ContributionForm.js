import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class ContributionForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form 
                scope='contribution'
                values={{
                    id: this.props.contribution && this.props.contribution.id,
                    interview_id: this.props.interview.id
                }}
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                elements={[
                    {
                        elementType: 'select',
                        attribute: 'person_id',
                        values: Object.values(this.props.people),
                        value: this.props.contribution && this.props.contribution.person_id,
                        withEmpty: true,
                        validate: function(v){return v !== ''},
                        individualErrorMsg: 'empty'
                    },
                    {
                        elementType: 'select',
                        attribute: 'contribution_type',
                        values: Object.values(this.props.contributionTypes),
                        value: this.props.contribution && this.props.contribution.contribution_type,
                        optionsScope: 'contributions',
                        withEmpty: true,
                        validate: function(v){return v !== ''} 
                    },
                ]}
            />
        );
    }
}
