import React from 'react';
import { t } from '../../../lib/utils';
import AuthShowContainer from '../containers/AuthShowContainer';

export default class InterviewTextMaterials extends React.Component {

    to() {
        return '/' + this.props.locale + '/interviews/' + this.props.interview.archive_id;
    }

    download(lang, condition) {
        if (condition) {
            let textKey = this.props.interview.lang === lang ? 'transcript' : 'translation';
            return (
                <p>
                    <a href={`${this.to()}.pdf?lang=${lang}`}>
                        <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download')}></i>
                        <span>{t(this.props, textKey)}</span>
                    </a>
                </p>
            )
        } else {
            return null;
        }
    }

    render() {
        if (this.props.interview) {
            return (
                <div>
                    <AuthShowContainer ifLoggedIn={true}>
                        {this.download(this.props.interview.lang, true)}
                        {this.download(this.props.locale, (this.props.interview.languages.indexOf(this.props.locale) > -1 && this.props.interview.lang !== this.props.locale))}
                    </AuthShowContainer>
                </div>
            );
        } else {
            return null;
        }
    }
}

