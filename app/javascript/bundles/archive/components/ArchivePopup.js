import React from 'react';
import {render} from 'react-dom';

export default class ArchivePopup extends React.Component {

    css() {
        let css = 'lightbox';
        css += this.props.popup.show ? '' : ' hidden';
        css += ` ${this.props.popup.className || ''}`;
        return css;
    }

    buttons() {
        return <div className='close' onClick={() => this.props.closeArchivePopup()}>
            X
        </div>
    }

    render() {
        return (
            <div className={this.css()}>
                <div className={'popup'}>
                    <div className={'popup-content-container'}>
                        <h3 className={'popup-content-title'}>{this.props.popup.title}</h3>
                        <div className='content'> {this.props.popup.content} </div>
                    </div>
                    {this.buttons()}
                </div>
            </div>
        );
    }
}
