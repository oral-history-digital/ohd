import { Component } from 'react';
import RichTextEditor from 'react-rte-18support';

import Element from '../Element';

export default class RichTextarea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: !this.props.validate,
            value: this.props.data && this.props.data[this.props.attribute] ?
                  RichTextEditor.createValueFromString(this.props.data[this.props.attribute], 'html') :
                  RichTextEditor.createEmptyValue()
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value) {
        const name =  this.props.attribute;
        let stringValue = value.toString('html');

        this.setState({value: value})
        this.props.handleChange(name, stringValue, this.props.data);

        if (typeof this.props.handlechangecallback === 'function') {
            this.props.handlechangecallback(name, value);
        }

        if (typeof(this.props.validate) === 'function') {
            if (this.props.validate(value)) {
                this.props.handleErrors(name, false);
                this.setState({valid: true})
            } else {
                this.props.handleErrors(name, true);
                this.setState({valid: false})
            }
        }
    }

    render() {
        let value = this.props.value || this.props.data && this.props.data[this.props.attribute];
        return (
            <Element
                scope={this.props.scope}
                attribute={this.props.attribute}
                label={this.props.label}
                labelKey={this.props.labelKey}
                showErrors={this.props.showErrors}
                className={this.props.className}
                hidden={this.props.hidden}
                valid={this.state.valid}
                mandatory={typeof(this.props.validate) === 'function'}
                elementType='textarea'
                individualErrorMsg={this.props.individualErrorMsg}
                help={this.props.help}
            >
                <div className='richtextarea'>
                    <RichTextEditor
                        className="Input"
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                </div>
            </Element>
        );
    }
}
