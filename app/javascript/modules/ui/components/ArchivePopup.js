import { Component } from 'react';
import { FaTimes } from 'react-icons/fa';

import { ErrorBoundary } from 'modules/react-toolbox';

export default class ArchivePopup extends Component {

    constructor(props) {
        super(props);
        this.stopClicks = this.stopClicks.bind(this);
    }

    stopClicks(event){
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
        const { closeArchivePopup } = this.props;

        return (
            <button
                type="button"
                className="Button Button--transparent Button--icon close"
                onClick={closeArchivePopup}
            >
                <FaTimes className="Icon Icon--large Icon--unobtrusive" />
            </button>
        );
    }

    header() {
        if (this.props.popup.title) {
            return (<h3 className={'popup-content-title'}>{this.props.popup.title}</h3>)
        }
    }

    render() {
        if (this.props.popup.show) {
            let popCss = this.props.popup.big ? 'popup big' : 'popup';
            return (
                <div className={this.css()} onClick={() => this.props.closeArchivePopup()}>
                    <div className={popCss} onClick={this.stopClicks}>
                        {this.header()}

                        <ErrorBoundary>
                            <div className='content'>{this.props.popup.content}</div>
                        </ErrorBoundary>

                        {this.buttons()}
                    </div>
                </div>
            );
        }
        return null;
    }
}
