import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class SegmentHeadingForm extends React.Component {

    render() {
        let _this = this;
        return (
            <div>
                {`${t(this.props, 'edit.segment.speaker_string')}: ${this.props.segment.speaker}`}
                <Form 
                    scope='segment'
                    onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                    data={this.props.segment}
                    submitText='submit'
                    elements={[
                        {
                            attribute: 'mainheading',
                            multiLocale: true,
                        },
                        {
                            attribute: 'subheading',
                            multiLocale: true,
                        },
                    ]}
                />
            </div>
        );
    }
}
