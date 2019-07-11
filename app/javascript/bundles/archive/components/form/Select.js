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
            valid: this.props.validate === undefined,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const value =  event.target.value;
        const name =  event.target.name;

        this.props.handleChange(name, value);

        if (typeof this.props.handlechangecallback === 'function') {
            this.props.handlechangecallback(name, value);
        }

        if (this.props.validate !== undefined) {
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
            if (props.optionsScope) { 
                return function(value, props) {
                    return {
                        text: t(props, `${props.optionsScope}.${value}`),
                        value: value
                    }
                }
            } else {
                return function(value, props) {
                    return {
                        text: t(props, `${props.scope}.${props.attribute}.${value}`),
                        value: value
                    }
                }
            }
        } else {
            return function(value, props) {
                return {
                    text: value.name[props.locale] || (typeof value.name === 'string') && value.name,
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
            values = this.props.data.transitions_to;
        }

        if (values) {
            let getTextAndValue = this.selectTextAndValueFunction(values[0], this.props);
            let _this = this;
            opts = values.
                sort(function(a,b){
                    let textA = getTextAndValue(a, _this.props).text;
                    let textB = getTextAndValue(b, _this.props).text;
                    return((textA > textB) - (textA < textB))
                }).
                map((value, index) => {
                    let textAndValue = getTextAndValue(value, this.props);
                    return (
                        <option value={textAndValue.value} key={`${this.props.scope}-${index}`}>
                            {textAndValue.text}
                        </option>
                    )
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
        return (
            <ElementContainer
                scope={this.props.scope}
                attribute={this.props.attribute}
                label={this.props.label}
                showErrors={this.props.showErrors}
                css={this.props.css}
                hidden={this.props.hidden}
                valid={this.state.valid}
                mandatory={this.props.validate !== undefined}
                elementType='select'
                individualErrorMsg={this.props.individualErrorMsg}
            >
                <select 
                    name={this.props.attribute}
                    value={this.props.value}
                    onChange={this.handleChange}
                    handlechangecallback={this.props.handlechangecallback}
                >
                    {this.options()}
                </select>
                <p className='help-block'>
                    {this.props.help}
                </p>
            </ElementContainer>
        );
    }

}
