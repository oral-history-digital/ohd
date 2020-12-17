import React from 'react';
import AuthorizedContent from './AuthorizedContent';
import { t } from 'lib/utils';

export default class ArchivePopupButton extends React.Component {

    // props:
    //
    // titleKey, buttonFaKey, content, authorizedObject
    // e.g.:
    // titleKey='edit.contribution.edit'
    // buttonFaKey='pencil'
    // content={<div>bla bla</div>}
    // authorizedObject={this.props.interview}
    //
    render() {
        const title = t(this.props, this.props.titleKey);

        return (
            <AuthorizedContent object={this.props.authorizedObject}>
                <span
                    className='flyout-sub-tabs-content-ico-link'
                    title={title}
                    onClick={() => this.props.openArchivePopup({
                        title: title,
                        content: this.props.content
                    })}
                >
                    <i className={`fa fa-${this.props.buttonFaKey}`}></i>
                    {title}
                </span>
            </AuthorizedContent>
        )
    }
}
