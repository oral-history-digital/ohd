import { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte-17';
import { FaCheckCircle, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import classNames from 'classnames';

import { TreeSelectContainer } from 'modules/tree-select';
import NestedScope from './NestedScope';
import InputContainer from './input-components/InputContainer';
import Textarea from './input-components/Textarea';
import SelectContainer from './input-components/SelectContainer';
import ColorPicker from './input-components/ColorPicker';
import RegistryEntrySelectContainer from './input-components/RegistryEntrySelectContainer';
import SpeakerDesignationInputs from './input-components/SpeakerDesignationInputs';
import MultiLocaleWrapperContainer from './MultiLocaleWrapperContainer';
import { pluralize } from 'modules/strings';
import { t } from 'modules/i18n';

export default class FormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: this.initValues(),
            errors: this.initErrors()
        };

        this.handleErrors = this.handleErrors.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNestedFormSubmit = this.handleNestedFormSubmit.bind(this);
        this.writeNestedObjectToStateValues = this.writeNestedObjectToStateValues.bind(this);
        this.deleteNestedObject = this.deleteNestedObject.bind(this);
    }

    initValues() {
        let values = { ...this.props.values };
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
        const { elements } = this.props;
        const { errors } = this.state;

        let hasErrors = false;

        Object.keys(errors).forEach(name => {
            const element = elements.find(element => element.attribute === name);

            const isHidden = element?.hidden;
            const isOptional = element?.optional;

            hasErrors = hasErrors || (!isHidden && !isOptional && errors[name]);
        })

        return !hasErrors;
    }

    handleSubmit(event) {
        let _this = this;
        event.preventDefault();

        if(this.valid()) {
            this.props.onSubmit({[this.props.scope || this.props.submitScope]: this.state.values}, this.props.index);
            if (typeof(this.props.onSubmitCallback) === "function") {
                this.props.onSubmitCallback()
            }
        }
    }

    deleteNestedObject(index, scope) {
        let nestedObjects = this.state.values[this.nestedRailsScopeName(scope)];
        this.setState({
            values: Object.assign({}, this.state.values, {
                [this.nestedRailsScopeName(scope)]: nestedObjects.slice(0,index).concat(nestedObjects.slice(index+1))
            })
        })
    }

    nestedRailsScopeName(scope) {
        return `${pluralize(scope)}_attributes`;
    }

    writeNestedObjectToStateValues(params, identifier, index) {
        // for translations identifier is 'locale' to not multiply translations
        identifier ||= 'id';
        let scope = Object.keys(params)[0];
        let nestedObject = params[scope];
        let nestedObjects = this.state.values[this.nestedRailsScopeName(scope)] || [];
        if (index === undefined)
            index = nestedObjects.findIndex((t) => nestedObject[identifier] && t[identifier] === nestedObject[identifier]);
        index = index === -1 ? nestedObjects.length : index;

        this.setState({values: Object.assign({}, this.state.values, {
            [this.nestedRailsScopeName(scope)]: Object.assign([], nestedObjects, {
                [index]: Object.assign({}, nestedObjects[index], nestedObject)
            })
        })})
    }

    // props is a dummy here
    handleNestedFormSubmit(props, params, index) {
        this.writeNestedObjectToStateValues(params, null, index);
    }

    nestedScopes() {
        return this.props.nestedScopeProps?.map(props => {
            return (
                <NestedScope key={props.scope} {...props}
                    onSubmit={this.handleNestedFormSubmit}
                    onDelete={this.deleteNestedObject}
                    getNewElements={() => this.state.values[this.nestedRailsScopeName(props.scope)]}
                />
            )
        })
    }

    components() {
        return {
            select: SelectContainer,
            registryEntrySelect: RegistryEntrySelectContainer,
            registryEntryTreeSelect: TreeSelectContainer,
            input: InputContainer,
            richTextEditor: RichTextEditor,
            textarea: Textarea,
            speakerDesignationInputs: SpeakerDesignationInputs,
            colorPicker: ColorPicker,
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

    render() {
        const { onCancel, className, children, elements, formId, formClasses,
            scope, submitText, nested } = this.props;

        return (
            <div className={className}>
                {this.nestedScopes()}
                <form
                    id={formId || scope}
                    className={classNames('Form', formClasses, {
                        [`${scope} default`]: !formClasses,
                    })}
                    onSubmit={this.handleSubmit}
                >

                    {children}

                    {elements.map(props => {
                        if(props.condition === undefined || props.condition === true) {
                            return this.elementComponent(props);
                        }
                    })}

                    <div className="Form-footer u-mt">
                        { nested ?
                            <button
                                type="submit"
                                className="Button Button--transparent Button--icon"
                                value={t(this.props, submitText || 'submit')}
                            >
                                <FaCheckCircle className="Icon Icon--editorial" />
                            </button> :
                            <input
                                type="submit"
                                className="Button Button--primaryAction"
                                value={t(this.props, submitText || 'submit')}
                            />
                        }
                        {typeof onCancel === 'function' && (
                            nested ?
                                <button
                                    className="Button Button--transparent Button--icon"
                                    title={t(this.props, 'edit.default.cancel')}
                                    onClick={onCancel}
                                >
                                    <FaTimes className="Icon Icon--editorial" />
                                </button> :
                                <input
                                    type="button"
                                    className="Button Button--secondaryAction"
                                    value={t(this.props, 'cancel')}
                                    onClick={onCancel}
                                />
                        )}
                    </div>
                </form>
            </div>
        );
    }
}

FormComponent.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    onCancel: PropTypes.func,
};
