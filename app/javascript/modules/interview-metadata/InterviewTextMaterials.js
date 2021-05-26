import { Component } from 'react';
import PropTypes from 'prop-types';

import { t } from 'modules/i18n';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { SingleValueWithFormContainer } from 'modules/forms';

export default class InterviewTextMaterials extends Component {
    to() {
        return '/' + this.props.locale + '/interviews/' + this.props.interview.archive_id;
    }

    firstSegment() {
        // here the index ([1]) stands for the tape number. Therefore it is not 0-basded.
        return this.props.interview.segments[1] && this.props.interview.segments[1][this.props.interview.first_segments_ids[1]];
    }

    download(lang, condition) {
        if (condition && this.firstSegment()) {
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
        const { interview, project, locale } = this.props;

        if (!interview.language_id) {
            return null;
        }

        return (
            <>
                <AuthorizedContent object={interview} action='update'>
                    <SingleValueWithFormContainer
                        obj={interview}
                        collapse
                        elementType="textarea"
                        multiLocale
                        metadataField={Object.values(project.metadata_fields).find(m => m.name === 'observations')}
                    />
                </AuthorizedContent>
                <AuthShowContainer ifLoggedIn={true}>
                    <p>
                        <span className='flyout-content-label'>{t(this.props, 'transcript')}:</span>
                        {this.download(interview.lang, true)}
                        {this.download(locale, (interview.languages.indexOf(locale) > -1 && interview.lang !== locale))}
                    </p>
                </AuthShowContainer>
            </>
        );
    }
}

InterviewTextMaterials.propTypes = {
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    interview: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
};
