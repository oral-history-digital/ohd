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
                    onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                    values={{
                        id: this.props.segment && this.props.segment.id,
                        locale: this.props.contentLocale
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
                            value: this.props.segment && (this.props.segment.text[this.props.contentLocale] || this.props.segment.text[`${this.props.contentLocale}-public`]),
                            validate: function(v){return v && v.length > 1} 
                        },
                    ]}
                />
            </div>
        );
    }
}
