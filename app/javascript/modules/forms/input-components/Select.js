import { Component } from 'react';

import { t } from 'modules/i18n';
import Element from '../Element';

export default class Select extends Component {

    // props are:
    //   @scope
    //   @attribute
    //   @values
    //   @validate = function
    //   @handleChange = function
    //   @handleErrors = function
    //   @help

    constructor(props, context) {
        super(props);
        this.state = {
            valid: props.valid !== undefined ? props.valid : !props.validate,
        };

        this.handleChange = this.handleChange.bind(this);
        this.selectTextAndValueFunction = this.selectTextAndValueFunction.bind(this);
    }

    handleChange(event) {
        const value =  event.target.value;
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

    selectTextAndValueFunction(value) {
        const {
            doNotTranslate,
            locale,
            translations,
            optionsScope,
            scope,
            attribute
        } = this.props;

        if (typeof value === 'string') {
            let translationPrefix = optionsScope || `${scope}.${attribute}`;
            return function(value) {
                return {
                    text: doNotTranslate ? value : t({ locale, translations }, `${translationPrefix}.${value}`),
                    value: value
                }
            }
        } else {
            return function(value) {
                return {
                    text: (value.name && value.name[locale]) || (typeof value.name === 'string') && value.name,
                    value: value.value || value.id
                }
            }
        }
    }

    options() {
        let opts = [];
        let values;

        if (this.props.values) {
            if (Array.isArray(this.props.values)) {
                values = this.props.values;
            } else {
                values = Object.keys(this.props.values).map((id, i) => {
                    return {id: id, name: this.props.values[id].name}
                })
            }
        } else if (this.props.data && this.props.attribute === 'workflow_state') {
            values = this.props.data.workflow_states;
        }

        if (values) {
            let getTextAndValue = this.selectTextAndValueFunction(values[0]);
            if (!this.props.keepOrder === true) {
                values.
                sort((a,b) => {
                  let textA = getTextAndValue(a,).text;
                  let textB = getTextAndValue(b).text;
                  return (new Intl.Collator(this.props.locale).compare(textA, textB))
             })
           }

            opts = values.
                map((value, index) => {
                    if (value) {
                        let textAndValue = getTextAndValue(value, this.props);
                        return (
                            <option value={textAndValue.value} key={`${this.props.scope}-${index}`}>
                                {textAndValue.text}
                            </option>
                        )
                    }
                }
            )
        }

        if (this.props.withEmpty) {
            opts.unshift(
                <option value='' key={`${this.props.scope}-choose`}>
                    {t(this.props, 'choose')}
                </option>
            )
        }
        return opts;
    }

    render() {
        const {
            data,
            attribute,
            scope,
            className,
            validate,
            hidden,
            label,
            labelKey,
            showErrors,
            help,
            individualErrorMsg,
            handlechangecallback
        } = this.props;

        const value = this.props.value !== undefined ?
            this.props.value :
            (data?.[attribute] || '');

        return (
            <Element
                scope={scope}
                attribute={attribute}
                label={label}
                labelKey={labelKey}
                showErrors={showErrors}
                className={className}
                hidden={hidden}
                valid={this.state.valid}
                mandatory={typeof(validate) === 'function'}
                elementType='select'
                individualErrorMsg={individualErrorMsg}
                help={help}
            >
                <select
                    name={attribute}
                    className="Input"
                    value={value}
                    onChange={this.handleChange}
                    handlechangecallback={handlechangecallback}
                >
                    {this.options()}
                </select>
            </Element>
        );
    }

}
