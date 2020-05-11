import React from 'react';

export default class ContentField extends React.Component {

    render() {
        return (
            <p className={this.props.className} key={`content-field-${this.props.label}-${this.props.value}`}>
                <span className="flyout-content-label">{this.props.label}:</span>
                <span className={"flyout-content-data " + this.props.className}>{this.props.value || '---'}</span>
                {this.props.children}
            </p>
        )
    }

}
