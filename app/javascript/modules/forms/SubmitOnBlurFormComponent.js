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

    //translation() {
        //if (this.props.locale) {
            //return this.props.data.translations.find(t => t.locale === this.props.locale)
        //}
    //}

    value() {
        if (this.props.locale) {
            //return this.translation()[this.props.attribute];
            return this.props.data[this.props.attribute][this.props.locale] || this.props.data[this.props.attribute][`${this.props.locale}-public`] || ''
        } else {
            return this.props.data[this.props.attribute];
        }
    }

    //{"person"=>{"translations_attributes"=>"[{\"locale\":\"de\",\"id\":\"339\",\"first_name\":\"Ewa Maria\"},{\"locale\":\"en\",\"id\":\"2394\",\"first_name\":\"Eva\"},{\"id\":340,\"locale\":\"ru\",\"first_name\":\"Эва\",\"last_name\":\"Червяковский\",\"birth_name\":null,\"other_first_names\":null,\"alias_names\":null}]"}
    //
    submit(event) {
        event.preventDefault();

        //let params = {[this.props.scope]: {id: this.props.data.id}};

        //if (this.props.locale) {
            ////params[this.props.scope].translations_attributes = [{id: this.translation().id, locale: this.props.locale, [this.props.attribute]: this.state.value}];
            //params[this.props.scope].locale = this.props.locale;
        //} else {
            //params[this.props.scope][this.props.attribute] = this.state.value;
        //}

        if(this.state.valid) {
            //this.props.submitData(this.props, params);
            this.props.submitData(this.props, {[this.props.scope]: {id: this.props.data.id, locale: this.props.locale, [this.props.attribute]: this.state.value}});
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
