import { Component } from 'react';
import PropTypes from 'prop-types';

import { t } from 'modules/i18n';
import { pathBase } from 'modules/routes';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { SingleValueWithFormContainer } from 'modules/forms';

export default class InterviewTextMaterials extends Component {
    download(lang, condition) {
        const { interview } = this.props;

        // here the index ([1]) stands for the tape number. Therefore it is not 0-basded.
        if (condition && interview.segments[1]?.[interview.first_segments_ids[1]]) {
            return (
                <a
                    href={`${pathBase(this.props)}/interviews/${interview.archive_id}.pdf?lang=${lang}`}
                    className="flyout-content-data"
                >
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
        const observationsMetadataField = Object.values(project.metadata_fields).find(m => m.name === 'observations');

        if (!interview.language_id) {
            return null;
        }

        return (
            <>
                <AuthorizedContent object={interview} action="show">
                    {
                        observationsMetadataField?.use_in_details_view &&
                        <SingleValueWithFormContainer
                            obj={interview}
                            collapse
                            elementType="textarea"
                            multiLocale
                            metadataField={Object.values(project.metadata_fields).find(m => m.name === 'observations')}
                        />
                    }
                </AuthorizedContent>
                <AuthShowContainer ifLoggedIn>
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
