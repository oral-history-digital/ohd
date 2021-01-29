import React from 'react';
import ElementContainer from '../../containers/form/ElementContainer';
import { t } from '../../../../lib/utils';

export default class Select extends React.Component {

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
            valid: !this.props.validate,
        };

        this.handleChange = this.handleChange.bind(this);
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

    selectTextAndValueFunction(value, props) {
        if (typeof value === 'string') {
            let translationPrefix = props.optionsScope || `${props.scope}.${props.attribute}`;
            return function(value, props) {
                return {
                    text: props.doNotTranslate ? value : t(props, `${translationPrefix}.${value}`),
                    value: value
                }
            }
        } else {
            return function(value, props) {
                return {
                    text: (value.name && value.name[props.locale]) || (typeof value.name === 'string') && value.name,
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
            let getTextAndValue = this.selectTextAndValueFunction(values[0], this.props);
            let _this = this;
            if (!this.props.keepOrder === true) {
                values.
                sort(function(a,b){
                  let textA = getTextAndValue(a, _this.props).text;
                  let textB = getTextAndValue(b, _this.props).text;
                  return(new Intl.Collator(_this.props.locale).compare(textA, textB))
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
        let value = this.props.value || this.props.data && this.props.data[this.props.attribute] || '';
        return (
            <ElementContainer
                scope={this.props.scope}
                attribute={this.props.attribute}
                label={this.props.label}
                labelKey={this.props.labelKey}
                showErrors={this.props.showErrors}
                css={this.props.css}
                hidden={this.props.hidden}
                valid={this.state.valid}
                mandatory={typeof(this.props.validate) === 'function'}
                elementType='select'
                individualErrorMsg={this.props.individualErrorMsg}
                help={this.props.help}
            >
                <select
                    name={this.props.attribute}
                    value={value}
                    onChange={this.handleChange}
                    handlechangecallback={this.props.handlechangecallback}
                >
                    {this.options()}
                </select>
            </ElementContainer>
        );
    }

}
