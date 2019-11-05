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
                    values={{
                        id: this.props.segment && this.props.segment.id,
                        locale: this.props.contentLocale
                    }}
                    submitText='submit'
                    elements={[
                        {
                            attribute: 'mainheading',
                            value: this.props.segment && this.props.segment.mainheading[`${this.props.contentLocale}-original`],
                        },
                        {
                            attribute: 'subheading',
                            value: this.props.segment && this.props.segment.subheading[`${this.props.contentLocale}-original`],
                        },
                    ]}
                />
            </div>
        );
    }
}
