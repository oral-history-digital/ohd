import React from 'react';
import ElementContainer from '../../containers/form/ElementContainer';

export default class Input extends React.Component {

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
            changeFile: false
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let value =  event.target.files ? event.target.files[0] : event.target.value;
        if (event.target.type === 'checkbox') {
            value = event.target.checked;
        }

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

    cleanProps() {
        let value = this.props.value || this.props.data && this.props.data[this.props.attribute];
        let props = {
            id: `${this.props.scope}_${this.props.attribute}`,
            type: this.props.type,
            name: this.props.attribute,
            defaultChecked: value,
            defaultValue: value,
            onChange: this.handleChange,
            onClick: this.handleChange, // otherwise checkboxes would not fire
        };

        return props;
    }

    inputOrImg() {
        if (this.props.type === 'file' && this.props.data && this.props.data.src && !this.state.changeFile) {
            return (
                <div>
                    <img src={this.props.data.thumb_src} />
                    <i className="fa fa-pencil" onClick={() => this.setState({changeFile: true})} ></i>
                </div>
            )
        } else {
            return React.createElement('input', this.cleanProps());
        }
    }

    render() {
        return (
            <ElementContainer
                scope={this.props.scope}
                attribute={this.props.attribute}
                label={this.props.label}
                labelKey={this.props.labelKey}
                htmlFor={`${this.props.scope}_${this.props.attribute}`}
                showErrors={this.props.showErrors}
                css={this.props.css}
                hidden={this.props.hidden}
                valid={this.state.valid}
                mandatory={typeof(this.props.validate) === 'function'}
                elementType={`${this.props.type}_input`}
                individualErrorMsg={this.props.individualErrorMsg}
                help={this.props.help}
            >
                {this.inputOrImg()}
            </ElementContainer>
        );
    }

}
