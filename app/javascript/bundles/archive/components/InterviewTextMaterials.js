import React from 'react';
import { t } from '../../../lib/utils';
import AuthShowContainer from '../containers/AuthShowContainer';

export default class InterviewTextMaterials extends React.Component {

    to() {
        return '/' + this.props.locale + '/interviews/' + this.props.interview.archive_id;
    }

    download(lang, condition) {
        if (condition) {
            // let textKey = this.props.interview.lang === lang ? 'transcript' : 'translation';
            return (
                <a href={`${this.to()}.pdf?lang=${lang}`} className='flyout-content-data'>
                    <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download')}></i>
                    <span>{t(this.props, lang)}</span>
                </a>
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
                        <p>
                            <span className='flyout-content-label'>{t(this.props, 'transcript')}:</span>
                            {this.download(this.props.interview.lang, true)}
                            {this.download(this.props.locale, (this.props.interview.languages.indexOf(this.props.locale) > -1 && this.props.interview.lang !== this.props.locale))}
                        </p>
                    </AuthShowContainer>
                </div>
            );
        } else {
            return null;
        }
    }
}

