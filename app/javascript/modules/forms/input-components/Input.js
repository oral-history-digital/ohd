import PropTypes from 'prop-types';
import { createElement, Component } from 'react';
import { FaPencilAlt} from 'react-icons/fa';

import { Checkbox } from 'modules/ui';
import Element from '../Element';

export default class Input extends Component {

    // props are:
    //   @scope
    //   @attribute = attribute name
    //   @type
    //   @value = default value
    //   @validate = function
    //   @optional = boolean
    //   @handleChange = function
    //   @handleErrors = function
    //   @help

    constructor(props, context) {
        super(props);
        this.state = {
            valid: (typeof this.props.validate !== 'function') || this.props.optional,
            changeFile: false,
            value: this.props.data && this.props.data[this.props.attribute] || this.props.value,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        let value =  event.target.files ? event.target.files[0] : event.target.value;
        if (event.target.type === 'checkbox') {
            value = event.target.checked;
        }

        this.setState({value: value});

        const name =  event.target.name;

        this.props.handleChange(name, value, this.props.data);

        if (typeof this.props.handlechangecallback === 'function') {
            this.props.handlechangecallback(name, value, this.props.data);
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
        let props = {
            id: `${this.props.scope}_${this.props.attribute}`,
            className: 'Input',
            type: this.props.type,
            name: this.props.attribute,
            readOnly: this.props.readOnly,
            defaultChecked: this.state.value,
            defaultValue: this.state.value,
            onChange: this.handleChange,
            onClick: this.handleChange, // otherwise checkboxes would not fire
        };

        if (this.props.type !== 'file')
            props.value = this.props.data && this.props.data[this.props.attribute] || this.props.value || this.state.value;

        return props;
    }

    inputOrImg() {
        if (this.props.type === 'file' && this.props.data && this.props.data.src && !this.state.changeFile) {
            return (
                <div>
                    <img src={this.props.data.thumb_src} alt="" />
                    <button
                        type="button"
                        className="Button Button--transparent Button--icon"
                        onClick={() => this.setState({ changeFile: true })}
                    >
                        <FaPencilAlt className="Icon Icon--primary" />
                    </button>
                </div>
            )
        } else if (this.props.type === 'checkbox') {
            return createElement(Checkbox, this.cleanProps());
        } else {
            return createElement('input', this.cleanProps());
        }
    }

    render() {
        const { validate, optional } = this.props;

        return (
            <Element
                scope={this.props.scope}
                attribute={this.props.attribute}
                label={this.props.label}
                labelKey={this.props.labelKey}
                htmlFor={`${this.props.scope}_${this.props.attribute}`}
                showErrors={this.props.showErrors}
                className={this.props.className}
                hidden={this.props.hidden}
                valid={this.state.valid}
                mandatory={typeof validate === 'function' && !optional}
                elementType={`${this.props.type}_input`}
                individualErrorMsg={this.props.individualErrorMsg}
                help={this.props.help}
            >
                {this.inputOrImg()}
            </Element>
        );
    }
}

Input.propTypes = {
    readOnly: PropTypes.bool,
};
