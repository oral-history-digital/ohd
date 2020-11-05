import React from 'react';
import InputContainer from '../../containers/form/InputContainer';
import MultiLocaleInputContainer from '../../containers/form/MultiLocaleInputContainer';
import MultiLocaleTextareaContainer from '../../containers/form/MultiLocaleTextareaContainer';
import MultiLocaleRichTextEditorContainer from '../../containers/form/MultiLocaleRichTextEditorContainer';
import RichTextEditor from 'react-rte';
import TextareaContainer from '../../containers/form/TextareaContainer';
import SelectContainer from '../../containers/form/SelectContainer';
import RegistryEntrySelectContainer from '../../containers/form/RegistryEntrySelectContainer';
import { t, pluralize } from '../../../../lib/utils';

export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showErrors: false, 
            showSubForm: false,
            values: this.props.values || {},
            errors: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleErrors = this.handleErrors.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubFormSubmit = this.handleSubFormSubmit.bind(this);
    }

    componentDidMount() {
        //this.initErrors();
        this.initValues();
    }

    handleChange(name, value) {
        // name should be e.g. translations_attributes-de-url-13
        let nameParts = name.split('-');
        if (nameParts[0] === 'translations_attributes') {
            let index = this.state.values.translations_attributes.findIndex((t) => t.locale === nameParts[1]);
            index = index === -1 ? this.state.values.translations_attributes.length : index;
            let translation = Object.assign({}, this.state.values.translations_attributes[index], {
                locale: nameParts[1],
                id: nameParts[3],
                [nameParts[2]]: value
            })

            this.setState({values: Object.assign({}, this.state.values, {
                translations_attributes: Object.assign([], this.state.values.translations_attributes, {[index]: translation})
            })})
        } else {
            this.setState({ 
                values: Object.assign({}, this.state.values, {[name]: value})
            })
        }
    }

    handleSubmit(event) {
        let _this = this;
        event.preventDefault();
        if(this.valid()) {
            //
            // for RichTextEditor (react rte) it is more performant to do the 'toString calculution only once, before submit
            //
            this.props.elements.filter(element => element.elementType === 'richTextEditor').map((element,index) => {
                _this.setState({
                    values: Object.assign({}, _this.state.values, {[element.attribute]: _this.state.values[element.attribute].toString('html')})
                })
            })
            this.props.elements.filter(element => element.elementType === 'multiLocaleRichTextEditor').map((element,index) => {
                _this.setState({
                    values: Object.assign({}, this.state.values, {
                        translations_attributes: Object.assign([], 
                            this.state.values.translations_attributes, 
                            this.state.values.translations_attributes.map((t,i) => {
                                return t[element.attribute] = t[element.attribute].toString('html');
                            })
                        )
                    })
                })
            })

            this.props.onSubmit({[this.props.scope || this.props.submitScope]: this.state.values});
            if (typeof(this.props.onSubmitCallback) === "function") {
                this.props.onSubmitCallback()
            }
        } 
    }

    initValues() {
        let values = this.state.values;
        if (this.props.data) {
            values.id = this.props.data.type === 'Interview' ? this.props.data.archive_id : this.props.data.id
            values.translations_attributes = this.props.data.translations;
        } else {
            values.translations_attributes = [];
        }

        this.props.elements.map((element, index) => {
            //if (element.elementType === 'multiLocaleRichTextEditor') {
                //values.translations_attributes.map((t,i) => {
                    //return t[element.attribute] = t[element.attribute] ?
                        //RichTextEditor.createValueFromString(t[element.attribute], 'html') : 
                        //RichTextEditor.createEmptyValue()
                //})
            //} else if (element.elementType === 'richTextEditor') {
                //values[element.attribute] = (this.props.data && this.props.data[element.attribute]) ?
                    //RichTextEditor.createValueFromString(this.props.data[element.attribute], 'html') : 
                    //RichTextEditor.createEmptyValue()
            //} else {
                let isTranslationsAttribute = values.translations_attributes[0] && values.translations_attributes[0].hasOwnProperty(element.attribute);
                if (!isTranslationsAttribute) 
                    values[element.attribute] = element.value || (this.props.data && this.props.data[element.attribute])
            //}
        })
        this.setState({ values: values });
    }

    initErrors() {
        let errors = {};
        this.props.elements.map((element, index) => {
            let error = false;
            let value = element.value || (this.props.data && this.props.data[element.attribute]);
            if (typeof(element.validate) === 'function') {
                error = !element.validate(value);
            }
            errors[element.attribute] = error;
        })
        //this.setState({ errors: errors });
        return errors;
    }

    handleErrors(name, bool) {
        this.setState({ 
            errors: Object.assign({}, this.state.errors, {[name]: bool})
        })
    }

    valid() {
        let errors = this.initErrors();
        let showErrors = false;
        Object.keys(errors).map((name, index) => {
            let hidden = this.props.elements.filter(element => element.attribute === name)[0] && this.props.elements.filter(element => element.attribute === name)[0].hidden;
            showErrors = (!hidden && errors[name]) || showErrors;
        })
        this.setState({showErrors: showErrors, errors: errors});
        return !showErrors;
    }

    deleteSubScopeValue(index) {
        return <span
            className='flyout-sub-tabs-content-ico-link'
            title={t(this.props, 'delete')}
            onClick={() => {
                let subScopeValues = this.state.values[`${pluralize(this.props.subFormScope)}_attributes`];
                this.setState({ 
                    values: Object.assign({}, this.state.values, {
                        [`${pluralize(this.props.subFormScope)}_attributes`]: subScopeValues.slice(0,index).concat(subScopeValues.slice(index+1))
                    })
                })
            }}
        >
            <i className="fa fa-trash-o"></i>
        </span>
    }

    subFormScopeAsRailsAttributes() {
        return `${pluralize(this.props.subFormScope)}_attributes`;
    }

    selectedSubScopeValues() {
        if (this.props.subFormScope && this.state.values[this.subFormScopeAsRailsAttributes()]) {
            return (
                <div>
                    <h4 className='nested-value-header'>{t(this.props, `${pluralize(this.props.subFormScope)}.title`)}</h4>
                    {this.state.values[this.subFormScopeAsRailsAttributes()].map((value, index) => {
                        return (
                            <p key={`${this.props.scope}-${this.props.subScope}-${index}`} >
                                <span className='flyout-content-data'>{this.props.subScopeRepresentation(value)}</span>
                                {this.deleteSubScopeValue(index)}
                            </p>
                        )
                    })}
                </div>
            )
        }
    }

    // props is a dummy here
    handleSubFormSubmit(props, params) {
        let nestedValues = this.state.values[this.subFormScopeAsRailsAttributes()] || [];
        this.setState({ 
            values: Object.assign({}, this.state.values, {
                [this.subFormScopeAsRailsAttributes()]: [...nestedValues, params[this.props.subFormScope]]
            }),
            showSubForm: false
        })
    }

    toggleSubForm() {
        if (this.props.subForm) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, `edit.${this.props.subFormScope}.new`)}
                    onClick={() => this.setState({showSubForm: !this.state.showSubForm})}
                >
                    <div>
                        {t(this.props, `${pluralize(this.props.subFormScope)}.add`) + '  '}
                        <i className={`fa fa-${this.state.showSubForm ? 'times' : 'plus'}`}></i>
                    </div>
                </div>
            )
        }
    }

    subForm() {
        if (this.props.subForm && this.state.showSubForm) {
            if (!this.props.data) {
                this.props.subFormProps.submitData = this.handleSubFormSubmit;
            } else {
                let _this = this;
                this.props.subFormProps.onSubmitCallback = function(props, params){_this.setState({showSubForm: false})};
            }
            return (
                <div>
                    {React.createElement(this.props.subForm, this.props.subFormProps)}
                </div>
            )
        }
    }

    components() {
        return {
            select: SelectContainer,
            registryEntrySelect: RegistryEntrySelectContainer,
            input: InputContainer,
            multiLocaleInput: MultiLocaleInputContainer,
            multiLocaleTextarea: MultiLocaleTextareaContainer,
            multiLocaleRichTextEditor: MultiLocaleRichTextEditorContainer,
            richTextEditor: RichTextEditor,
            textarea: TextareaContainer
        }
    }

    elementComponent(props) {
        props['scope'] = props.scope || this.props.scope;
        props['showErrors'] = this.state.errors[props.attribute];
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

    cancelButton() {
        if (typeof(this.props.cancel) === 'function') {
            return (
                <input 
                    type='button' 
                    value={t(this.props, 'cancel')} 
                    onClick={() => this.props.cancel()} 
                />
            )
        }
    }

    render() {
        return (
            <div>
                {this.selectedSubScopeValues()}
                {this.subForm()}
                {this.toggleSubForm()}
                <form 
                    id={this.props.formId || this.props.scope} 
                    className={this.props.formClasses || `${this.props.scope} default`} 
                    onSubmit={this.handleSubmit}
                >

                    {this.props.elements.map((props, index) => {
                        if(props.condition === undefined || props.condition === true) {
                            return this.elementComponent(props);
                        }
                    })}

                    <input type="submit" value={t(this.props, this.props.submitText || 'submit')}/>
                    {this.cancelButton()}
                </form>
            </div>
        );
    }
}
