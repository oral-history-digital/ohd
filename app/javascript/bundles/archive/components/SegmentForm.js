import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class SegmentForm extends React.Component {

    render() {
        let _this = this;
        return (
            <div>
                {`${t(this.props, 'edit.segment.speaker_string')}: ${this.props.segment.speaker}`}
                <Form 
                    scope='segment'
                    onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                    values={{
                        id: this.props.segment && this.props.segment.id
                    }}
                    submitText='submit'
                    elements={[
                        {
                            elementType: 'select',
                            attribute: 'speaker_id',
                            values: Object.values(this.props.people),
                            value: this.props.segment && this.props.segment.speaker_id,
                            withEmpty: true,
                            //validate: function(v){return v !== ''},
                            individualErrorMsg: 'empty'
                        },
                        {
                            elementType: 'textarea',
                            attribute: 'text',
                            value: this.props.segment && this.props.segment.text[this.props.locale],
                            validate: function(v){return v.length > 1} 
                        },
                    ]}
                />
            </div>
        );
    }
}
