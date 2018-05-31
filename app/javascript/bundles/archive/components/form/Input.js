import React from 'react';
import ElementContainer from '../../containers/form/ElementContainer';

export default class Input extends React.Component {

    // props are:
    //   @scope
    //   @attribute = attribute name
    //   @type 
    //   @value = default value
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
        const value =  event.target.files ? event.target.files[0] : event.target.value;
        const name =  event.target.name;

        this.props.handleChange(name, value);

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

    render() {
        return (
            <ElementContainer
                scope={this.props.scope}
                attribute={this.props.attribute}
                label={this.props.label}
                showErrors={this.props.showErrors}
                valid={this.state.valid}
                mandatory={this.props.validate !== undefined}
            >
                <input 
                    type={this.props.type} 
                    name={this.props.attribute}
                    value={this.props.value}
                    onChange={this.handleChange}
                />
                <p className='help-block'>
                    {this.props.help}
                </p>
            </ElementContainer>
        );
    }

}
