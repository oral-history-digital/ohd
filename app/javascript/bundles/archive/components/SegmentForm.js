import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class SegmentForm extends React.Component {

    render() {
        let _this = this;
        return (
            <div>
                <Form 
                    scope='segment'
                    onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                    data={this.props.segment}
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
                            //multiLocale: true,
                            value: this.props.segment && (this.props.segment.text[this.props.contentLocale] || this.props.segment.text[`${this.props.contentLocale}-public`]),
                            attribute: 'text',
                            //validate: function(v){return v && v.length > 1} 
                        },
                    ]}
                />
            </div>
        );
    }
}
