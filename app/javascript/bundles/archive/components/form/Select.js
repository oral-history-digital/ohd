import React from 'react';
import ElementContainer from '../../containers/form/ElementContainer';
import { t } from '../../../../lib/utils';

export default class Select extends React.Component {

    // props are:
    //   @scope
    //   @attribute
    //   @values
    //   @selected
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

        if (this.props.validate(value)) {
            this.props.handleErrors(name, false);
            this.setState({valid: true})
        } else {
            this.props.handleErrors(name, true);
            this.setState({valid: false})
        }
    }

    options() {
        let opts = this.props.values.map((value, index) => {
            return (
                <option value={value}>
                    {t(this.props, `${this.props.scope}.${this.props.attribute}s.${value}`)}
                </option>
            )}
        )
        if (this.props.withEmpty) {
            opts.unshift(
                <option value=''>
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
                showErrors={this.props.showErrors}
                valid={this.state.valid}
                mandatory={this.props.validate !== undefined}
            >
                <select 
                    name={this.props.attribute}
                    value={this.props.selected}
                    onChange={this.handleChange}
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
