import { createElement, Component } from 'react';
import PropTypes from 'prop-types';

export default class SubmitOnBlurForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: this.props.validate === undefined,
            value: this.value(),
        };

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    // is the attribute part of a translation-table
    handleChange(event) {
        let value = event.target.value;
        this.setState({value: value})

        if (this.props.validate !== undefined) {
            if (this.props.validate(value)) {
                this.setState({valid: true})
            } else {
                this.setState({valid: false})
            }
        }
    }

    value() {
        if (this.props.locale) {
            return this.props.data[this.props.attribute][this.props.locale] || this.props.data[this.props.attribute][`${this.props.locale}-public`] || ''
        } else {
            return this.props.data[this.props.attribute];
        }
    }

    submit(event) {
        event.preventDefault();

        if(this.state.valid) {
            this.props.submitData(
                { locale: 'de', project: this.props.project, projectId: this.props.projectId },
                {[this.props.scope]: {id: this.props.data.id, locale: this.props.locale, [this.props.attribute]: this.state.value}}
            );
        }
    }

    input() {
        return createElement(this.props.type || 'input', {
            onBlur: this.submit,
            onChange: this.handleChange,
            defaultValue: this.value(),
        });
    }

    render() {
        return (
            <form className={'submit-on-focus-out'}>
                {this.input()}
            </form>
        );
    }
}

SubmitOnBlurForm.propTypes = {
    attribute: PropTypes.string.isRequired,
    scope: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    validate: PropTypes.func,
    data: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    submitData: PropTypes.func.isRequired,
};
