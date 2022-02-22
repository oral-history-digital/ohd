import { Component } from 'react';
import PropTypes from 'prop-types';
import { FaDownload } from 'react-icons/fa';

import { t } from 'modules/i18n';
import { pathBase } from 'modules/routes';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { SingleValueWithFormContainer } from 'modules/forms';

export default class InterviewTextMaterials extends Component {
    download(lang, type, condition, showEmpty=false) {
        const { interview } = this.props;

        if (condition) {
            return (
                <a
                    href={`${pathBase(this.props)}/interviews/${interview.archive_id}/${type}.pdf?lang=${lang}`}
                    className="flyout-content-data"
                >
                    <FaDownload className="Icon Icon--small" title={t(this.props, 'download')} />
                    {' '}
                    {t(this.props, lang)}
                </a>
            )
        } else if (showEmpty) {
            return '---';
        } else {
            return null;
        }
    }

    render() {
        const { interview, project, locale } = this.props;
        const observationsPublic = interview.properties?.public_attributes?.['observations'] === true;

        if (!interview.language_id) {
            return null;
        }

        return (
            <>
                <AuthorizedContent object={interview} action="show">
                    {
                        <SingleValueWithFormContainer
                            obj={interview}
                            collapse
                            elementType="textarea"
                            multiLocale
                            attribute={'observations'}
                        />
                    }
                </AuthorizedContent>
                <AuthShowContainer ifLoggedIn>
                    <p>
                        <span className='flyout-content-label'>{t(this.props, 'activerecord.attributes.interview.observations')}:</span>
                        { this.download(
                            interview.lang,
                            'observations',
                            (observationsPublic && interview.observations?.[interview.lang]),
                            true
                        )}
                        { this.download(
                            locale,
                            'observations',
                            (observationsPublic && interview.observations?.[locale] && interview.lang !== locale)
                        )}
                    </p>
                    <p>
                        <span className='flyout-content-label'>{t(this.props, 'transcript')}:</span>
                        { this.download(
                            interview.lang,
                            'transcript',
                            (interview.segments?.[1]?.[interview.first_segments_ids[1]]),
                            true
                        )}
                        { this.download(
                            locale,
                            'transcript',
                            (interview.languages.indexOf(locale) > -1 && interview.lang !== locale) &&
                            (interview.segments?.[1]?.[interview.first_segments_ids[1]])
                        )}
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
