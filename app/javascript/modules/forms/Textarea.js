import { Component } from 'react';

import ElementContainer from './ElementContainer';

export default class Textarea extends Component {

    // props are:
    //   @scope
    //   @attribute = attribute name
    //   @type
    //   @value = default value
    //   @validate = function
    //   @handleChange = function
    //   @handleErrors = function
    //   @help

    constructor(props, context) {
        super(props);
        this.state = {
            valid: !this.props.validate,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const value =  event.target.value;
        const name =  event.target.name;

        this.props.handleChange(name, value, this.props.data);

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
            <ElementContainer
                scope={this.props.scope}
                attribute={this.props.attribute}
                label={this.props.label}
                labelKey={this.props.labelKey}
                showErrors={this.props.showErrors}
                css={this.props.css}
                hidden={this.props.hidden}
                valid={this.state.valid}
                mandatory={typeof(this.props.validate) === 'function'}
                elementType='textarea'
                individualErrorMsg={this.props.individualErrorMsg}
                help={this.props.help}
            >
                <textarea
                    name={this.props.attribute}
                    defaultValue={value}
                    onChange={this.handleChange}
                />
            </ElementContainer>
        );
    }

}
