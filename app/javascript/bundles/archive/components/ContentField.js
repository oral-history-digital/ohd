import React from 'react';

export default class ContentField extends React.Component {

    label() {
        if (!this.props.noLabel) {
            return (
                <span className="flyout-content-label">{this.props.label}:</span>
            )
        }
    }

    render() {
        return (
            <p className={this.props.className} key={`content-field-${this.props.label}-${this.props.value}`}>
                {this.label()}
                <span className={"flyout-content-data " + this.props.className}>{this.props.value || '---'}</span>
                {this.props.children}
            </p>
        )
    }

}
