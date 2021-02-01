import React from 'react';
import { Form } from 'modules/forms';
import { t } from '../../../lib/utils';

export default class SingleTextInputForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form
                scope='text'
                onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                formClasses={_this.props.formClasses}
                elements={[
                    {attribute: 'text_to_mark'},
                    {attribute: 'replacement'}
                ]}
            />
        );
    }
}
