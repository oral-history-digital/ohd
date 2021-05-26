import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte-17';

import { TreeSelectContainer } from 'modules/tree-select';
import InputContainer from './InputContainer';
import TextareaContainer from './TextareaContainer';
import SelectContainer from './SelectContainer';
import RegistryEntrySelectContainer from './RegistryEntrySelectContainer';
import MultiLocaleWrapperContainer from './MultiLocaleWrapperContainer';
import SpeakerDesignationInputs from './SpeakerDesignationInputs';
import { pluralize } from 'modules/strings';
import { t } from 'modules/i18n';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNestedForm: false,
            values: this.initValues(),
            errors: this.initErrors()
        };

        this.handleErrors = this.handleErrors.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNestedFormSubmit = this.handleNestedFormSubmit.bind(this);
    }

    initValues() {
        let values = this.props.values || {};
        if (this.props.data)
            values.id = this.props.data.type === 'Interview' ? this.props.data.archive_id : this.props.data.id;
        return values;
    }

    initErrors() {
        let errors = {};
        this.props.elements.map((element) => {
            let error = false;
            if (typeof(element.validate) === 'function') {
                let value = element.value || (this.props.data && this.props.data[element.attribute]);
                error = !(value && element.validate(value));
            }
            errors[element.attribute] = error;
        })
        return errors;
    }

    handleErrors(name, bool) {
        this.setState({
            errors: Object.assign({}, this.state.errors, {[name]: bool})
        })
    }

    handleChange(name, value, params, identifier) {
        if (params && !name && !value) {
            this.writeNestedObjectToStateValues(params, identifier);
        } else {
            this.setState({
                values: Object.assign({}, this.state.values, {[name]: value})
            })
        }
    }

    valid() {
        let showErrors = false;
        Object.keys(this.state.errors).map((name, index) => {
            let hidden = this.props.elements.filter(element => element.attribute === name)[0] && this.props.elements.filter(element => element.attribute === name)[0].hidden;
            showErrors = (!hidden && this.state.errors[name]) || showErrors;
        })
        return !showErrors;
    }

    handleSubmit(event) {
        let _this = this;
        event.preventDefault();
        if(this.valid()) {
            this.props.onSubmit({[this.props.scope || this.props.submitScope]: this.state.values});
            if (typeof(this.props.onSubmitCallback) === "function") {
                this.props.onSubmitCallback()
            }
        }
    }

    deleteNestedObject(index) {
        return <span
            className='flyout-sub-tabs-content-ico-link'
            title={t(this.props, 'delete')}
            onClick={() => {
                let nestedObjects = this.state.values[this.nestedRailsScopeName(this.props.nestedFormScope)];
                this.setState({
                    values: Object.assign({}, this.state.values, {
                        [this.nestedRailsScopeName(this.props.nestedFormScope)]: nestedObjects.slice(0,index).concat(nestedObjects.slice(index+1))
                    })
                })
            }}
        >
            <i className="fa fa-trash-o"></i>
        </span>
    }

    nestedRailsScopeName(scope) {
        return `${pluralize(scope)}_attributes`;
    }

    writeNestedObjectToStateValues(params, identifier) {
        // for translations identifier is 'locale' to not multiply translations
        identifier ||= 'id';
        let scope = Object.keys(params)[0];
        let nestedObject = params[scope];
        let nestedObjects = this.state.values[this.nestedRailsScopeName(scope)] || [];
        let index = nestedObjects.findIndex((t) => nestedObject[identifier] && t[identifier] === nestedObject[identifier]);
        index = index === -1 ? nestedObjects.length : index;

        this.setState({values: Object.assign({}, this.state.values, {
            [this.nestedRailsScopeName(scope)]: Object.assign([], nestedObjects, {
                [index]: Object.assign({}, nestedObjects[index], nestedObject)
            })
        })})
    }

    showNewNestedObjects() {
        if (this.props.nestedFormScope && this.state.values[this.nestedRailsScopeName(this.props.nestedFormScope)]) {
            return (
                <div>
                    <h4 className='nested-value-header'>{t(this.props, `${pluralize(this.props.nestedFormScope)}.title`)}</h4>
                    {this.state.values[this.nestedRailsScopeName(this.props.nestedFormScope)].map((value, index) => {
                        return (
                            <p key={`${this.props.scope}-${this.props.nestedScope}-${index}`} >
                                <span className='flyout-content-data'>{this.props.nestedScopeRepresentation(value)}</span>
                                {this.deleteNestedObject(index)}
                            </p>
                        )
                    })}
                </div>
            )
        }
    }

    // props is a dummy here
    handleNestedFormSubmit(props, params) {
        this.writeNestedObjectToStateValues(params);
        this.setState({ showNestedForm: false });
    }

    toggleNestedForm() {
        if (this.props.nestedForm) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link u-mb u-ml-none'
                    title={t(this.props, `edit.${this.props.nestedFormScope}.new`)}
                    onClick={() => this.setState({showNestedForm: !this.state.showNestedForm})}
                >
                    <div>
                        {t(this.props, `${pluralize(this.props.nestedFormScope)}.add`) + '  '}
                        <i className={`fa fa-${this.state.showNestedForm ? 'times' : 'plus'}`}></i>
                    </div>
                </div>
            )
        }
    }

    nestedForm() {
        if (this.props.nestedForm && this.state.showNestedForm) {
            this.props.nestedFormProps.formClasses = 'nested-form default';
            if (!this.props.data) {
                this.props.nestedFormProps.submitData = this.handleNestedFormSubmit;
            } else {
                let _this = this;
                this.props.nestedFormProps.onSubmitCallback = function(props, params){_this.setState({showNestedForm: false})};
            }
            return (
                <div>
                    {createElement(this.props.nestedForm, this.props.nestedFormProps)}
                </div>
            );
        }
    }

    components() {
        return {
            select: SelectContainer,
            registryEntrySelect: RegistryEntrySelectContainer,
            registryEntryTreeSelect: this.props.treeSelectEnabled ? TreeSelectContainer : RegistryEntrySelectContainer,
            input: InputContainer,
            richTextEditor: RichTextEditor,
            textarea: TextareaContainer,
            speakerDesignationInputs: SpeakerDesignationInputs,
        }
    }

    elementComponent(props) {
        props.scope = props.scope || this.props.scope;
        props.showErrors = this.state.errors[props.attribute];
        props.handleChange = this.handleChange;
        props.handleErrors = this.handleErrors;
        props.key = props.attribute;
        props.value = this.state.values[props.attribute] || props.value;
        props.data = this.props.data;

        // set defaults for the possibillity to shorten elements list
        if (!props.elementType) {
            props.elementType = 'input';
            props.type = 'text';
        }

        if (props.multiLocale) {
            return createElement(MultiLocaleWrapperContainer, props);
        } else {
            return createElement(this.components()[props.elementType], props);
        }
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
            <div className={this.props.className}>
                {this.showNewNestedObjects()}
                {this.nestedForm()}
                {this.toggleNestedForm()}
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

                    {this.props.children}

                    <input type="submit" value={t(this.props, this.props.submitText || 'submit')}/>
                    {this.cancelButton()}
                </form>
            </div>
        );
    }
}

Form.propTypes = {
    treeSelectEnabled: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
};
