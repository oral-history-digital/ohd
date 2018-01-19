import React from 'react';

export default class Element extends React.Component {

    // props are:
    //   @scope
    //   @attribute
    //   @valid = boolean
    //   @mandatory = boolean
    //   @textMethod = function

    //text(error=false) {
        //let scope = error ? this.props.scope + '_errors' : this.props.scope;
        //let text;
        //try{
            //text = this.props.translations[this.props.locale][scope][this.props.attribute];
        //} catch(e) {
            //text = `translation for ${this.props.locale}.${scope}.${this.props.attribute} is missing!`;
        //} finally {
            //return text;
        //}
    //}

    label() {
        let mandatory = this.props.mandatory ? ' *' : '';
        return (
            <label for={`${this.props.scope}_${this.props.attribute}`}>
                {this.props.textMethod(this.props.scope, this.props.attribute, false) + mandatory}
            </label>
        );
    }

    error() {
        if (this.props.valid) {
            return null;
        } else {
            return (
                <div className='error'>
                    {this.props.textMethod(this.props.scope, this.props.attribute, true)}
                </div>
            )
        }
    }

    render() {
        return (
            <div className='form-group'>
                <div className='form-label'>
                    {this.label()}
                    {this.error()}
                </div>
                <div className='form-input'>
                    {this.props.children}
                </div>
            </div>
        );
    }

}
