import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class TaskForm extends React.Component {

    render() {
        let _this = this;
        return (
            <div>
                <Form 
                    scope='task'
                    onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                    values={{
                        user_id: this.props.userId,
                    }}
                    elements={[
                        {
                            attribute: 'name',
                            validate: function(v){return v.length > 1} 
                        },
                        {
                            elementType: 'textarea',
                            attribute: 'desc',
                            value: this.props.task && this.props.task.desc,
                            validate: function(v){return v.length > 1} 
                        },
                        {
                            elementType: 'select',
                            attribute: 'authorized_type',
                            values: ['Interview', 'BiographicalEntry', 'RegistryReference', 'Contribution', 'Photo'],
                            optionsScope: 'tasks',
                            withEmpty: true,
                            validate: function(v){return v !== ''} 
                        },
                        {
                            attribute: 'authorized_id',
                            validate: function(v){return v.length > 1} 
                        },
                        {
                            elementType: 'select',
                            attribute: 'workflow_state',
                            label: t(this.props, 'activerecord.attributes.task.transition_to'),
                            values: this.props.task && this.props.task.transitions_to,
                            optionsScope: 'workflow_states',
                            withEmpty: true,
                        },
                    ]}
                />
            </div>
        );
    }
}
