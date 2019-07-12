import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class SingleTextInputForm extends React.Component {

    render() {
        let _this = this;
        return (
            <Form 
                scope='text'
                onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                elements={[
                    {attribute: 'text_to_mark'}
                ]}
            />
        );
    }
}
