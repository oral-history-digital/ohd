import React from 'react';
import Element from './Element';

export default class Select extends React.Component {

    // props are:
    //   @scope
    //   @attribute
    //   @values
    //   @selected
    //   @validate = function
    //   @handleChange = function
    //   @handleErrors = function
    //   @textMethod   = function
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
                    {this.props.textMethod(this.props.scope, value)}
                </option>
            )}
        )
        if (this.props.withEmpty) {
            opts.unshift(
                <option value=''>
                    {this.props.textMethod(this.props.scope, 'choose')}
                </option>
            )
        }
        return opts;
    }

    render() {
        return (
            <Element
                scope={this.props.scope}
                attribute={this.props.attribute}
                valid={this.state.valid}
                mandatory={this.props.validate !== undefined}
                textMethod={this.props.textMethod}
            >
                <select 
                    name={this.props.attribute}
                    value={this.props.selected}
                    onChange={this.handleChange}
                >
                    {this.options()}
                </select>
                {this.props.help}
            </Element>
        );
    }

}
