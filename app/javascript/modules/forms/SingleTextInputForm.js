import React from 'react';
import { Form } from 'modules/forms';

export default class SingleTextInputForm extends React.Component {
    render() {
        return (
            <Form
                scope='text'
                onSubmit={(params) => {this.props.submitData(this.props, params); this.props.closeArchivePopup()}}
                formClasses={this.props.formClasses}
                elements={[
                    {attribute: 'text_to_mark'},
                    {attribute: 'replacement'}
                ]}
            />
        );
    }
}