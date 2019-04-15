import React from 'react';
import InputContainer from '../../containers/form/InputContainer';
import TextareaContainer from '../../containers/form/TextareaContainer';
import SelectContainer from '../../containers/form/SelectContainer';
import { t, pluralize } from '../../../../lib/utils';

export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showErrors: false, 
            values: this.props.values || {},
            errors: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubFormSubmit = this.handleSubFormSubmit.bind(this);
    }

    componentDidMount() {
        this.initErrors();
        this.initValues();
    }

    handleChange(name, value) {
        this.setState({ 
            values: Object.assign({}, this.state.values, {[name]: value})
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.valid()) {
            this.props.onSubmit({[this.props.scope || this.props.submitScope]: this.state.values}, this.props.locale);
        } 
    }

    initValues() {
        let values = this.state.values;
        if (this.props.data)
            values.id = this.props.data.id
        this.props.elements.map((element, index) => {
            values[element.attribute] = element.value || (this.props.data && this.props.data[element.attribute])
        })
        this.setState({ values: values });
    }

    initErrors() {
        let errors = {};
        this.props.elements.map((element, index) => {
            errors[element.attribute] = element.validate && !(element.value || (this.props.data && this.props.data[element.attribute])) ? true : false
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

    deleteSubScopeValue(index) {
        return <span
            className='flyout-sub-tabs-content-ico-link'
            title={t(this.props, 'delete')}
            onClick={() => {
                let subScopeValues = this.state.values[pluralize(this.props.subFormScope)];
                this.setState({ 
                    values: Object.assign({}, this.state.values, {
                        [pluralize(this.props.subFormScope)]: subScopeValues.slice(0,index).concat(subScopeValues.slice(index+1))
                    })
                })
            }}
        >
            <i className="fa fa-trash-o"></i>
        </span>
    }

    selectedSubScopeValues() {
        if (this.props.subFormScope && this.state.values[pluralize(this.props.subFormScope)]) {
            return (
                <div>
                    <h4 className='nested-value-header'>{t(this.props, `${pluralize(this.props.subFormScope)}.title`)}</h4>
                    {this.state.values[pluralize(this.props.subFormScope)].map((value, index) => {
                        return (
                            <p>
                                <span className='flyout-content-data'>{this.props.subScopeRepresentation(value)}</span>
                                {this.deleteSubScopeValue(index)}
                            </p>
                        )
                    })}
                </div>
            )
        }
    }

    handleSubFormSubmit(params) {
        let scope = Object.keys(params)[0];
        let nestedValues = this.state.values[pluralize(scope)] || [];
        this.setState({ 
            values: Object.assign({}, this.state.values, {
                [pluralize(scope)]: [...nestedValues, params[scope]]
                //[pluralize(scope)]: Object.assign([...nestedValues], {[nestedValues.length]: params[scope]})
            })
        })
    }

    openSubForm() {
        if (this.props.subFormProps) {
            this.props.subFormProps.submitData = this.handleSubFormSubmit;

            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, `edit.${this.props.subFormScope}.new`)}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, `edit.${this.props.subFormScope}.new`),
                        content: React.createElement(this.props.subForm, this.props.subFormProps)
                    })}
                >
                    <div>
                        {t(this.props, `${pluralize(this.props.subFormScope)}.add`) + '  '}
                        <i className="fa fa-plus"></i>
                    </div>
                </div>
            )
        }
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
        props['data'] = this.props.data;

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

                {this.selectedSubScopeValues()}
                {this.openSubForm()}

                <input type="submit" value={t(this.props, this.props.submitText || 'submit')}/>
            </form>
        );
    }
}
