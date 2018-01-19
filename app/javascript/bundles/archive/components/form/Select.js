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
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onChange(event);

        const value =  event.target.value;

        if (this.props.validate(value)) {
            this.props.handleErrors(false);
            this.setState({valid: false})
        } else {
            this.props.handleErrors(true);
            this.setState({valid: true})
        }
    }

    options() {
        return this.props.values.map((value, index) => {
            return (
                <option value={value}>
                    {this.props.textMethod(scope, value)}
                </option>
            )}
        )
    }

    //text(value) {
        //let text;
        //try{
            //text = this.props.translations[this.props.locale][this.props.scope][value];
        //} catch(e) {
            //text = `translation for ${this.props.locale}.${this.props.scope}.${value} is missing!`;
        //} finally {
            //return text;
        //}
    //}

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
