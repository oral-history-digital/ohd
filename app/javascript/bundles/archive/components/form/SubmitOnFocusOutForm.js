import React from 'react';
import { t, pluralize } from '../../../../lib/utils';

export default class SubmitOnFocusOutForm extends React.Component {

    constructor(props, context) {
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

    translation() {
        if (this.props.translationLocale) {
            return this.props.data.translations.find(t => t.locale === this.props.translationLocale)
        }
    }

    value() {
        if (this.props.translationLocale) {
            return this.translation()[this.props.attribute];
        } else {
            return this.props.data[this.props.attribute];
        }
    }

    //{"person"=>{"translations_attributes"=>"[{\"locale\":\"de\",\"id\":\"339\",\"first_name\":\"Ewa Maria\"},{\"locale\":\"en\",\"id\":\"2394\",\"first_name\":\"Eva\"},{\"id\":340,\"locale\":\"ru\",\"first_name\":\"Эва\",\"last_name\":\"Червяковский\",\"birth_name\":null,\"other_first_names\":null,\"alias_names\":null}]"}
    //
    submit(event) {
        event.preventDefault();

        let params = {[this.props.scope]: {id: this.props.data.id}};

        if (this.props.translationLocale) {
            params[this.props.scope].translations_attributes = {id: this.translation().id, locale: this.props.translationLocale, [this.props.attribute]: this.state.value};
        } else {
            params[this.props.scope][this.props.attribute] = this.state.value;
        }

        if(this.state.valid) {
            this.props.submitData(this.props, params);
        } 
    }

    input() {
        return (
            React.createElement(this.props.type || 'input', {
                onBlur: this.submit,
                onChange: this.handleChange,
                defaultValue: this.value(),
            })
        )
    }

    render() {
        return (
            <form 
                className={'submit-on-focus-out'} 
                key={this.props.key}
            >
                {this.input()}
            </form>
        );
    }
                //{this.props.textarea ? this.textarea() : this.input()}
}
