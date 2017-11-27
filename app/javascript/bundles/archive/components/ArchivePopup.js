import React from 'react';
import {render} from 'react-dom';

export default class ArchivePopup extends React.Component {

    constructor(props) {
        super(props);
        this.stopClicks = this.stopClicks.bind(this);
    }

    stopClicks(event){
        console.log("clicks");
        event.stopPropagation();
        return false;
    }

    css() {
        let css = 'lightbox';
        css += this.props.popup.show ? '' : ' hidden';
        css += ` ${this.props.popup.className || ''}`;
        return css;
    }

    buttons() {
        return <div className='close' onClick={() => this.props.closeArchivePopup()}>

        </div>
    }

    header() {
        if (this.props.popup.title) {
            return (<h3 className={'popup-content-title'}>{this.props.popup.title}</h3>)
        }

    }

    render() {
        return (
            <div className={this.css()} onClick={() => this.props.closeArchivePopup()} >
                <div className={'popup'} onClick={this.stopClicks}>
                    {this.header()}
                    <div className='content'> {this.props.popup.content} </div>
                    {this.buttons()}
                </div>
            </div>
        );
    }
}
