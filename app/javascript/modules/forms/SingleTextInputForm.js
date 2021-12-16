import { Component } from 'react';
import { Form } from 'modules/forms';

export default class SingleTextInputForm extends Component {
    render() {
        return (
            <Form
                scope='text'
                onSubmit={params => {
                    this.props.submitData(this.props, params);
                }}
                formClasses={this.props.formClasses}
                elements={[
                    {attribute: 'text_to_mark'},
                    {attribute: 'replacement'}
                ]}
            />
        );
    }
}
