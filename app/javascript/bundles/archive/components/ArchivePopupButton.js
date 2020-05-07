import React from 'react';
import { t } from '../../../lib/utils';

export default class ArchivePopupButton extends React.Component {

    // props:
    //
    // titleKey, buttonFaKey, content
    // e.g.:
    // titleKey='edit.contribution.edit'
    // buttonFaKey='pencil'
    // content={<div>bla bla</div>}
    //
    render() {
        return (
            <span
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, this.props.titleKey)}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, this.props.titleKey),
                    content: this.props.content
                })}
            >
                <i className={`fa fa-${this.props.buttonFaKey}`}></i>
            </span>
        )
    }
}
