import React from 'react';
import InputContainer from '../../containers/form/InputContainer';
import TextareaContainer from '../../containers/form/TextareaContainer';
import SelectContainer from '../../containers/form/SelectContainer';
import { t } from '../../../../lib/utils';

export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showErrors: false, 
            values: {
                default_locale: this.props.locale,
            },
            errors: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.initErrors();
    }

    handleChange(name, value) {
        this.setState({ 
            values: Object.assign({}, this.state.values, {[name]: value})
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.valid()) {
            this.props.onSubmit({[this.props.scope || this.props.submitScope]: this.state.values});
        } 
    }

    initErrors() {
        let errors = {};
        this.props.elements.map((element, index) => {
            errors = Object.assign({}, errors, {[element.attribute]: element.validate ? true : false})
        })
        this.setState({ errors: errors });
    }

    handleErrors(name, bool) {
        this.setState({ 
            errors: Object.assign({}, this.state.errors, {[name]: bool})
        })
    }

    valid() {
        let errors = false;
        Object.keys(this.state.errors).map((name, index) => {
            let hidden = this.props.elements.filter(element => element.attribute === name)[0].hidden;
            errors = (!hidden && this.state.errors[name]) || errors;
        })
        this.setState({showErrors: errors});
        return !errors;
    }

    components() {
        return {
            select: SelectContainer,
            input: InputContainer,
            textarea: TextareaContainer 
        }
    }

    elementComponent(props) {
        props['scope'] = props.scope || this.props.scope;
        props['showErrors'] = this.state.showErrors;
        props['handleChange'] = this.handleChange;
        props['handleErrors'] = this.handleErrors;
        props['key'] = props.attribute;
        props['value'] = this.state.values[props.attribute] || props.value;

        // set defaults for the possibillity to shorten elements list
        if (!props.elementType) {
            props['elementType'] = 'input';
            props['type'] = 'text';
        }

        return React.createElement(this.components()[props.elementType], props);
    }

    render() {
        return (
            <form 
                id={this.props.formId || this.props.scope} 
                className={this.props.formClasses || `${this.props.scope} default`} 
                onSubmit={this.handleSubmit}
            >

                {this.props.elements.map((props, index) => {
                    return this.elementComponent(props);
                })}

                <input type="submit" value={t(this.props, this.props.submitText)}/>
            </form>
        );
    }
}
